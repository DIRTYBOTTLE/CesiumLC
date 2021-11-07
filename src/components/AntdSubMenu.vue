<template>
  <a-sub-menu :key="menuParams.name">
    <template #title>
      <span>
        <slot name="icon"></slot>
        &nbsp;&nbsp;<b>{{ menuParams.title }}</b>
      </span>
    </template>
    <a-menu-item
      v-for="item in menuParams.types"
      :key="item.id"
      @click="triggleFilter"
    >
      {{ item.type }}
    </a-menu-item>
  </a-sub-menu>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "antd-sub-menu",

  props: {
    menuParams: Object,
  },

  emits: ["addFilter"],

  setup(props, context) {
    const triggleFilter = (event) => {
      const filter = event.target.innerText
      context.emit("addFilter", filter, props.menuParams.name)
    }

    return { triggleFilter }
  },
})
</script>
