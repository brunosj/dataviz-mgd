<script>
  export let yScale;
  export let groupByGenre;
  import { fade } from 'svelte/transition';

  $: ticks = yScale?.domain();
  $: console.log(ticks);
</script>

<g role="group" aria-label="Y axis showing genres">
  {#if ticks}
    {#each ticks as tick, index}
      {#if groupByGenre}
        <g class="tick" in:fade={{ delay: index * 100 }} out:fade>
          <text y={yScale(tick)} x="0">
            {tick}
          </text></g
        >
      {/if}
    {/each}
  {/if}
</g>
