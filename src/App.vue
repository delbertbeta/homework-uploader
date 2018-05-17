<template>
  <div id="app" class="app">
    <div class="container" :class="{
      'stage-1': stage === 1,
      'stage-2': stage === 2,
      'stage-3': stage === 3,
      'hover': hover
    }">
      <div class="header">
        <img class="logo" src="./assets/logo.svg" />
        <span>Homework Uploader</span>
        <span class="version">beta</span>
      </div>
      <homework-list
      :class="{
        'hide': homeworkListOuted, 
        'in': homeworkListIn,
        'out': homeworkListOut
      }"
      :homeworkList="homeworkList"
      @selectHomework="selectHomework"
      ></homework-list>
      <verify 
      :class="{
        'hide': verifyOuted, 
        'in': verifyIn, 
        'out': verifyOut
      }"
      :id="selectedHomework"
      @goBack="goBack"
      @idInput="idInput"
      ></verify>
      <uploaded 
      :class="{
        'hide': uploadedOuted, 
        'in': uploadedIn, 
        'out': uploadedOut
      }"
      :uploadedList="uploadedList"
      @goBack="goBack"
      @goToUpload="goToUpload"
      ></uploaded>
      <upload
      :class="{
        'hide': uploadOuted, 
        'in': uploadIn, 
        'out': uploadOut
      }"
      ref="uploadComponent"
      :homework="selectedHomeworkObj"
      :id="studentId"
      @goBack="goBack"
      @goToFinished="goToFinished"
      @onHover="onHover"
      @onHoverOut="onHoverOut"
      ></upload>
    </div>
  </div>
</template>

<script>
import api from "./api";
import moment from "moment";
import homeworkList from "./HomeworkList";
import verify from "./Verify";
import uploaded from "./uploaded";
import upload from "./upload";

export default {
  name: "app",
  components: {
    "homework-list": homeworkList,
    verify: verify,
    uploaded: uploaded,
    upload: upload
  },
  data() {
    return {
      homeworkListOut: false,
      homeworkListOuted: false,
      homeworkListIn: true,
      verifyOut: false,
      verifyOuted: true,
      verifyIn: false,
      uploadedOut: false,
      uploadedOuted: true,
      uploadedIn: false,
      uploadOut: false,
      uploadOuted: true,
      uploadIn: false,
      hover: false,
      stage: 0,
      homeworkList: [],
      selectedHomework: -1,
      studentId: -1,
      uploadedList: [],
      selectedHomeworkObj: {
        id: -1,
        name: "",
        tip: "",
        multifile: false
      }
    };
  },
  mounted: function() {
    this.axios.get(api.HomeworkList).then(r => {
      this.homeworkList = r.data;
    });
  },
  methods: {
    changeView(from, to) {
      this[from + "Out"] = true;
      this[from + "In"] = false;
      setTimeout(() => {
        this[from + "Outed"] = true;
        this[from + "Out"] = false;
        this[to + "Outed"] = false;
        this[to + "In"] = true;
      }, 500);
    },
    goBack() {
      if (this.stage === 3) {
        if (this.uploadedList.length === 0) {
          this.changeView("upload", "verify");
          this.stage = 1;
        } else {
          this.changeView("upload", "uploaded");
          this.stage = 2;
        }
      } else if (this.stage === 2) {
        this.changeView("uploaded", "verify");
        this.stage = 1;
      } else if (this.stage === 1) {
        this.changeView("verify", "homeworkList");
        this.stage = 0;
      }
    },
    selectHomework(homework) {
      this.selectedHomework = homework.id;
      this.selectedHomeworkObj = homework;
      this.changeView("homeworkList", "verify");
      this.stage = 1;
    },
    idInput(studentId, uploadedList) {
      this.studentId = studentId;
      this.uploadedList = uploadedList;
      if (uploadedList.length !== 0) {
        this.changeView("verify", "uploaded");
        this.stage = 2;
      } else {
        this.changeView("verify", "upload");
        this.$refs['uploadComponent'].clearList();
        this.stage = 3;
      }
    },
    goToUpload() {
      this.changeView("uploaded", "upload");
      this.$refs['uploadComponent'].clearList();
      this.stage = 3;
    },
    goToFinished() {},
    onHover() {
      this.hover = true;
    },
    onHoverOut() {
      this.hover = false;
    }
  }
};
</script>

<style lang="scss">
html {
  height: 100%;
  width: 100%;
  font-family: "Microsoft YaHei UI", "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB", "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  // font-family: "Microsoft Yahei UI", Monospace;
  min-width: 900px;
  min-height: 480px;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
}

.app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.container {
  position: relative;
  height: 550px;
  width: 800px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: 300;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.5s ease;

  .header {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    margin: 16px;
    line-height: 32px;
    vertical-align: middle;
    font-weight: 300;
    font-family: "Open Sans", sans-serif;

    .logo {
      width: 32px;
      height: 32px;
      vertical-align: top;
    }
    .version {
      display: inline-block;
      line-height: 16px;
      font-size: 8px;
      vertical-align: middle;
      border-radius: 4px;
      background-color: #4787ff;
      color: white;
      height: 16px;
      margin: 0;
      padding: 4px;
      margin-left: 4px;
    }
  }
}

.container.stage-1 {
  height: 400px;
  width: 350px;
}

.container.stage-2 {
  height: 550px;
  width: 950px;
}

.container.stage-3 {
  height: 650px;
  width: 500px;
}

.container.hover {
  transform: scale(1.1);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.in {
  animation: in 0.5s ease both;
}

.out {
  animation: out 0.5s ease both;
}

.hide {
  display: none;
}

@keyframes in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
