<template>
  <div class="attributeSearch">

    <el-autocomplete clearable :trigger-on-focus="true" :fetch-suggestions="querySearch" placeholder="请输入主语" v-model="keyword" class="attrSelector">
      <el-select v-model="attrVal" slot="prepend" placeholder="请选择">
        <el-option
          v-for="attribute in attributes"
          :key="attribute.label"
          :label="attribute.label"
          :value="attribute.value">
        </el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="attrSearch">属性检索</el-button>
    </el-autocomplete>

  </div>
</template>

<script>
    export default {
      name: "AttributeSearch",
      data() {
        return {
          appPath: "http://localhost:8080/culture",
          keyword: '',
          attrVal: '',
          attributes: []
        }
      },
      mounted() {
        this.$Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.8)' });
        this.$ajax.get(this.appPath + '/getObjectProperties')
          .then(res => {
            let a = [];
            res.data.data.properties.forEach((val, index, arr) => {
              if ( isNaN(a[val]) ){
                a[val] = 1;
                let obj = {};
                obj.label = val;
                obj.value = val;
                this.attributes.push(obj);
              }
            });
            this.$Loading.service().close();
          })
          .catch(error => {
            console.log(error);
            this.$alert('获取属性失败！', '错误', {
              confirmButtonText: '确定',
            });
            this.$Loading.service().close();
          });
        this.$ajax.get(this.appPath + '/getHistoriesByType?type=attribute')
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
        attrSearch() {
          if (this.attrVal === '') {
            this.$alert('请选择属性！', '提示', {
              confirmButtonText: '确定',
            });
          } else {
            this.doSearch(this.keyword, this.attrVal);
          }
        },
        doSearch(keyword, attrVal) {
          this.$Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.8)' });
          this.$ajax.get(this.appPath + '/queryForProperty?individualName=' + keyword + '&predicateName=' + attrVal)
            .then(res => {
              if (res.data.data.nodes === null) {
                this.$alert('请输入正确的主语', '无此主语数据', {
                  confirmButtonText: '确定',
                });
                this.$Loading.service().close();
              } else {
                // 处理历史记录
                let now = new Date();
                this.$ajax.post(this.appPath + '/addHistory', {
                  historySubject: keyword,
                  historyScope: attrVal,
                  historyType: 'attribute',
                  createDate: now
                })
                  .then(res => {
                    this.$ajax.get(this.appPath + '/getHistoriesByType?type=attribute')
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

                // 处理检索数据
                this.attrSearchResult = {
                  keyword: '',
                  resultType: 'attribute',
                  nodes: [],
                  links: []
                };
                this.attrSearchResult.keyword = keyword;
                let objects = [];
                res.data.data.queryResults.forEach((val, index, arr) => {
                  objects.push(val.object);
                });
                let nodes = [];
                res.data.data.nodes.forEach((val, index, arr) => {
                  if (objects.indexOf(val.name) !== -1 || val.name === keyword) {
                    nodes.push(val);
                  }
                });
                this.attrSearchResult.nodes = nodes;
                this.attrSearchResult.links = res.data.data.queryResults;
                this.$emit('listenResultData', this.attrSearchResult);
              }
            })
            .catch(error => {
              this.$alert('获取检索数据失败！', '错误', {
                confirmButtonText: '确定',
              });
              console.log(error);
              this.$Loading.service().close();
            });
        }
      }
    }
</script>

<style scoped>

  .attributeSearch {
    margin: 0 auto;
    width: 600px;
  }

</style>

<style>

  .attributeSearch .el-select .el-input {
    width: 140px;
  }

  .attributeSearch .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .attributeSearch .attrSelector .el-input .el-input-group__prepend .el-select .el-input.el-input--suffix .el-input__inner {
    width: 140px;
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .attributeSearch .attrSelector .el-input .el-input__inner {
    width: 338px;
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .attributeSearch .attrSelector .el-input .el-input-group__append .el-button {
    font-family: myFont, sans-serif;
    font-size: 15px;
    font-weight: bold;
  }

  .attributeSearch .el-input-group__append button {
    border-radius: 0;
  }

  .attributeSearch .el-input-group__append button:hover {
    background-color: rgba(144,147,153, 0.25);
    transition: .4s;
  }

  .attributeSearch .attrSelector .el-input-group__prepend .el-select .el-input.el-input--suffix .el-input__inner:focus {
    box-shadow: none;
    border-color: transparent;
    background-color: transparent;
    border-top: 0;
    border-bottom: 0;
  }

  .attributeSearch .attrSelector .el-input__inner:focus {
    border: 1px solid #dcdfe6;
    transition: .6s;
  }

  .el-scrollbar__view.el-select-dropdown__list .el-select-dropdown__item span {
    font-weight: bold;
  }

  .attributeSearch .el-autocomplete-suggestion li {
    font-weight: bold;
    font-size: 15px;
  }

</style>
