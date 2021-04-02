<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- 经过tabs优化后的页面 -->

      <el-tabs :value="'basic'" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="称号">
            <el-input v-model="model.title"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-input v-model="model.avatar"></el-input>
          </el-form-item>
          <el-form-item label="上传头像">
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :headers="getAuthHeaders()"
              :on-success="(res) => $set(model, 'avatar', res.url)"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="model.avatar" :src="model.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="Banner">
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :headers="getAuthHeaders()"
              :on-success="(res) => $set(model, 'banner', res.url)"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="model.banner" :src="model.banner" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="model.categories" multiple>
              <el-option
                v-for="item of categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="难度">
            <el-rate
              style="margin-top: 0.6rem"
              :max="10"
              show-score
              v-model="model.scores.difficult"
            ></el-rate>
          </el-form-item>
          <el-form-item label="技能">
            <el-rate
              style="margin-top: 0.6rem"
              :max="10"
              show-score
              v-model="model.scores.skills"
            ></el-rate>
          </el-form-item>
          <el-form-item label="攻击">
            <el-rate
              style="margin-top: 0.6rem"
              :max="10"
              show-score
              v-model="model.scores.attack"
            ></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <el-rate
              style="margin-top: 0.6rem"
              :max="10"
              show-score
              v-model="model.scores.survive"
            ></el-rate>
            <!-- <el-input v-model="model.scores.difficult"></el-input> -->
          </el-form-item>
          <el-form-item label="顺风出装">
            <el-select v-model="model.items1" multiple>
              <el-option
                v-for="item of items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <el-select v-model="model.items2" multiple>
              <el-option
                v-for="item of items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 3.21 增加英雄关系 -->
        <el-tab-pane label="最佳搭档" name="partners">
          <el-button
            type="primary"
            size="small"
            @click="model.partners.push({})"
            ><i class="el-icon-plus"></i> 添加英雄</el-button
          >
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col
              :md="12"
              v-for="(item, index) in model.partners"
              :key="index"
            >
              <el-form-item label="英雄">
                <el-select filterable v-model="item.hero">
                  <el-option
                    v-for="hero in heroes"
                    :key="hero._id"
                    :value="hero._id"
                    :label="hero.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="warning"
                  size="small"
                  @click="model.parents.splice(index, 1)"
                  >删除</el-button
                ></el-form-item
              >
              <el-divider></el-divider>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="技能" name="skills">
          <el-button type="primary" size="small" @click="model.skills.push({})"
            ><i class="el-icon-plus"></i> 添加技能</el-button
          >
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, index) in model.skills" :key="index">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-upload
                  class="avatar-uploader"
                  :action="$http.defaults.baseURL + '/upload'"
                  :show-file-list="false"
                  :headers="getAuthHeaders()"
                  :on-success="(res) => $set(item, 'icon', res.url)"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="item.icon" :src="item.icon" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="冷却值">
                <el-input v-model="item.delay"></el-input>
              </el-form-item>
              <el-form-item label="消耗">
                <el-input v-model="item.cost"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input type="textarea" v-model="item.tips"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="warning"
                  size="small"
                  @click="model.skills.splice(index, 1)"
                  >删除</el-button
                ></el-form-item
              >

              <el-divider></el-divider>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-form-item style="margin-top: 1rem">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      id: {},
    },
    data() {
      return {
        categories: [],
        items: [],
        model: {
          partners: [],
          skills: [],
          scores: {
            difficult: 0,
          },
        },
        parents: [],
        heroes: [],
        imageUrl: '',
      };
    },
    created() {
      this.fetchParents();
      this.fetchCategories();
      this.fetchItems();
      this.fetchHeroes();
      this.id && this.fetch(this.id);
    },
    methods: {
      afterUpload(res, file) {
        console.log(res, file);
        this.$set(this.model, 'avatar', res.url);
        // this.model.icon = res.url; // 可能会无法响应赋值,也可以先在data上定义好，就 不用set赋值了。
        // this.imageUrl = URL.createObjectURL(res.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      async fetch(id) {
        const res = await this.$http.get(`/rest/hero/${id}`);
        console.log(res);
        // 通过y一次浅拷贝，确保model中有多层属性
        this.model = Object.assign({}, this.model, res.data);
        // this.model = res.data;
      },
      async fetchHeroes() {
        const params = {
          limit: 1000,
        };
        const res = await this.$http.get('/rest/hero', { params });
        // console.log(res);
        this.heroes = res.data;
      },
      async fetchParents() {
        const res = await this.$http.get(`/rest/hero/`);
        console.log(res);
        this.parents = res.data;
      },
      async fetchCategories() {
        const res = await this.$http.get(`/rest/categories/`);
        console.log(res);
        this.categories = res.data;
      },
      async fetchItems() {
        const res = await this.$http.get(`/rest/item/`);
        // console.log(res);
        this.items = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(`/rest/hero/${this.id}`, this.model);
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/hero/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/hero/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/hero/list');
      },
    },
  };
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>