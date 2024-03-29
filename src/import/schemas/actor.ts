import Schema from "validate";

import { isValidCountryCode } from "../../types/countries";
import { isValidDate, limitRating, stringArray, validCustomFields } from "./common";

export const actorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  aliases: stringArray(false),
  description: {
    type: String,
    required: false,
  },
  bornOn: {
    type: Number,
    required: false,
    use: { isValidDate },
  },
  thumbnail: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    use: { limitRating },
  },
  labels: stringArray(false),
  customFields: {
    required: false,
    type: Object,
    use: { validCustomFields },
  },
  bookmark: {
    required: false,
    type: Number,
  },
  favorite: {
    required: false,
    type: Boolean,
  },
  nationality: {
    required: false,
    type: String,
    use: { isValidCountryCode },
  },
});
