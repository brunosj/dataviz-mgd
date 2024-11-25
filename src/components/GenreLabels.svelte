<script>
  export let genres;
  export let xScaleBand;
  export let innerHeight;

  import { fade } from 'svelte/transition';

  $: genreLabels = genres?.map((genre) => {
    return {
      genre: genre.genre,
      x: xScaleBand(genre.genre),
      y: innerHeight / 1.1,
    };
  });
</script>

{#if genreLabels}
  {#each genreLabels as position, index}
    <g class="" in:fade={{ delay: index * 100 }}>
      <text
        x={position.x}
        y={position.y}
        text-anchor="middle"
        alignment-baseline="middle"
        fill="white"
        role="presentation"
        aria-label={`Genre: ${position.genre}`}
      >
        {position.genre}
      </text>
      <line x={position.x} y={position.y} stroke="hsla(215,15%,91%,1)" />
    </g>
  {/each}
{/if}

<style>
  text {
    font-size: 14px;
    color: white;
  }

  @media (max-width: 568) {
    text {
      font-size: 10px;
    }
  }
</style>
