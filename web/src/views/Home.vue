<template>
  <div class="home">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/201.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/202.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/203.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/204.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right px-3 pb-2"
        slot="pagination"
      ></div>
    </swiper>
    <!-- end of swiper -->
    <!-- 图标导航 -->
    <!-- 外部容器text-center pt-3 内部容易mb-3 这样能统一样式 -->
    <transition name="fade" mode="out-in">
      <div
        class="nav-icons bg-white mt-3 d-flex flex-wrap text-center pt-3 text-grey-1"
      >
        <!-- <div class="nav-icons bg-white mt-3 text-center pt-3 text-grey-1"> -->
        <!-- <div class="nav-item mb-3" v-for="n in 10" :key="n">
        <i class="sprite sprite-news"></i>
        <div class="py-2">爆料站</div>
      </div> -->
        <!-- 处理底部的收起按钮，需要把d-flex flex-wrap 放在子集的div上，跟它平级写个收起的div -->

        <div class="d-flex flex-wrap" :class="{ toggleActive: isCollapse }">
          <a href class="nav-item my-3">
            <i class="sprite sprite-news"></i>
            <div>爆料站</div>
          </a>
          <a href class="nav-item my-3">
            <i class="sprite sprite-practice"></i>
            <div>故事站</div>
          </a>
          <a href class="nav-item my-3">
            <i class="sprite sprite-affair"></i>
            <div>周边商城</div>
          </a>
          <a href class="nav-item my-3 border-none">
            <i class="sprite sprite-mall"></i>
            <div>体验服</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-start"></i>
            <div>新人专区</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-honour"></i>
            <div>荣耀·传承</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-community"></i>
            <div>同人社区</div>
          </a>
          <a href class="nav-item my-2 border-none">
            <i class="sprite sprite-base"></i>
            <div>王者营地</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-echart"></i>
            <div>公众号</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-edition"></i>
            <div>版本介绍</div>
          </a>
        </div>
        <!-- <div class="d-flex flex-wrap"> -->
        <div
          class="bg-light py-2 fs-sm;"
          style="width: 100%"
          @click="switchActive"
        >
          <i
            class="sprite sprite-arrow mr-1"
            :style="{ transform: isCollapse ? 'rotate(180deg)' : '' }"
          ></i>
          <span class="retract">{{ isCollapse ? '收起' : '展开' }}</span>
        </div>
      </div>
    </transition>
    <!-- end of 图标模块 -->
    <!-- begin of 字体图标 -->
    <!-- <i class="iconfont icon-news text-primary"></i> -->
    <!-- end of 字体图标 -->
    <!-- begin of 新闻资讯卡片 -->
    <div class="card mt-3 p-3 bg-white">
      <div class="card-header d-flex ai-center pb-3">
        <i class="iconfont icon-caidananniudianji" style="color: deeppink"></i>
        <div class="fs-xl flex-1 px-2">新闻资讯</div>
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="card-body pt-3">
        <div class="nav jc-between">
          <div class="nav-item active">
            <div class="nav-link">热门</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
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
      </div>
    </div>
    <a-card icon="caidananniudianji" title="新闻资讯-全局组件">
      <!-- 应用插槽展示数据 -->
      <div class="nav jc-between">
        <div class="nav-item active">
          <div class="nav-link">热门</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
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
    <!-- 封装好的高级组件 -->
    <m-list-card
      icon="caidananniudianji"
      title="新闻资讯-ListCard组件"
      :categories="newsCats"
    >
      <!-- 在父组件里，不通过循环，直接拿到子组件里的具名slot的数据，
      这样的好处是 子组件的内容可以由父组件决定怎么展示 -->
      <template #items="{ category }">
        <div
          class="py-2 fs-lg d-flex"
          v-for="(item, index) in category.newsList"
          :key="index"
        >
          <span class="text-info" v-text="`[${item.categoryName}]`"
            >[新闻]</span
          >
          <span class="px-1">|</span>
          <span
            class="flex-1 text-dark-1 text-ellipsis pr-2"
            v-text="item.title"
            >春和景明柳垂莺娇，峡谷好礼随春报到</span
          >
          <span class="text-grey-1 fs-sm">{{ item.createdAt | date }}</span>
        </div>
      </template>
      <!-- <template v-slot:heros="{ category }"></template> -->
    </m-list-card>
    <!-- 英雄列表开始 -->
    <m-list-card
      icon="hero"
      title="英雄分类-ListCard组件"
      :categories="heroCats"
    >
      <!-- 在父组件里，不通过循环，直接拿到子组件里的具名slot的数据，
      这样的好处是 子组件的内容可以由父组件决定怎么展示 -->
      <template #items="{ category }">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem">
          <div
            class="p-2 text-center"
            v-for="(item, index) in category.heroList"
            :key="index"
            style="width: 20%"
          >
            <img :src="item.avatar" class="w-100" alt="" />
            <div>{{ item.name }}</div>
          </div>
        </div>
      </template>
      <!-- <template v-slot:heros="{ category }"></template> -->
    </m-list-card>
    <!-- 英雄列表结束-->
    <m-card icon="caidananniudianji" title="新闻资讯-局部组件"></m-card>
    <m-card icon="caidananniudianji" title="英雄列表"></m-card>
    <m-card icon="caidananniudianji" title="精彩视频"></m-card>
    <m-card icon="caidananniudianji" title="图文攻略"></m-card>
    <!-- end of 新闻资讯卡片 -->
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  // @ is an alias to /src
  import Card from '../components/Card';
  export default {
    filters: {
      date(val) {
        return dayjs(val).format('MM/DD');
      },
    },
    name: 'Home',
    components: { 'm-card': Card },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 1,
          autoplay: {
            disableOnInteraction: false,
            delay: 2000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        },
        isCollapse: true,
        // 定义ListCard组件的数据结构
        // newsCats: [
        //   {
        //     _id: 1,
        //     name: '热门',
        //     newsList: [
        //       {
        //         _id: 222,
        //         categoryName: '公告',
        //         title: '景明柳垂莺娇，峡谷好礼随春报到',
        //         date: '06/01',
        //       },
        //       {
        //         _id: 203,
        //         categoryName: '公告',
        //         title: '景明柳垂莺娇，峡谷好礼随春报到',
        //         date: '06/01',
        //       },
        //       {
        //         _id: 204,
        //         categoryName: '公告',
        //         title: '景明柳垂莺娇，峡谷好礼随春报到',
        //         date: '06/01',
        //       },
        //       {
        //         _id: 201,
        //         categoryName: '新闻',
        //         title: '景明柳垂莺娇，峡谷好礼随春报到',
        //         date: '06/01',
        //       },
        //       {
        //         _id: 202,
        //         categoryName: '赛事',
        //         title: '景明柳垂莺娇，峡谷好礼随春报到',
        //         date: '06/01',
        //       },
        //     ],
        //   },
        // ],
        // newsList的简单写法，新建数组5填充1，再map循环替换成对象
        newsCats: [
          {
            _id: 1,
            name: '热门',
            newsList: new Array(5).fill(1).map((v) => ({
              _id: v + 201,
              categoryName: '赛事',
              title: '景明柳垂莺娇，峡谷好礼随春报到',
              date: '06/01',
            })),
          },
          {
            _id: 2,
            name: '新闻',
            newsList: new Array(5).fill(2).map((v) => ({
              _id: v + 202,
              categoryName: '赛事',
              title: '景明柳垂莺娇，峡谷好礼随春报到',
              date: '06/01',
            })),
          },
        ],
        // 后台数据
        // newsCats: [],
        heroCats: [],
      };
    },
    created() {
      this.fetchNewsCats();
      this.fetchheroCats();
    },
    mounted() {
      console.log('Current Swiper instance object', this.swiper);
      //   this.swiper.slideTo(3, 1000, false);
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper;
      },
    },
    methods: {
      async fetchheroCats() {
        const res = await this.$http.get('hero/list');
        this.heroCats = res.data;
      },
      async fetchNewsCats() {
        const res = await this.$http.get('news/list');
        this.newsCats = res.data;
      },
      switchActive() {
        this.isCollapse = !this.isCollapse;
      },
    },
  };
</script>
<style lang='scss' scope>
  @import '../style/variables.scss';
  //  重新定义一个class，便于单独管理各个页面的swipers
  .pagination-home {
    .swiper-pagination-bullet {
      display: inline-block;
      opacity: 1;
      border-radius: 0.1538rem;
      background-color: map-get($colors, 'white');
      //   background-color: #ffffff;
      &.swiper-pagination-bullet-active {
        background: map-get($colors, 'info');
      }
    }
  }
  .nav-icons {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    .nav-item {
      width: 25%;
      // 取消右侧的边框
      border-right: 1px solid $border-color;
      &:nth-child(4n) {
        border-right: none;
      }
    }
  }
  .toggleActive {
    height: 60px;
    overflow: hidden;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active,
  .fade-enter-active {
    transition: opacity 0.9s;
  }
</style>
