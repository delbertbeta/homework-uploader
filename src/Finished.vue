<template>
  <div class="finished-container">
    <div class="icon-container">
      <img src="./assets/checked.svg" class="checked-img" />
      <div class="finished-text">已收到您的作业</div>
    </div>
    <div class="button primary-button big" @click="goToHome">选择另一份作业</div>
  </div>
</template>

<script>
export default {
  name: 'finished',
  methods: {
    goToHome() {
      this.$emit('goToHome');
    }
  }
};
</script>

<style lang="scss">
.finished-container {
  position: absolute;
  height: 500px;
  width: 400px;
  padding: 52px 0 0 0;
  box-sizing: border-box;
  background-color: white;
  .icon-container {
    margin-top: 48px;
    text-align: center;
    .checked-img {
      height: 92px;
    }
    .finished-text {
      margin-top: 16px;
      font-size: 24px;
    }
  }
  .big {
    display: block;
    margin: 128px 48px 0 48px;
    text-align: center;
    padding: 12px 0;
  }
}
</style>
