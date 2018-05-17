<template>
  <div class="verify">
    <div class="verify-title">让我知道您是谁</div>
    <div class="number-input">
      <input @keypress="inputKeyPress" :class="{error: errorState, shake}" class="input" v-model="number" type="tel" placeholder="Student ID" />
    </div>
    <div class="function">
      <span class="button secondary-button" @click="goBack">返回</span>
      <span class="button primary-button" @click="check">下一步</span>
    </div>
  </div>
</template>

<script>
import api from "./api";

export default {
  name: "homework-list",
  props: ["id"],
  data() {
    return {
      number: "",
      errorState: false,
      shake: false
    };
  },
  methods: {
    goBack() {
      this.$emit("goBack");
    },
    inputKeyPress(e) {
      if (e.keyCode === 13) {
        this.check();
      }
    },
    check() {
      this.axios.get(api.Verify, {
        params: {
          id: this.number,
          homework: this.id
        }
      }).then((r) => {
        this.errorState = false;
        this.$emit('idInput', this.number, r.data);
      }).catch(() => {
        this.error();
      })
    },
    error() {
      this.errorState = true;
      this.shake = true;
      setTimeout(() => {
        this.shake = false;
      }, 500);
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
  border-bottom: solid 2px rgb(88, 88, 88);
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

.input.error {
  border-bottom: solid 2px #ff3a3a;
}

.input.error:focus {
  border-bottom: solid 2px #ff3a3a;
}

.shake {
  animation: shake 0.5s ease 0s 1;
}

@keyframes shake {
  from {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-10%);
  }

  40% {
    transform: translateX(10%);
  }

  60% {
    transform: translateX(-10%);
  }

  80% {
    transform: translateX(10%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
