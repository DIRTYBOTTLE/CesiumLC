<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-row>
          <a-col :span="24">
            <a-layout>
              <!-- 地理数据编目 -->
              <a-layout-sider
                width="240"
                v-model:collapsed="collapsedLeft"
                :trigger="null"
                collapsible
                style="background: #fff"
              >
                <a-button
                  :block="true"
                  type="primary"
                  @click="() => (collapsedLeft = !collapsedLeft)"
                >
                  <MenuUnfoldOutlined v-if="collapsedLeft" />
                  <MenuFoldOutlined v-else />
                </a-button>
                <a-menu
                  mode="inline"
                  :openKeys="openKeys"
                  style="height: 100%; text-align: left"
                >
                  <a-sub-menu key="sub1">
                    <template #icon>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-dili"></use>
                      </svg>
                    </template>
                    <template #title><b>地理数据编目</b></template>
                    <a-menu-item
                      v-for="(item, index) in geoDataList"
                      :key="index"
                    >
                      {{ item }}
                    </a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </a-layout-sider>
              <!--地图可视化-->
              <a-layout-content
                id="mainMap"
                style="
                  padding: 0 24px;
                  background: rgb(255, 255, 255);
                  overflow: hidden;
                  width: 100%;
                  position: relative;
                "
              >
                <map-visualization />
                <!-- 服务资源 -->
                <a-drawer
                  id="rightDrawer"
                  title="服务资源"
                  placement="right"
                  :closable="false"
                  :visible="visibleRight"
                  :maskClosable="false"
                  :mask="false"
                  :get-container="false"
                  :wrap-style="{ position: 'absolute' }"
                >
                  <a-card
                    hoverable
                    v-for="(item, index) in serviceList"
                    :key="index"
                    style="width: 100%"
                  >
                    <template #cover>
                      <img :alt="item.name" :src="item.url" />
                    </template>
                    <a-card-meta :title="item.name">
                      <template #description>{{ item.discription }}</template>
                    </a-card-meta>
                  </a-card>
                </a-drawer>
                <a-button
                  id="showService"
                  type="primary"
                  @click="showDrawerRight"
                >
                  <MenuUnfoldOutlined v-if="collapsedRight" />
                  <MenuFoldOutlined v-else />
                </a-button>

                <!-- 专题应用 -->
                <a-drawer
                  id="bottomDrawer"
                  title="专题应用"
                  placement="bottom"
                  :closable="false"
                  :visible="visibleBottom"
                  :maskClosable="false"
                  :mask="false"
                  :get-container="false"
                  :wrap-style="{ position: 'absolute' }"
                >
                  <a-carousel arrows autoplay>
                    <template #prevArrow>
                      <div class="custom-slick-arrow" style="left: 10px">
                        <left-circle-outlined />
                      </div>
                    </template>
                    <template #nextArrow>
                      <div class="custom-slick-arrow" style="right: 10px">
                        <right-circle-outlined />
                      </div>
                    </template>
                    <div>
                      <a-row type="flex" justify="space-around">
                        <a-col
                          :span="4"
                          v-for="(item, index) in applicationList.slice(0, 4)"
                          :key="index"
                        >
                          <a-card hoverable :bordered="false">
                            <template #cover>
                              <img :alt="item.name" :src="item.url" />
                            </template>
                            <a-card-meta :title="item.name"> </a-card-meta>
                          </a-card>
                        </a-col>
                      </a-row>
                    </div>
                    <div>
                      <a-row type="flex" justify="space-around">
                        <a-col
                          :span="4"
                          v-for="(item, index) in applicationList.slice(4, 8)"
                          :key="index"
                        >
                          <a-card hoverable :bordered="false">
                            <template #cover>
                              <img :alt="item.name" :src="item.url" />
                            </template>
                            <a-card-meta :title="item.name"> </a-card-meta>
                          </a-card>
                        </a-col>
                      </a-row>
                    </div>
                  </a-carousel>
                </a-drawer>
                <a-button
                  id="showApplication"
                  type="primary"
                  @click="showDrawerBottom"
                >
                  <MenuUnfoldOutlined v-if="collapsedBottom" />
                  <MenuFoldOutlined v-else />
                </a-button>
              </a-layout-content>
            </a-layout>
          </a-col>
        </a-row>
        <!-- 专题应用
        <a-row>
          <a-col :span="24">
            <a-card class="application" title="专题应用" :bordered="false">
              <div
                class="appDataImg"
                v-for="(item, index) in applicationList"
                :key="index"
              >
                <img :src="item.url" />
                <p>{{ item.name }}</p>
              </div>
            </a-card>
          </a-col>
        </a-row> -->
        <!-- 相关连接 -->
        <a-row>
          <a-col :span="24">
            <a-card class="link" title="相关链接" :bordered="false">
              <a href="http://www.hubwd.com/" target="_blank"
                >湖北水院官方网站</a
              >
            </a-card>
          </a-col>
        </a-row>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons-vue";
