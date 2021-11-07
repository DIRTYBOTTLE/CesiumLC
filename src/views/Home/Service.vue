<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>服务资源</a-breadcrumb-item>
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
                  <use xlink:href="#icon-wangluofuwu"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[1]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuti"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[2]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jizuobiao"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[3]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-touyingshezhi"></use>
                </svg>
              </template>
            </antd-sub-menu>

            <antd-sub-menu :menuParams="menuParams[4]" @addFilter="addFilter">
              <template #icon>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-quanxian"></use>
                </svg>
              </template>
            </antd-sub-menu>
          </a-menu>
        </a-layout-sider>

        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
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
            class="service-list"
            :loading="loading"
            item-layout="horizontal"
            :data-source="serviceList.service.slice(slice.start, slice.end)"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a
                    class="link"
                    :url="item.url"
                    :layerName="item.layerName"
                    :type="item.type"
                    @click="naviToMap"
                    >服务详情</a
                  >
                </template>
                <a-list-item-meta :description="item.coord + '; ' + item.time">
                  <template #title>
                    <a>{{ item.title.split(".")[0] }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar shape="square" size="large" :src="item.imgSrc" />
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
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, ref, reactive, computed } from "vue"
import IconFont from "assets/js/iconfont"
import AntdSubMenu from "@/components/AntdSubMenu.vue"
import { useStore } from "vuex"

export default defineComponent({
  components: {
    AntdSubMenu,
  },
  setup() {
    const store = useStore()
    const currentPage = ref(1)
    const pageSize = ref(10)
    const value = ref("")

    const slice = computed(() => {
      return {
        start: (currentPage.value - 1) * pageSize.value,
        end: (currentPage.value - 1) * pageSize.value + pageSize.value,
      }
    })

    const openKeys = computed(() => {
      return Array.from(menuParams, (item) => item.name)
    })

    const { menuParams, options, optionsArr, addFilter } = useAddFilter()

    const { loading, serviceList, totalItem, onSearch } = useSearchData(
      store,
      value,
      options
    )

    return {
      currentPage,
      pageSize,
      value,
      slice,
      openKeys,
      menuParams,
      options,
      optionsArr,
      addFilter,
      loading,
      serviceList,
      totalItem,
      onSearch,
    }
  },
})

function useAddFilter() {
  const menuParams = reactive([
    {
      name: "sub1",
      title: "服务类型",
      types: [
        { type: "OGC WMS", id: 1 },
        { type: "OGC WMTS", id: 2 },
        { type: "OGC WFS", id: 3 },
        { type: "OGC WCS", id: 4 },
      ],
    },
    {
      name: "sub2",
      title: "主题分类",
      types: [
        { type: "基础地理框架数据", id: 5 },
        { type: "机关单位", id: 6 },
        { type: "规划建设", id: 7 },
      ],
    },
    {
      name: "sub3",
      title: "坐标系",
      types: [
        { type: "CGCS2000", id: 8 },
        { type: "WGS84", id: 9 },
      ],
    },
    {
      name: "sub4",
      title: "投影类型",
      types: [
        { type: "高斯投影", id: 10 },
        { type: "墨卡托投影", id: 11 },
      ],
    },
    {
      name: "sub5",
      title: "使用权限",
      types: [
        { type: "公开", id: 12 },
        { type: "授权", id: 13 },
      ],
    },
  ])

  const options = reactive({
    option: {
      types: [],
      topic: [],
      coord: [],
      proj: [],
      authority: [],
    },
  })

  const optionsArr = computed(() => {
    return options.option.types.concat(
      options.option.topic,
      options.option.coord,
      options.option.proj,
      options.option.authority
    )
  })

  const addFilter = (filter, key) => {
    let existIndex
    switch (key) {
      case "sub1":
        existIndex = options.option.types.findIndex((value) => value === filter)
        if (existIndex === -1) {
          options.option.types.push(filter)
        } else {
          options.option.types.splice(existIndex, 1)
        }
        break
      case "sub2":
        existIndex = options.option.topic.findIndex((value) => value === filter)
        if (existIndex === -1) {
          options.option.topic.push(filter)
        } else {
          options.option.topic.splice(existIndex, 1)
        }
        break
      case "sub3":
        existIndex = options.option.coord.findIndex((value) => value === filter)
        if (existIndex === -1) {
          options.option.coord.push(filter)
        } else {
          options.option.coord.splice(existIndex, 1)
        }
        break
      case "sub4":
        existIndex = options.option.proj.findIndex((value) => value === filter)
        if (existIndex === -1) {
          options.option.proj.push(filter)
        } else {
          options.option.proj.splice(existIndex, 1)
        }
        break
      case "sub5":
        existIndex = options.option.authority.findIndex(
          (value) => value === filter
        )
        if (existIndex === -1) {
          options.option.authority.push(filter)
        } else {
          options.option.authority.splice(existIndex, 1)
        }
        break
    }
  }

  return { menuParams, options, optionsArr, addFilter }
}

function useSearchData(store, value, options) {
  const loading = ref(false)

  const serviceList = reactive({
    service: store.state.service,
  })

  const totalItem = ref()

  const onSearch = async (searchValue) => {
    loading.value = true
    value.value = ""
    store.state.service = []

    const url = store.state.baseUrl + "/service"
    const params = {
      params: {
        name: searchValue,
        typesFilter: options.option.types,
        dateFilter: options.option.date,
        scaleFilter: options.option.scale,
      },
    }

    const res = await axios.get(url, params)
    if (res.data.length) {
      store.state.service = res.data.map((item) => {
        return {
          title: item.data_name,
          coord: item.data_coord,
          time: `更新时间:${item.data_time}`,
          url: item.data_url,
          type: item.data_type,
          imgSrc: store.state.imgSrc.find((img) => img.name === item.data_type)
            .src,
          layerName: item.data_layer_name,
        }
      })
      serviceList.service = store.state.service
      totalItem.value = res.data.length
      loading.value = false
    }
  }

  return { loading, totalItem, serviceList, onSearch }
}
</script>

<style scoped>
.ant-list :deep(a.link) {
  color: #40a9ff;
}
</style>
