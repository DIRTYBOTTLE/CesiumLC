<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>数据详情</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <a-spin id="loading" size="large" :spinning="spinning" tip="加载...">
            <vaadin-split-layout id="split">
              <div style="width: 50%"><div id="cesiumViewer"></div></div>
              <div style="width: 50%"><div id="cadViewer"></div></div>
            </vaadin-split-layout>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import "@vaadin/vaadin-split-layout";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import "assets/css/style.css";
import axios from "axios";
import SuperGif from "libgif";
import initCesium from "assets/js/initCesium";
import * as Cesium from "cesium";

let cadViewer;

function launchViewer(accessToken, urn) {
  const options = {
    env: "AutodeskProduction",
    api: "derivativeV2",
    getAccessToken: function (onTokenReady) {
      onTokenReady(accessToken, 3600);
    },
  };

  Autodesk.Viewing.Initializer(options, () => {
    cadViewer = new Autodesk.Viewing.GuiViewer3D(
      document.getElementById("cadViewer"),
      { extensions: ["Autodesk.DocumentBrowser"] }
    );
    cadViewer.start();
    var documentId = "urn:" + urn;
    Autodesk.Viewing.Document.load(
      documentId,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  cadViewer.loadDocumentNode(doc, viewables).then((i) => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
  console.error(
    "onDocumentLoadFailure() - errorCode:" +
      viewerErrorCode +
      "\n- errorMessage:" +
      viewerErrorMsg
  );
}

function loadGif(url, viewer) {
  const gifDiv = document.createElement("div");
  const gifImg = document.createElement("img");

  // gif库需要img标签配置下面两个属性
  gifImg.setAttribute("rel:animated_src", url);
  gifImg.setAttribute("rel:auto_play", "0");

  gifDiv.appendChild(gifImg);

  // 新建gif实例
  const rub = new SuperGif({ gif: gifImg });

  rub.load(function () {
    const img_list = [];

    // 获取 gif 图的每一帧图片
    for (let i = 1; i <= rub.get_length(); i++) {
      // 遍历gif实例的每一帧
      rub.move_to(i);
      img_list.push(rub.get_canvas().toDataURL());
    }

    let flag = 0;
    let len = img_list.length;
    // 创建图片实体
    let gif_entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(114.2833, 30.6349),
      billboard: {
        image: img_list[0], // default: undefined
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
        height: 32,
        width: 32,
      },
    });

    // 循环更新 billboard
    setInterval(() => {
      flag++;
      if (flag >= len) {
        flag = 0;
      }
      gif_entity.billboard.image = img_list[flag];
    }, 1000 / 30);
  });
}

export default defineComponent({
  name: "cad-viewer",
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = ref(false);
    const url = "/src/assets/down-arrow_bg.gif";
    onMounted(async () => {
      const viewer = initCesium(
        Cesium,
        store.state.cesiumToken,
        store.state.mapboxToken,
        "cesiumViewer"
      );

      // const enetity = viewer.entities.add({
      //   name: "位置",
      //   position: Cesium.Cartesian3.fromDegrees(114.2833, 30.6349),
      //   billboard: {
      //     image: "/src/assets/pos.svg",
      //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //     scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
      //     height: 32,
      //     width: 32,
      //   },
      // });

      loadGif(url, viewer);

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114.2833, 30.5849, 8000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-60.0),
        },
      });

      const urn = route.params.urn;
      const accessToken = route.params.access_token;
      const res = await axios({
        method: "get",
        url:
          "https://developer.api.autodesk.com/modelderivative/v2/designdata/" +
          urn +
          "/manifest",
        headers: { Authorization: "Bearer " + accessToken },
      });
      if (res.data.progress === "success" || res.data.progress === "complete") {
        launchViewer(accessToken, urn);
      } else {
        message.success("转换工作正在进行: " + res.progress + ". 请稍等.");
      }
    });
    return {
      spinning,
    };
  },
});
</script>

<style scoped>
#cesiumViewer {
  height: 700px;
  min-height: 700px;
  justify-content: center;
  position: relative;
}

#cadViewer {
  min-height: 700px;
  justify-content: center;
  position: relative;
}

:deep(#loading) {
  max-height: 700px;
}

/* :deep(#cadViewer .canvas-wrap canvas) {
  width: 100% !important;
  height: auto !important;
} */
</style>
