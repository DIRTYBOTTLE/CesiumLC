const initCesium = function (Cesium, cesiumToken, mapboxToken, container) {
    Cesium.Ion.defaultAccessToken = cesiumToken
    const mapboxStyleLayer = new Cesium.MapboxStyleImageryProvider({
        url: "https://api.mapbox.com/styles/v1/",
        styleId: "cksr4guu51vlf18ljr9yv68nm",
        username: "illusiondream",
        accessToken: mapboxToken,
    })

    const viewer = new Cesium.Viewer(container, {
        geocoder: false, //位置查找工具
        homeButton: false, //复位按钮
        sceneModePicker: false, //模式切换
        baseLayerPicker: false, //图层选择
        navigationHelpButton: false, //帮助按钮
        animation: false, //速度控制
        timeline: false, //时间轴
        fullscreenButton: false, //全屏
        infoBox: false, //关闭infobox
        shouldAnimate: true,
        imageryProvider: mapboxStyleLayer,
        terrainProvider: Cesium.createWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true,
        }),
    })

    viewer._cesiumWidget._creditContainer.style.display = "none" // 隐藏版权信息
    viewer.scene.skyAtmosphere.show = false // 隐藏大气层
    // 显示帧率插件
    viewer.scene.debugShowFramesPerSecond = true;

    // viewer.scene.postProcessStages.fxaa.enabled = false

    viewer._cesiumWidget._supportsImageRenderingPixelated =
        Cesium.FeatureDetection.supportsImageRenderingPixelated()

    viewer._cesiumWidget._forceResize = true
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        var vtxf_dpr = window.devicePixelRatio
        // 适度降低分辨率
        while (vtxf_dpr >= 2.0) {
            vtxf_dpr /= 2.0
        }
        viewer.resolutionScale = vtxf_dpr
    }

    return viewer
}

export default initCesium;