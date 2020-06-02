<script>
// Vue 官方网站对 Mixins 定义：混入 (Mixins) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。
// 一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。
// 简单的来说就是 Mixins 是我们可以重用的代码块，
// 在实际开发中，如果有些代码重复性比较高，这时候可以考虑 Mixins 这个特性
/*注意事项：
     1.当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。
     比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
     2.同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用
     3.值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。
     两个对象键名冲突时，取组件对象的键值对。
**/
export default {
  methods: {
    //  删除操作
    del(url, id, methodName) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: url,
            data: {
              id
            }
          });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            if (this.page > 1 && this.userList.length == 1) {
              // 此时删除的是当前页的最后一条数据  并且页数大于一页
              this.page--; //当前页没有数据了 那么应该-1
              // 我们可以通过统一不同组件中的方法名来达到刷新效果
              // this.getList(); //重新获取删除后的当前页对应条件的用户列表
              // 我们还可以用vue的底层方法options，来获取到我们自定义的方法并调用。
              // 但是这个时候调用方法，this指向会发生很大的变化，会很影响我们的预期，我们可以给方法指定this
              this.$options.methods[methodName].call(this);
              return;
            }
            // this.getList(); //重新获取删除后的当前页对应条件的用户列表
            this.$options.methods[methodName].call(this);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 更改状态
    async changeStatus(url, id, methodName) {
      const res = await this.$axios({
        method: "post",
        url: url,
        data: {
          id
        }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        // this.getList(); //重新获取更改后的当前页对应条件的用户列表
        this.$options.methods[methodName].call(this);
      }
    }
  }
};
</script>