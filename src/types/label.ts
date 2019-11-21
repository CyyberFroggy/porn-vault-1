import * as database from "../database";
import { generateHash } from "../hash";

export default class Label {
  _id: string;
  name: string;
  aliases: string[] = [];
  addedOn = +new Date();
  thumbnail: string | null = null;

  static async filterImage(thumbnail: string) {
    await database.update(
      database.store.labels,
      { thumbnail },
      { $set: { thumbnail: null } }
    );
  }

  static async remove(_id: string) {
    await database.remove(database.store.labels, { _id });
  }

  static async getById(_id: string) {
    return (await database.findOne(database.store.labels, {
      _id
    })) as Label | null;
  }

  static async getAll() {
    return (await database.find(database.store.labels, {})) as Label[];
  }

  static async find(name: string) {
    name = name.toLowerCase().trim();

    name = name.toLowerCase().trim();
    const allLabels = await Label.getAll();
    return allLabels.find(
      label =>
        label.name === name ||
        label.aliases.map(alias => alias.toLowerCase()).includes(name)
    );
  }

  constructor(name: string, aliases: string[] = []) {
    this._id = generateHash();
    this.name = name.trim();
    this.aliases = aliases.map(alias => alias.toLowerCase().trim());
  }
}
