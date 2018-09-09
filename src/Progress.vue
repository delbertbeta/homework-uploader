<template>
  <div class="progress-wrapper">
    <div class="progress-bar" :class="{error: errorState}" :style="{
      width: progressBar + '%'
    }"></div>
    <span class="progress-text">{{textProgress}}</span>
  </div>
</template>

<script>
let interval;
export default {
  name: "custom-progress",
  props: ["progress", "handled", "error"],
  data() {
    return {
      progressBar: 0,
      textProgress: "0%",
      errorState: false
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
        let display =
          (to - from) *
            (-Math.pow(2, -10 * progress / timeout) + 1) *
            1024 /
            1023 +
          from;
        display = display.toFixed(0);
        this.textProgress = display + "%";

        if (progress < timeout) {
          requestAnimationFrame(callback);
        } else {
          if (this.handled) {
            this.textProgress = "完成";
            clearInterval(interval);
          }
        }
      };
      requestAnimationFrame(callback);
    }
  },
  mounted() {
    interval = setInterval(() => {
      if (this.error) {
        this.errorState = true;
        this.textProgress = "错误";
        clearInterval(interval);
        return;
      }
      if (parseInt(this.textProgress) !== this.progress) {
        this.progressBar = this.progress;
        this.textAnimation(parseInt(this.textProgress), this.progress, 1000);
      }
    }, 1200);
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: content-box;

  .progress-bar {
    height: 100%;
    left: 0;
    top: 0;
    background-color: #eeeeee;
    transition: all 0.5s ease;
  }
  .progress-bar.error {
    background-color: #ff8f8f;
  }
  .progress-text {
    position: absolute;
    right: 28px;
    top: 12px;
  }
}
</style>
