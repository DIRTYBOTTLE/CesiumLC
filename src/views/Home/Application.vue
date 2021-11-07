<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>专题应用</a-breadcrumb-item>
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
                  <use xlink:href="#icon-gongcheng"></use>
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

          <a-layout style="padding: 12px 0; background: #fff">
            <a-row type="flex" justify="space-around">
              <a-col
                :span="10"
                v-for="(item, index) in applicationData"
                :key="index"
              >
                <a-card :hoverable="hoverable">
                  <template #cover>
                    <img :alt="item.name" :src="item.url" />
                  </template>
                  <a-card-meta :title="item.name">
                    <template #description>{{ item.name }}</template>
                  </a-card-meta>
                </a-card>
                <br>
              </a-col>
            </a-row>
          </a-layout>

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
import AntdSubMenu from "@/components/AntdSubMenu.vue"
import IconFont from "assets/js/iconfont"

export default defineComponent({
  components: {
    AntdSubMenu,
  },
  setup() {
    const currentPage = ref(1)
    const pageSize = ref(10)

    const value = ref("")

    const onShowSizeChange = (current, size) => {}
    const onChange = () => {}

    const openKeys = computed(() => {
      return Array.from(menuParams, (item) => item.name)
    })

    const hoverable = ref(true)

    const { menuParams, options, optionsArr, addFilter } = useAddFilter()

    const { applicationData, totalItem, onSearch } = useSearchData()

    return {
      currentPage,
      pageSize,
      value,
      onShowSizeChange,
      onChange,
      openKeys,
      hoverable,
      menuParams,
      options,
      optionsArr,
      addFilter,
      applicationData,
      totalItem,
      onSearch,
    }
  },
})

function useAddFilter() {
  const menuParams = reactive([
    {
      name: "sub1",
      title: "工程巡礼",
      types: [
        { type: "引调水篇", id: 1 },
        { type: "重大规划篇", id: 2 },
        { type: "电站篇", id: 3 },
        { type: "泵站水库划", id: 4 },
        { type: "水闸渡槽篇", id: 5 },
        { type: "堤防篇", id: 6 },
        { type: "水生态水环境篇", id: 7 },
        { type: "总承包项目篇", id: 8 },
      ],
    },
  ])

  const options = reactive({
    option: {
      types: [],
    },
  })

  const optionsArr = computed(() => {
    return options.option.types
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
    }
  }

  return { menuParams, options, optionsArr, addFilter }
}

function useSearchData() {
  const applicationData = [
    {
      name: "鄂北工程全面建设动员会",
      url: "/src/assets/img/1鄂北工程全面建设动员会.png",
    },
    {
      name: "孟楼渡槽",
      url: "/src/assets/img/1孟楼渡槽.png",
    },
    {
      name: "引江济汉工程兴隆枢纽",
      url: "/src/assets/img/1引江济汉工程兴隆枢纽.png",
    },
    {
      name: "引江济汉工程拾桥河枢纽",
      url: "/src/assets/img/1引江济汉工程拾桥河枢纽.png",
    },
    {
      name: "引徐济安工程",
      url: "/src/assets/img/1引徐济安工程.png",
    },
    {
      name: "引隆补水工程",
      url: "/src/assets/img/1引隆补水工程.png",
    },
  ]

  const totalItem = ref(6)

  const onSearch = async (searchValue) => {}

  return { applicationData, totalItem, onSearch }
}
</script>

<style scoped>
.ant-card :deep(img){
  height: 300px;
}
</style>
