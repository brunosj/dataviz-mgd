<script>
  export let genres;

  import { fade } from 'svelte/transition';
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="legend" role="list" aria-label="Genre legend">
  {#if genres}
    {#each genres as genre, index}
      <p role="listitem" in:fade={{ delay: index * 100 }}>
        <span role="presentation" style="background-color: {genre.color}" />
        {genre.genre}
      </p>
    {/each}
  {/if}
</div>

<style>
  .legend {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 30px;
    row-gap: 10px;
    margin-bottom: 5px;
    margin-top: 20px;
  }

  span {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 14px;
    display: flex;
    align-items: center;
    column-gap: 3px;
    transition: opacity 300ms ease;
    color: white;
  }
</style>
