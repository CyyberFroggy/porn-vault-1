import express from "express";
import { getConfig, IConfig } from "./config/index";
import Actor from "./types/actor";
import Image from "./types/image";
import Scene from "./types/scene";
import Label from "./types/label";
import pug from "pug";

export default (req: express.Request, res: express.Response) => {
  if (process.env.NODE_ENV != "development")
    return res.sendStatus(404);
    
  const config = JSON.parse(JSON.stringify(getConfig())) as IConfig;
  config.PASSWORD = "***********";

  try {
    return res.status(401).send(
      pug.renderFile("./views/debug.pug", {
        config,
        labels: Label.getAll(),
        actors: Actor.getAll(),
        scenes: Scene.getAll(),
        images: Image.getAll()
      })
    );
  }
  catch(err) {
    console.error(err);
    return;
  }
};
