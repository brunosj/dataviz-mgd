<script>
  export let data;
  export let width;
  export let height;
  export let innerWidth;
  export let innerHeight;
  export let hovered;
  export let margin;
  export let xScale;
  export let radiusScale;
  export let genres;
  export let xScaleBand;
  export let nodes;
  export let colorScale;
  export let currentStep;

  import GenreLabels from './GenreLabels.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Tooltip from './Tooltip.svelte';
  import Legend from './Legend.svelte';
  import { fade } from 'svelte/transition';

  function getStrokeAndOpacity(node, currentStep, hovered, genre) {
    let stroke = 'black';
    let opacity = 1;

    if (currentStep === 2 && node.popularity <= 95) {
      opacity = 0.3;
    } else if (currentStep >= 4 && hovered !== node) {
      opacity = 0.3;
    }

    if (currentStep >= 3) {
      if (hovered && hovered !== node) {
        opacity = 0.3;
      }
      if (hovered === node) {
        opacity = 1;
      }
      stroke = hovered === node ? 'white' : '#00000090';
    }

    return { stroke, opacity };
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="sticky">
  <div
    class="chart-container"
    role="button"
    tabindex="0"
    bind:clientWidth={width}
    on:click={() => {
      hovered = null;
    }}
  >
    {#if currentStep === 1}
      <h1 in:fade={{ duration: 300 }}>Most popular genres on Spotify</h1>
    {/if}
    {#if currentStep === 2}
      <h1 in:fade={{ duration: 300 }}>Top 200 artists</h1>
    {/if}
    {#if currentStep === 3}
      <h1 in:fade={{ duration: 300 }}>Worldwide top</h1>
    {/if}
    {#if currentStep >= 2}
      <Legend {genres} />
    {/if}
    <svg
      {width}
      {height}
      role="img"
      aria-label="Chart showing artist popularity data"
      on:mouseleave={() => {
        hovered = null;
      }}
    >
      <g class="inner-chart" transform="translate({margin.left}, {margin.top})">
        {#if currentStep >= 2}
          <AxisX {xScale} height={innerHeight} width={innerWidth} />
        {/if}
        {#if data}
          {#each nodes as node, i}
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            {#if genres}
              {#each genres as genre}
                {#if genre.genre === node.main_genre}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  {@const { stroke, opacity } = getStrokeAndOpacity(
                    node,
                    currentStep,
                    hovered,
                    genre
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    style={currentStep >= 3 ? 'cursor:pointer' : ''}
                    r={radiusScale(node.popularity)}
                    fill={genre.color}
                    {stroke}
                    {opacity}
                    role="button"
                    aria-label={`${node.name}, popularity: ${node.popularity}`}
                    on:mouseover={() => {
                      hovered = node;
                    }}
                    on:focus={() => {
                      hovered = node;
                    }}
                    tabindex="0"
                    on:click={(e) => {
                      e.stopPropagation();
                    }}
                    on:keypress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                      }
                    }}
                  />
                {/if}
              {/each}
            {/if}
          {/each}
        {/if}

        {#if currentStep === 1}
          <GenreLabels {genres} {xScaleBand} {innerHeight} {width} />
        {/if}
      </g>
    </svg>
    {#if currentStep >= 3}
      {#if hovered}
        <Tooltip data={hovered} {colorScale} {width} />
      {/if}
    {/if}
  </div>
</div>

<style>
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    color: white;
  }

  circle {
    transition:
      stroke 300ms ease,
      opacity 300ms ease;
  }

  .chart-container {
    height: 100%;
    width: 100%;
    /* margin-top: 0rem; */
    /* max-width: 700px;
    max-height: 450px; */
    /* background: white; */
    /* border: 1px solid plum; */
    border-radius: 5px;
    /* box-shadow: 1px 1px 30px rgba(252, 220, 252, 1); */
  }

  .sticky {
    position: sticky;
    top: 5vh; /* (100vh - 90vh) */
    z-index: 1;
    height: 90vh;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  p {
    margin-bottom: 0;
    line-height: normal;
  }
</style>
