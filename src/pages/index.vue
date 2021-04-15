<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Config } from 'windicss/types/interfaces'
import { userSession, useWindiCSS, fetchComponents, allComponents } from '~/logic'
import { IframePreview } from "@windicss/shared-components";

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const props = defineProps({
  config: {
    type: Object as PropType<Config>,
  },
})

onMounted(async () => {
  await fetchComponents()
})

</script>

<template>
  <div v-if="userSession !== null" class="flex mb-2 w-full items-center justify-center">
    <router-link
      to="/editor"
      class="rounded-full flex bg-gray-200 h-50px shadow px-6 justify-center items-center"
    >
      <mdi-code-braces-box />Open editor
    </router-link>
  </div>
  <div class="grid gap-5 grid-cols-3">
    <ClientOnly>
      <div
        v-for="component in allComponents"
        :key="component.id"
        class="flex flex-col bg-opacity-10 bg-gray-400 rounded-2xl min-h-430px items-center justify-center"
      >
        <div
          id="upperpart"
          style="flex: 4;"
          class="flex h-full w-full p-4 justify-center items-center overflow-hidden"
        >
          <IframePreview
            :html="component.html"
            :css="useWindiCSS(ref(component.html), ref(component.css), props.config).generatedCSS.value"
            :dark="false"
          />
        </div>
        <div
          id="lowerpart"
          class="rounded-lg flex-grow bg-gray-400 bg-opacity-10 flex-1 m-2 px-3 pt-1 pb-2 place-self-stretch self-stretch justify-self-stretch"
        >
          <div class="flex flex-col text-sm">
            <span class="text-sm text-center text-true-gray-400">{{ component.id }}</span>
            <div class="flex flex-row justify-between">
              <div class="flex flex-row gap-1 items-center justify-start">
                <mdi:account class="text-true-gray-600" />
                <span class="text-true-gray-900">{{ component.user_name }}</span>
              </div>
              <div class="flex flex-row gap-1 items-center justify-start">
                <mdi:calendar-clock class="text-true-gray-600" />
                <span class="text-true-gray-900">
                  {{
                    new Date(component.added_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex mt-2 gap-2">
            <a
              v-if="(component.user_id !== userSession?.user.id)"
              class="rounded-md flex bg-gray-100 flex-1 shadow py-2 ring-gray-600 items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
              :href="'/editor/' + component.id"
            >
              <mdi:code-tags class="mr-2" />Open code
            </a>
            <a
              v-else
              class="rounded-md flex bg-gray-200 flex-1 py-2 ring-gray-600 items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
            >
              <mdi:puzzle-edit class="mr-2" />Edit
            </a>
            <button
              :disabled="(userSession == null)"
              class="rounded-md flex bg-gray-200 flex-1 py-2 ring-gray-600 items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
            >
              <mdi:star class="mr-2 text-yellow-600" />
              {{ component.stars }}
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.preview-container,
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>