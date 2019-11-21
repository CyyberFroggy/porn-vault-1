import DataStore from "nedb";
import mkdirp from "mkdirp";
import { libraryPath } from "../types/utility";

try {
  mkdirp.sync("tmp/");
  mkdirp.sync(libraryPath("scenes/"));
  mkdirp.sync(libraryPath("images/"));
  mkdirp.sync(libraryPath("thumbnails/"));
} catch (err) {}

const store = {
  scenes: new DataStore({
    autoload: true,
    filename: libraryPath("scenes.db")
  }),
  actors: new DataStore({
    autoload: true,
    filename: libraryPath("actors.db")
  }),
  images: new DataStore({
    autoload: true,
    filename: libraryPath("images.db")
  }),
  labels: new DataStore({
    autoload: true,
    filename: libraryPath("labels.db")
  }),
  movies: new DataStore({
    autoload: true,
    filename: libraryPath("movies.db")
  }),
  studios: new DataStore({
    autoload: true,
    filename: libraryPath("studios.db")
  })
};

export function insert<T>(store: DataStore, doc: T | T[]) {
  return new Promise((resolve, reject) => {
    store.insert(doc, (err, doc) => {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}

export function getAll(store: DataStore) {
  return new Promise((resolve, reject) => {
    store.find({}, (err, docs) => {
      if (err) return reject(err);
      resolve(docs);
    });
  });
}

export function update(store: DataStore, query: any, update: any) {
  return new Promise((resolve, reject) => {
    store.update(query, update, { multi: true }, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function remove(store: DataStore, query: any) {
  return new Promise((resolve, reject) => {
    store.remove(query, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function find(store: DataStore, query: any) {
  return new Promise((resolve, reject) => {
    store.find(query, (err, doc) => {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}

export function findOne(store: DataStore, query: any) {
  return new Promise((resolve, reject) => {
    store.findOne(query, (err, doc) => {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}

export { store };
