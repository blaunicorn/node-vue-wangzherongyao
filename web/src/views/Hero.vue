<template>
  <div class="page-hero" v-if="model">
    <div
      class="topbar bg-black py-2 text-white px-3 d-flex ai-center text-white"
    >
      <img src="../assets/logo.png" height="30" alt="" sizes="" srcset="" />
      <!-- 用flex-1去占据全部的剩余空间 -->
      <div class="px-2 flex-1">
        <!-- <div class="text-white">王者荣耀</div> -->
        <!-- <div class="text-dark-1">团队成就更多</div> -->
        <!-- 不是上下两行了，需要用inline元素 -->
        <span class="text-white">王者荣耀</span>
        <span class="text-white ml-2">攻略站</span>
      </div>
      <router-link to="/" tag="div" class="jc-end">更多英雄 &gt;</router-link>
    </div>
    <!-- 注意banner应该是个背景图 -->
    <div class="top" :style="{ 'background-image': `url(${model.banner})` }">
      <!-- 3.22  d-flex flex-column让背景上的info变成垂直布局， 加h-100 让info保持与背景一样高，再用justify-content:end（变成垂直布局，就不是靠右而是靠底部了） -->
      <div class="info text-white p-3 h-100 d-flex flex-column jc-end">
        <div class="fs-sm">{{ model.title }}</div>
        <h2 class="my-2">{{ model.name }}</h2>
        <!-- map 循环转成数组，在用/分割 -->
        <div class="fs-sm">
          {{ model.categories.map((v) => v.name).join('/') }}
        </div>
        <div class="d-flex jc-between">
          <!-- 右边还有皮肤数据，所以要把它转成d-flex，变成左右对齐，上面再增加一层， -->
          <!-- ai-center 让scores 垂直对齐 -->
          <div class="scores d-flex ai-center pt-2" v-if="model.scores">
            <span>难度</span>
            <span class="badge bg-primary">{{ model.scores.difficult }}</span>
            <span>技能</span>
            <span class="badge bg-blue-1">{{ model.scores.skills }}</span>
            <span>攻击</span>
            <span class="badge bg-danger">{{ model.scores.attack }}</span>
            <span>生存</span>
            <span class="badge bg-dark">{{ model.scores.survive }}</span>
          </div>
          <router-link to="/" tag="div" class="text-grey fs-sm"
            >皮肤： 2 &gt;</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      id: { required: true },
    },
    data() {
      return {
        model: null,
      };
    },
    created() {
      this.fetch();
    },
    methods: {
      async fetch() {
        const res = await this.$http.get(`heroes/${this.id}`);
        this.model = res.data;
      },
    },
  };
</script>
<style lang="scss" scoped>
  // 限制在hero页面内，防止样式冲突
  .page-hero {
    .top {
      // 没有高度不会显示
      height: 50vw;
      //   背景图不要重复，垂直向上靠，水平居中
      background: #fff no-repeat top center;
      // 限制高度100%
      background-size: auto 100%;
    }
    .info {
      // 增加渐变效果，全透明变到全黑
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      .scores {
        .badge {
          margin: 0 0.25rem;
          display: inline-block;
          width: 1rem;
          height: 1rem;
          line-height: 0.9rem;
          text-align: center;
          border-radius: 50%;
          font-size: 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>