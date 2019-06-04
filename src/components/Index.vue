<template>
  <div class="index">

    <div class="indexIntro">
      <div class="introContent">
        <h1>香山文化</h1>
        <p>
          香山文化在地缘上是指包括今天的中山、珠海、澳门<br>
          在内的地域文化。它在本质上集中体现了岭南文化中<br>
          广府文化的文化特征，是中原文化、土著文化、西洋<br>
          文化、南洋文化相互碰撞和不断融合的产物，是相对<br>
          岭南文化而言的子文化，是岭南文化的重要组成部分。
        </p>
      </div>
    </div>

    <div v-if="!isLogin" class="login">
      <div class="loginTitle">
        <h1>登录</h1>
      </div>
      <div class="usernameInput">
        <embed src="../../static/font/username.svg" width="40" height="40" />
        <el-input v-model="loginData.username" type="text" placeholder="请输入用户名" clearable style="width: 250px" class="username"></el-input>
      </div>
      <div class="passwordInput">
        <embed src="../../static/font/password.svg" width="40" height="40" />
        <el-input v-model="loginData.password" type="password" placeholder="请输入密码" clearable style="width: 250px" class="password"></el-input>
      </div>
      <p class="forgetPassword">忘记密码？</p>
      <div class="submit">
        <el-button type="primary" @click="userLogin">登录</el-button>
        <el-button type="warning" @click="regDialog">注册</el-button>
      </div>
    </div>

    <div v-if="isLogin" class="logout">
      <div class="logoutTitle">
        <h1>CAVINNN</h1>
      </div>
      <div class="logoutContent">
        你好！<br>欢迎使用香山文化知识图谱系统
      </div>
      <div class="logoutButt">
        <el-button type="warning" @click="userLogout">注销</el-button>
      </div>
    </div>

    <el-dialog title="注册" width="400px" :visible.sync="regDialogVisible">
      <el-form :model="registerData" :rules="regRules" ref="regForm">
        <el-form-item label="用户名" :label-width="labelWidth" prop="username">
          <el-input type="text" v-model="registerData.username" placeholder="请输入用户名" clearable style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="labelWidth" prop="password">
          <el-input type="password" v-model="registerData.password" placeholder="请输入密码" clearable style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" :label-width="labelWidth" prop="email">
          <el-input type="text" v-model="registerData.email" placeholder="请输入电子邮件" clearable style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="regDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="register">注 册</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

    import {mapState, mapGetters, mapActions} from 'vuex'

    export default {
      name: "Index",
      data() {
        return {
          appPath: "http://localhost:8080/culture",
          regDialogVisible: false,
          labelWidth: '80px',
          loginData: {
            username: '',
            password: ''
          },
          registerData: {
            username: '',
            password: '',
            email: ''
          },
          regRules: {
            username: [
              { required:true, message:'请输入用户名', trigger:'blur' },
              { min:6, max:16, message:'长度在6-16个字符', trigger:'blur' }
              // { validator: validateUserName, trigger: 'blur' }
            ],
            password: [
              { required:true, message:'请输入密码', trigger:'blur' },
              { min:6, max:16, message:'长度在6-16个字符', trigger:'blur' }
            ],
            email: [
              { type:'email', required:true, message:'请输入正确的电子邮箱', trigger:'blur' },
            ]
          }
        }
      },
      computed: {
        ...mapState(['isLogin']),
        ...mapGetters(['loginState'])
      },
      // mounted() {
      //   this.$ajax.get(this.appPath + '/admin/getToken')
      //     .then(res => {
      //       console.log(res)
      //     })
      //     .catch(error => {
      //       console.log(error);
      //     });
      // },
      methods: {
        ...mapActions(['login', 'logout']),
        regDialog() {
          // console.log(this.isLogin);
          this.regDialogVisible = true;
        },
        // 注册
        register() {
          this.$refs.regForm.validate((valid) => {
            if (valid) {
              let now = new Date();
              this.$ajax.post(this.appPath + '/admin/register', {
                userName: this.registerData.username,
                userPassword: this.registerData.password,
                email: this.registerData.email,
                registerDate: now
              })
                .then(res => {
                  if (res.data.code === 200) {
                    this.$message({
                      showClose: true,
                      message: '注册成功！',
                      type: 'success'
                    });
                    this.$refs.regForm.resetFields();
                    this.regDialogVisible = false
                  } else {
                    this.$message({
                      showClose: true,
                      message: '注册失败！该用户名已注册',
                      type: 'error'
                    });
                    this.$refs.regForm.resetFields();
                  }
                })
                .catch(error => {
                  console.log(error);
                });

              this.$refs.regForm.resetFields();
              this.regDialogVisible = false
            } else {
              this.$message({
                showClose: true,
                message: '表单未正确输入！',
                type: 'error'
              });
              return false;
            }
          });
        },
        // 登录
        userLogin() {
          if (this.loginData.username === ""){
            this.$message({
              showClose: true,
              message: '请输入用户名！',
              type: 'error'
            });
          } else if (this.loginData.password === ""){
            this.$message({
              showClose: true,
              message: '请输入密码！',
              type: 'error'
            });
          } else {
            this.$ajax.post(this.appPath + '/admin/login', {
              userName: this.loginData.username,
              userPassword: this.loginData.password
            })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '登录成功！',
                    type: 'success'
                  });
                  this.login({});
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error'
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        },
        userLogout() {
          this.$ajax.post(this.appPath + '/admin/logout')
            .then(res => {
              this.$message({
                showClose: true,
                message: '注销成功！',
                type: 'success'
              });
              this.logout({});
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>

  .index {
    margin: 0 auto;
    width: 1364px;
    height: 780px;
  }

  .indexIntro {
    float: left;
    position: relative;
    top: 160px;
    left: 150px;
    border-radius: 10px;
    width: 600px;
    height: 450px;
    background: url("../../static/images/indexIntro.jpg") no-repeat;
    opacity: 0.9;
    background-size: 600px 450px;
  }

  .introContent {
    background: rgba(0, 0, 0, 0.6);
    width: 600px;
    height: 450px;
    border-radius: 10px;
    color: white;
    z-index: 15;
  }

  .introContent h1 {
    margin: 0px;
    padding: 60px 0px 0px 50px;
  }

  .introContent p {
    margin: 0px;
    padding: 30px 0px 0px 80px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
  }

  .login {
    float: left;
    position: relative;
    top: 160px;
    left: 200px;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.7);
    width: 400px;
    height: 450px;
  }

  .loginTitle {
    padding: 0 30px;
    text-align: center;
    color: white;
  }

  .loginTitle h1 {
    margin-bottom: 0px;
    padding-bottom: 20px;
    border-bottom: 2px solid white;
    overflow: hidden;
  }

  .usernameInput {
    margin-top: 55px;
    text-align: center;
  }

  .usernameInput embed {
    vertical-align: top;
    margin-right: 10px;
  }

  .passwordInput {
    margin-top: 50px;
    text-align: center;
  }

  .passwordInput embed {
    vertical-align: top;
    margin-right: 10px;
  }

  .forgetPassword {
    margin: 25px 45px 25px 0px;
    text-align: right;
    font-weight: bold;
    color: #f0c14b;
    cursor: pointer;
  }

  .submit {
    text-align: center;
    margin-top: 35px;
    letter-spacing: 5px;
  }

  /*登录后的状态框*/
  .logout {
    float: left;
    position: relative;
    top: 160px;
    left: 200px;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.7);
    width: 400px;
    height: 450px;
  }

  .logoutTitle {
    padding: 0 30px;
    text-align: center;
    color: white;
  }

  .logoutTitle h1 {
    margin-bottom: 0px;
    padding-bottom: 20px;
    border-bottom: 2px solid white;
    overflow: hidden;
  }

  .logoutContent {
    padding: 65px 30px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    line-height: 300%;
    color: white;
  }

  .logoutButt {
    text-align: center;
    margin-top: 35px;
    letter-spacing: 5px;
  }

</style>

<style>

  .index .username.el-input.el-input--suffix input {
    font-family: myFont, sans-serif;
    font-size: 18px;
    font-weight: bold;
  }

  .index .password.el-input.el-input--suffix input {
    font-family: myFont, sans-serif;
    font-size: 18px;
    font-weight: bold;
  }

  .index .submit .el-button {
    font-family: myFont, sans-serif;
    font-size: 18px;
    font-weight: bold;
    padding: 12px 35px;
  }

  .index .logoutButt .el-button {
    font-family: myFont, sans-serif;
    font-size: 18px;
    font-weight: bold;
    padding: 12px 35px;
  }

</style>
