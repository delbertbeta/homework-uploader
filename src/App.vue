<template>
  <div id="app" class="app">
    <div class="cover" :style="background">
      <div class="shadow"></div>
      <div class="line"></div>
    </div>
    <!-- <div class="blur-background" :class="{show: toastShow}" :style="background"></div> -->
    <div class="toast" :class="{show: toastShow}">
      <i class="priority-icon"></i>
      <span class="tip-text">{{ toastTip }}</span>
    </div>
    <div class="left">
      <div class="title-area">
        <p class="horizontal-text">HOMEWORK UPLOADER</p>
        <p class="sub-text">Author:<br />delbertbeta</p>
        </p>
      </div>
    </div>
    <div class="right">
      <div class="border-area">
        <div class="info-page" :class="{hide: !nowFirstPage}">
          <div class="first-row">
            <select class="select" v-model="homework">
              <option disabled value="">Select a homework</option>
              <option v-for="(homework,index) in homeworkList" :value="index" :key="homework.name">{{ homework.name }}</option>
            </select>
          </div>
          <div class="second-row">
            <input class="input" v-model="studentNumber" type="tel" placeholder="Student ID" />
          </div>
          <img @click="goToNext" class="next-arrow" src="./assets/right_arrow.png" />
        </div>
        <div class="upload-page" :class="{hide: nowFirstPage}" @dragleave="dragLeave" @drop="dragDrop" @dragover="dragOver" @click="opneFilePicker">
          <div class="drag-status" :class="{'over': isDragOver}"></div>
          <div class="progress" :class="{progressRunning: progressRunning}" :style="progressStyle"></div>
          <div class="upload-info">
            <img @click="goToFirst" class="goback-arrow" src="./assets/left_arrow.png" />
            <img class="upload-icon" src="./assets/upload.png" />
            <p>拖放或点击此处打开文件</p>
            <input id="filePicker" type="file" style="display: none;" @change="pickedFile" :multiple="multifile" />
            <p>{{ multifile ? '您可以上传多个文件，它们都会被保存下来' : '您仅可以上传一个文件，新的文件将会覆盖旧的文件'}} </p>
          </div>
          <div class="hide-scrollbar">
            <transition-group name="filelist" tag="div" id="fileList" class="file-info" @dragleave="dragLeave" @drop="dragDrop" @dragover="dragOver">
              <p v-for="(file, index) in fileList" :key="file.filename" class="file-text" :class="{error: file.status === 'error', running: file.status === 'running', ok: file.status === 'ok'}"> {{ file.filename }}</p>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from './ajax';
import api from './api';

