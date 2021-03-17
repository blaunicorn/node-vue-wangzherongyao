<template>
  <div>
    <a-card :icon="icon" :title="title">
      <!-- 应用插槽展示数据 -->
      <div class="nav jc-between">
        <div class="nav-item" :class="{ active: false }">
          <div class="nav-link">热门</div>
        </div>
      </div>
      <div class="pt-3">
        <swiper>
          <swiper-slide v-for="m in 5" :key="m"
            ><div class="py-2" v-for="n in 5" :key="n">
              <span>[新闻]</span>
              <span>|</span>
              <span>春和景明柳垂莺娇，峡谷好礼随春报到</span>
              <span>06/12</span>
            </div></swiper-slide
          >
        </swiper>
      </div>
    </a-card>
  </div>
</template>

<script>
  export default {
    props: {
      icon: { type: String, required: true },
      title: {
        type: String,
        required: true,
      },
      // 分类
      categories: { type: Array, required: true },
    },
  };
</script>

<style>
</style>