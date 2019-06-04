<template>
  <div class="relationSearch">
    <el-autocomplete clearable :trigger-on-focus="true" :fetch-suggestions="querySearch" placeholder="请输入主语" v-model="keyword1" class="classSelector"></el-autocomplete>
    <i class="el-icon-close"></i>
    <el-autocomplete clearable :trigger-on-focus="true" :fetch-suggestions="querySearch" placeholder="请输入宾语" v-model="keyword2" class="classSelector"></el-autocomplete>
    <el-button plain type="info" @click="relationSearch"><i class="el-icon-search"></i> 关系检索</el-button>
  </div>
</template>

<script>
    export default {
      name: "RelationSearch",
      data() {
        return {
          appPath: "http://localhost:8080/culture",
          keyword1: '',
          keyword2: '',
          relationSearchResult: {
            keyword: '',
            resultType: 'relation',
            nodes: [],
            links: []
          }
        }
      },
      mounted() {
        this.$ajax.get(this.appPath + '/getHistoriesByType?type=relation')
          .then(res => {
            let tableData = [];

            res.data.data.histories.forEach((val, index, arr) => {
              let obj = {};
              // 处理record
              let subject = val.historySubject;
              let object = val.historyObject;
              obj.record = subject + "（" + object + "）";
              // 处理time
              let date = new Date(val.createDate);
              let year = date.getFullYear();
              let month;
              if ((date.getMonth() + 1) < 10) {
                month = "0" + (date.getMonth() + 1);
              } else {
                month = date.getMonth() + 1;
              }
              let day;
              if ((date.getDate() + 1) < 10) {
                day = "0" + date.getDate();
              } else {
                day = date.getDate();
              }
              let hours = date.getHours();
              let minutes;
              if ((date.getMinutes() + 1) < 10) {
                minutes = "0" + date.getMinutes();
              } else {
                minutes = date.getMinutes();
              }
              let seconds;
              if ((date.getSeconds() + 1) < 10) {
                seconds = "0" + date.getSeconds();
              } else {
                seconds = date.getSeconds();
              }
              obj.time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
              // 处理id
              obj.historyId = val.historyId;
              tableData.push(obj);
            });

            this.$emit("listenHistories", tableData);
          })
          .catch(error => {
            console.log(error);
            this.$alert('获取历史记录失败！', '错误', {
              confirmButtonText: '确定',
            });
          });
      },
      methods: {
        querySearch(queryString, cb) {
          this.$ajax.get(this.appPath + '/getInputSuggestion?queryString=' + queryString)
            .then(res => {
              let results = [];
              let suggestions = res.data.data.suggestion;
              suggestions.forEach((val, index, arr) => {
                let obj = {};
                obj.value = val;
                results.push(obj);
              });
              cb(results);
            })
            .catch(error => {
              console.log(error);
              this.$alert('获取输入建议失败！', '错误', {
                confirmButtonText: '确定',
              });
            });
        },
        relationSearch() {
          this.doSearch(this.keyword1, this.keyword2)
        },
        doSearch(keyword1, keyword2){
          this.$ajax.get(this.appPath + '/queryForRelation?individualName1=' + keyword1 + '&individualName2=' + keyword2)
            .then(res => {
              if (res.data.data.queryResults === null) {
                this.$alert('请输入正确的关键词', '无此关键词数据', {
                  confirmButtonText: '确定',
                });
              } else {
                // 处理历史记录
                let now = new Date();
                this.$ajax.post(this.appPath + '/addHistory', {
                  historySubject: keyword1,
                  historyObject: keyword2,
                  historyType: 'relation',
                  createDate: now
                })
                  .then(res => {
                    this.$ajax.get(this.appPath + '/getHistoriesByType?type=relation')
                      .then(res => {
                        let tableData = [];

                        res.data.data.histories.forEach((val, index, arr) => {
                          let obj = {};
                          // 处理record
                          let subject = val.historySubject;
                          let object = val.historyObject;
                          obj.record = subject + "（" + object + "）";
                          // 处理time
                          let date = new Date(val.createDate);
                          let year = date.getFullYear();
                          let month;
                          if ((date.getMonth() + 1) < 10) {
                            month = "0" + (date.getMonth() + 1);
                          } else {
                            month = date.getMonth() + 1;
                          }
                          let day;
                          if ((date.getDate() + 1) < 10) {
                            day = "0" + date.getDate();
                          } else {
                            day = date.getDate();
                          }
                          let hours = date.getHours();
                          let minutes;
                          if ((date.getMinutes() + 1) < 10) {
                            minutes = "0" + date.getMinutes();
                          } else {
                            minutes = date.getMinutes();
                          }
                          let seconds;
                          if ((date.getSeconds() + 1) < 10) {
                            seconds = "0" + date.getSeconds();
                          } else {
                            seconds = date.getSeconds();
                          }
                          obj.time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                          // 处理id
                          obj.historyId = val.historyId;
                          tableData.push(obj);
                        });
                        this.$emit("listenHistories", tableData);
                      })
                      .catch(error => {
                        console.log(error);
                        this.$alert('更新历史记录失败！', '错误', {
                          confirmButtonText: '确定',
                        });
                      });
                  })
                  .catch(error => {
                    this.$alert('添加历史记录失败！', '错误', {
                      confirmButtonText: '确定',
                    });
                    console.log(error);
                  });

                // 处理检索数据
                this.relationSearchResult = {
                  keyword: '',
                  resultType: 'relation',
                  nodes: [],
                  links: []
                };
                this.relationSearchResult.keyword = keyword1;
                this.relationSearchResult.nodes = res.data.data.queryResults.nodes;
                this.relationSearchResult.links = res.data.data.queryResults.links;
                this.$emit('listenResultData', this.relationSearchResult);
              }
            })
            .catch(error => {
              this.$alert('获取检索数据失败！', '错误', {
                confirmButtonText: '确定',
              });
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>

  .relationSearch {
    margin: 0 auto;
    width: 560px;
  }

</style>

<style>

  .relationSearch .classSelector .el-input.el-input--suffix .el-input__inner {
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .relationSearch .classSelector .el-input.el-input--suffix {
    width: 200px;
  }

  .relationSearch button {
    font-family: myFont, sans-serif;
    margin-left: 5px;
    font-size: 15px;
    font-weight: bold;
  }

  .relationSearch .el-icon-close {
    color: white;
    font-weight: bold;
  }

</style>
