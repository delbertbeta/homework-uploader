<template>
  <div class="uploaded-container">
    <div class="uploaded-title">
      <p class="bold-text">emmm...</p>
      <p class="title-text">我们发现您有过以下的提交记录</p>
    </div>
    <div class="uploaded-items">
      <div v-for="(uploaded,index) in uploadedList" :key="uploaded.id" class="uploaded-item">
        <span class="uploaded-name">{{uploaded.originalFile}}<span class="small-text">{{getSize(uploaded.fileSize)}}</span></span>
        <span class="uploaded-time">
          <img class="small-icon" src="./assets/time.svg" />
          <span>{{
            getDate(uploaded, index)
          }}</span>
        </span>
      </div>
    </div>
    <div class="uploaded-function">
      <span class="button secondary-button">返回</span>
      <span class="button primary-button">继续</span>
    </div>
  </div>
</template>

<script>
import filesize from "filesize";
import moment from "moment";

export default {
  name: "uploaded",
  data() {
    return {
      uploadedList: [
        {
          id: 1,
          who: "一个人名",
          student_number: 2016,
          target: 1,
          originalFile: "计网.txt",
          storageFile:
            "C:\\Users\\delbertbeta\\Desktop\\Projects\\HomeworkUploaderApi\\upload\\test\\2016-软件4班-一个人名\\计网.txt",
          fileSize: 128,
          date: "2018-05-16T02:54:01.000Z",
          homework_list: {
            id: 1,
            name: "test",
            multifile: false,
            create_folder: false,
            finished: false,
            ddl: "2018-05-15T16:02:00.000Z",
            tip: "你好啊"
          }
        }
      ]
    };
  },
  methods: {
    getDate(u, i) {
      if (u.homework_list.multifile === false && i !== 0) {
        return "已覆盖";
      }
      return moment(u.date).format("YYYY年MM月DD日 HH:mm");
    },
    getSize(s) {
      return filesize(s);
    }
  }
};
</script>


<style lang="scss">
.uploaded-container {
  position: absolute;
  height: 550px;
  width: 950px;
  padding: 52px 0 0 0;
  box-sizing: border-box;
  background-color: white;
}

.uploaded-title {
  text-align: center;

  .bold-text {
    font-weight: 700;
    font-size: 32px;
    margin-top: 8px;
    margin-bottom: 0px;
  }

  .title-text {
    margin-top: 12px;
    font-size: 24px;
  }
}

.uploaded-items {
  margin-top: 32px;
  width: 100%;
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;

  .uploaded-item {
    font-size: 18px;
    color: #555555;
    padding: 16px 64px;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    transition: all 0.5s ease;
    border-bottom: dashed 1px #eeeeee;

    .small-text {
      display: inline-block;
      font-size: 12px;
      color: #aaaaaa;
      vertical-align: middle;
      margin-left: 8px;
    }

    .uploaded-time {
      span {
        vertical-align: middle;
      }
      img {
        vertical-align: middle;
      }
    }
  }

  .uploaded-item:hover {
    color: black;
    background-color: #eeeeee;
    cursor: pointer;
  }
}

.uploaded-function {
  margin: 16px 200px 0 200px;
  display: flex;
  justify-content: space-between;

  .button {
    font-size: 18px;
    padding: 8px 16px;
  }

  .primary-button {
    background-color: #ff4747;
  }
  .primary-button:hover {
    background-color: #ff6d6d;
  }
}
</style>
