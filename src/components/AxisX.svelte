<script>
  export let xScale;
  export let height;
  export let width;
  import { fade, fly } from 'svelte/transition';

  // $: console.log({ xScale, height, width })
  $: ticks = xScale?.ticks(4);
</script>

<g class="axisX" role="group" aria-label="X axis showing popularity values">
  {#if ticks}
    {#each ticks as tick, index}
      <g
        class="tick"
        transform={`translate(${xScale(tick)}, 0)`}
        in:fade={{ delay: index * 100 }}
      >
        <text x="6" y={height}>{tick}</text>
        <line x1="0" y1="0" x2="0" y2={height} stroke="hsla(215,15%,91%,1)" />
      </g>
    {/each}
    <text
      class="axis-title"
      x={width}
      y={height}
      text-anchor="end"
      dominant-baseline="hanging"
      dy="8"
      in:fade={{ delay: 500 }}
    >
      Popularity</text
    >
  {/if}
</g>
