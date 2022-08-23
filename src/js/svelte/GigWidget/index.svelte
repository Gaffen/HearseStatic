<script src="./script.js"/>

<a href={link} class="GigWidget" class:enabled="{ link }">
  <div class="label">
    <div class="text"><span>NEXT</span><span>GIG</span></div>
  </div>
  <div class="content">
    <p>
      {#if title}
        <strong>{ title }</strong>
      {/if}
      { description }
    </p>
  </div>
</a>

<style src="./styles.scss"/>
