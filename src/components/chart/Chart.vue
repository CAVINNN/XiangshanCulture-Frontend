<template>
  <div class="chart">

    <div class="graphChart" :id="chartId" :style="{height: height, weight: weight}" oncontextmenu="return false"></div>

    <!-- 右键菜单 -->
    <v-contextmenu ref="menu" theme="dark">
    <div :style="{ backgroundColor: contextTitleBkrColor }" class="contextTitle">{{ contextTitle }}</div>
    <v-contextmenu-item @click="showDialog(contextTitle)">详细信息</v-contextmenu-item>
    </v-contextmenu>

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
    name: "Chart",
    props: {
      chartId: {
        type: String,
        default: 'myChart'
      },
      chartName: {
        type: String
      },
      chartData: {
        type: Object
      },
      weight: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        appPath: "http://localhost:8080/culture",
        chart: null,
        contextTitle: '',
        contextTitleBkrColor: '',
        dialogVisible: false,
        personalInfo: {
          comment: '',
          infos: []
        },
        relatedInfo: {
          people: [],
          events: [],
          relics: []
        },
        personalImg: {
          url: '../../../static/images/infos/',
          selfUrl: '',
          classUrl: ''
        }
      }
    },
    mounted() {
      this.chart = this.$echarts.init(document.getElementById(this.chartId));
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null;
    },
    watch: {
      chartData: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (this.chart) {
            if (newVal) {
              this.setOption(newVal)
            } else {
              this.setOption(oldVal)
            }
          }
        }
      }
    },
    methods: {
      setOption() {
        this.chart.showLoading();
        // this.chartData.nodes.splice(0, this.chartData.nodes.length);
        // this.chartData.links.splice(0, this.chartData.links.length);
        // this.chartData.categories.splice(0, this.chartData.categories.length);

        this.chart.setOption({
          title: {
            text: this.chartName,
            top: 'bottom',
            left: 'right',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            formatter: function (params) {
              if (params.data.category !== undefined) {
                return '<div style="display: inline-block;height:9px;width:9px;border:1px solid '+params.color+';border-radius: 50%;background-color:'+params.color+';"></div> ' + params.name;
              } else {
                return params.data.source + " <span style='color: #FFA500;'>" + params.data.value + "--></span> " + params.data.target;
              }
            }
          },
          legend: [{
            data: this.chartData.categories.map(function (node) {
              let obj = {};
              obj.name = node.name;
              obj.textStyle = {color: 'white', fontFamily: 'myFont, sans-serif', fontSize: 13,fontWeight: 'bold'};
              return obj;
            }),
            itemGap: 15
          }],
          animation: true,
          series : [
            {
              type: 'graph',
              layout: 'force',
              data: this.chartData.nodes,
              links: this.chartData.links,
              categories: this.chartData.categories,
              edgeSymbol: ['none', 'arrow'],
              edgeLabel: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 10
                  },
                  formatter: "{c}"
                }
              },
              focusNodeAdjacency: true,
              draggable: true,
              roam: true,
              force: {
                edgeLength: [0, 300],
                repulsion: 80,
                layoutAnimation : true,
                gravity: 0.001,
              }
            }
          ]
        }, {
          notMerge: true,
          lazyUpdate: false,
          silent: false
        });
        this.chart.off('contextmenu');
        this.chart.on('contextmenu', (params) => {
          if (params.dataType === "node") {
            this.contextTitle = params.data.name;
            this.contextTitleBkrColor = params.color;
            this.$refs.menu.show({top: params.event.event.clientY, left: params.event.event.clientX});
          }
        });
        this.chart.hideLoading();
      },
      showDialog(individualName) {

        this.contextTitle = individualName;

        let p1 = new Promise((resolve, reject) => {
          this.$ajax.get(this.appPath + '/getIndividualInfo?individualName=' + individualName)
            .then(res => {
              resolve(res);
            })
            .catch(error => {
              reject(error);
            });
        });

        let p2 = () => {
          return new Promise((resolve, reject) => {
            this.$ajax.get(this.appPath + '/getIndividualRlatOfType?individualName=' + individualName)
              .then(res => {
                resolve(res);
              })
              .catch(error => {
                reject(error);
              });
          });
        };

        let p3 = () => {
          return new Promise((resolve, reject) => {
            this.dialogVisible = true;
          });
        };

        p1.then((res) => {
            let personalInfo = res.data.data.info;
            this.personalInfo.comment = '暂无数据';
            this.personalInfo.infos = [];
            Object.keys(personalInfo).forEach((val, index, arr) => {
              if (val === 'comment') {
                this.personalInfo.comment = personalInfo[val];
              } else {
                let obj = {};
                obj.title = val;
                obj.value = personalInfo[val];
                this.personalInfo.infos.push(obj);
              }
            });
            return p2();
          })
          .catch((err) => {
            console.log(err);
            this.$alert('获取详细信息失败！', '错误', {
              confirmButtonText: '确定',
            });
          })
          .then((res) => {
            let relations = res.data.data.rlat;
            this.relatedInfo.people = [];
            this.relatedInfo.events = [];
            this.relatedInfo.relics = [];
            relations.rlatIndiv.forEach((val, index, arr) => {
              let obj = {};
              obj.name = val.name;
              obj.relation = val.relation.slice(0, 2);
              obj.imgsrc = this.personalImg.url + val.name + '.jpg';
              this.relatedInfo.people.push(obj);
            });
            relations.rlatEvent.forEach((val, index, arr) => {
              this.relatedInfo.events.push(val);
            });
            relations.rlatRelic.forEach((val, index, arr) => {
              this.relatedInfo.relics.push(val);
            });
            this.personalImg.selfUrl = this.personalImg.url + individualName + '.jpg';
            this.personalImg.classUrl = this.personalImg.url + relations.class + '.jpg';
            return p3();
          })
          .catch((err) => {
            console.log(err);
            this.$alert('获取相关信息失败！', '错误', {
              confirmButtonText: '确定',
            });
          })

      },
      personalWithoutImg() {
        this.personalImg.selfUrl = this.personalImg.classUrl;
      },
      relatedWithoutImg(event) {
        event.target.src = '../../../static/images/infos/香山人物.jpg';
      },
      closeDialog() {
        this.personalImg.selfUrl = '';
        this.personalImg.classUrl = '';
      }
    }
  }
