<template>
  <a-card :icon="icon" :title="title">
    <!-- 应用插槽展示数据 -->
    <div class="nav jc-between">
      <div
        class="nav-item"
        :class="{ active: active === index }"
        v-for="(category, index) in categories"
        :key="index"
        @click="
          () => {
            $refs.list.$swiper.slideTo(index);
          }
        "
      >
        <div class="nav-link" v-text="category.name">热门</div>
      </div>
    </div>
    <div class="card-body pt-3">
      <swiper
        ref="list"
        :options="swiperOptions"
        @slide-change="() => (active = $refs.list.$swiper.realIndex)"
      >
        <swiper-slide v-for="(category, index) in categories" :key="index">
          <!-- 具名插槽，把子组件的数据再传递给父组件，便于后面区分新闻资讯、英雄列表、视频列表的不同样式展示 -->
          <slot name="items" :category="category"></slot>
        </swiper-slide>
      </swiper>
    </div>
  </a-card>
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
    data() {
      return {
        swiperOptions: {
          // 自动高度
          autoHeight: true,
          slidesPerView: 1,
          //   autoplay: {
          //     disableOnInteraction: false,
          //     delay: 2000,
          //   },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        },
        active: 0,
      };
    },
  };
</script>

<style>
</style>