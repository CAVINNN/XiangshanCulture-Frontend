<template>
  <div class="knowledgeSearch">

    <el-autocomplete clearable :trigger-on-focus="true" :fetch-suggestions="querySearch" placeholder="请输入内容" v-model="keyword" class="classSelector">
      <el-select v-model="classVal" slot="prepend" placeholder="请选择">
        <el-option
          v-for="theClass in classes"
          :key="theClass.label"
          :label="theClass.label"
          :value="theClass.value">
        </el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="knowledgeSearch">知识检索</el-button>
    </el-autocomplete>

  </div>
</template>

<script>
    export default {
      name: "KnowledgeSearch",
      data() {
        return {
          appPath: "http://localhost:8080/culture",
          classes: [],
          classVal: '所有类',
          keyword: '',
          knowledgeSearchResult: {
            keyword: '',
            resultType: 'knowledge',
            nodes: [],
            links: []
          }
        }
      },
      mounted() {
        this.$Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.8)' });
        this.$ajax.get(this.appPath + '/getRootClasses')
          .then(res => {
            let object = {};
            object.label = '所有类';
            object.value = '所有类';
            this.classes.push(object);
            res.data.data.rootClasses.forEach((val, index, arr) => {
              let obj = {};
              obj.label = val.name;
              obj.value = val.name;
              this.classes.push(obj);
            });
            this.$Loading.service().close();
          })
          .catch(error => {
            console.log(error);
            this.$alert('获取类失败！', '错误', {
              confirmButtonText: '确定',
            });
            this.$Loading.service().close();
          });
        this.$ajax.get(this.appPath + '/getHistoriesByType?type=knowledge')
          .then(res => {
            let tableData = [];

            res.data.data.histories.forEach((val, index, arr) => {
              let obj = {};
              // 处理record
              let subject = val.historySubject;
              let scope = val.historyScope;
              obj.record = subject + "（" + scope + "）";
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
            this.$Loading.service().close();
            this.$emit("listenHistories", tableData);
          })
          .catch(error => {
            console.log(error);
            this.$alert('获取历史记录失败！', '错误', {
              confirmButtonText: '确定',
            });
            this.$Loading.service().close();
          });
      },
      methods: {
        knowledgeSearch() {
          this.doSearch(this.keyword, this.classVal)
        },
        doSearch(keyword, classVal){
          this.$Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.8)' });
          this.$ajax.get(this.appPath + '/queryForKnowledge?individualName=' + keyword + '&scope=' + classVal)
            .then(res => {
              if (res.data.data.nodes === null) {
                this.$alert('请输入正确的关键词', '无此关键词数据', {
                  confirmButtonText: '确定',
                });
                this.$Loading.service().close();
              } else {
                // 处理历史记录
                let now = new Date();
                this.$ajax.post(this.appPath + '/addHistory', {
                  historySubject: keyword,
                  historyScope: classVal,
                  historyType: 'knowledge',
                  createDate: now
                })
                  .then(res => {
                    this.$ajax.get(this.appPath + '/getHistoriesByType?type=knowledge')
                      .then(res => {
                        let tableData = [];

                        res.data.data.histories.forEach((val, index, arr) => {
                          let obj = {};
                          // 处理record
                          let subject = val.historySubject;
                          let scope = val.historyScope;
                          obj.record = subject + "（" + scope + "）";
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
                        this.$Loading.service().close();
                      });
                  })
                  .catch(error => {
                    this.$alert('添加历史记录失败！', '错误', {
                      confirmButtonText: '确定',
                    });
                    console.log(error);
                    this.$Loading.service().close();
                  });

                // 处理检索响应数据
                this.knowledgeSearchResult = {
                  keyword: '',
                  resultType: 'knowledge',
                  nodes: [],
                  links: []
                };

                this.knowledgeSearchResult.keyword = keyword;
                if (classVal !== '所有类') {
                  let originalNodes = res.data.data.nodes;
                  let catedNodes = [];
                  originalNodes.forEach((val, index, arr) => {
                    if (val.category === classVal || val.name === keyword) {
                      catedNodes.push(val)
                    }
                  });
                  this.knowledgeSearchResult.nodes = catedNodes;
                  this.knowledgeSearchResult.links = res.data.data.queryResults;
                } else {
                  this.knowledgeSearchResult.nodes = res.data.data.nodes;
                  this.knowledgeSearchResult.links = res.data.data.queryResults;
                }
                this.$emit('listenResultData', this.knowledgeSearchResult);
              }
            })
            .catch(error => {
              this.$alert('知识检索失败！', '错误', {
                confirmButtonText: '确定',
              });
              console.log(error);
            });
        },
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
        }
      }
    }
</script>

<style scoped>

  .knowledgeSearch {
    margin: 0 auto;
    width: 600px;
  }

</style>

<style>

  /*前面选择框*/
  .knowledgeSearch .el-select .el-input {
    width: 140px;
  }

  .knowledgeSearch .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  /*.knowledgeSearch .classSelector .el-input {*/
    /*font-family: myFont, sans-serif;*/
    /*font-size: 15px;*/
    /*font-weight: bold;*/
  /*}*/

  .knowledgeSearch .classSelector .el-input .el-input-group__prepend .el-select .el-input.el-input--suffix .el-input__inner {
    width: 140px;
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .knowledgeSearch .classSelector .el-input .el-input__inner {
    width: 338px;
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .knowledgeSearch .classSelector .el-input .el-input-group__append .el-button {
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .knowledgeSearch .el-input-group__append button {
    border-radius: 0;
  }

  .knowledgeSearch .el-input-group__append button:hover {
    background-color: rgba(144,147,153, 0.25);
    transition: .4s;
  }

  .knowledgeSearch .classSelector .el-input-group__prepend .el-select .el-input.el-input--suffix .el-input__inner:focus {
    box-shadow: none;
    border-color: transparent;
    background-color: transparent;
    border-top: 0;
    border-bottom: 0;
  }

  .knowledgeSearch .classSelector .el-input__inner:focus {
    border: 1px solid #dcdfe6;
    transition: .6s;
  }

  .el-autocomplete-suggestion li {
    font-weight: bold;
    font-size: 15px;
  }

</style>
