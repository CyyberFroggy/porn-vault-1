import Scene from "../../../types/scene";
import * as logger from "../../../logger";
import { searchScenes } from "../../../search/scene";

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getScenes(
  _,
  { query, random }: { random: number | undefined; query: string | undefined }
) {
  try {
    const timeNow = +new Date();
    const result = await searchScenes(query || "");

    if (random) {
      logger.log("Randomizing items...");
      result.items = shuffle(result.items).slice(0, random);
    }

    logger.log(
      `Search results: ${result.max_items} hits found in ${
        (Date.now() - timeNow) / 1000
      }s`
    );

    const scenes = await Promise.all(result.items.map(Scene.getById));
    logger.log(`Search done in ${(Date.now() - timeNow) / 1000}s.`);
    return {
      numItems: result.max_items,
      numPages: result.num_pages,
      items: scenes.filter(Boolean),
    };
  } catch (error) {
    logger.error(error);
  }
}
