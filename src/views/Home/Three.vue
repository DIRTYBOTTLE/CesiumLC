<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>三维实景</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <div id="cesiumContainer"></div>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import initCesium from "assets/js/initCesium";
import * as Cesium from "cesium";

export default defineComponent({
  name: "three",
  setup() {
    const route = useRoute();
    const store = useStore();

    onMounted(() => {
      const viewer = initCesium(
        Cesium,
        store.state.cesiumToken,
        store.state.mapboxToken,
        "cesiumContainer"
      );

      // const canvas = viewer.scene.canvas;
      // const ellipsoid = viewer.scene.globe.ellipsoid;
      // const handler = new Cesium.ScreenSpaceEventHandler(canvas);

      // handler.setInputAction(function (movement) {
      //   const cartesian = viewer.camera.pickEllipsoid(
      //     movement.endPosition,
      //     ellipsoid
      //   );
      //   if (cartesian) {
      //     const cartographic =
      //       viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      //     const long_string = Cesium.Math.toDegrees(
      //       cartographic.longitude
      //     ).toFixed(4);
      //     const lat_string = Cesium.Math.toDegrees(
      //       cartographic.latitude
      //     ).toFixed(4);
      //     const alti_string = (
      //       viewer.camera.positionCartographic.height / 1000
      //     ).toFixed(2);
      //     const elec_string = viewer.scene.globe
      //       .getHeight(cartographic)
      //       .toFixed(4);
      //     console.log(
      //       `经度: ${long_string}; 纬度: ${lat_string}; 视角高度: ${alti_string}; 海拔高度: ${elec_string}`
      //     );
      //   }
      // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      if (route.params.serviceUrl) {
        switch (route.params.serviceType) {
          case "Vector":
            axios({
              methods: "GET",
              url: route.params.serviceUrl,
            })
              .then((res) => {
                const dataSource = Cesium.GeoJsonDataSource.load(res.data);
                viewer.dataSources.add(dataSource);
                viewer.flyTo(dataSource, 1.0);
              })
              .catch((error) => {
                console.log("error: ", error);
              });
            break;
          case "Model":
            const tileset = viewer.scene.primitives.add(
              new Cesium.Cesium3DTileset({
                url: "http://localhost:4000/geodata/3dtiles/zhanlangguan/tileset.json",
              })
            );
            tileset.readyPromise.then(function (tileset) {
              viewer.camera.viewBoundingSphere(
                tileset.boundingSphere,
                new Cesium.HeadingPitchRange(0, -0.5, 0)
              );
            });
            break;
          default:
            const provider = new Cesium.WebMapServiceImageryProvider({
              url: route.params.serviceUrl,
              layers: route.params.serviceLayerName,
              parameters: {
                service: "WMS",
                version: "1.3.0",
                request: "GetMap",
                transparent: true,
                format: "image/png",
                // crs: "EPSG:3857",
                // bbox: "13037099.5443,3406033.9804,13054221.4387,3421321.386",
              },
            });
            const imageryLayer =
              viewer.imageryLayers.addImageryProvider(provider);
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                117.1882,
                29.1838,
                40000
              ),
              orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-75.0),
              },
            });
            break;
        }
      }
    });
    return {};
  },
});
</script>

<style scoped>
#cesiumContainer {
  min-height: 700px;
  justify-content: center;
  position: relative;
}
</style>
