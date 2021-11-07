<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>个人中心</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <!-- 侧边导航栏区域 -->
        <a-layout-sider width="200" style="background: #fff">
          <a-menu mode="inline" style="height: 100%; text-align: center">
            <a-menu-item class="firstClass" key="1">
              <span>个人信息</span>
            </a-menu-item>
            <a-menu-item class="firstClass" key="2">
              <span>我的上传</span>
            </a-menu-item>
            <a-menu-item class="firstClass" key="3">
              <span>我的下载</span>
            </a-menu-item>
            <a-menu-item class="firstClass" key="4">
              <span>我的审核</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <!-- 主体内容区域 -->
        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <!-- 个人信息 -->
          <a-card class="about" title="个人信息" :bordered="false"> </a-card>
          <!-- 我的上传 -->
          <a-card class="about" title="我的上传" :bordered="false">
            <a-upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              list-type="picture"
              v-model:file-list="fileList"
            >
              <a-button @click="uploadClick">
                <upload-outlined></upload-outlined>
                上传数据
              </a-button>
            </a-upload>
          </a-card>
          <!-- 我的下载 -->
          <a-card class="about" title="我的下载" :bordered="false"> </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from "vue"
import { message } from "ant-design-vue"
import { UploadOutlined } from "@ant-design/icons-vue"

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const fileList = ref([
      {
        uid: "-1",
        name: "xxx.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        thumbUrl:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
      {
        uid: "-2",
        name: "yyy.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        thumbUrl:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ])

    const uploadClick = () => {
      message.success("上传成功!")
    }
    return { fileList, uploadClick }
  },
})
</script>

<style scoped>
:deep(.ant-card-head-title) {
  font-weight: bold;
}
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline :deep(.ant-upload-animate-enter) {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline :deep(.ant-upload-animate-leave) {
  animation-name: uploadAnimateInlineOut;
}
</style>
