<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userSession } from '~/logic'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { useWindiCSS, addComponent } from '~/logic'
import type { PropType } from 'vue'
import type { Config } from 'windicss/types/interfaces'
import { Editor, IframePreview } from "@windicss/shared-components";

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
  processor,
  generatedCSS,
} = useWindiCSS(htmlCode, styleCode, props.config)
</script>

<template>
  <div class="min-h-screen text-left w-full">
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
                <div class="h-full w-full block-bg relative">
                  <div class="block-code">
                    <Editor
                      v-model="htmlCode"
                      class="h-full w-full pb-2"
                      language="html"
                      :processor="processor"
                    />
                  </div>
                  <div class="block-title">
                    <div class="flex w-full justify-between items-center">
                      <span>Template</span>
                    </div>
                  </div>
                </div>
              </Pane>
              <Pane min-size="20">
                <div class="h-full w-full block-bg relative">
                  <div class="block-code">
                    <Editor
                      v-model="styleCode"
                      class="h-full w-full pb-2"
                      language="css"
                      :processor="processor"
                    />
                  </div>
                  <div class="block-title">
                    <div class="flex w-full justify-between items-center">
                      <span>Style</span>
                    </div>
                  </div>
                </div>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane min-size="20" size="33">
            <div class="h-full">
              <IframePreview
                class="h-full w-full"
                :html="htmlCode"
                :css="generatedCSS"
                :dark="false"
              />
            </div>
          </Pane>
        </Splitpanes>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.playground {
  @apply h-75vh p-4 bg-blue-gray-100 dark:bg-dark-800;
}
.block-bg {
  @apply bg-white rounded-lg bg-opacity-90 dark:bg-dark-500;
}
.block-title {
  @apply pl-4 pr-2 pt-2 text-sm font-bold opacity-85 select-none;
}
.block-code {
  @apply absolute pt-2em inset-0 w-full h-full overflow-hidden rounded-b-lg;
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

.preview-container,
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
