<template>
  <div id="app" class="app">
    <button @click="change"></button>
    <div class="container">
      <div class="header">
        <img class="logo" src="./assets/logo.svg" />
        <span>Homework Uploder</span>
        <span class="version">beta</span>
      </div>
      <homework-list :class=""></homework-list>
      <verify :class=""></verify>
    </div>
  </div>
</template>

<script>
import api from "./api";
import moment from "moment";
import HomeworkList from './HomeworkList'
import verify from './Verify'

export default {
  name: "app",
  components: {
    'homework-list': HomeworkList,
    'verify': verify
  },
  data() {
    return {
      stage: 0,
    };
  },
  computed: {
    
  },
  mounted: function() {
    // let that = this;
    // ajax.get(
    //   api.HomeworkList,
    //   null,
    //   false,
    //   function(data) {
    //     that.homeworkList = JSON.parse(data);
    //   },
    //   function() {},
    //   false
    // );
  },
  methods: {
    change() {
      if (this.stage === 0) {
        this.stage = 1;
      } else {
        this.stage = 0;
      }
    },
    goToNext: function() {
      if (this.homework === "" || this.studentNumber === "") {
        return;
      } else {
        let that = this;
        ajax.get(
          api.Verify,
          "id=" + this.studentNumber,
          false,
          function() {
            that.nowFirstPage = false;
          },
          function() {
            alert("你确定你是4班的么...");
          },
          false
        );
      }
      if (this.hasGoNexted === false) {
        (function() {
          let fileListDom = document.getElementById("fileList");
          let scrolled = false;
          fileListDom.addEventListener("scroll", function() {
            // console.log(fileListDom.scrollTop + "." + fileListDom.scrollHeight )
            if (
              fileListDom.scrollTop <
              fileListDom.scrollHeight - fileListDom.clientHeight
            ) {
              scrolled = true;
            } else {
              scrolled = false;
            }
          });
          setInterval(function() {
            if (scrolled === false)
              fileListDom.scrollTop = fileListDom.scrollTopMax;
          }, 100);
        })();
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
      event.dataTransfer.dropEffect = "copy";
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
      document.getElementById("filePicker").click();
    },
    pickedFile: function() {
      this.filesHandle(document.getElementById("filePicker").files);
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
            status: "running",
            file: file
          };
          this.totalSize += file.size;
          this.fileList.push(fileListItem);
        }
      } else {
        let file = files[0];
        // if (file.type === '') return;
        let fileList = [
          {
            filename: file.name,
            status: "running",
            file: file
          }
        ];
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
          if (that.fileList[i].status === "ok") {
            uploadedSize += that.fileList[i].file.size;
          } else if (that.fileList[i].status === "running") {
            break;
          }
        }
        uploadedSize += event.loaded;
        that.progress = uploadedSize / that.totalSize;
      };
      let upload = function(file, index) {
        let formData = new FormData();
        formData.append(
          "info",
          JSON.stringify({
            studentNumber: that.studentNumber,
            homework: that.homeworkList[parseInt(that.homework)].id
          })
        );
        formData.append("file", file);
        ajax.postFormData(
          api.UploadFile,
          formData,
          function() {
            that.$set(that.fileList[index], "status", "ok");
            setTimeout(listHandle.bind(that), 100);
          },
          function() {
            that.totalSize -= file.size;
            that.$set(that.fileList[index], "status", "error");
            setTimeout(listHandle.bind(that), 100);
            // listHandle();
          },
          progressHandle
        );
      };
      let listHandle = function() {
        that.progressRunning = true;
        let uploadedSize = 0;
        for (let i = 0; i < that.fileList.length; i++) {
          if (that.fileList[i].status === "ok") {
            uploadedSize += that.fileList[i].file.size;
          } else if (that.fileList[i].status === "error") {
            errorState = true;
          } else if (that.fileList[i].status === "running") {
            break;
          }
        }
        that.progress = uploadedSize / that.totalSize;
        let index = 0;
        // console.log(that.fileList.length + '.' + that.fileList[index].status);
        while (
          index < that.fileList.length &&
          (that.fileList[index].status === "ok" ||
            that.fileList[index].status === "error")
        ) {
          index++;
        }
        if (index !== that.fileList.length)
          upload(that.fileList[index].file, index);
        else {
          if (errorState === true) {
            that.toastTip = "处理队列时有错误发生";
          } else {
            that.toastTip = "队列上传成功";
          }
          this.showToast();
          that.progressRunning = false;
          return;
        }
      };
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
};
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

  .header {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    margin: 16px;
    line-height: 32px;
    vertical-align: middle;
    font-weight: 300;
    font-family: 'Open Sans', sans-serif;

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
      background-color: #4787FF;
      color: white;
      height: 16px;
      margin: 0;
      padding: 4px;
      margin-left: 4px;
    }
  }
}

.out {
  animation: out 0.5s ease both;
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
