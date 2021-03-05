<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <option value=""></option>
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
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
      return { model: {}, parents: [] };
    },
    created() {
      this.fetchParents();
      this.id && this.fetch(this.id);
    },
    methods: {
      async fetch(id) {
        const res = await this.$http.get(`/rest/categories/${id}`);
        console.log(res);
        this.model = res.data;
      },
      async fetchParents() {
        const res = await this.$http.get(`/rest/categories/`);
        console.log(res);
        this.parents = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(
            `/rest/categories/${this.id}`,
            this.model
          );
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/categories/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/categories/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/categories/list');
      },
    },
  };
</script>

<style>
</style>