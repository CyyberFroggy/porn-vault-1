<template>
  <div>
    <div>
      <v-btn depressed color="primary text-none black--text">Primary</v-btn>
    </div>
    <div>
      <v-btn text color="accent" class="text-none">Accent</v-btn>
    </div>
    <div>
      <v-btn depressed color="error text-none black--text">Error</v-btn>
    </div>
    <div>
      <v-btn depressed color="warning text-none black--text">Warn</v-btn>
    </div>
    <div>
      <v-btn depressed color="success text-none black--text">Success</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ApolloClient from "../apollo";
import gql from "graphql-tag";

@Component({
  components: {
  }
})
export default class Home extends Vue {
}
</script>
