<template>
    <div class="info">

      <!-- 弹出对话框 -->
      <el-dialog
        :title="contextTitle"
        custom-class="infoDialog"
        :visible.sync="dialogVisible"
        @close="closeDialog"
        width="30%">
        <div>

          <div class="dialogIntro">{{ personalInfo.comment }}</div>
          <div class="dialogImg"><img :src="personalImg.selfUrl" @error="personalWithoutImg" /></div>

          <div v-if="personalInfo.infos.length !== 0" class="detailIntro">
            <div class="dialogTag">
              <p>详细信息</p>
              <div class="dialogTag-right"></div>
            </div>
            <div v-for="info in personalInfo.infos" class="detailIntro-holder">
              <span class="intro-key">{{ info.title }}</span>
              <span class="intro-value">{{ info.value }}</span>
            </div>
          </div>

          <div v-if="relatedInfo.people.length !== 0" class="dialogRelation">
            <div class="dialogTag">
              <p>相关人物</p>
              <div class="dialogTag-right"></div>
            </div>
            <div class="rlatImgs">
              <div v-for="person in relatedInfo.people" class="rlatImgs-holder">
                <img :src="person.imgsrc" @error="relatedWithoutImg" />
                <span class="rlatImgs-intro" @click="showDialog(person.name)">{{ person.relation }} {{ person.name }}</span>
              </div>
            </div>
          </div>

          <div v-if="relatedInfo.events.length !== 0" class="dialogEvents">
            <div class="dialogTag">
              <p>相关事件</p>
              <div class="dialogTag-right"></div>
            </div>
            <div class="rlatEvents">
              <div v-for="event in relatedInfo.events" @click="showDialog(event)" class="rlatEvent">
                <i class="el-icon-document"></i> {{ event }}
              </div>
            </div>
          </div>

          <div v-if="relatedInfo.relics.length !== 0" class="dialogEvents">
            <div class="dialogTag">
              <p>相关遗存</p>
              <div class="dialogTag-right"></div>
            </div>
            <div class="rlatEvents">
              <div v-for="relic in relatedInfo.relics" @click="showDialog(relic)" class="rlatEvent">
                <i class="el-icon-location-outline"></i> {{ relic }}
              </div>
            </div>
          </div>

        </div>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    name: "Info",
    props: {
      contextTitle: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      personalInfo: {
        type: Object
      },
      relatedInfo: {
        type: Object
      },
      personalImg: {
        type: Object
      }
    },
    methods: {
      personalWithoutImg() {
        this.personalImg.selfUrl = this.personalImg.classUrl;
      },
      relatedWithoutImg(event) {
        event.target.src = '/static/images/infos/香山人物.jpg';
      },
      closeDialog() {
        this.personalImg.selfUrl = '';
        this.personalImg.classUrl = '';
        this.$emit('listenInfo')
      }
    }
  }
</script>

<style scoped>

  .dialogIntro {
    display: inline-block;
    font-size: 16px;
    width: 77%;
    vertical-align: top;
    padding-top: 10px;
  }

  .dialogImg {
    display: inline-block;
    width: 22%;
  }

  .dialogImg img {
    display: inline-block;
    width: 110px;
    height: 132px;
    border-radius: 100%;
    border: 2px solid #333;
  }

  .dialogRelation {
    margin-top: 10px;
  }

  .dialogTag {
    color: white;
    text-align: center;
    background: #4682B4;
    width: 100px;
    height: 30px;
    border-radius: 3px 0 0 3px;
  }

  .dialogTag p {
    margin: 0;
    line-height: 30px;
  }

  .dialogTag-right {
    width: 13px;
    height: 30px;
    margin-left: 100px;
    margin-top: -30px;
    background: #4682B4;
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%, 0% 100%);
  }

  .rlatImgs {
    margin-top: 10px;
  }

  .rlatImgs-holder {
    display: inline-block;
    margin-bottom: 25px;
  }

  .rlatImgs img {
    width: 72px;
    height: 86px;
  }

  .rlatImgs-intro {
    position: absolute;
    text-align: center;
    width: 72px;
    font-size: 12px;
    z-index: 10;
    cursor: pointer;
    overflow: hidden;
  }

  .rlatImgs-intro:hover {
    color: #FFA500;
  }

  .dialogEvents {
    margin-top: 10px;
  }

  .rlatEvents {
    margin-top: 10px;
  }

  .rlatEvent {
    display: inline-block;
    border-radius: 2px;
    background: #909399;
    padding: 3px 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    color: white;
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
  }

  .rlatEvent:hover {
    background: rgba(0,0,0, 0.7);
  }

  .detailIntro {
    margin-top: 10px;
  }

  .detailIntro-holder {
    margin: 10px 0 0 10px;
    display: inline-block;
    width: 160px;
    overflow: hidden;
  }

  .intro-key {
    color: #F56C6C;
    padding: 0 10px 0 0;
  }

  .intro-value {
    padding: 0 0 0 10px;
  }

</style>

<style>

  .info .infoDialog {
    font-family: myFont, sans-serif;
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .info .infoDialog .el-dialog__header {
    padding-top: 10px;
    /*background-color: #8B8682;*/
    background-color: #8B8989;
    border: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .info .infoDialog .el-dialog__header .el-dialog__title {
    color: #000000;
  }

  .info .infoDialog .el-dialog__header .el-dialog__headerbtn {
    top: 15px;
  }

  .info .infoDialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
    font-weight: bold;
    color: black;
  }

  .info .infoDialog .el-dialog__body {
    padding: 20px;
    background-color: #fafafa;
  }

</style>
