<template>
  <div class="upload-container"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @drop="drop">
    <div class="homework-title">{{homework.name}}</div>
    <div class="homework-subtitle">{{multifile}}</div>
    <div class="homework-tip">{{homework.tip}}</div>
    <div class="upload-button">点击或拖拽文件开始上传</div>
    <div class="upload-list">
      <div class="upload-item" 
        v-for="(upload, index) in uploadList" 
        :key="index">
        <span>{{upload.name}}</span>
        <custom-progress :progress="upload.progress"></custom-progress>
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

export default {
  name: "upload",
  props: ["homework"],
  components: {
    "custom-progress": progress
  },
  data() {
    return {
      canNext: false,
      uploadList: [
        {
          name: "1.txt",
          progress: 0,
          handled: true
        }
      ]
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
    pointer-events: none;
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
    overflow: hidden auto;

    .upload-item {
      position: relative;
      font-size: 18px;
      color: #555555;
      padding: 12px 28px;
      border-bottom: dashed 1px #eeeeee;
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

