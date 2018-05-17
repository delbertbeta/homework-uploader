<template>
  <div class="homework-list">
    <div class="welcome-title">
      <div class="show-off-text-wrapper">
        <show-off-text></show-off-text>
      </div>
      <span class="title-text">请选择一个作业以开始</span>
    </div>
    <div class="homework-items">
      <div class="nothing-text" v-if="homeworkList.length === 0">这里什么都没有，愉快的玩耍去吧</div>
      <div @click="homeworkItemClicked(homework)" v-for="homework in homeworkList" :key="homework.id" class="homework-item">
        <span class="homework-name">{{homework.name}}</span>
        <span class="homework-ddl">
          <img class="small-icon" src="./assets/time.svg" />
          <span>{{getDate(homework.ddl)}}</span>
        </span>
      </div>
      <div class="no-more">
        <no-more></no-more>
      </div>
    </div>
  </div>
</template>

<script>
import animateText from "./AnimateText";
import noMore from "./NoMore"
import moment from "moment";

export default {
  name: "homework-list",
  components: {
    "show-off-text": animateText,
    "no-more": noMore
  },
  props: ['homeworkList'],
  methods: {
    getDate(s) {
      return moment(s).format("YYYY年MM月DD日 HH:mm");
    },
    homeworkItemClicked(i) {
      this.$emit('selectHomework', i);
    }
  }
};
</script>

<style lang="scss">
.homework-list {
  position: absolute;
  height: 550px;
  width: 800px;
  padding: 52px 0 0 0;
  box-sizing: border-box;
  background-color: white;
}
.welcome-title {
  margin-top: 20px;
  text-align: center;
}
.show-off-text-wrapper {
  text-align: center;
}

.title-text {
  font-size: 24px;
}

.small-icon {
  height: 22px;
  width: 22px;
}

.homework-items {
  margin-top: 64px;
  width: 100%;
  height: 332px;
  overflow-x: hidden;
  overflow-y: auto;

  .no-more {
    margin: 64px 120px 64px 120px;
    font-size: 16px;
    text-align: center;
    color: #cfcfcf;
  }

  .nothing-text {
    text-align: center;
    font-size: 24px;
    color: #888888;
  }

  .homework-item {
    font-size: 18px;
    color: #555555;
    padding: 16px 64px;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    transition: all 0.5s ease;
    border-bottom: dashed 1px #eeeeee;

    .homework-ddl {
      span {
        vertical-align: middle;
      }
      img {
        vertical-align: middle;
      }
    }
  }

  .homework-item:hover {
    color: black;
    background-color: #eeeeee;
    cursor: pointer;
  }
}
</style>
