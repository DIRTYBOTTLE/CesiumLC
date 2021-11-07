<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import { defineComponent, onMounted } from "vue"
import { useRoute } from "vue-router"

import * as Cesium from "cesium"

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTIyOGI5My1jMGZlLTQ2NTUtYjEyYS0zMmU0MzBmNGE5YmQiLCJpZCI6MzQ1NzAsInNjb3BlcyI6WyJsZ24iLCJwciIsImFjdyIsImFzbCIsImFzciIsImFzdyIsImFzcyIsImdjIiwibHIiLCJsdyIsInRyIiwidHciLCJ1c2ciXSwiaWF0IjoxNjI3NjE2NjA1LCJleHAiOjE2MjgyMjE0MDV9.r9_7MaT91gSJtJEh3NOXs_T0zVG06ojKgJN6rRYSmro"

export default defineComponent({
  setup() {
    const route = useRoute()
    onMounted(() => {
      console.log("url: ", route.params.serviceUrl)
      console.log("layerName: ", route.params.serviceLayerName)
      console.log("type: ", route.params.serviceType)

      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTIyOGI5My1jMGZlLTQ2NTUtYjEyYS0zMmU0MzBmNGE5YmQiLCJpZCI6MzQ1NzAsInNjb3BlcyI6WyJsZ24iLCJwciIsImFjdyIsImFzbCIsImFzciIsImFzdyIsImFzcyIsImdjIiwibHIiLCJsdyIsInRyIiwidHciLCJ1c2ciXSwiaWF0IjoxNjI3NjE2NjA1LCJleHAiOjE2MjgyMjE0MDV9.r9_7MaT91gSJtJEh3NOXs_T0zVG06ojKgJN6rRYSmro"

      const viewer = new Cesium.Viewer("cesiumContainer")

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114.4, 30.54, 80000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      })

      if (route.params.serviceType === "Vector") {
        $.ajax({
          url: route.params.serviceUrl,
          cache: false,
          async: true,
          success: function (data) {
            var datasource = Cesium.GeoJsonDataSource.load(data)
            viewer.dataSources.add(datasource)
          },
          error: function (data) {
            console.log("error")
          },
        })
      } else {
        const provider = new Cesium.WebMapServiceImageryProvider({
          url: route.params.serviceUrl,
          layers: route.params.serviceLayerName,
          parameters: {
            service: "WMS",
            format: "image/png",
            transparent: true,
          },
        })
        viewer.imageryLayers.addImageryProvider(provider)
      }
    })
    return { route }
  },
})
</script>
