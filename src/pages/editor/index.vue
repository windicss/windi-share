<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userSession } from '~/logic'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { useWindiCSS, addComponent } from '~/logic'
import type { PropType } from 'vue'
import type { Config } from 'windicss/types/interfaces'

const router = useRouter()
const go = () => {
  router.push(`/`)
}
const props = defineProps({
  config: {
    type: Object as PropType<Config>,
  },
})

onMounted(() => {
  if (userSession.value == null) {
    go()
  } else {
    console.log(userSession)
  }
})
let htmlCode = ref("")
let styleCode = ref("")
const {
  generatedCSS,
} = useWindiCSS(htmlCode, styleCode, props.config)
</script>

<template>
  <div v-if="userSession !== null" class="flex mb-2 w-full items-center justify-center">
    <button
      v-if="userSession && userSession.user && userSession.user.id != undefined"
      @click="addComponent({ html: htmlCode, css: styleCode, user_id: userSession?.user.id, user_name: userSession?.user.user_metadata.full_name })"
      class="rounded-full flex bg-gray-200 h-50px shadow px-6 justify-center items-center"
    >
      <mdi:progress-upload />Upload new component
    </button>
  </div>
  <div class="playground">
    <ClientOnly>
      <Splitpanes :horizontal="false" class="h-full w-full default-theme">
        <Pane min-size="20" size="66">
          <Splitpanes :horizontal="true">
            <Pane min-size="20">
              <input type="text" v-model="htmlCode" />
            </Pane>
            <Pane min-size="20">
              <input type="text" v-model="styleCode" />
            </Pane>
          </Splitpanes>
        </Pane>
        <Pane min-size="20" size="33">
          <Iframe class="h-full w-full" :html="htmlCode" :css="generatedCSS" />
        </Pane>
      </Splitpanes>
    </ClientOnly>
  </div>
</template>

<style>
.playground {
  @apply h-140vh p-4 bg-blue-gray-100 dark:bg-dark-800;
}
.splitpanes.default-theme .splitpanes__pane {
  @apply bg-transparent;
}
.splitpanes.default-theme .splitpanes__splitter {
  @apply bg-transparent border-transparent min-w-4 min-h-4;
  &:before,
  &:after {
    @apply bg-gray-300 dark:bg-dark-300;
  }
  &:hover:before,
  &:hover:after {
    @apply bg-gray-400 dark:bg-dark-100;
  }
}
</style>