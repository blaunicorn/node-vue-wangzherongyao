<template>
  <div>
    <div class="topbar bg-black py-2 text-white px-3 d-flex ai-center">
      <img src="../assets/logo.png" height="30" alt="" sizes="" srcset="" />
      <!-- 用flex-1去占据全部的剩余空间 -->
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-dark-1">团队成就更多</div>
      </div>
      <button type="button" class="btn bg-primary jc-end">立即下载</button>
    </div>
    <div class="bg-primary pt-3 pb-2">
      <!-- 增加反色nav-inverse,去掉d-flex text-white -->
      <div class="nav nav-inverse jc-around pb-1">
        <div class="nav-item active">
          <router-link class="nav-link" to="/" tag="div">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/about" tag="div"
            >攻略中心</router-link
          >
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">赛事中心</router-link>
        </div>
      </div>
    </div>
    <!-- 所有子路由入口 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {};
</script>

<style>
</style>