export default {
  name: 'app',
  data() {
    return {
      homework: '',
      homeworkList: [
      ],
      nowFirstPage: true,
      studentNumber: '',
      isDragOver: false,
      fileList: [
      ],
      progress: 0,
      totalSize: 0,
      progressRunning: false,
      toastShow: false,
      hasGoNexted: false,
      toastTip: '',
    }
  },
  computed: {
    background: function() {
      let range = 6 - 1;
      let rand = Math.random();
      let index = (1 + Math.round(rand * range));
      let url = 'url(./assets/background_image_' + index + '.jpg)';
      return {
        backgroundImage: url
      }
    },
    multifile: function() {
      let work = this.homeworkList[this.homework];
      if (work === undefined) return true;
      else return work.multifile;
    },
    progressStyle: function() {
      return {
        bottom: (-100 + this.progress * 100) + '%'
      }
    }
  },
  mounted: function() {
    let that = this;
    ajax.get(api.HomeworkList, null, false, function(data) {
      that.homeworkList = JSON.parse(data);
    }, function() { }, false)
  },
  methods: {
    goToNext: function() {
      if (this.homework === '' || this.studentNumber === '') {
        return;
      } else {
        let that = this;
        ajax.get(api.Verify, 'id=' + this.studentNumber, false, function() {
          that.nowFirstPage = false;
        }, function() { alert('你确定你是4班的么...') }, false)
      }
      if (this.hasGoNexted === false) {
        (function() {
          let fileListDom = document.getElementById('fileList');
          let scrolled = false;
          fileListDom.addEventListener('scroll', function() {
            // console.log(fileListDom.scrollTop + "." + fileListDom.scrollHeight )
            if (fileListDom.scrollTop < fileListDom.scrollHeight - fileListDom.clientHeight) {
              scrolled = true;
            } else {
              scrolled = false;
            }
          })
          setInterval(function() {
            if (scrolled === false)
              fileListDom.scrollTop = fileListDom.scrollTopMax;
          }, 100)
        })()
      }
      this.hasGoNexted = true;
    },
    goToFirst: function(event) {
      // event.preventDefault();
      event.stopPropagation();
      this.fileList = [];
      this.progressRunning = false;
      this.totalSize = 0;
      this.progress = 0;
      this.nowFirstPage = true;
    },
    dragOver: function(event) {
      event.preventDefault();
      this.isDragOver = true;
      event.dataTransfer.dropEffect = 'copy';
    },
    dragLeave: function(event) {
      event.preventDefault();
      this.isDragOver = false;
    },
    dragDrop: function(event) {
      event.preventDefault();
      this.isDragOver = false;

      let dt = event.dataTransfer;
      let files = dt.files;

      this.filesHandle(files);
    },
    opneFilePicker: function() {
      document.getElementById('filePicker').click();
    },
    pickedFile: function() {
      this.filesHandle(document.getElementById('filePicker').files);
    },
    filesHandle: function(files) {
      if (files.length === 0) {
        return;
      }
      if (this.multifile) {
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          // if (file.type === '') continue;
          let fileListItem = {
            filename: file.name,
            status: 'running',
            file: file
          };
          this.totalSize += file.size;
          this.fileList.push(fileListItem);
        }
      } else {
        let file = files[0];
        // if (file.type === '') return;
        let fileList = [{
          filename: file.name,
          status: 'running',
          file: file
        }];
        this.totalSize = file.size;
        this.fileList = fileList;
      }
      this.uploadHandle();
    },
    uploadHandle: function() {
      let that = this;
      if (that.progressRunning === true) {
        return;
      }
      let errorState = false;
      let progressHandle = function(event) {
        let uploadedSize = 0;
        for (let i = 0; i < that.fileList.length; i++) {
          if (that.fileList[i].status === 'ok') {
            uploadedSize += that.fileList[i].file.size;
          } else if (that.fileList[i].status === 'running') {
            break;
          }
        }
        uploadedSize += event.loaded;
        that.progress = uploadedSize / that.totalSize;
      }
      let upload = function(file, index) {
        let formData = new FormData;
        formData.append('info', JSON.stringify({
          studentNumber: that.studentNumber,
          homework: that.homeworkList[parseInt(that.homework)].id
        }));
        formData.append('file', file);
        ajax.postFormData(api.UploadFile, formData, function() {
          that.$set(that.fileList[index], 'status', 'ok');
          setTimeout(listHandle.bind(that), 100);
        }, function() {
          that.totalSize -= file.size;
          that.$set(that.fileList[index], 'status', 'error');
          setTimeout(listHandle.bind(that), 100);
          // listHandle();
        }, progressHandle);
      }
      let listHandle = function() {
        that.progressRunning = true;
        let uploadedSize = 0;
        for (let i = 0; i < that.fileList.length; i++) {
          if (that.fileList[i].status === 'ok') {
            uploadedSize += that.fileList[i].file.size;
          } else if (that.fileList[i].status === 'error') {
            errorState = true;
          } else if (that.fileList[i].status === 'running') {
            break;
          }
        }
        that.progress = uploadedSize / that.totalSize;
        let index = 0;
        // console.log(that.fileList.length + '.' + that.fileList[index].status);
        while (index < that.fileList.length && (that.fileList[index].status === 'ok' || that.fileList[index].status === 'error')) {
          index++;
        }
        if (index !== that.fileList.length)
          upload(that.fileList[index].file, index);
        else {
          if (errorState === true) {
            that.toastTip = '处理队列时有错误发生';
          } else {
            that.toastTip = '队列上传成功';
          }
          this.showToast();
          that.progressRunning = false;
          return;
        }
      }
      listHandle();
    },
    showToast: function() {
      if (this.toastShow === true) {
        return;
      } else {
        this.toastShow = true;
        setTimeout(() => {
          this.toastShow = false;
        }, 10000);
      }
    }
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
  width: 100%;
  font-family: "Microsoft Yahei UI", Monospace;
  min-width: 900px;
  min-height: 480px;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
  .app {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .left {
      position: absolute;
      width: 54%;
      height: 100%;
      overflow: hidden;
      .title-area {
        animation: move-in-from-right 1s cubic-bezier(.82, .02, .12, 1) 0.6s 1;
        animation-fill-mode: both;
        position: absolute;
        right: 25px;
        top: 50%;
        text-align: right; // transform: translateY(-50%);
        .horizontal-text {
          margin: 12px 0;
          color: white;
          font-size: 40px;
          font-weight: 900;
        } // .sub-text {
        //   // line-height: 28px;
        //   // display: inline-block;
        //   // text-align: left;
        //   // writing-mode: tb-rl;
        //   color: white;
        //   font-size: 24px;
        //   font-weight: 300;
        //   // transform: rotate(180deg) translateX(100%);
        //   // margin-left: 100%;
        //   padding-bottom: 8px;
        //   border-bottom: solid 2px rgba(255, 255, 255, 0.6);
        // }
        .sub-text {
          bottom: 0px;
          margin-bottom: 0px;
          display: inline-block;
          margin-top: 60px;
          transform: rotate(270deg) translate(10px, 36px);
          color: white;
          font-size: 24px;
          font-weight: 300;
          padding-right: 8px;
          border-right: solid 2px rgba(255, 255, 255, 0.6);
        }
      }
    }
    .right {
      position: absolute;
      left: 54%;
      width: 46%;
      height: 100%;
      overflow: hidden;
      .border-area {
        animation: move-in-from-left 1s cubic-bezier(.82, .02, .12, 1) 0.6s 1;
        animation-fill-mode: both;
        position: absolute;
        top: 50%; // transform: translateY(-50%);
        width: 300px;
        height: 300px;
        border-radius: 10px;
        border: dashed 2px rgba(255, 255, 255, 0.6);
        margin-left: 25px;
        overflow: hidden;
        .info-page {
          transition: all 1s cubic-bezier(.82, .02, .12, 1);
          transform: translateX(0%);
          .first-row {
            margin-top: 55px;
          }
          .second-row {
            margin-top: 30px;
          }
          .next-arrow {
            padding: 10px;
            margin-top: 60px;
            width: 40px;
            height: auto;
            margin-left: 125px;
            cursor: pointer;
            border-radius: 50%;
            transition: all 0.5s ease;
            background-color: rgba(0, 0, 0, 0)
          }
          .next-arrow:hover {
            background-color: rgba(255, 255, 255, 0.1)
          }
        }
        .upload-page {
          transition: all 1s cubic-bezier(.82, .02, .12, 1);
          overflow: hidden;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          transform: translateX(0%);
          cursor: pointer;
          .goback-arrow {
            position: absolute;
            z-index: 1;
            top: 20px;
            left: 20px;
            height: 25px;
            width: 25px;
            cursor: pointer;
            transition: background-color 0.5s ease;
            background-color: rgba(0, 0, 0, 0);
            border-radius: 2px;
            pointer-events: all;
          }
          .goback-arrow:hover {
            background-color: rgba(255, 255, 255, 0.1)
          }
          .drag-status {
            pointer-events: none;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.5s ease;
            background-color: rgba(255, 255, 255, 0.2);
          }
          .drag-status.over {
            opacity: 1;
          }
          .progress {
            pointer-events: none;
            z-index: -1;
            position: absolute;
            width: 100%;
            height: 100%;
            bottom: -100%;
            transition: all 0.5s ease;
            background-image: linear-gradient(to bottom, rgba(16, 162, 224, 0.6), rgba(54, 228, 255, 0.6));
          }
          .progress.running {
            animation: wave 5s ease-in-out 0s infinite;
          }
          .upload-info {
            pointer-events: none;
            text-align: center;
            color: white;
            font-size: 14px;
            padding: 0px 20px;
            margin-top: 60px;
            .upload-icon {
              height: 40px;
              width: 40px;
            }
          }
          .hide-scrollbar {
            margin-top: 36px;
            height: 38px;
            width: 228px;
            margin-left: 36px;
            overflow: hidden;
            position: relative;
            .file-info {
              position: absolute;
              color: white;
              font-size: 12px;
              width: 248px;
              height: 38px;
              overflow-y: auto;
              overflow-x: hidden;
              .file-text {
                pointer-events: none;
                width: 210px;
                margin: 2px 0px;
                padding-right: 36px;
                position: relative;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .file-text.running::after {
                content: ' ';
                display: block;
                position: absolute;
                height: 16px;
                width: 16px;
                top: 0px;
                right: 20px;
                background-image: url(./assets/running.png);
                background-size: 100%;
                animation: rotate 2s linear 0s infinite;
              }
              .file-text.ok::after {
                content: ' ';
                display: block;
                position: absolute;
                height: 16px;
                width: 16px;
                top: 0px;
                right: 20px;
                background-image: url(./assets/ok.png);
                background-size: 100%;
              }
              .file-text.error::after {
                content: ' ';
                display: block;
                position: absolute;
                height: 16px;
                width: 16px;
                top: 0px;
                right: 20px;
                background-image: url(./assets/error.png);
                background-size: 100%;
              }
            }
          }
        }
        .upload-page.hide {
          transform: translateX(100%);
        }
        .info-page.hide {
          transform: translateX(-100%);
        }
      }
    }
  }
  .cover {
    position: fixed;
    z-index: -1;
    pointer-events: none;
    width: 100%;
    height: 100%;
    margin: 0;
    background-size: cover;
    background-position: center;
    .line {
      position: absolute;
      width: 2px;
      height: 400px;
      left: 54%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
    }
    .shadow {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
  .blur-background {
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    position: absolute;
    width: 250px;
    height: 60px;
    top: 20px;
    right: 0px;
    border-radius: 2px 0 0 2px;
    opacity: 0.6;
    transform: translateX(100%);
    transition: transform 1s cubic-bezier(.82, .02, .12, 1);
  }
  .blur-background.show,
  .toast.show {
    transform: translateX(0%);
  }
  .toast {
    position: absolute;
    width: 250px;
    height: 60px;
    top: 20px;
    right: 0px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 2px 0 0 2px;
    line-height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 1s cubic-bezier(.82, .02, .12, 1);
    .priority-icon {
      display: inline-block;
      height: 40px;
      width: 40px;
      margin: 0 5px 0 10px;
      background-image: url(./assets/priority.png);
      background-size: cover;
      vertical-align: middle;
    }
    .tip-text {
      vertical-align: middle;
    }
  }
}

.select {
  outline: none;
  width: 80%;
  height: 30px;
  margin-left: 10%;
  background-color: transparent;
  border: none;
  border-bottom: solid 2px rgba(255, 255, 255, 0.8); // border-radius: 2px;
  color: white;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 16px;
  text-align-last: center;
}

.select option {
  color: black;
}

.select:active {
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.input {
  outline: none;
  width: 80%;
  height: 30px;
  margin-left: 10%; // padding: 0px 2px;
  // box-sizing: border-box;
  background-color: transparent;
  border: none;
  border-bottom: solid 2px rgba(255, 255, 255, 0.8);
  color: rgba(0, 0, 0, 0.8);
  transition: all 0.5s ease;
  color: white;
  font-size: 16px;
  text-align: center;
}

.input:focus {
  border-bottom: solid 2px rgba(255, 255, 255, 1);
}

input::-webkit-input-placeholder {
  color: #ddd;
}

input:-moz-placeholder {
  color: #ddd;
}

input::-moz-placeholder {
  color: #ddd;
}

input:-ms-input-placeholder {
  color: #ddd;
}


@keyframes move-in-from-left {
  from {
    opacity: 0;
    transform: translateX(-100%) translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(0%) translateY(-50%);
  }
}

@keyframes move-in-from-right {
  from {
    opacity: 0;
    transform: translateX(100%) translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(0%) translateY(-50%);
  }
}

@keyframes wave {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(5deg) scale(1.2);
  }
  75% {
    transform: rotate(-5deg) scale(1.2);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.filelist-enter-active,
.filelist-leave-active {
  transition: all 0.5s ease;
}

.filelist-enter,
.filelist-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
