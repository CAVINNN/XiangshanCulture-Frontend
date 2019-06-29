<template>
  <div id="app">
    <Header v-on:listenHeader="changeKey"></Header>
    <router-view :key="componentKey"></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/header/Header'
  import Footer from './components/footer/Footer'
  import {mapActions} from 'vuex'

  export default {
    name: 'App',
    components: {
      Header,
      Footer
    },
    data() {
      return {
        appPath: "http://localhost:8080",
        componentKey: 0
      }
    },
    mounted() {
      this.$ajax.get(this.appPath + '/admin/isLogin')
        .then(res => {
          if (res.data.code === 401) {
            this.logout({});
          } else {
            this.login({});
          }
        })
        .catch(error => {
          this.$alert('无法获取登录状态！', '错误', {
            confirmButtonText: '确定',
          });
          console.log(error);
        });
    },
    methods: {
      ...mapActions(['login', 'logout']),
      changeKey() {
        this.componentKey++
      }
    }
  }
</script>

<style>

  /*@media (min-width: 1367px) and (max-width: 1601px) {*/
    /*html, body {*/
      /*margin: 0px;*/
      /*background: url("../static/images/background1.jpg") no-repeat;*/
      /*background-size: 1600px 900px;*/
      /*font-family: myFont, sans-serif;*/
    /*}*/
  /*}*/

  /*@media (min-width: 1601px) and (max-width: 1921px) {*/
    /*html, body {*/
      /*margin: 0px;*/
      /*background: url("../static/images/background1.jpg") no-repeat;*/
      /*background-size: 1920px 1080px;*/
      /*font-family: myFont, sans-serif;*/
    /*}*/
  /*}*/

  html, body {
    margin: 0;
    background: url("/static/images/background1.jpg") no-repeat;
    background-size: 1920px 1080px;
    font-family: myFont, sans-serif;
  }

  .el-message {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  @font-face
  {
    font-family: myFont;
    src:
      url('/static/font/YaHeiLight.ttf'),
      url('/static/font/YaHeiLight.svg'),
      url('/static/font/YaHeiLight.eot'),
      url('/static/font/YaHeiLight.woff');
  }

</style>
