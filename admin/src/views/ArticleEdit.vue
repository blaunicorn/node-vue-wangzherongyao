<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <option value=""></option>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor
          id="editor"
          useCustomImageHandler
          @image-added="handleImageAdded"
          v-model="model.body"
        ></vue-editor>
      </el-form-item>
      <!-- <el-form-item label="上传图标">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button
          type="danger"
          size="medium"
          native-type="button"
          @click="cancel"
          v-show="this.id"
          :plain="true"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { VueEditor } from 'vue2-editor'; // 解构写法
  //   import a from 'vue2-editor';  // 另一种写法，对象写法 ，用 a.VueEditor 获取
  export default {
    components: {
      VueEditor,
    },
    props: {
      id: {},
    },
    data() {
      return { model: {}, categories: [], imageUrl: '' };
    },
    created() {
      this.fetchCategories();
      this.id && this.fetch(this.id);
    },
    methods: {
      // 富文本编辑器图片处理
      async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        console.log(111);
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.$http.post('upload', formData);
        Editor.insertEmbed(cursorLocation, 'image', res.data.url);
        resetUploader();
      },
      afterUpload(res, file) {
        console.log(res, file);
        this.$set(this.model, 'icon', res.url);
        // this.model.icon = res.url; // 可能会无法响应赋值
        // this.imageUrl = URL.createObjectURL(res.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
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
        const res = await this.$http.get(`/rest/article/${id}`);
        console.log(res);
        this.model = res.data;
      },
      async fetchCategories() {
        const res = await this.$http.get(`/rest/category/`);
        console.log(res);
        this.categories = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(
            `/rest/article/${this.id}`,
            this.model
          );
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/article/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/article/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/article/list');
      },
      //取消保存返回上一页
      cancel() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style>
  .el-button--medium-ArticleEdit {
    padding: 15px 60px !important;
  }
  /* 富文本编辑器 */
  .ql-snow .ql-picker-label::before {
    top: -7px;
    position: relative;
  }
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>