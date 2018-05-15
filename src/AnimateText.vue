<template>
  <div class="animate-text-wrapper" :class="{'swap': swap}">
    <span class="first-span">{{first}}</span>
    <span class="second-span">{{second}}</span>
  </div>
</template>

<script>
export default {
  name: 'animate-text',
  data() {
    return {
      textList: [
        '欢迎',
        'Welcome',
        'Bienvenue',
        'Willkommen',
        'ようこそ',
        '환영합니다'
      ],
      first: '欢迎',
      second: 'Welcome',
      swap: false
    }
  },
  mounted() {
    let index = 0;
    setInterval(() => {
      this.swap = true;
      setTimeout(() => {
        this.swap = false;
        [this.second, this.first] = [this.first, this.second];
      }, 1000)
      if (index === this.textList.length) {
        index = 0;
      }
      this.first = this.textList[index];
      this.second = this.textList[(index + 1) % this.textList.length];
      index++;
    }, 5000)
  }
}
</script>


<style lang="scss">

.animate-text-wrapper {
  display: inline-block;
  font-size: 32px;
  overflow: hidden;
  font-weight: 700;
  height: 48px;

  span {
    display: block;
    line-height: 48px;
  }
}

.animate-text-wrapper.swap {
  span {
    transition: all 1s cubic-bezier(.85,.07,.17,.92);
    transform: translateY(-100%);
  }
}

</style>

