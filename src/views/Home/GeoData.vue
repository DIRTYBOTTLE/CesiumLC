<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>地理数据编目</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
            :openKeys="openKeys"
            :multiple="true"
            style="height: 100%"
          >
            <antd-sub-menu :menuParams="menuParams[0]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-leixing"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[1]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-riqi"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[2]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-biaochi"></use>
                </svg>
              </template>
            </antd-sub-menu>
          </a-menu>
        </a-layout-sider>

        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <a-spin :spinning="spinning" size="large" tip="数据加载中...">
            <a-input-search
              v-model:value="value"
              placeholder="请输入关键词进行搜索"
              enter-button="搜索"
              size="large"
              @search="onSearch"
            />

            <a-select
              mode="tags"
              placeholder="请选择"
              v-model:value="optionsArr"
              style="width: 100%"
              :open="false"
              :bordered="false"
              disabled
            >
            </a-select>

            <a-list
              class="geo-data-list"
              :loading="loading"
              item-layout="horizontal"
              :data-source="dataList.data.slice(slice.start, slice.end)"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <a class="link" @click="naviToMap(item)">数据详情</a>
                    <a
                      v-if="allowFlag"
                      class="link"
                      :dataTitle="item.title"
                      @click="download"
                      >下载</a
                    >
                  </template>
                  <a-list-item-meta
                    :description="item.coord + '; ' + item.time"
                  >
                    <template #title>
                      <a>{{ item.title.split(".")[0] }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar
                        shape="square"
                        size="large"
                        :src="item.imgSrc"
                      />
                    </template>
                  </a-list-item-meta>
                  <!-- <div>content</div> -->
                </a-list-item>
              </template>
            </a-list>

            <a-pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="totalItem"
              :show-total="(total) => `共 ${total} 条`"
              show-size-changer
              @showSizeChange="onShowSizeChange"
              show-quick-jumper
              @change="onChange"
            />
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, h } from "vue";
import { Modal, message } from "ant-design-vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
import IconFont from "assets/js/iconfont";
// import导入组件时不加 { }
import AntdSubMenu from "@/components/AntdSubMenu.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";

