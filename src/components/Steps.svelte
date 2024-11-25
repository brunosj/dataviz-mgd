<script>
  export let currentStep;

  import Scrolly from '../helpers/Scrolly.svelte';

  const steps = [
    "<p>This is a graphical representation of the 250 most popular artists on Spotify.<br></br>According to the Spotify API Reference, an artist's popularity is derived from the popularity of all the artist's songs.<br></br>This value is calculated by algorithms and is based, in the most part, on the total number of plays these songs have had and how recent those plays are.</p>",
    "<p>It's clear to see that Pop and Rap/Hip-Hop artists are clearly dominating the distribution of the top 250 artists on the platform.</p>",
    '<p>Four artists are clearly dominating the market.<br></br>Combined, these four artists cumulate more than 326,286,231 listeners per month, which amounts to revenues close to $1,305 million monthly.</p>',
    '<p>Who are these four artists?<br></br> Explore the data to find out!</p>',
    '<p>Come back later for further analysis!</p>',
  ];
</script>

<div class="steps">
  <Scrolly bind:value={currentStep}>
    {#each steps as text, i}
      <div
        class="step"
        class:active={currentStep === i}
        role="tabpanel"
        aria-label={`Step ${i + 1} of ${steps.length}`}
      >
        <div class="step-content">
          {@html text}
        </div>
      </div>
    {/each}
  </Scrolly>
</div>

<style>
  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    /* background: whitesmoke; */
    opacity: 50%;
    /* font-size: 1.2rem; */
    /* line-height: 1.5rem; */
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    /* box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2); */
    text-align: left;
    width: 80%;
    /* margin: auto; */
    max-width: 500px;
    border-radius: 0.5rem;
    color: gray;
  }

  .step.active .step-content {
    /* background: #121212; */
    opacity: 100%;
    color: white;
  }

  .steps {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  @media screen and (max-width: 768px) {
    .step.active .step-content {
      background: #121212;
      /* opacity: 100%; */
      /* color: white; */
    }
  }
</style>
