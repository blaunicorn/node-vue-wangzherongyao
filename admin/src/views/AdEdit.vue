<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}广告位</h1>
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
      <el-form-item label="广告">
        <el-button type="primary" size="small" @click="model.items.push({})"
          ><i class="el-icon-plus"></i> 添加广告</el-button
        >
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="23" v-for="(item, index) in model.items" :key="index">
            <el-form-item>
              <el-tag
                style="
                  text-align: center;
                  border-radius: 5px;
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                "
                type="success"
                >第{{ index + 1 }}个广告位</el-tag
              >
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="item.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转联接(URL)">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top: 0.5rem">
              <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload'"
                :show-file-list="false"
                :on-success="(res) => $set(item, 'image', res.url)"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item>
              <el-button
                type="warning"
                size="small"
                style="margin: 20px 0; width: 100%"
                @click="model.items.splice(index, 1)"
                >删除</el-button
              ></el-form-item
            >

            <el-divider></el-divider>
          </el-col>
        </el-row>
      </el-form-item>
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
    props: {
      id: {},
    },
    data() {
      return {
        model: {
          items: [],
        },
        parents: [],
      };
    },
    created() {
      this.fetchParents();
      this.id && this.fetch(this.id);
    },
    methods: {
      afterUpload(res, file) {
        console.log(res, file);
        this.$set(this.model, 'image', res.url);
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
        const res = await this.$http.get(`/rest/ad/${id}`);
        console.log(res);
        // this.model = res.data;
        this.model = Object.assign({}, this.model, res.data);
      },
      async fetchParents() {
        const res = await this.$http.get(`/rest/ad/`);
        console.log(res);
        this.parents = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(`/rest/ad/${this.id}`, this.model);
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/ad/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/ad/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/ad/list');
      },
      //取消保存返回上一页
      cancel() {
        this.$router.go(-1);
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
    min-width: 15rem !important;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 15rem;
    height: 50px;
    display: block;
  }
</style>