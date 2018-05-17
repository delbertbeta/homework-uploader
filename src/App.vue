<template>
  <div id="app" class="app">
    <div class="container" :class="{
      'stage-1': stage === 1,
      'stage-2': stage === 2,
      'stage-3': stage === 3,
      'stage-4': stage === 4,
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
      <finished
      :class="{
        'hide': finishedOuted, 
        'in': finishedIn, 
        'out': finishedOut
      }"
      @goToHome="goToHome"
      ></finished>
    </div>
    <div class="background-container">
      <div class="background-img" :class="{fadeIn: backgroundLoaded}" :style="{backgroundImage: 'url(' + backgroundUrl + ')'}"></div>
      <div class="background-mask" :class="{fadeIn: backgroundLoaded}"></div>
    </div>
    <div v-if="backgroundError" class="info">Error occurs when requesting Unsplash API.</div>
    <div v-if="backgroundLoaded" class="info">Photo by {{backgroundInfo.author}}, visit it on <a :href="backgroundInfo.url">Unsplash.</a></div>
  </div>
</template>

<script>
import api from "./api";
import moment from "moment";
import homeworkList from "./HomeworkList";
import verify from "./Verify";
import uploaded from "./Uploaded";
import upload from "./Upload";
import finished from "./Finished";

export default {
  name: "app",
  components: {
    "homework-list": homeworkList,
    verify: verify,
    uploaded: uploaded,
    upload: upload,
    finished: finished
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
      finishedOut: false,
      finishedOuted: true,
      finishedIn: false,
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
      },
      backgroundUrl: "",
      backgroundLoaded: false,
      backgroundError: false,
      backgroundInfo: {}
    };
  },
  mounted: function() {
    this.axios.get(api.HomeworkList).then(r => {
      this.homeworkList = r.data;
    });
    this.axios
      .get(api.Unsplash)
      .then(r => {
        const index = Math.floor(Math.random() * 10);
        const item = r.data[index];
        const image = new Image();
        image.src = item.urls.regular;
        image.onload = () => {
          this.backgroundUrl = image.src;
          setTimeout(() => {
            this.backgroundLoaded = true;
          }, 1000);
        };
        this.backgroundInfo = {
          author: item.user.name,
          url: item.links.html
        };
      })
      .catch(() => {
        this.backgroundError = true;
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
        this.$refs["uploadComponent"].clearList();
        this.stage = 3;
      }
    },
    goToUpload() {
      this.changeView("uploaded", "upload");
      this.$refs["uploadComponent"].clearList();
      this.stage = 3;
    },
    goToFinished() {
      this.changeView("upload", "finished");
      this.stage = 4;
    },
    goToHome() {
      this.changeView("finished", "homeworkList");
      this.stage = 0;
    },
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
  font-family: "Microsoft YaHei UI", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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

.background-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;

  .background-img {
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: all 1s ease;
  }
  .background-img.fadeIn,
  .background-mask.fadeIn {
    opacity: 1;
  }
  .background-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
    opacity: 0.01;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 1s ease;
  }
}
.info {
  position: fixed;
  bottom: 32px;
  left: 24px;
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  color: #bebebe;
  z-index: 1;
  a,
  a:visited {
    color: #bebebe;
    text-decoration: none;
    border-bottom: solid 1px #bebebe;
  }
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

.container.stage-4 {
  height: 500px;
  width: 400px;
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
