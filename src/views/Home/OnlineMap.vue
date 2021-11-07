<template>
  <a-layout>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>在线地图</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-content :style="{ padding: '0 24px', minHeight: '420px' }">
          <div id="map"></div>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, onMounted } from "vue"
import { Scene, HeatmapLayer } from "@antv/l7"
import { GaodeMap } from "@antv/l7-maps"

export default defineComponent({
  setup() {
    onMounted(() => {
      const scene = new Scene({
        id: "map",
        logoVisible: false,
        map: new GaodeMap({
          style: "light",
          pitch: 0,
          center: [104.995156, 31.450658],
          zoom: 3.79,
        }),
      })
      scene.on("loaded", () => {
        fetch(
          "https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json"
        )
          .then((res) => res.json())
          .then((data) => {
            const layer = new HeatmapLayer({})
              .source(data, {
                transforms: [
                  {
                    type: "hexagon",
                    size: 90000,
                    field: "capacity",
                    method: "sum",
                  },
                ],
              })
              .shape("hexagon")
              .style({
                coverage: 0.9,
                angle: 0,
                opacity: 1.0,
              })
              .color(
                "sum",
                [
                  "#3F4BBA",
                  "#3F4BBA",
                  "#3F4BBA",
                  "#3F4BBA",
                  "#3C73DA",
                  "#3C73DA",
                  "#3C73DA",
                  "#0F62FF",
                  "#0F62FF",
                  "#30B2E9",
                  "#30B2E9",
                  "#40C4CE",
                ].reverse()
              )
            scene.addLayer(layer)
          })
      })
    })
  },
})
</script>

<style scoped>
#map {
    min-height: 700px;
    justify-content: center;
    position: relative;
}
</style>
