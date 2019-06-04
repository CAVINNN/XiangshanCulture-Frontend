<template>
  <div class="header">

    <div class="nav">

      <div class="navLogo">
        <img src="../../../static/images/logo.png" />
      </div>

      <div class="navItem">
        <ul v-if="isLogin">
          <li v-for="menuItem in menuItems"><router-link active-class="active" :to="menuItem.path" @click.native="navClick">{{ menuItem.name }}</router-link></li>
        </ul>
        <ul v-if="!isLogin">
          <li v-for="menuItem in indexItems"><router-link active-class="active" :to="menuItem.path" @click.native="navClick">{{ menuItem.name }}</router-link></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "Header",
    data () {
      return {
        menuItems: [
          {
            name: '首页',
            path: '/index'
          },
          {
            name: '图谱展示',
            path: '/show'
          },
          {
            name: '知识检索',
            path: '/search/knowledgeSearch'
          },
          {
            name: '关系检索',
            path: '/search/relationSearch'
          },
          {
            name: '属性检索',
            path: '/search/attributeSearch'
          }
          // {
          //   name: '时空检索',
          //   path: '/search/timeSpaceSearch'
          // }
        ],
        indexItems: [
          {
            name: '首页',
            path: '/index'
          }
        ]
      }
    },
    computed: {
      ...mapState(['isLogin'])
    },
    methods: {
      navClick() {
        this.$emit('listenHeader')
      }
    }
  }
</script>

<style scoped>

  .header {
    width: 1364px;
    height: 80px;
    margin: 20px auto 0px auto;
    border-bottom: 2px solid white;
  }

  .nav {
    height: inherit;
  }

  .navLogo {
    height: inherit;
    position: relative;
    float: left;
    margin-left: 30px;
  }

  .navLogo img {
    height: inherit;
  }

  .navItem {
    width: 580px;
    position: relative;
    float: right;
    height: inherit;
  }

  .navItem ul {
    height: inherit;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .navItem ul li {
    height: inherit;
    display: inline-block;
  }

  .navItem ul li a {
    display: inline-block;
    line-height: 80px;
    padding: 0 25px 0 25px;
    text-decoration: none;
    color: white;
    font-size: 17px;
    font-weight: bold;
    border-bottom: 2px solid #ffffff;
  }

  .navItem ul li a:hover {
    color: #FFA500;
    transition: 0.4s;
  }

  .navItem ul li a.active {
    color: #FFA500;
    border-bottom: 2px solid #FFA500;
    transition: 0.6s;
  }

</style>
