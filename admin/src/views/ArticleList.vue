<template>
  <div class="about">
    <h1>文章列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"> </el-table-column>
      <el-table-column prop="categories" label="所属分类" width="120">
        <template slot-scope="scope" v-if="parents.length > 0">
          <p v-for="item in scope.row.categories" :key="item">
            {{ parents.find((e) => e._id === item).name }},
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" width="120">
      </el-table-column>
      <el-table-column prop="icon" label="物品图标" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.icon" alt="" style="3rem;" srcset="" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/article/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button @click="remove(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: [],
        parents: [],
      };
    },
    created() {
      this.fetchCategories();
      this.fetch();
    },
    methods: {
      async fetchCategories() {
        const res = await this.$http.get(`/rest/category/`);
        console.log(res);
        this.parents = res.data;
      },
      async fetch() {
        const params = {
          limit: 100,
        };
        // 查询字符串传参 用 req.query接收   eg. http://localhost:9999/axios?id=1000  服务端 app.get('/axios', (req, res)
        // restful风格URL  传参 用req.params.id 接收 eg.http://localhost:9999/axios/1000  服务端需要:id
        const res = await this.$http.get('/rest/article', { params });
        // console.log(res);
        this.items = res.data;
      },
      async remove(row) {
        console.log(row);
        this.$confirm(`此操作将永久删除该文章${row.title}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const res = await this.$http.delete(`/rest/article/${row._id}`);
            console.log(res);
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.fetch();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      },
    },
  };
</script>
