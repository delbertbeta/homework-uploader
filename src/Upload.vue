<template>
  <div class="upload-container"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @drop="drop">
    <div class="homework-title">{{homework.name}}</div>
    <div class="homework-subtitle">{{multifile}}</div>
    <div class="homework-tip">{{homework.tip}}</div>
    <div class="upload-button" @click="openFilePicker">点击或拖拽文件开始上传</div>
    <input id="filePicker" type="file" style="display: none;" @change="pickedFile" :multiple="homework.multifile" />
    <div class="upload-list">
      <div class="upload-item" 
        v-for="(upload, index) in uploadList" 
        :key="index">
        <div class="item-name">{{upload.name}}</div>
        <custom-progress :error="upload.error" :progress="upload.progress"></custom-progress>
      </div>
    </div>
    <div class="upload-function">
      <span class="button secondary-button" @click="goBack">返回</span>
      <span class="button primary-button" :class="{disable: !canNext}" @click="goToFinished">完成</span>
    </div>
  </div>
</template>

<script>
import progress from "./Progress";
import api from "./api";
import axios from "axios";

export default {
  name: "upload",
  props: ["homework", "id"],
  components: {
    "custom-progress": progress
  },
  data() {
    return {
      canNext: false,
      uploadList: [],
      uploadingLock: false
    };
  },
  computed: {
    multifile() {
      if (this.homework.multifile) {
        return "您上传的多个文件都将被保存";
      } else {
        return "您仅可以上传一份文件，新文件将覆盖旧文件";
      }
    }
  },
  methods: {
    goBack() {
      this.$emit("goBack");
    },
    goToFinished() {
      if (this.canNext) {
        this.$emit("goToFinished");
      }
    },
    dragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      this.$emit("onHover");
    },
    dragLeave(e) {
      e.preventDefault();
      this.$emit("onHoverOut");
    },
    drop(e) {
      e.preventDefault();
      this.$emit("onHoverOut");
      this.filesHandle(e.dataTransfer.files);
    },
    openFilePicker() {
      document.getElementById("filePicker").click();
    },
    pickedFile() {
      this.filesHandle(document.getElementById("filePicker").files);
    },
    filesHandle(files) {
      console.log(files);
      let curFiles = files;
      if (curFiles.length === 0) {
        return;
      }
      if (this.homework.multifile) {
        Array.prototype.forEach.call(curFiles, element => {
          this.uploadList.push({
            name: element.name,
            progress: 0,
            handled: false,
            error: false,
            file: element
          });
        });
      } else {
        this.uploadList.push({
          name: curFiles[0].name,
          progress: 0,
          handled: false,
          error: false,
          file: curFiles[0]
        });
      }
      this.uploadHandle();
    },
    uploadHandle() {
      if (this.uploadingLock) {
        return;
      }
      let upload = () => {
        this.uploadingLock = true;
        let index = -1;
        for (let i = 0; i < this.uploadList.length; i++) {
          if (
            this.uploadList[i].handled === false &&
            this.uploadList[i].error === false
          ) {
            index = i;
          }
        }
        if (index === -1) {
          this.canNext = true;
          this.uploadingLock = false;
          document.getElementById("filePicker").value = "";
          return;
        }
        let formData = new FormData();
        formData.append(
          "info",
          JSON.stringify({
            studentNumber: this.id,
            homework: this.homework.id
          })
        );
        formData.append("file", this.uploadList[index].file);
        console.log(this.uploadList);
        let that = this;
        let config = {
          url: api.UploadFile,
          method: "post",
          data: formData,
          headers: {
            "content-type": "multipart/form-data"
          },
          onUploadProgress(e) {
            that.$set(
              that.uploadList[index],
              "progress",
              Math.floor(e.loaded / e.total * 100)
            );
          }
        };
        axios(config)
          .then(() => {
            this.$set(this.uploadList[index], "progress", 100);
            this.$set(this.uploadList[index], "handled", true);
            upload();
          })
          .catch(() => {
            this.$set(this.uploadList[index], "error", true);
            upload();
          });
      };
      upload();
    },
    clearList() {
      this.canNext = false;
      this.uploadList = [];
    }
  }
};
</script>

<style lang="scss">
.upload-container {
  position: absolute;
  padding: 52px 0 0 0;
  background-color: white;
  box-sizing: border-box;
  height: 650px;
  width: 500px;

  .homework-title {
    font-size: 28px;
    font-weight: 700;
    margin: 16px 24px 12px 24px;
    pointer-events: none;
  }
  .homework-subtitle {
    font-size: 18px;
    margin: 12px 24px;
    pointer-events: none;
  }

  .homework-tip {
    margin: 12px 12px;
    height: 80px;
    padding: 8px 12px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f3f3f3;
    border-radius: 4px;
    // pointer-events: none;
  }

  .upload-button {
    text-align: center;
    margin: 12px 24px;
    padding: 12px;
    border-radius: 4px;
    background-color: #4787ff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.5s ease;
  }

  .upload-button:hover {
    cursor: pointer;
    background-color: #7ba9ff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .upload-list {
    margin: 20px 0;
    height: 240px;
    overflow-x: hidden;
    overflow-y: auto;

    .upload-item {
      position: relative;
      font-size: 18px;
      color: #555555;
      padding: 12px 28px;
      border-bottom: dashed 1px #eeeeee;

      .item-name {
        padding-right: 46px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: content-box;
      }
    }
  }

  .upload-function {
    margin: 16px 100px 0 100px;
    display: flex;
    justify-content: space-between;

    .button {
      font-size: 18px;
      padding: 8px 16px;
    }

    .button.disable,
    .button.disable:hover {
      background-color: #aaaaaa;
      cursor: not-allowed;
    }
  }
}

.hover .upload-button,
.hover .upload-button,
.hover .upload-function,
.hover .button {
  pointer-events: none;
}
</style>

