<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>意见反馈</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <!-- 侧边导航栏区域 -->
        <a-layout-sider width="200" style="background: #fff">
          <a-menu mode="inline" style="height: 100%; text-align: center">
            <a-menu-item class='firstClass' key="1">
              <span>关于我们</span>
            </a-menu-item>
            <a-menu-item class='firstClass' key="2">
              <span>联系我们</span>
            </a-menu-item>
            <a-menu-item class='firstClass' key="3">
              <span>留言反馈</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <!-- 主体内容区域 -->
        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <!-- 关于我们 -->
          <a-card class='about' title="关于我们" :bordered="false">
            <div>
              <p>
                湖北省水利水电规划勘测设计院，简称“湖北水院”，建于1956年，是湖北省水利厅直属的事业单位。1984年，我院实行技术经济责任制，自收自支，企业化管理。2010年被评定为湖北省高新技术企业，2014年被确定为省水利厅直属的公益二类事业单位，2015年设立博士后科研工作站。我院是湖北省属唯一的甲级水利水电规划勘测设计单位，现拥有国家颁发的各类资质17项，其中甲级资质13项，是中国水利水电勘测设计行业AAA+信用等级单位。主要从事各种河流及区域规划、水利水电工程、防洪工程、机电排灌、河流湖泊生态修复、建筑、公路、桥梁、涵洞、供水排水、污水处理工程等规划、勘测、设计、试验、工程总承包以及工程建设监理、招标代理、技术咨询等业务。
              </p>
              <p>
                截止2020年，我院现有在职职工700余人，在编职工550人，劳务派遣153人。其中专业技术人员600余人，正高级职称101人，副高级职称167人、中级职称198人、初级职称152人。荣获全国先进工作者以及享受国务院特殊津贴、“水利部5151人才工程”部级人选、省有突出贡献中青年专家、享受省政府专项津贴等技术专家20余人。
              </p>
            </div>
          </a-card>

          <!-- 联系我们 -->
          <a-card class='contact' title="联系我们" :bordered="false">
            <p><PhoneOutlined/>&nbsp;&nbsp;电话：027-87275763</p>
            <p><PrinterOutlined/>&nbsp;&nbsp;传真：027-87301015</p>
            <p><SendOutlined/>&nbsp;&nbsp;邮编：430070</p>
            <p><MailOutlined/>&nbsp;&nbsp;邮箱：hbsy_bgs@163.com</p>
            <p>
              <EnvironmentOutlined/>&nbsp;&nbsp;地址：湖北省武汉市洪山区珞南街珞狮路290号
            </p>
          </a-card>

          <!-- 留言反馈 -->
          <a-card class='message' title="留言反馈" :bordered="false">
            <p>
              感谢使用湖北省水利水电规划勘测设计院地理数据共享平台！您在使用过程中遇到的各种问题或者对我们有什么好的建议，欢迎在此留言。
            </p>
            <a-form :model="messageForm">
              <!-- 留言区域 -->
              <a-form-item>
                <a-input
                  type="textarea"
                  v-model="messageForm.message"
                ></a-input>
              </a-form-item>
              <!-- 按钮区域 -->
              <a-form-item>
                <a-button @click="submit">提交</a-button>
                <a-button @click="reset">重置</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent } from "vue"
import { message } from "ant-design-vue"
import {
  PhoneOutlined,
  PrinterOutlined,
  SendOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons-vue"

export default defineComponent({
  components: {
    PhoneOutlined,
    PrinterOutlined,
    SendOutlined,
    MailOutlined,
    EnvironmentOutlined,
  },
  setup() {
    const messageForm = {
      message: "",
    }

    const submit = () => {
      message.success("提交成功，我们会尽快查看您的留言。")
    }

    const reset = () => {
      messageForm.message = ""
    }

    return { messageForm, submit, reset }
  },
})
</script>

<style scoped>
:deep(.ant-card-head-title) {
  font-weight: bold;
}

.firstClass {
  cursor: pointer;
}

.firstClass:hover {
  color: #e6a23c;
}

.about p {
  line-height: 200%;
}

.messageArea {
  height: 200px;
}

.message p {
  line-height: 180%;
}
</style>
