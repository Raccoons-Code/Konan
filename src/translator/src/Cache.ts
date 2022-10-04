import { Resources } from './@types';

class Cache {
  resources: Resources = {};

  setResources(resources: Resources) {
    this.resources = resources;
  }
}

const cache = new Cache();

export default cache;