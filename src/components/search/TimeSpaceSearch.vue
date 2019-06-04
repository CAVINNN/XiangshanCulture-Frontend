<template>
  <div class="timeSpaceSearch">

    <el-input placeholder="请输入内容" v-model="keyword" class="timeSpaceSelector">
      <el-select v-model="timeSpaceVal" slot="prepend" placeholder="请选择">
        <el-option label="时间" value="time"></el-option>
        <el-option label="空间" value="space"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search">时空检索</el-button>
    </el-input>

  </div>
</template>

<script>
    export default {
      name: "TimeSpaceSearch",
      data() {
        return {
          timeSpaceVal: 'time',
          keyword: ''
        }
      }
    }
</script>

<style scoped>

  .timeSpaceSearch {
    margin: 0 auto;
    width: 600px;
  }

</style>

<style>

  .timeSpaceSearch .el-select .el-input {
    width: 80px;
  }

  .timeSpaceSearch .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .timeSpaceSearch .timeSpaceSelector {
    font-size: 15px;
  }

  .timeSpaceSearch .el-input-group__append button {
    border-radius: 0;
  }

  .timeSpaceSearch .el-input-group__append button:hover {
    /*background-color: rgba(139, 137, 137, 0.15);*/
    background-color: rgba(144,147,153, 0.25);
    transition: .4s;
  }

  .timeSpaceSearch .timeSpaceSelector .el-input-group__prepend .el-select .el-input.el-input--suffix .el-input__inner:focus {
    box-shadow: none;
    border-color: transparent;
    background-color: transparent;
    border-top: 0;
    border-bottom: 0;
  }

  .timeSpaceSearch .timeSpaceSelector .el-input__inner:focus {
    border: 1px solid #dcdfe6;
    box-shadow: 0 0 6px #409EFF;
    transition: .6s;
  }

</style>
