<template>
  <div class="card mt-3 p-3 bg-white">
    <div class="card-header d-flex ai-center pb-3">
      <i class="iconfont" :class="`icon-${icon}`" style="color: deeppink"></i>
      <div class="fs-xl flex-1 px-2">{{ title }}</div>
      <i class="iconfont icon-menu"></i>
    </div>
    <div class="card-body pt-3">
      <!-- 使用插槽功能 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    // 父子组件传值
    props: {
      title: {
        type: String,
        required: true,
        default: '',
      },
      icon: {
        type: String,
        required: true,
        default: '',
      },
    },
  };
</script>

<style lang="scss">
  @import '../style/_variables.scss';
  .card {
    border-bottom: 1px solid $border-color;
    .card-header {
      border-bottom: 1px solid $border-color;
    }
  }
</style>