import IconFont from "assets/js/iconfont";
import MapVisualization from "@/components/MapVisualization.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  components: {
    MapVisualization,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const openKeys = ref(["sub1"]);
    const collapsedLeft = ref(false);
    const collapsedRight = ref(false);
    const collapsedBottom = ref(false);

    const visibleRight = ref(false);
    const visibleBottom = ref(false);

    const showDrawerRight = () => {
      collapsedBottom.value = false;
      visibleBottom.value = false;
      collapsedRight.value = !collapsedRight.value;
      visibleRight.value = !visibleRight.value;
    };

    const showDrawerBottom = () => {
      collapsedRight.value = false;
      visibleRight.value = false;
      collapsedBottom.value = !collapsedBottom.value;
      visibleBottom.value = !visibleBottom.value;
    };

    // 地理数据编目列表
    const geoDataList = [
      "湖北省矢量地图",
      "2016年武汉市土地利用类型数据",
      "2017年武汉市土地利用类型数据",
      "2018年武汉市土地利用类型数据",
      "武汉市90米DEM数据产品",
      "2017年洪山区1:1万道路数据集",
      "2017年洪山区1:1万矢量地形图",
      "三层Revit商务办公楼BIM模型",
      "倾斜摄影测试数据",
    ];

    // 服务信息列表
    const serviceList = [
      {
        name: "地址名称",
        url: "/src/assets/img/2地名.png",
        discription: "地名地址服务；提供单位：…",
      },
      {
        name: "DOM影像",
        url: "/src/assets/img/2DOM影像.png",
        discription: "洪山区2014年DOM影像…",
      },
      {
        name: "DEM",
        url: "/src/assets/img/2DEM.png",
        discription: "洪山区数字高程模型…",
      },
      {
        name: "矢量地图",
        url: "/src/assets/img/2矢量.png",
        discription: "洪山区1:1万地形图矢量服务…",
      },
    ];

    // 专题应用列表
    const applicationList = [
      {
        name: "引调水篇",
        url: "/src/assets/img/0引调水篇.png",
      },
      {
        name: "泵站水库篇",
        url: "/src/assets/img/0泵站水库篇.png",
      },
      {
        name: "电站篇",
        url: "/src/assets/img/0电站篇.png",
      },
      {
        name: "重大规划篇",
        url: "/src/assets/img/0重大规划篇.png",
      },
      {
        name: "水闸渡槽篇",
        url: "/src/assets/img/0水闸渡槽篇.png",
      },
      {
        name: "堤防篇",
        url: "/src/assets/img/0堤防篇.png",
      },
      {
        name: "水生态水环境篇",
        url: "/src/assets/img/0水生态水环境篇.png",
      },
      {
        name: "总承包项目篇",
        url: "/src/assets/img/0总承包项目篇.png",
      },
    ];

    // const getGeoDataList = async () => {
    //   const url = store.state.url + "/geodatalist"
    //   const res = await axios.get(url)
    //   if (res.data.length) {
    //     geoDataList = res.data
    //   }
    // }

    // const getServiceList = async () => {
    //   const url = store.state.url + "/servicelist"
    //   const res = await axios.get(url)
    //   if (res.data.length) {
    //     for (let i = 1; i < 4; i++) {
    //       serviceList[i].serviceUrl = res.data[i - 1].data_url
    //       serviceList[i].serviceLayerName = res.data[i - 1].data_layer_name
    //       serviceList[i].serviceType = res.data[i - 1].data_type
    //     }
    //   }
    // }

    // onMounted(()=>{
    //   getGeoDataList()
    //   getServiceList()
    // })

    // const goToGeoData = (title) => {
    //   router
    //     .push({
    //       name: "geodata",
    //       params: {
    //         name: title,
    //       },
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }

    // const goToThree = (item) => {
    //   router
    //     .push({
    //       name: "three",
    //       params: {
    //         serviceUrl: item.serviceUrl,
    //         serviceLayerName: item.serviceLayerName,
    //         serviceType: item.serviceType,
    //       },
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }

    return {
      openKeys,
      collapsedLeft,
      collapsedRight,
      collapsedBottom,
      visibleRight,
      visibleBottom,
      showDrawerRight,
      showDrawerBottom,
      geoDataList,
      serviceList,
      applicationList,
    };
  },
});
</script>

<style scoped>
#rightDrawer .ant-card {
  margin-bottom: 10px;
}

:deep(.ant-card-head-title) {
  font-weight: bold;
}

:deep(.ant-drawer-title) {
  font-weight: bold;
}

:deep(#showService) {
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 24px;
  z-index: 9999;
}

:deep(#showApplication) {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  z-index: 9999;
}

:deep(#showApplication > span) {
  transform: rotate(90deg);
}

:deep(#bottomDrawer .ant-drawer-header) {
  padding: 12px 24px;
}

:deep(#bottomDrawer .ant-drawer-body) {
  padding: 12px;
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 180px;
  line-height: 180px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: rgb(77, 174, 219);
  opacity: 0.5;
  z-index: 1;
}

/*去除圆形箭头上方的方向箭头*/
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}

.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.8;
}

.ant-carousel :deep(.ant-card) {
  margin: 3px;
}

.ant-carousel :deep(.ant-card-body) {
  padding: 12px;
}

.link {
  margin: 0px 30px;
}
</style>
