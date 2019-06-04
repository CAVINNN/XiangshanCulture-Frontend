<template>
    <div class="search">
      <router-view ref="routerRef" v-on:listenResultData="getResultData" v-on:listenHistories="getHistories"></router-view>
      <div class="searchResult">
        <el-tabs v-model="activeTab" stretch>

          <el-tab-pane label="知识图谱" name="graph" :disabled="tabsDisabled">
            <div class="searchGraphWrapper">
              <Chart :chartId="'searchChart'" :chartName="searchChartName" :chartData="searchChartData" :height="'636px'" :weight="'1100px'"></Chart>
            </div>
          </el-tab-pane>

          <el-tab-pane label="相关结果" name="relatedSearch" :disabled="tabsDisabled">

            <div v-if="resultOption.knowledgeResult" class="knowledgeResult">
              <div v-for="rlatResult in rlatResults" class="rlatResult">
                <div class="rlatResultCont">
                  <div class="resultTitle">{{ rlatResult.object }} <span>（{{ rlatResult.predicate }}）</span></div>
                  <div class="resultContent">{{ rlatResult.objComment }}</div>
                </div>
                <div class="rlatResultButt">
                  <el-button type="warning" @click="showDialog(rlatResult.object)">详细信息</el-button>
                  <el-button type="warning" @click="getRlatGraph(rlatResult.object)">查看图谱</el-button>
                </div>
              </div>
              <div class="resultPagination">
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="6"
                  :total="total"
                  @current-change="changePage">
                </el-pagination>
              </div>
            </div>

            <div v-if="resultOption.relationResult" class="relationResult">
              <div v-for="rlatResult in rlatResults" class="rlatResult">
                <div class="rlatResultCont">
                  <div class="resultContent">
                    <span class="sub">{{ rlatResult.subject }}</span>
                    <span class="pre"><-- {{ rlatResult.predicate }} --></span>
                    <span class="obj">{{ rlatResult.object }}</span>
                  </div>
                </div>
                <div class="rlatResultButt">
                  <el-button type="warning" @click="showDialog(rlatResult.subject)">主语详细信息</el-button>
                  <el-button type="warning" @click="showDialog(rlatResult.object)">宾语详细信息</el-button>
                </div>
              </div>
              <div class="resultPagination">
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="6"
                  :total="total"
                  @current-change="changePage">
                </el-pagination>
              </div>
            </div>

            <div v-if="resultOption.attributeResult" class="attributeResult">
              <div v-for="rlatResult in rlatResults" class="rlatResult">
                <div class="rlatResultCont">
                  <div class="resultContent">
                    <span class="sub">{{ rlatResult.subject }}</span>
                    <span class="pre"><-- {{ rlatResult.predicate }} --></span>
                    <span class="obj">{{ rlatResult.object }}</span>
                  </div>
                </div>
                <div class="rlatResultButt">
                  <el-button type="warning" @click="showDialog(rlatResult.object)">宾语详细信息</el-button>
                </div>
              </div>
              <div class="resultPagination">
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="6"
                  :total="total"
                  @current-change="changePage">
                </el-pagination>
              </div>
            </div>

          </el-tab-pane>

          <el-tab-pane label="回溯检索" name="history">
            <el-table
              :data="tableData"
              @cell-click="tableClick"
              style="width: 100%">
              <el-table-column
                align="center"
                prop="time"
                label="时间"
                width="300">
              </el-table-column>
              <el-table-column
                align="center"
                class-name="recordColumn"
                prop="record"
                label="记录"
                width="500">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

        </el-tabs>
      </div>

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
    import Chart from './chart/Chart'

    export default {
      name: "Search",
      components: {
        Chart
      },
      data() {
        return {
          appPath: "http://localhost:8080/culture",
          tabsDisabled: false,
          activeTab: 'graph',
          resultOption: {
            knowledgeResult: false,
            relationResult: false,
            attributeResult: false
          },
          searchChartName: '',
          searchChartData: {
            nodes: [],
            links: [],
            categories: []
          },
          totalResults: [],
          rlatResults: [],
          total: '',
          tableData: [],

          contextTitle: '',
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
        this.activeTab = 'history';
        this.tabsDisabled = true;
      },
      methods: {
        tableClick(row, column, cell, event) {
          if (column.property === 'record') {
            // 孙中山（所有类）
            let record = row.record;
            let key1 = record.slice(0, record.indexOf("（"));
            let key2 = record.slice(record.indexOf("（") + 1, record.indexOf("）"));
            this.$refs.routerRef.doSearch(key1, key2);
          }
        },
        handleDelete(row) {
          this.$confirm('你确定要删除此条记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(row.historyId);
            this.$ajax.delete(this.appPath + '/deleteHistoryById/' + row.historyId)
              .then(res => {
                let tblData = this.tableData;
                tblData.forEach((val, index, arr) => {
                  if (val.historyId === row.historyId) {
                    this.tableData.splice(index, 1);
                  }
                });
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              })
              .catch(error => {
                this.$alert('删除历史记录失败！', '错误', {
                  confirmButtonText: '确定',
                });
                console.log(error);
              });
          }).catch(() => {

          });
        },
        getResultData(data) {
          if (data.resultType === 'knowledge') {
            this.resultOption.knowledgeResult = true;
            this.resultOption.relationResult = false;
            this.resultOption.attributeResult = false;
          } else if (data.resultType === 'relation') {
            this.resultOption.knowledgeResult = false;
            this.resultOption.relationResult = true;
            this.resultOption.attributeResult = false;
          } else if (data.resultType === 'attribute') {
            this.resultOption.knowledgeResult = false;
            this.resultOption.relationResult = false;
            this.resultOption.attributeResult = true;
          }

          this.drawGraph(data);
          this.fillRlatResult(data.links);

          this.total = data.links.length;

          this.activeTab = 'graph';
          this.tabsDisabled = false;
        },
        getHistories(historiesData) {
          this.tableData = historiesData;
        },
        drawGraph(graphData) {
          this.searchChartName = graphData.keyword;

          this.searchChartData.nodes.splice(0, this.searchChartData.nodes.length);
          this.searchChartData.links.splice(0, this.searchChartData.links.length);
          this.searchChartData.categories.splice(0, this.searchChartData.categories.length);

          // 节点预处理
          graphData.nodes.forEach(node => {
            node.itemStyle = null;
            node.symbolSize = 45;
            node.symbol = "circle";
            node.label = {
              show: true,
              color: 'white',
              fontFamily: 'myFont, sans-serif',
              fontSize: 13,
              fontWeight: 'bold',
              align: 'center',
              verticalAlign: 'middle',
              position: 'inside'
            };

            this.searchChartData.nodes.push(node);

            // 目录预处理
            let hasThisCate = false;
            this.searchChartData.categories.forEach(cate => {
              if (cate.name === node.category) {
                hasThisCate = true;
              }
            });
            if (!hasThisCate) {
              let obj = {};
              obj.name = node.category;
              obj.symbolSize = 30;
              this.searchChartData.categories.push(obj);
            }
          });

          // 链接预处理
          graphData.links.forEach(link => {
            link.source = link.subject;
            link.target = link.object;
            link.value = link.predicate;
            this.searchChartData.links.push(link);
          });
        },
        fillRlatResult(rlatData) {
          this.totalResults = rlatData;
          this.rlatResults = this.totalResults.slice(0, 6);
        },
        changePage(val) {
          this.rlatResults = this.totalResults.slice((6*val-6), (6*val));
        },
        // getRlatInfo(name) {
        //   // this.$refs.searchResultRef.showDialog(name);
        // },
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
        },
        getRlatGraph(name) {
          this.$refs.routerRef.doSearch(name, '所有类')
        },
      }
    }
