<script>
  export let data;
  export let colorScale;
  export let width;

  import { fly, fade } from 'svelte/transition';

  let tooltipWidth;
  const xNudge = 10;
  const yNudge = 10;

  $: xPosition =
    data.x + tooltipWidth + xNudge > width
      ? data.x - tooltipWidth - xNudge
      : data.x + xNudge;

  $: yPosition = data.y + yNudge;
</script>

<div
  class="tooltip"
  role="tooltip"
  aria-live="polite"
  in:fly={{ y: 10, duration: 200, delay: 200 }}
  out:fade
  style="position:absolute;
  top:{yPosition}px;
  left:{xPosition}px"
  bind:clientWidth={tooltipWidth}
>
  <img
    src={data.image_url}
    alt={data.name}
    style="border: 2px solid {colorScale(data.main_genre)};"
  />
  <div class="info" style="border: 2px solid {colorScale(data.main_genre)};">
    <h1>
      {data.name}
    </h1>
    <div class="extra">
      <span class="score">
        {new Intl.NumberFormat('en-US').format(data.followers)} followers
      </span>
      <span class="genre" style="color:{colorScale(data.main_genre)}">
        {#if data.genres.length >= 1}
          {#each data.genres as genre, index}
            {genre} {index < data.genres.length - 1 ? ' - ' : ''}
          {/each}
        {/if}
      </span>
    </div>
  </div>
</div>

<style>
  .tooltip {
    padding: 8px 6px;
    pointer-events: none;
    transition:
      top 300ms ease,
      left 300ms ease;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .info {
    border-radius: 3px;
    background: #151515;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.15);
    padding: 1rem 1rem 1rem 2rem;
    margin-left: -1.5rem;
    color: white;
  }

  .extra {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    column-gap: 6px;
    row-gap: 6px;
    align-items: center;
  }

  .score {
    font-size: 12px;
  }

  .genre {
    font-size: 11px;
    padding: 3px;
    border-radius: 3px;
  }

  h1 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
  }

  .bar .background {
    background: #eee;
  }

  img {
    width: 6rem;
    height: 6rem;
    border-radius: 100%;
    margin-bottom: 0.5rem;
    z-index: 50;
  }
</style>
