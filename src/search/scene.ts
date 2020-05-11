import Scene from "../types/scene";
import Studio from "../types/studio";
import * as logger from "../logger";
import ora from "ora";
import Axios from "axios";
import extractQueryOptions from "../query_extractor";
import { ISearchResults } from "./index";
import argv from "../args";
import SceneView from "../types/watch";
import { Gianna } from "./internal/index";

const PAGE_SIZE = 24;

export let index!: Gianna.Index<ISceneSearchDoc>;

export interface ISceneSearchDoc {
  _id: string;
  added_on: number;
  name: string;
  actors: string[];
  labels: string[];
  actor_names: string[];
  label_names: string[];
  rating: number;
  bookmark: number | null;
  favorite: boolean;
  num_watches: number;
  release_date: number | null;
  duration: number | null;
  studio: string | null;
  studio_name: string | null;
  resolution: number | null;
  size: number | null;
}

async function createSceneSearchDoc(scene: Scene): Promise<ISceneSearchDoc> {
  const labels = await Scene.getLabels(scene);
  const actors = await Scene.getActors(scene);

  return {
    _id: scene._id,
    added_on: scene.addedOn,
    name: scene.name,
    labels: labels.map((l) => l._id),
    actors: actors.map((a) => a._id),
    actor_names: actors.map((a) => a.name),
    label_names: labels.map((l) => l.name),
    rating: scene.rating,
    bookmark: scene.bookmark,
    favorite: scene.favorite,
    num_watches: await SceneView.getCount(scene._id),
    duration: scene.meta.duration,
    release_date: scene.releaseDate,
    studio: scene.studio,
    resolution: scene.meta.dimensions ? scene.meta.dimensions.height : 0,
    size: scene.meta.size,
    studio_name: scene.studio
      ? ((await Studio.getById(scene.studio)) || { name: null }).name
      : null,
  };
}

async function addSceneSearchDocs(docs: ISceneSearchDoc[]) {
  logger.log(`Indexing ${docs.length} items...`);
  const timeNow = +new Date();
  const res = await index.index(docs, [
    "name",
    "labels",
    "actors",
    "studio_name",
    "actor_names",
    "label_names",
  ]);
  logger.log(`Gianna indexing done in ${(Date.now() - timeNow) / 1000}s`);
  return res;
}

export async function indexScenes(scenes: Scene[]) {
  let docs = [] as ISceneSearchDoc[];
  let numItems = 0;
  for (const scene of scenes) {
    docs.push(await createSceneSearchDoc(scene));

    if (docs.length == (argv["index-slice-size"] || 5000)) {
      await addSceneSearchDocs(docs);
      numItems += docs.length;
      docs = [];
    }
  }
  if (docs.length) {
    await addSceneSearchDocs(docs);
    numItems += docs.length;
  }
  docs = [];
  return numItems;
}

export async function searchScenes(query: string, /* TODO: */ random = 0) {
  const options = extractQueryOptions(query);
  logger.log(`Searching scenes for '${options.query}'...`);

  let sort = undefined as Gianna.ISortOptions | undefined;
  let filter = {
    type: "AND",
    children: [],
  } as Gianna.IFilterTreeGrouping;

  if (options.durationMin) {
    filter.children.push({
      condition: {
        operation: ">",
        property: "duration",
        type: "number",
        value: options.durationMin - 1,
      },
    });
  }

  if (options.durationMax) {
    filter.children.push({
      condition: {
        operation: "<",
        property: "duration",
        type: "number",
        value: options.durationMax + 1,
      },
    });
  }

  if (options.favorite) {
    filter.children.push({
      condition: {
        operation: "=",
        property: "bookmark",
        type: "boolean",
        value: true,
      },
    });
  }

  if (options.bookmark) {
    filter.children.push({
      condition: {
        operation: ">",
        property: "bookmark",
        type: "number",
        value: 0,
      },
    });
  }

  if (options.include.length) {
    filter.children.push({
      type: "AND",
      children: options.include.map((labelId) => ({
        condition: {
          operation: "?",
          property: "labels",
          type: "array",
          value: labelId,
        },
      })),
    });
  }

  if (options.sortBy) {
    const sortType = {
      name: "string",
      rating: "number",
      bookmark: "number",
      num_watches: "number",
      release_date: "number",
      duration: "number",
      resolution: "number",
      size: "number",
    }[options.sortBy];
    sort = {
      sort_by: options.sortBy,
      sort_asc: options.sortDir === "asc",
      sort_type: sortType,
    };
  }

  return index.search({
    query: options.query,
    skip: options.skip || options.page * 24,
    take: options.take || options.take || PAGE_SIZE,
    sort,
    filter,
  });
}

export async function buildSceneIndex() {
  index = await Gianna.createIndex("scenes");

  const timeNow = +new Date();
  const loader = ora("Building scene index...").start();

  const res = await indexScenes(await Scene.getAll());

  loader.succeed(`Build done in ${(Date.now() - timeNow) / 1000}s.`);
  logger.log(`Index size: ${res} items`);

  console.log(
    await searchScenes(
      "query:gianna sortBy:duration durationMax:5 include:la_k3ajw7luf8GO6Q1X"
    )
  );

  return index;
}

/* export async function searchScenes(query: string, random = 0) {
  const options = extractQueryOptions(query);
  logger.log(`Searching scenes for '${options.query}'...`);
  return Axios.get<ISearchResults>("http://localhost:8000/scene", {
    params: {
      query: options.query || "",
      skip: options.skip || options.page * 24,
      take: (random ? 999999 : null) || options.take || PAGE_SIZE,
      sort_by: options.sortBy,
      sort_dir: options.sortDir,
      favorite: options.favorite ? "true" : undefined,
      bookmark: options.bookmark ? "true" : undefined,
      rating: options.rating || 0,
      include: options.include.join(","),
      exclude: options.exclude.join(","),
      actors: options.actors.join(","),
      studio: options.studios[0],
      duration_min: options.durationMin || undefined,
      duration_max: options.durationMax || undefined,
    },
  });
}

 */
