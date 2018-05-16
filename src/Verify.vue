<template>
  <div class="verify">
    <div class="verify-title">让我们知道你是谁</div>
    <div class="number-input">
      <input class="input" v-model="number" type="tel" placeholder="" />
    </div>
    <div class="function">
      <span class="button secondary-button">返回</span>
      <span class="button primary-button">下一步</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "homework-list",
  components: {
  },
  data() {
    return {
      number: ''
    }
  }
};
</script>

<style lang="scss">
.verify {
  position: absolute;
  height: 400px;
  width: 350px;
  padding: 52px 0 0 0;
  box-sizing: border-box;
  background-color: white;
}

.verify-title {
  margin-top: 48px;
  text-align: center;
  font-size: 24px;
}

.number-input {
  margin-top: 64px;
  text-align: center;
}

.input:focus {
  outline: none;
  border-bottom: solid 2px black;
}

.input {
  appearance: none;
  border: none;
  font-size: 28px;
  width: 230px;
  text-align: center;
  font-family: "Open Sans", sans-serif;
  border-bottom: solid 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

.function {
  margin: 40px 60px;
  display: flex;
  justify-content: space-between;
}

.button {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.5s ease;
}

.button:hover {
  cursor: pointer;
}

.secondary-button {
  background-color: white;
}

.secondary-button:hover {
  background-color: #eeeeee;
}

.primary-button {
  background-color: #4787ff;
  color: white;
}
.primary-button:hover {
  background-color: #7ba9ff;
}
</style>
