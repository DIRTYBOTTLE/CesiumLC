<template>
  <div id="map"></div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { Scene } from "@antv/l7";
import { DrillDownLayer } from "@antv/l7-district";
import { Mapbox } from "@antv/l7-maps";

export default defineComponent({
  name: "map-visualization",
  setup() {
    const colors = [
      "#eaac8b",
      "#e56b6f",
      "#b56576",
      "#6d597a",
      "#355070",
      "#f2cc8f",
      "#81b29a",
      "#3d405b",
      "#e07a5f",
      "#f4f1de",
    ];

    onMounted(() => {
      const scene = new Scene({
        id: "map",
        logoVisible: false,
        map: new Mapbox({
          style: "mapbox://styles/illusiondream/cksr4guu51vlf18ljr9yv68nm",
          center: [113.30672713271815, 31.230039009583635],
          pitch: 0,
          zoom: 6.26002082669568,
          minZoom: 0, //解决mapbox地图缩放时中心点偏移的问题
          maxZoom: 8,
          token:
            "pk.eyJ1IjoiaWxsdXNpb25kcmVhbSIsImEiOiJjazQ1Nm9jZzkwNmE3M2tuNmpqajRjc2lxIn0.4yZ7cB1IiaW5w1Cbn3ZXiA",
        }),
      });
      let provinceLayer;
      scene.on("loaded", () => {
        provinceLayer = new DrillDownLayer(scene, {
          data: [],
          viewStart: "Province",
          viewEnd: "County",
          drillDownTriggerEvent: "dblclick",
          fill: {
            color: {
              field: "NAME_CHN",
              values: colors,
            },
          },
          autoFit: true,
          city: {
            adcode: [420000],
            autoFit: true,
          },
          popup: {
            enable: true,
            Html: (props) => {
              return `<span>${props.NAME_CHN}</span>`;
            },
          },
        });
        //console.log(provinceLayer);
      });
    });
  },
});
</script>

<style scoped>
#map {
  height: 700px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

:deep(.l7-scene > canvas) {
  width: 100% !important;
}

:deep(.mapboxgl-canvas) {
  width: 100% !important;
}
</style>
