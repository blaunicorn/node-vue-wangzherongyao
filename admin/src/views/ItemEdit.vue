<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <option value=""></option>
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="model.icon"></el-input>
      </el-form-item>
      <el-form-item label="上传图标">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :headers="headers"
          :show-file-list="false"
          :on-success="afterUpload"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
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
        model: {},
        parents: [],
        imageUrl: '',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
      };
    },
    created() {
      this.fetchParents();
      this.id && this.fetch(this.id);
    },
    methods: {
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
        const res = await this.$http.get(`/rest/item/${id}`);
        console.log(res);
        this.model = res.data;
      },
      async fetchParents() {
        const res = await this.$http.get(`/rest/item/`);
        console.log(res);
        this.parents = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(`/rest/item/${this.id}`, this.model);
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/item/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/item/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/item/list');
      },
    },
  };
</script>

<style>
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