<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <option value=""></option>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="model.password"></el-input>
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
  export default {
    components: {},
    props: {
      id: {},
    },
    data() {
      return { model: {}, categories: [], imageUrl: '' };
    },
    created() {
      this.id && this.fetch(this.id);
    },
    methods: {
      async fetch(id) {
        const res = await this.$http.get(`/rest/admin_user/${id}`);
        console.log(res);
        this.model = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(
            `/rest/admin_user/${this.id}`,
            this.model
          );
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/admin_user/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/admin_user/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/admin_user/list');
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