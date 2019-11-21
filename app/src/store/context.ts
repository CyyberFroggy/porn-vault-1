import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";

@Module
class ContextModule extends VuexModule {
  showFilters = false;

  @Mutation
  toggleFilters(bool: boolean) {
    this.showFilters = bool;
  }
}

import store from "./index";
export const contextModule = new ContextModule({ store, name: "context" });
