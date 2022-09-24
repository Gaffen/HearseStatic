import 'svelte';
import { onMount } from 'svelte';

export let record;
export let artwork;

let maxRecordSize = 320 - 40;
let maxRecordInnerSize = 100;
let defaultArtwork =
  typeof artwork === 'string' ? JSON.parse(artwork) : artwork;
let hideFallback = false;
let playing = false;
let scrubbing = false;
let playPosition = 0;
let buffered = 0;
let mousePos = null;
let initialised = false;
let bassBoom = 1;
let canvasSize = 320;
let minRecordSize = maxRecordSize - maxRecordSize / 6;
let recordInnerSize = maxRecordInnerSize;
let recordSize = maxRecordSize;
let eqBarCache = null;
let eqBarCacheWhite = null;
let eqBarWidth = 0;
let eqBarRotation = 0;
let eqSampleSize = 2;
let artworkMainImg = defaultArtwork.src;
let artworkSrcSet = defaultArtwork.srcset;
let audioElement = null;
let sUsrAg = null;
let disc;
let discCtx;
let audioCtx;
let analyser;
let source;
let dataArray;
let freqArray;

const createBarData = () => {
  drawBar(eqBarCache, 'rgb(0, 0, 0)');
  drawBar(eqBarCacheWhite, 'rgb(255, 255, 255)');
};

const drawBar = (canvas, colour) => {
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(0, eqBarCache.height);
  ctx.arc(
    0,
    disc.height / 2,
    disc.height / 2,
    0 - Math.PI / 2,
    eqBarWidth - Math.PI / 2
  );
  ctx.closePath();
  ctx.fill();
};

const drawUI = () => {
  if (initialised) {
    drawRecord();
  }
};

const draw = () => {
  if (playing || scrubbing) {
    let drawVisual = requestAnimationFrame(draw);
  }

  discCtx.clearRect(0, 0, disc.width, disc.height);

  drawUI();

  if (analyser) {
    runAnalysis();
  }
};

const drawRecord = () => {
  // White Disc
  discCtx.fillStyle = 'rgb(255, 255, 255)';
  discCtx.beginPath();
  discCtx.arc(
    disc.width / 2,
    disc.height / 2,
    recordSize / 2,
    0,
    Math.PI * 2,
    false
  );
  discCtx.arc(
    disc.width / 2,
    disc.height / 2,
    recordInnerSize / 2,
    0,
    Math.PI * 2,
    true
  );
  discCtx.closePath();
  discCtx.fill();

  if (audioElement.buffered.length > 0) {
    let buffered = audioElement.buffered;
    buffered =
      (audioElement.buffered.end(audioElement.buffered.length - 1) /
        audioElement.duration) *
      100;
  }

  if (audioElement.duration) {
    playPosition = (audioElement.currentTime / audioElement.duration) * 100;
  }

  // Buffered Ring
  drawProgressBar('rgb(200, 200, 200)', buffered);

  // Playhead Position
  drawProgressBar('rgb(0, 0, 0)', playPosition);

  drawEqualizerBars();
};

const drawProgressBar = (color, percentage) => {
  let ctx = discCtx;
  let startPos = Math.PI * 2 - Math.PI / 2;
  let progressPosition = startPos + ((Math.PI * 2) / 100) * percentage;

  discCtx.fillStyle = color;
  discCtx.beginPath();
  discCtx.arc(
    disc.width / 2,
    disc.height / 2,
    recordSize / 2,
    progressPosition,
    startPos,
    true
  );
  discCtx.lineTo(disc.width / 2, disc.height / 2 - 11 / 2);
  discCtx.arc(
    disc.width / 2,
    disc.height / 2,
    recordInnerSize / 2,
    startPos,
    progressPosition,
    false
  );
  discCtx.closePath();
  discCtx.fill();
};

