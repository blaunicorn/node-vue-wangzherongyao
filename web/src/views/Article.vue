<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <div class="iconfont icon-back text-blue" @click="$router.go(-1)"></div>
      <strong class="flex-1 text-ellipsis text-blue pl-2">{{
        model.title
      }}</strong>
      <div class="text-grey fs-xs">2019-06-19</div>
    </div>
    <div class="px-3 body fs-lg" v-html="model.body"></div>
    <div class="px-3 border-top py-3">
      <div class="d-flex ai-center">
        <i class="iconfont icon-menu"></i
        ><strong class="text-blue fs-lg ml-2">相关资讯</strong>
      </div>
      <div class="pt-2">
        <router-link
          class="py-1 mt-2"
          :to="`/articles/${item._id}`"
          tag="div"
          v-for="item in model.related"
          :key="item._id"
        >
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      id: {
        required: true,
      },
    },
    data() {
      return {
        model: null,
      };
    },
    created() {
      this.fetch();
    },
    watch: {
      // 简写
      id: 'fetch',
      // 完整写法
      //   id() {
      //     this.fetch();
      //   },
    },
    methods: {
      async fetch() {
        // 调用是 用 实参，没有冒号
        const res = await this.$http.get(`articles/${this.id}`);
        this.model = res.data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  //   img不能自动缩小，可能存在不能深度渲染的问题，可以去掉scoped 或者在img前增加深度渲染：：v-deep
  // less中一般使用 >>> 或 /deep/
  // scss中一般使用 ::v-deep
  .page-article {
    .icon-back {
      font-size: 1.692308rem;
    }
    .body {
      ::v-deep img {
        max-width: 100%;
        height: auto;
      }
      iframe {
        width: 100%;
        height: auto;
      }
    }
  }
</style>