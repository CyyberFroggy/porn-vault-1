import Scene from "../../types/scene";
import Image from "../../types/image";
import Label from "../../types/label";
import Actor from "../../types/actor";

export default {
  async actors(image: Image) {
    return await Promise.all(image.actors.map(id => Actor.getById(id)));
  },
  async scene(image: Image) {
    if (image.scene) return await Scene.getById(image.scene);
    return null;
  },
  async labels(image: Image) {
    return await Promise.all(image.labels.map(id => Label.getById(id)));
  }
};