</script>

<style scoped>

  .search {
    margin: 20px auto 0 auto;
    width: 1364px;
    height: 760px;
    border: 0 solid blue;
  }

  .searchResult {
    margin: 20px auto 0 auto;
    width: 1100px;
    height: 690px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.7);
    overflow: auto;
  }

  /*知识图谱*/
  .searchGraphWrapper {
    height: 636px;
    width: 1100px;
  }

  /*相关结果*/
  .rlatResult {
    height: 15%;
    padding: 11px 5% 10px 5%;
    overflow: hidden;
    /*padding-top: 5px;*/
  }

  .rlatResult:hover {
    background-color: rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  .rlatResultCont {
    float: left;
    width: 70%;
  }

  .knowledgeResult .resultTitle {
    color: #FFA500;
    font-weight: bold;
    font-size: 18px;
  }

  .knowledgeResult .resultTitle span {
    color: #409eff;
  }

  /*relationResult*/
  .relationResult .resultContent {
    font-weight: bold;
    font-size: 18px;
    line-height: 76px;
  }

  .relationResult span.sub {
    color: #FFA500;
  }

  .relationResult span.pre {
    color: #409eff;
  }

  .relationResult span.obj {
    color: #FFA500;
  }

  /*attrResult*/
  .attributeResult .resultContent {
    font-weight: bold;
    font-size: 18px;
    line-height: 76px;
  }

  .attributeResult span.sub {
    color: #FFA500;
  }

  .attributeResult span.pre {
    color: #409eff;
  }

  .attributeResult span.obj {
    color: #FFA500;
  }

  .resultContent {
    margin-top: 2px;
    color: white;
    font-weight: bold;
    font-size: 17px;
    line-height: 150%;

    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .rlatResultButt {
    float: right;
    line-height: 76px;
  }

  .resultPagination {
    margin-top: 20px;
    text-align: center;
  }

  /*对话框*/
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

  .searchResult .is-top {
    font-size: 18px;
    font-weight: bold;
  }

  .searchResult .el-tabs__active-bar.is-top {
    background-color: #FFA500;
  }

  .searchResult .el-tabs__item.is-top {
    padding: 0;
    color: white;
  }

  .searchResult .el-tabs__item.is-top:hover {
    color: #FFA500;
  }

  .searchResult .el-tabs__item.is-top.is-active {
    color: #FFA500;
  }

  .searchResult .is-disabled {
    cursor: not-allowed;
  }

  .searchResult .is-disabled:hover {
    color: #8B7D7B !important;
  }

  /*相关结果按钮*/
  .searchResult .rlatResultButt .el-button {
    font-family: myFont, sans-serif;
    /*color: #1C1C1C;*/
    color: black;
    font-weight: bold;
    font-size: 15px;
  }

  /*分页按钮*/
  .searchResult .el-pagination button {
    background: transparent;
    color: white;
    font-size: 15px;
  }

  .searchResult .el-pagination button:hover {
    color: #FFA500;
  }

  .searchResult .el-pagination .el-pager li:not(.active) {
    background: transparent;
    color: white;
    font-size: 15px;
  }

  .searchResult .el-pagination .el-pager li.active {
    background: transparent;
    color: #FFA500;
    font-size: 15px;
  }

  /*回溯检索表格*/

  .searchResult .el-table {
    background-color: transparent !important;
  }

  .searchResult .el-tabs .el-tabs__content .el-table th {
    background-color: transparent !important;
  }

  .searchResult .el-tabs .el-tabs__content .el-table tr {
    background-color: transparent !important;
  }

  .searchResult .el-table thead {
    color: #FFA500;
    font-size: 17px;
    font-weight: bold;
  }

  .searchResult .el-table {
    color: white;
    font-size: 16px;
    font-weight: bold;
  }

  .searchResult .el-table td {
    /*border-bottom: 2px solid #FFA500;*/
    border: 0;
  }

  .searchResult .el-table th.is-leaf {
    border-bottom: 2px solid #FFA500;
  }

  .searchResult .el-table::before {
    height: 0
  }

  .searchResult .el-table .el-table__body tr:hover>td{
    background-color: rgba(0, 0, 0, 0.3) !important;
  }

  .searchResult .recordColumn:hover {
    color: #FFA500;
    cursor: pointer;
  }

  .searchResult .el-button.el-button--danger {
    font-family: myFont, sans-serif;
    font-weight: bold;
    font-size: 15px;
  }

  /*对话框*/
  .search .infoDialog {
    font-family: myFont, sans-serif;
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .search .infoDialog .el-dialog__header {
    padding-top: 10px;
    /*background-color: #8B8682;*/
    background-color: #8B8989;
    border: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .search .infoDialog .el-dialog__header .el-dialog__title {
    color: #000000;
  }

  .search .infoDialog .el-dialog__header .el-dialog__headerbtn {
    top: 15px;
  }

  .search .infoDialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
    font-weight: bold;
    color: black;
  }

  .search .infoDialog .el-dialog__body {
    padding: 20px;
    background-color: #fafafa;
  }

</style>
