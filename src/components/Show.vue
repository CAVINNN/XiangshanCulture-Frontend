<template>
    <div class="show">

      <div class="classTree">
        <p>知识分类</p>
        <div class="clzTreeContent">
          <el-tree :props="treeProps" lazy :load="loadClasses" @node-click="classClick"></el-tree>
        </div>
      </div>

      <div class="instanceTree">
        <p>知识实例</p>
        <div class="insTreeContent">
          <el-tree :data="instanceData" :props="treeProps" @node-click="instanceClick"></el-tree>
        </div>
      </div>

      <div class="showInsInfo">
        <p>知识图谱</p>
        <Chart :chartId="'showChart'" :chartName="chartName" :chartData="chartData" :height="'670px'" :weight="'720px'"></Chart>
      </div>

    </div>
</template>

<script>
    import Chart from './chart/Chart'

    export default {
      name: "Show",
      components: {
        Chart
      },
      data() {
        return {
          appPath: "http://localhost:8080",
          treeProps: {
            children: 'children',
            label: 'label',
            isLeaf: 'leaf'
          },
          instanceData: [],
          relatedPeople: [],
          relatedEvents: [],
          chartName: '',
          chartData: {
            nodes: [],
            links: [],
            categories: []
          }
        }
      },
      methods: {
        loadClasses(node, resolve) {
          if (node.level === 0) {
            return resolve([{ label: '香山文化', leaf: false }]);
          } else if (node.level === 1) {
            // 获取类根节点
            this.$ajax.get(this.appPath + '/getRootClasses')
              .then(res => {
                let rootClasses = [];
                res.data.data.rootClasses.forEach((val, index, arr) => {
                  let obj = {};
                  obj.label = val.name;
                  obj.leaf = !val.hasSubClasses;
                  rootClasses.push(obj);
                });
                resolve(rootClasses);
              })
              .catch(error => {
                console.log(error);
                this.$alert('获取类根节点失败！', '错误', {
                  confirmButtonText: '确定',
                });
              });
          } else if (node.level > 1) {
            // 获取子节点
            this.$ajax.get(this.appPath + '/getSubClasses?className=' + node.label)
              .then(res => {
                let subClasses = [];
                res.data.data.subClasses.forEach((val, index, arr) => {
                  let obj = {};
                  obj.label = val.name;
                  obj.leaf = !val.hasSubClasses;
                  subClasses.push(obj);
                });
                resolve(subClasses);
              })
              .catch(error => {
                console.log(error);
                this.$alert('获取子节点失败！', '错误', {
                  confirmButtonText: '确定',
                });
              });
          }
        },
        classClick(node) {
          if (node.label !== "香山文化") {
            this.instanceData.splice(0, this.instanceData.length);
            // 获取实例
            this.$ajax.get(this.appPath + '/getInstancesByClass?className=' + node.label)
              .then(res => {
                let instances = res.data.data.instances;
                instances.forEach((val, index, arr) => {
                  let obj = {};
                  obj.label = val;
                  this.instanceData.push(obj);
                });
              })
              .catch(error => {
                console.log(error);
                this.$alert('获取实例失败！', '错误', {
                  confirmButtonText: '确定',
                });
              });
          }
        },
        instanceClick(node) {
          this.chartName = node.label;
          this.drawGraph();
        },
        drawGraph() {
          this.$ajax.get(this.appPath + '/getRelationshipOfIns?individualName=' + this.chartName)
            .then(res => {
              this.chartData.nodes.splice(0, this.chartData.nodes.length);
              this.chartData.links.splice(0, this.chartData.links.length);
              this.chartData.categories.splice(0, this.chartData.categories.length);

              let graphData = res.data.data;

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

                this.chartData.nodes.push(node);

                // 目录预处理
                let hasThisCate = false;
                this.chartData.categories.forEach(cate => {
                  if (cate.name === node.category) {
                    hasThisCate = true;
                  }
                });
                if (!hasThisCate) {
                  let obj = {};
                  obj.name = node.category;
                  obj.symbolSize = 30;
                  this.chartData.categories.push(obj);
                }
              });

              // 链接预处理
              graphData.links.forEach(link => {
                link.source = link.subject;
                link.target = link.object;
                link.value = link.predicate;
                this.chartData.links.push(link);
              });

            })
            .catch(error => {
              console.log(error);
              window.alert("生成知识图谱失败！");
            });

        }
      },
    }
</script>

<style scoped>

  .show {
    margin: 0 auto;
    width: 1364px;
    height: 780px;
  }

  .classTree {
    float: left;
    position: relative;
    top: 50px;
    left: 15px;
    border-radius: 10px;
    width: 290px;
    height: 730px;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  .clzTreeContent {
    height: 689px;
    overflow: auto;
  }

  .instanceTree {
    float: left;
    position: relative;
    top: 50px;
    left: 30px;
    border-radius: 10px;
    width: 290px;
    height: 730px;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  .insTreeContent {
    height: 689px;
    overflow: auto;
  }

  .classTree p {
    font-size: 17px;
    margin: 10px 0;
    text-align: center;
    color: white;
    font-weight: bold;
  }

  .instanceTree p {
    font-size: 17px;
    margin: 10px 0;
    text-align: center;
    color: white;
    font-weight: bold;
  }

  .showInsInfo {
    float: left;
    position: relative;
    top: 50px;
    left: 45px;
    border-radius: 10px;
    width: 720px;
    height: 730px;
    background: rgba(0, 0, 0, 0.7);
  }

  .showInsInfo p {
    font-size: 17px;
    margin: 10px 0;
    text-align: center;
    color: white;
    font-weight: bold;
  }

</style>

<style>

  .classTree .el-tree {
    background: none;
    color: wheat;
  }

  .classTree .el-tree .el-tree-node__content:hover {
    background-color:	#8B4513;
  }

  .classTree .el-tree-node:focus>.el-tree-node__content {
    background-color:	#8B4513;
  }

  .classTree .el-tree-node__label {
    font-size: 15px;
  }

  .instanceTree .el-tree {
    background: none;
    color: wheat;
  }

  .instanceTree .el-tree .el-tree-node__content:hover {
    background-color:	#8B4513;
  }

  .instanceTree .el-tree-node:focus>.el-tree-node__content {
    background-color:	#8B4513;
  }

  .instanceTree .el-tree-node__label {
    font-size: 15px;
  }

</style>
