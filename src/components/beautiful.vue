<template>
  <div class="layout-con">
    <Layout :style="{minHeight: '500vh'}">
      <Sider collapsible :collapsed-width="500" v-model="isCollapsed">

      </Sider>
      <Layout>
        <Content :style="{padding: '0 2px'}">
          <Card>
            <Tabs value="name1" style="height:920px;">
              <TabPane label="class" name="name1"></TabPane>
              <TabPane label="service" name="name2"></TabPane>
              <TabPane label="setter" name="name3"></TabPane>
              <TabPane label="mapper" name="name4"></TabPane>
              <TabPane label="mock" name="name5"></TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isCollapsed: true
      };
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    }
  }
</script>
<style scoped>
  .layout-con {

  }
</style>
