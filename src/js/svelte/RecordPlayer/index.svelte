<script src="./script.js"/>

<div 
	class="RecordPlayer"
  data-test
>
	{#if !hideFallback}
	  <a href={record}>
	    PLAY AUDIO
	  </a>
  {/if}
  <button class="toggle" on:click={togglePlay}>
    <svg class="icon">
      <use xlink:href={!playing ? "#playbutton" : "#pausebutton"} />
    </svg>
  </button>
  <canvas
    class="disc"
    bind:this={disc}
    width={canvasSize}
    height={canvasSize}
    on:mousedown={beginScrubbing}
  />
  <img
  	alt="Music Player"
    src={artworkMainImg}
    srcset={artworkSrcSet}
    sizes="160px"
    class="artwork"
  />
</div>

<style src="./styles.scss"/>