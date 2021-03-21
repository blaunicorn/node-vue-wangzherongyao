<template>
  <div class="about">
    <h1>英雄列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"> </el-table-column>
      <el-table-column prop="parent.name" label="上级分类" width="120">
      </el-table-column>
      <el-table-column prop="name" label="英雄名称" width="120">
      </el-table-column>
      <el-table-column prop="title" label="英雄称号" width="120">
      </el-table-column>
      <el-table-column prop="avatar" label="英雄头像" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="3rem;" srcset="" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/hero/edit/${scope.row._id}`)"
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
      };
    },
    created() {
      this.fetch();
    },
    methods: {
      async fetch() {
        const params = {
          limit: 1000,
        };
        // 查询字符串传参 用 req.query接收   eg. http://localhost:9999/axios?id=1000  服务端 app.get('/axios', (req, res)
        // restful风格URL  传参 用req.params.id 接收 eg.http://localhost:9999/axios/1000  服务端需要:id
        const res = await this.$http.get('/rest/hero', { params });
        // console.log(res);
        this.items = res.data;
      },
      async remove(row) {
        console.log(row);
        this.$confirm(`此操作将永久删除该分类${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const res = await this.$http.delete(`/rest/hero/${row._id}`);
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