export default defineComponent({
  components: {
    AntdSubMenu,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const spinning = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    //输入框文本值
    const value = ref("");
    //根据用户类别控制是否展示“下载”按钮
    const allowFlag = Cookies.get("usertype") === "administrator";

    //截取返回数据中当前分页范围内的列表项
    const slice = computed(() => {
      return {
        start: (currentPage.value - 1) * pageSize.value,
        end: (currentPage.value - 1) * pageSize.value + pageSize.value,
      };
    });

    const filesArr = ["089057.e00.dwg", "3537.5-575.0.zip", "chuanzha.rvt"];

    let index = 0;

    const onShowSizeChange = (current, size) => {};

    const onChange = () => {};

    watch(currentPage, (newVal, oldValue) => {});

    watch(pageSize, (newVal, oldValue) => {});

    const openKeys = computed(() => {
      return Array.from(menuParams, (item) => item.name);
    });

    const naviToMap = async (item) => {
      if (item.title.split(".")[1] === "dwg") {
        spinning.value = true;
        const res = await axios({
          method: "post",
          url: store.state.baseUrl + "/api/forge",
          data: {
            fileName: filesArr[index++ % 3],
          },
        });
        spinning.value = false;
        if (res.status === 200) {
          router
            .push({
              name: "cadviewer",
              params: {
                access_token: res.data.access_token,
                urn: res.data.urn,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        router
          .push({
            name: "three",
            params: {
              serviceUrl: item.url,
              serviceLayerName: item.layerName,
              serviceType: item.type,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const download = (event) => {
      const dataTitle = event.target.getAttribute("dataTitle");
      Modal.confirm({
        title: "确认下载?",
        icon: h(DownloadOutlined),
        centered: true,
        content: h("p", [
          h("span", "您选择的数据集是: "),
          h("b", dataTitle),
          h("span", "，是否确认下载？"),
        ]),
        onOk() {
          return new Promise((resolve, reject) => {
            const url = store.state.baseUrl + "/download";
            const params = {
              fileName: dataTitle,
            };
            axios
              .post(url, params)
              .then((res) => {
                if (res.status === 200) {
                  message.success("开始下载!");
                  location.href = `${url}?fileName=${dataTitle}`;
                } else {
                  message.error("文件未找到!");
                }
                resolve();
              })
              .catch((error) => {
                message.error("请求出错，请重试!");
              });
          });
        },
        onCancel() {},
      });
    };

    const { menuParams, options, optionsArr, addFilter } = useAddFilter();
    const { loading, dataList, totalItem, onSearch } = useSearchData(
      store,
      value,
      options
    );

    return {
      spinning,
      currentPage,
      pageSize,
      value,
      allowFlag,
      slice,
      onShowSizeChange,
      onChange,
      openKeys,
      naviToMap,
      download,
      menuParams,
      options,
      optionsArr,
      addFilter,
      loading,
      dataList,
      totalItem,
      onSearch,
    };
  },
});

function useAddFilter() {
  const menuParams = reactive([
    {
      name: "sub1",
      title: "数据集类型",
      types: [
        { type: "DEM", id: 1 },
        { type: "DOM", id: 2 },
        { type: "Vector", id: 3 },
        { type: "Model", id: 4 },
      ],
    },
    {
      name: "sub2",
      title: "时间",
      types: [
        { type: "2020年以后", id: 5 },
        { type: "2019年", id: 6 },
        { type: "2017年", id: 7 },
        { type: "2017年以前", id: 8 },
      ],
    },
    {
      name: "sub3",
      title: "比例尺",
      types: [
        { type: "1:10000", id: 9 },
        { type: "1:5000", id: 10 },
        { type: "1:2000", id: 11 },
        { type: "> 1:2000", id: 12 },
      ],
    },
  ]);

  const options = reactive({
    option: {
      types: [],
      date: [],
      scale: [],
    },
  });

  const optionsArr = computed(() => {
    return options.option.types.concat(
      options.option.date,
      options.option.scale
    );
  });

  const addFilter = (filter, key) => {
    let existIndex;
    switch (key) {
      case "sub1":
        existIndex = options.option.types.findIndex(
          (value) => value === filter
        );
        if (existIndex === -1) {
          options.option.types.push(filter);
        } else {
          options.option.types.splice(existIndex, 1);
        }
        break;
      case "sub2":
        existIndex = options.option.date.findIndex((value) => value === filter);
        if (existIndex === -1) {
          options.option.date.push(filter);
        } else {
          options.option.date.splice(existIndex, 1);
        }
        break;
      case "sub3":
        existIndex = options.option.scale.findIndex(
          (value) => value === filter
        );
        if (existIndex === -1) {
          options.option.scale.push(filter);
        } else {
          options.option.scale.splice(existIndex, 1);
        }
        break;
    }
  };

  return { menuParams, options, optionsArr, addFilter };
}

function useSearchData(store, value, options) {
  const loading = ref(false);

  const dataList = reactive({
    data: store.state.data,
  });

  const totalItem = ref();

  const onSearch = async (searchValue) => {
    loading.value = true;
    value.value = "";
    store.state.data = [];

    const url = store.state.baseUrl + "/data";
    const params = {
      params: {
        name: searchValue,
        typesFilter: options.option.types,
        dateFilter: options.option.date,
        scaleFilter: options.option.scale,
      },
    };

    const res = await axios.get(url, params);
    if (res.data.length) {
      store.state.data = res.data.map((item) => {
        return {
          title: item.data_name,
          coord: item.data_coord,
          time: `更新时间:${item.data_time}`,
          url: item.data_url,
          type: item.data_type,
          imgSrc: store.state.imgSrc.find((img) => img.name === item.data_type)
            .src,
          layerName: item.data_layer_name,
        };
      });
      dataList.data = store.state.data;
      totalItem.value = res.data.length;
      loading.value = false;
    } else {
      store.state.data = [];
      dataList.data = store.state.data;
      totalItem.value = 0;
      loading.value = false;
    }
  };

  return { loading, totalItem, dataList, onSearch };
}
</script>

<style scoped>
.ant-list :deep(a.link) {
  color: #40a9ff;
}
</style>