const drawEqualizerBars = () => {
  if (freqArray) {
    let ctx = discCtx;
    let dataPoints = [];

    let rotateAmount = eqBarRotation;

    for (let i = 0; i < freqArray.length; i += eqSampleSize) {
      dataPoints.push(freqArray.slice(i, i + eqSampleSize));
    }

    dataPoints.forEach((freqData, i) => {
      let mean =
        freqData.reduce((dataPoint, total) => {
          return total + dataPoint;
        }, 0) / freqData.length;
      let multiplier = (mean - 126) / 100;
      let ringWidth = recordSize - recordInnerSize;

      let barSize = (recordInnerSize + ringWidth * multiplier) / 2;

      barSize = barSize >= 0 ? barSize : 0;

      discCtx.save();
      discCtx.beginPath();
      // if (barSize < this.recordInnerSize / 2) {
      discCtx.arc(
        disc.width / 2,
        disc.height / 2,
        recordInnerSize / 2,
        0,
        Math.PI * 2,
        barSize <= recordInnerSize / 2
      );
      // }

      // if (i === 3) {
      //  console.log(
      //    this.playPosition,
      //    i / dataPoints.length * 100,
      //    this.playPosition < i / dataPoints.length * 100
      //  );
      // }

      discCtx.arc(
        disc.width / 2,
        disc.height / 2,
        barSize,
        0,
        Math.PI * 2,
        barSize > recordInnerSize / 2
      );
      discCtx.closePath();
      discCtx.translate(disc.width / 2, disc.height / 2);
      discCtx.rotate(rotateAmount * i);
      discCtx.clip();
      discCtx.drawImage(
        barSize > recordInnerSize / 2 &&
          playPosition < (i / dataPoints.length) * 100
          ? eqBarCache
          : eqBarCacheWhite,
        0,
        -(disc.height / 2)
      );
      ctx.rotate(-(rotateAmount * i));
      ctx.translate(-(disc.width / 2), -(disc.height / 2));
      ctx.restore();
    });
  }
};

const runAnalysis = () => {
  analyser.getByteFrequencyData(dataArray);
  analyser.getByteTimeDomainData(freqArray);

  let bassSample = dataArray.slice(dataArray.length / 4);
  let bassVolume =
    bassSample.reduce((accumulated, vol) => {
      return accumulated + vol;
    }, 0) /
    (dataArray.length / 4);

  bassBoom = bassVolume / 255;

  let variance = bassBoom * (maxRecordSize - minRecordSize);

  recordSize = minRecordSize + variance;
  recordInnerSize = maxRecordInnerSize + variance;
};

const togglePlay = () => {
  if (!playing) {
    if (!audioElement.src) {
      audioElement.src = record;
    }
    audioElement.play();
    playing = !playing;
    draw();
  } else {
    audioElement.pause();
    playing = !playing;
  }
};

const beginScrubbing = (e) => {
  if (initialised) {
    scrubbing = true;
    draw();

    window.addEventListener('mouseup', finishScrubbing);
    window.addEventListener('mousemove', scrub);

    scrub(e);

    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }
};

const scrub = (e) => {
  let discPos = disc.getBoundingClientRect();
  let centre = {
    x: discPos.x + discPos.width / 2,
    y: discPos.y + discPos.height / 2,
  };
  let mousePos = { x: e.clientX, y: e.clientY };

  let angle =
    Math.atan2(centre.y - mousePos.y, centre.x - mousePos.x) +
    Math.PI +
    Math.PI / 2;

  angle = angle > Math.PI * 2 ? angle - Math.PI * 2 : angle;

  let position = angle / (Math.PI * 2);

  audioElement.currentTime = audioElement.duration * position;
};

const finishScrubbing = (e) => {
  scrubbing = false;
  window.removeEventListener('mouseup', finishScrubbing);
  window.removeEventListener('mousemove', scrub);
};

onMount(() => {
  console.log('test');
  if (Modernizr.webaudio) {
    hideFallback = true;
  }
  audioElement = document.createElement('audio');
  audioElement.crossOrigin = 'anonymous';
  sUsrAg = navigator.userAgent;
  eqBarCache = document.createElement('canvas');
  eqBarCacheWhite = document.createElement('canvas');
  eqBarCache.width = 80;
  eqBarCache.height = disc.height / 2;
  eqBarCacheWhite.width = 80;
  eqBarCacheWhite.height = disc.height / 2;

  discCtx = disc.getContext('2d');

  drawUI();

  audioElement.addEventListener('playing', () => {
    if (!initialised) {
      initialised = true;
    }
    if (!analyser) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaElementSource(audioElement);
      source.connect(analyser);
      source.connect(audioCtx.destination);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      freqArray = new Uint8Array(bufferLength);

      let segmentWidth = 360 / (analyser.fftSize / (eqSampleSize * 2));

      eqBarWidth = (segmentWidth / 5) * 3 * (Math.PI / 180);
      eqBarRotation = segmentWidth * (Math.PI / 180);

      createBarData();
    } else {
      if (!source) {
        source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        source.connect(audioCtx.destination);
      }
    }
  });
  audioElement.addEventListener('ended', () => {
    playing = false;
    initialised = false;
    drawUI();
  });
});
