import 'svelte';
import { onMount } from 'svelte';
import request from 'axios';

let title = 'No new Hearse gigs for now';
let description =
  'We must be busy getting drunk, come back soon for more gigs!';
let link = false;

onMount(() => {
  request
    .get(process.env.GIGS_ENDPOINT + '?apikey=' + process.env.tourBoxKey)
    .then((response) => {
      if (response.data.resultsPage.totalEntries != 0) {
        let event = response.data.resultsPage.results.event[0];
        title = null;
        description = event.displayName;
        link = event.uri;
      }
    });
});