</script>

<style scoped>

  .graphChart {
    margin: 0 auto;
    vertical-align: middle;
  }

  .contextTitle {
    text-align: center;
    color: #fff;
    padding: 5px 0;
    border: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .v-contextmenu {
    padding: 0px;
    border: 0px;
    font-family: myFont, sans-serif;
    font-weight: bold;
  }

  .v-contextmenu-item {
    text-align: center;
    font-family: myFont, sans-serif;
    font-weight: bold;
  }

  .v-contextmenu-item:nth-last-of-type(1) {
    border: 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

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
    margin-bottom: 5px;
    width: 72px;
  }

  .rlatImgs img {
    width: 72px;
    height: 86px;
  }

  .rlatImgs-intro {
    /*position: absolute;*/
    display: inline-block;
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

  .chart .infoDialog {
    font-family: myFont, sans-serif;
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .chart .infoDialog .el-dialog__header {
    padding-top: 10px;
    /*background-color: #8B8682;*/
    background-color: #8B8989;
    border: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .chart .infoDialog .el-dialog__header .el-dialog__title {
    color: #000000;
  }

  .chart .infoDialog .el-dialog__header .el-dialog__headerbtn {
    top: 15px;
  }

  .chart .infoDialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
    font-weight: bold;
    color: black;
  }

  .chart .infoDialog .el-dialog__body {
    padding: 20px;
    background-color: #fafafa;
  }

</style>
