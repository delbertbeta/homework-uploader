<template>
  <div class="progress-wrapper">
    <div class="progress-bar" :style="{
      width: progressBar + '%'
    }"></div>
    <span class="progress-text">{{textProgress}}%</span>
  </div>
</template>

<script>
export default {
  name: "custom-progress",
  props: ["progress"],
  data() {
    return {
      progressBar: 0,
      textProgress: 0
    };
  },
  methods: {
    textAnimation(from, to, timeout) {
        let startTime = -1;

        let callback = timestamp => {
            if (startTime === -1) {
                startTime = timestamp;
            }
            let progress = timestamp - startTime;
            // let display = (from + (to - from) * ((Math.sin((progress) * Math.PI - Math.PI / 2) + 1) / 2)).toFixed(0);
            let display = (to - from) * (-Math.pow(2, -10 * progress / timeout) + 1) * 1024 / 1023 + from;
            display = display.toFixed(0);
            // console.log(display);
            this.textProgress = display;
            
            if (progress < timeout) {
                requestAnimationFrame(callback);
            }
        }
        requestAnimationFrame(callback);
    }
  },
  mounted() {
    setInterval(() => {
      this.progressBar = this.progress;
      this.textAnimation(parseInt(this.textProgress), this.progress, 1000);
    }, 1200)
  }
};
</script>

<style lang="scss">
.progress-wrapper {
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .progress-bar {
    height: 100%;
    left: 0;
    top: 0;
    background-color: #eeeeee;
    transition: all 0.5s ease;
  }
  .progress-text {
    position: absolute;
    right: 28px;
    top: 12px;
  }
}
</style>
