<template lang="html">
  <div class="RecordPlayer">
    <button class="toggle" v-on:click="togglePlay">
      <svg v-if="playing === false">
        <use :xlink:href="playIcon" />
      </svg>
      <svg v-else>
        <use :xlink:href="pauseIcon" />
      </svg>
    </button>
    <canvas
      class="disc"
      ref="disc"
      v-bind:width="canvasSize"
      v-bind:height="canvasSize"
      v-on:mousedown="beginScrubbing"
    />
    <p class="devinfo">Scrubbing: {{ scrubbing }}</p>
  </div>
</template>

<script>
export default {
  props: ["record"],
  data: function(args) {
    let maxRecordSize = 320 - 40;
    let maxRecordInnerSize = 100;
    return {
      playing: false,
      scrubbing: false,
      playIcon: "#playbutton",
      pauseIcon: "#pausebutton",
      playPosition: 0,
      buffered: 0,
      mousePos: null,
      initialised: false,
      bassBoom: 1,
      canvasSize: 320,
      maxRecordSize,
      minRecordSize: maxRecordSize - maxRecordSize / 6,
      maxRecordInnerSize,
      recordInnerSize: maxRecordInnerSize,
      recordSize: maxRecordSize,
      eqBarCache: null,
      eqBarWidth: 0,
      eqBarRotation: 0,
      eqSampleSize: 2
    };
  },
  mounted: function() {
    this.audioElement = document.createElement("audio");
    this.audioElement.src = this.record;
    let disc = this.$refs.disc;

    this.eqBarCache = document.createElement("canvas");
    this.eqBarCacheWhite = document.createElement("canvas");
    // this.eqBarCache = this.$refs.cache;
    this.eqBarCache.width = 80;
    this.eqBarCache.height = disc.height / 2;
    this.eqBarCacheWhite.width = 80;
    this.eqBarCacheWhite.height = disc.height / 2;

    this.discCtx = disc.getContext("2d");

    this.drawUI();

    this.audioElement.addEventListener("playing", () => {
      if (!this.initialised) {
        this.initialised = true;
      }
      if (!this.analyser) {
        this.audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.source = this.audioCtx.createMediaStreamSource(
          this.audioElement.captureStream()
        );
        this.source.connect(this.analyser);

        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.3;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.freqArray = new Uint8Array(this.bufferLength);

        let segmentWidth =
          360 / (this.analyser.fftSize / (this.eqSampleSize * 2));

        this.eqBarWidth = (segmentWidth / 5) * 3 * (Math.PI / 180);
        this.eqBarRotation = segmentWidth * (Math.PI / 180);

        this.createBarData();
      } else {
        // let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.audioCtx.createMediaStreamSource(
          this.audioElement.captureStream()
        );
        this.source.connect(this.analyser);
      }
    });
    this.audioElement.addEventListener("ended", () => {
      this.playing = false;
      this.initialised = false;
      this.drawUI();
    });
  },
  methods: {
    createBarData: function() {
      this.drawBar(this.eqBarCache, "rgb(0, 0, 0)");
      this.drawBar(this.eqBarCacheWhite, "rgb(255, 255, 255)");
    },
    drawBar: function(canvas, colour) {
      let ctx = canvas.getContext("2d");
      let disc = this.$refs.disc;

      ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
      ctx.clearRect(0, 0, ctx.width, ctx.height);

      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.moveTo(0, this.eqBarCache.height);
      ctx.arc(
        0,
        disc.height / 2,
        disc.height / 2,
        0 - Math.PI / 2,
        this.eqBarWidth - Math.PI / 2
        // Math.PI * 2
      );
      // ctx.moveTo(0, this.eqBarCache.height);
      ctx.closePath();
      ctx.fill();
    },
    draw: function() {
      if (this.playing || this.scrubbing) {
        let drawVisual = requestAnimationFrame(this.draw);
      }

      let disc = this.$refs.disc;
      let ctx = this.discCtx;

      ctx.clearRect(0, 0, disc.width, disc.height);

      this.drawUI();

      if (this.analyser) {
        this.runAnalysis();
      }
    },
    drawUI: function() {
      let ctx = this.discCtx;
      let disc = this.$refs.disc;

      // Outer ring
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.strokeStyle = "rgb(38, 38, 38)";
      ctx.arc(
        disc.width / 2,
        disc.height / 2,
        disc.width / 2 - 4,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.stroke();

      // Inner Ring
      ctx.beginPath();
      ctx.arc(disc.width / 2, disc.height / 2, 80 / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();

      if (this.initialised) {
        this.drawRecord();
      }
    },
    runAnalysis: function() {
      let ctx = this.discCtx;
      let disc = this.$refs.disc;
      this.analyser.getByteFrequencyData(this.dataArray);
      this.analyser.getByteTimeDomainData(this.freqArray);

      let bassSample = this.dataArray.slice(this.dataArray.length / 4);
      let bassVolume =
        bassSample.reduce((accumulated, vol) => {
          return accumulated + vol;
        }, 0) /
        (this.dataArray.length / 4);

      this.bassBoom = bassVolume / 255;

      let variance = this.bassBoom * (this.maxRecordSize - this.minRecordSize);

      this.recordSize = this.minRecordSize + variance;
      this.recordInnerSize = this.maxRecordInnerSize + variance;
    },
    drawRecord: function() {
      let ctx = this.discCtx;
      let disc = this.$refs.disc;

      // White Disc
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.beginPath();
      ctx.arc(
        disc.width / 2,
        disc.height / 2,
        this.recordSize / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.arc(
        disc.width / 2,
        disc.height / 2,
        this.recordInnerSize / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();

      if (this.audioElement.buffered.length > 0) {
        let buffered = this.audioElement.buffered;
        this.buffered =
          (this.audioElement.buffered.end(
            this.audioElement.buffered.length - 1
          ) /
            this.audioElement.duration) *
          100;
      }

      if (this.audioElement.duration) {
        this.playPosition =
          (this.audioElement.currentTime / this.audioElement.duration) * 100;
      }

      // Buffered Ring
      this.drawProgressBar("rgb(200, 200, 200)", this.buffered);

      // Playhead Position
      this.drawProgressBar("rgb(0, 0, 0)", this.playPosition);

      this.drawEqualizerBars();
    },
    drawProgressBar: function(color, percentage) {
      let ctx = this.discCtx;
      let disc = this.$refs.disc;
      let startPos = Math.PI * 2 - Math.PI / 2;
      let progressPosition = startPos + ((Math.PI * 2) / 100) * percentage;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        disc.width / 2,
        disc.height / 2,
        this.recordSize / 2,
        progressPosition,
        startPos,
        true
      );
      ctx.lineTo(disc.width / 2, disc.height / 2 - 11 / 2);
      ctx.arc(
        disc.width / 2,
        disc.height / 2,
        this.recordInnerSize / 2,
        startPos,
        progressPosition,
        false
      );
      ctx.closePath();
      ctx.fill();
    },
    drawEqualizerBars() {
      let ctx = this.discCtx;
      let disc = this.$refs.disc;
      let dataPoints = [];

      let rotateAmount = this.eqBarRotation;
      // console.log(this.freqArray.length / this.eqSampleSize);

      for (let i = 0; i < this.freqArray.length; i += this.eqSampleSize) {
        dataPoints.push(this.freqArray.slice(i, i + this.eqSampleSize));
      }

      dataPoints.forEach((freqData, i) => {
        let mean =
          freqData.reduce((dataPoint, total) => {
            return total + dataPoint;
          }, 0) / freqData.length;
        let multiplier = (mean - 126) / 100;
        let ringWidth = this.recordSize - this.recordInnerSize;

        let barSize = (this.recordInnerSize + ringWidth * multiplier) / 2;

        barSize = barSize >= 0 ? barSize : 0;

        // if (i === 0) {
        // 	console.log(barSize, this.recordInnerSize);
        // }

        ctx.save();
        ctx.beginPath();
        // if (barSize < this.recordInnerSize / 2) {
        ctx.arc(
          disc.width / 2,
          disc.height / 2,
          this.recordInnerSize / 2,
          0,
          Math.PI * 2,
          barSize <= this.recordInnerSize / 2
        );
        // }

        // if (i === 3) {
        // 	console.log(
        // 		this.playPosition,
        // 		i / dataPoints.length * 100,
        // 		this.playPosition < i / dataPoints.length * 100
        // 	);
        // }

        ctx.arc(
          disc.width / 2,
          disc.height / 2,
          barSize,
          0,
          Math.PI * 2,
          barSize > this.recordInnerSize / 2
        );
        ctx.closePath();
        ctx.translate(disc.width / 2, disc.height / 2);
        ctx.rotate(rotateAmount * i);
        ctx.clip();
        ctx.drawImage(
          barSize > this.recordInnerSize / 2 &&
            this.playPosition < (i / dataPoints.length) * 100
            ? this.eqBarCache
            : this.eqBarCacheWhite,
          /*disc.width / 2*/ 0,
          -(disc.height / 2)
        );
        ctx.rotate(-(rotateAmount * i));
        ctx.translate(-(disc.width / 2), -(disc.height / 2));
        ctx.restore();
      });
    },
    togglePlay: function() {
      if (!this.playing) {
        this.audioElement.play();
        this.playing = !this.playing;
        this.draw();
      } else {
        this.audioElement.pause();
        this.playing = !this.playing;
      }
    },
    beginScrubbing: function(e) {
      if (this.initialised) {
        this.scrubbing = true;
        this.draw();

        window.addEventListener("mouseup", this.finishScrubbing);
        window.addEventListener("mousemove", this.scrub);

        this.scrub(e);

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      }
    },
    scrub: function(e) {
      let discPos = this.$refs.disc.getBoundingClientRect();
      let centre = {
        x: discPos.x + discPos.width / 2,
        y: discPos.y + discPos.height / 2
      };
      let mousePos = { x: e.clientX, y: e.clientY };

      let angle =
        Math.atan2(centre.y - mousePos.y, centre.x - mousePos.x) +
        Math.PI +
        Math.PI / 2;

      angle = angle > Math.PI * 2 ? angle - Math.PI * 2 : angle;

      let position = angle / (Math.PI * 2);

      this.audioElement.currentTime = this.audioElement.duration * position;
    },
    finishScrubbing: function(e) {
      this.scrubbing = false;
      window.removeEventListener("mouseup", this.finishScrubbing);
      window.removeEventListener("mousemove", this.scrub);
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "~styles/_vars.scss";

.RecordPlayer {
  position: relative;
  width: 160px;
  height: 160px;
}

.disc {
  width: 160px;
  height: 160px;

  &:hover {
    cursor: pointer;
  }
}

.toggle {
  position: absolute;
  width: 38px;
  height: 38px;
  top: 61px;
  left: 61px;
  border: 0;
  background: none;
  border-radius: 50%;
  background: linear-gradient(#191919, #000);

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
    background: linear-gradient(#000, #191919);
  }

  svg {
    fill: white;
    width: 10px;
    height: 10px;
    display: block;
    margin: auto;
  }
}

.devinfo {
  position: absolute;
  top: 100%;
  width: 100%;
  display: block;
  text-align: center;
}
</style>
