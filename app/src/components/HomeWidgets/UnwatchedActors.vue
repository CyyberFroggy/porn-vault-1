<template>
  <WidgetCard
    v-if="actors && actors.length"
    title="Actors you haven't watched yet"
    icon="mdi-shuffle"
  >
    <ActorGrid :value="actors" />

    <template v-slot:actions>
      <v-btn block class="text-none" color="primary" text @click="nextPage">Show more</v-btn>
    </template>
  </WidgetCard>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ApolloClient from "@/apollo";
import gql from "graphql-tag";
import ActorGrid from "@/components/ActorGrid.vue";

@Component({
  components: {
    ActorGrid
  }
})
export default class RandomActors extends Vue {
  actors = [] as any[];
  skip = 0;

  nextPage() {
    this.getActors();
  }

  created() {
    this.getActors();
  }

  async getActors() {
    const res = await ApolloClient.query({
      query: gql`
        query($skip: Int) {
          getUnwatchedActors(skip: $skip, take: 4) {
            _id
            name
            thumbnail {
              _id
            }
          }
        }
      `,
      variables: {
        skip: this.skip
      }
    });
    this.actors.push(...res.data.getUnwatchedActors);
    this.skip += 4;
  }
}
</script>