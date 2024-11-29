<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { scaleLinear, scaleBand, scaleOrdinal, scaleSqrt } from 'd3-scale';
  import { tsv } from 'd3-fetch';
  import { extent, mean, rollups } from 'd3-array';
  import {
    forceSimulation,
    forceX,
    forceY,
    forceCollide,
    forceCenter,
  } from 'd3-force';
  import { forceCluster } from 'd3-force-cluster';
  import Steps from './components/Steps.svelte';
  import Chart from './components/Chart.svelte';
  import { mainGenres } from '$data/genres.js';
  import { parseGenres } from './helpers/utils';
  import IntroText from './components/IntroText.svelte';

  // Dimensions
  let width = 400,
    height = 600;
  const margin = { top: 20, right: 30, bottom: 30, left: 30 };

  $: innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  // Data
  let data;
  let genres;

  onMount(async () => {
    data = await tsv('src/data/data-with-regions.csv', (row) => ({
      artist_id: row.artist_id,
      name: row.name,
      followers: +row.followers,
      popularity: +row.popularity,
      genres: parseGenres(row.genres),
      image_url: row.image_url,
    }));
    data = data.sort((a, b) => b.popularity - a.popularity).slice(0, 250);

    data.forEach((entry) => {
      let matched = false;
      for (const mainGenre in mainGenres) {
        if (
          entry.genres.some((subGenre) =>
            mainGenres[mainGenre].includes(subGenre)
          )
        ) {
          entry.main_genre = mainGenre;
          matched = true;
          break;
        }
      }
      if (!matched) {
        entry.main_genre = 'Other';
      }
    });

    data.sort((a, b) => {
      const countA = data.filter(
        (entry) => entry.main_genre === a.main_genre
      ).length;
      const countB = data.filter(
        (entry) => entry.main_genre === b.main_genre
      ).length;
      return countA - countB;
    });
  });

  // Genres
  $: {
    genres = data
      ? rollups(
          data,
          (v) => ({
            mean: mean(v, (d) => d.popularity),
            count: v.length,
            color: colorScale(v[0].main_genre),
          }),
          (d) => d.main_genre
        )
          .sort((a, b) => a[1].count - b[1].count)
          .map((d) => ({
            genre: d[0],
            mean: d[1].mean,
            count: d[1].count,
            color: d[1].color,
          }))
      : null;
  }

  // Colors
  const uniqueMainGenres = Object.keys(mainGenres);
  const customColorRange = [
    '#2E86AB', // A shade of blue
    '#FFC107', // Yellow
    '#795548', // Brown
    '#F06292', // Pink
    '#4CAF50', // Green
    '#F57C00', // Orange
    '#8E24AA', // Purple
    '#C2185B', // Another shade of pink
    '#a1cfc7', // Teal
  ];

  // Create a color scale for main_genre
  const colorScale = scaleOrdinal()
    .domain(uniqueMainGenres)
    .range(customColorRange);

  // Size of circles
  $: radiusScale = data
    ? scaleSqrt()
        .domain(extent(data.map((d) => d.popularity)))
        .range(width < 568 ? [3, 10] : [5, 15])
    : null;

  // Scales
  $: xScale = data
    ? scaleLinear()
        .domain(extent(data.map((d) => d.popularity)))
        // .domain([80, 100])
        .range([0, innerWidth])
    : null;

  $: xScaleBand = data
    ? scaleBand()
        .domain(data.map((d) => d.main_genre))
        .range([50, innerWidth])
    : null;

  $: yScale = data
    ? scaleBand().domain(genres).range([innerHeight, 0]).paddingOuter(0.5)
    : null;

  // Scrolly
  let currentStep;

  // Simulation
  $: simulation = forceSimulation(data);

  $: {
    function assignRandomInitialPositions(nodes) {
      nodes?.forEach((node) => {
        node.x = Math.random() * innerWidth;
        node.y = Math.random() * innerHeight;
      });
    }

    if (currentStep === 0) {
      assignRandomInitialPositions(data);

      simulation
        .force('x', forceX(innerWidth / 2).strength(0.1))
        .force('y', forceY(innerHeight / 2).strength(0.1))
        .force(
          'collision',
          forceCollide().radius((d) => radiusScale(d.popularity))
        )
        .alpha(0.1)
        .alphaDecay(0.0005)
        .restart();
    }

    if (currentStep === 1) {
      assignRandomInitialPositions(data);

      simulation
        .force(
          'x',
          forceX()
            .x((d) => xScaleBand(d.main_genre))
            .strength(0.3)
        )
        .force('y', forceY(innerHeight / 2))
        .force('cluster', forceCluster())
        .force(
          'collision',
          forceCollide().radius((d) => radiusScale(d.popularity))
        )
        .alpha(0.18)
        .alphaDecay(0.0005)
        .restart();
    }

    if (currentStep === 2) {
      assignRandomInitialPositions(data);
      simulation
        .force(
          'x',
          forceX()
            .x((d) => xScale(d.popularity))
            .strength(0.4)
        )
        .force(
          'y',
          forceY()
            .y((d) => innerHeight / 2)
            .strength(0.3)
        )

        .force(
          'collide',
          forceCollide().radius((d) => radiusScale(d.popularity))
        )
        .alpha(0.2)
        .alphaDecay(0.0005)
        .restart();
    }
  }

  let nodes = [];

  $: {
    simulation.on('tick', () => {
      nodes = simulation.nodes();
    });
  }

  // Interactvity
  let hovered;
  let groupByGenre = true;
</script>

<article>
  <IntroText />

  <div class="section-container">
    <section class="steps-container">
      <Steps bind:currentStep />
      <div class="spacer" />
    </section>

    <section class="sticky">
      {#await data}
        <div aria-live="polite">Loading data...</div>
      {:then data}
        <Chart
          bind:height
          bind:width
          bind:groupByGenre
          bind:innerHeight
          bind:innerWidth
          bind:hovered
          {margin}
          {currentStep}
          {xScale}
          {radiusScale}
          {genres}
          {data}
          {xScaleBand}
          {nodes}
          {colorScale}
        />
      {:catch error}
        <div role="alert">Error loading data: {error.message}</div>
      {/await}
    </section>
  </div>
  <footer>
    <p>
      made by
      <a href="https://landozone.net" target="_blank">landozone</a>
    </p>
  </footer>
</article>

<style>
  :global(html) {
    background: #14151d;
  }

  :global(p) {
    font-size: 1.1rem;
    line-height: 1.5rem;
    margin-bottom: 1rem;
  }

  :global(p:not(:last-of-type)) {
    margin-bottom: 1rem;
  }

  :global(.tick text, .axis-title) {
    font-size: 12px;
    font-weight: 400;
    fill: white;
    user-select: none;
  }

  :global(.axis-title) {
    font-size: 14px;
    font-weight: 600;
  }

  :global(a) {
    color: white;
    cursor: pointer;
  }

  :global(a:hover) {
    text-decoration: underline;
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
  }

  :global(p) {
    color: white;
  }

  section {
    position: relative;
  }

  .spacer {
    height: 40vh;
  }

  .sticky {
    position: sticky;
    top: 10%;
    flex: 1 1 70%;
    width: 70%;
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .steps-container,
  .sticky {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 30%;
    z-index: 10;
  }

  footer {
    text-align: right;
    margin: 2em;
  }

  @media screen and (max-width: 768px) {
    .section-container {
      flex-direction: column-reverse;
    }
    .sticky {
      width: 95%;
      margin: auto;
    }
  }
</style>
