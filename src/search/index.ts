import { studioIndex } from "./studio";
import { movieIndex } from "./movie";

import { buildImageIndex } from "./image";
import { buildActorIndex } from "./actor";
import { buildStudioIndex } from "./studio";
import { buildMovieIndex } from "./movie";
import { buildSceneIndex } from "./scene";

export interface ISearchResults {
  num_hits: number;
  items: string[];
  time: {
    sec: number;
    milli: number;
    micro: number;
  };
}

export const indices = {
  studios: studioIndex,
  movies: movieIndex,
};

export async function buildIndices() {
  await buildSceneIndex();
  await buildActorIndex();
  await buildMovieIndex();
  await buildStudioIndex();
  await buildImageIndex();
}
