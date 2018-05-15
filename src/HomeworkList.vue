<template>
  <div class="homework-list">
    <div class="welcome-title">
      <div class="show-off-text-wrapper">
        <show-off-text></show-off-text>
      </div>
      <span class="title-text">请选择一个作业以开始</span>
    </div>
    <div class="homework-items">
      <div v-for="homework in homeworkList" :key="homework.id" class="homework-item">
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
  data() {
    return {
      homeworkList: [
        {
          id: 1,
          name: "测试作业",
          multifile: true,
          ddl: "2018-05-14T16:02:00.000Z",
          tip: "这是一个提醒"
        },
        {
          id: 1,
          name: "数据库第二次实验报告",
          multifile: true,
          ddl: "2018-05-14T16:02:00.000Z",
          tip: "这是一个提醒"
        }
      ]
    };
  },
  methods: {
    getDate(s) {
      return moment(s).format("YYYY年MM月DD日 HH:mm");
    }
  }
};
</script>

<style lang="scss">
.homework-list {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 52px 0 0 0;
  box-sizing: border-box;
  background-color: white;
}
.welcome-title {
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
  height: 352px;
  overflow-x: hidden;
  overflow-y: auto;

  .no-more {
    margin: 64px 120px 64px 120px;
    font-size: 16px;
    text-align: center;
    color: #cfcfcf;
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
