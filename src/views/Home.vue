<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <span>湖北省水利水电规划勘测设计院 / 地理数据共享平台</span>
    </div>

    <!-- 横向导航区域 -->
    <a-menu
      class="topNavBar"
      mode="horizontal"
      theme="light"
      v-model:selectedKeys="mainKeys"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item
        :index="'/' + item.path"
        v-for="(item, index) in naviList"
        :key="index"
        @click="handleClick(item)"
        >{{ item.name }}</a-menu-item
      >

      <a-sub-menu key="sub1" v-model:selectedKeys="subKeys">
        <template #icon>
          <a-avatar :src="avatarUrl" />
        </template>
        <template #title>欢迎您! {{ username }}</template>
        <a-menu-item key="item1" @click.stop.prevent="goToUser">
          <span>个人信息</span>
        </a-menu-item>
        <a-menu-item key="item2" @click="exit">
          <span>退出</span>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>

    <!-- 路由占位符 -->
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive :exclude="['three', 'cad-viewer']">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <!-- 底部信息 -->
    <div class="footer">
      <p>© 湖北省水利水电规划勘测设计院 版权所有</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Cookies from "js-cookie";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const mainKeys = ref(["0"]);
    const username = Cookies.get("username");
    const avatarUrl = "/src/assets/avatar.png";

    const subKeys = [];
    const naviList = [
      { name: "首页", path: "homepage" },
      { name: "地理数据编目", path: "geodata" },
      { name: "服务资源", path: "service" },
      { name: "专题应用", path: "application" },
      { name: "数据详情", path: "cadviewer" },
      { name: "三维实景", path: "three" },
      { name: "意见反馈", path: "suggestion" },
      { name: "个人中心", path: "user" },
    ];

    const handleClick = (item) => {
      router.push("/home/" + item.path);
    };

    const goToUser = () => {
      router.push("/home/user");
      mainKeys.value = naviList.findIndex((item) => {
        return item.path === "user";
      });
    };

    const exit = () => {
      store.state.data = [];
      Cookies.remove("username");
      Cookies.remove("usertype");
      router.push("login");
    };

    return {
      mainKeys,
      username,
      avatarUrl,
      subKeys,
      naviList,
      handleClick,
      goToUser,
      exit,
    };
  },
});
</script>

<style scoped>
.box {
  width: 100%;
}

.header {
  height: 60px;
  background-color: #333333;
  color: #fff;
  font-size: 20px;
  line-height: 60px;
  padding-left: 30px;
}

/* 横向菜单栏 */
.topNavBar :deep(.ant-menu) {
  height: 64px;
  width: 100%;
}

.topNavBar :deep(.ant-menu-item) {
  width: 10%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

/* 底部信息 */
.footer {
  margin-top: 20px;
  height: 50px;
  background-color: #333333;
  color: #fff;
  line-height: 50px;
  padding: 0 30px;
}
</style>
