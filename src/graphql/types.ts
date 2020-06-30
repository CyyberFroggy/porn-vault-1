import { makeExecutableSchema } from "graphql-tools";
import RootResolver from "./resolvers";

import indexSchema from "./schema/index";
import imageSchema from "./schema/image";
import sceneSchema from "./schema/scene";
import actorSchema from "./schema/actor";
import studioSchema from "./schema/studio";
import movieSchema from "./schema/movie";
import labelSchema from "./schema/label";
import customFieldSchema from "./schema/custom_field";
import markerSchema from "./schema/marker";

export default makeExecutableSchema({
  typeDefs: [
    actorSchema,
    indexSchema,
    imageSchema,
    sceneSchema,
    studioSchema,
    movieSchema,
    labelSchema,
    customFieldSchema,
    markerSchema
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  resolvers: RootResolver,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});
