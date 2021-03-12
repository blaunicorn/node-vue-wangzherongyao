<template>
  <div class="login-container">
    <video
      autoplay
      muted
      loop
      poster="../assets/bg.jpg"
      class="bgvid"
      id="bgvid"
    >
      <!-- <source src="../assets/bg.mp4" type="video/mp4" /> -->
    </video>
    <el-card header="请先登录" class="login-card">
      <el-form label-width="70px" @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="model.username"
            required
            minlength="3"
            maxlength="20"
            placeholder="name"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            prefix-icon="el-icon-s-opportunity"
            clearable
            required
            maxlength="20"
            error
            v-model="model.password"
            placeholder="password"
            minlength="5"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          style="display: flex; justify-content: space-between; flex-wrap: wrap"
        >
          <el-button type="primary" native-type="submit">登录</el-button>
          <el-button type="primary" @click="afterpage">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        model: {},
      };
    },
    created() {
      this.model = {};
    },
    methods: {
      async login() {
        const res = await this.$http.post('login', this.model);
        console.log(res);
        localStorage.token = res.data.data.token;
        // sessionStorage // 当前浏览器关闭就没有了
        this.$router.push({ path: '/' });
        this.$message({
          type: 'success',
          message: res.data.data.message,
        });
      },
      afterpage() {},
    },
  };
</script>
<style scoped>
  #bgvid {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -2;
    background: url(../assets/bg.jpg) no-repeat;
    background-size: cover;
  }
  .login-card {
    width: 20rem;
    margin: 5rem auto;
  }
  .login-container {
    text-align: center;
  }
</style>
