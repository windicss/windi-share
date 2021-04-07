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
  <div class="grid gap-5 grid-cols-4 +sm:grid-cols-1 +md:grid-cols-2 +lg:grid-cols-3">
    <ClientOnly>
      <div
        v-for="component in allComponents"
        :key="component.id"
        class="rounded flex flex-col bg-gray-400 h-350px w-350px items-center justify-center"
      >
        <div
          id="upperpart"
          style="flex: 4;"
          class="flex h-full w-full p-2 justify-center items-center"
        >
          <IframePreview
            class="w-full h-full"
            :html="component.html"
            :css="useWindiCSS(ref(component.html), ref(component.css), props.config).generatedCSS.value"
            :dark="false"
          />
        </div>
        <div
          id="lowerpart"
          class="flex-grow bg-gray-300 flex-1 p-2 place-self-stretch self-stretch justify-self-stretch"
        >
          <div>
            uploaded by
            <span class="text-gray-500">{{ component.user_name }}</span>
            at
            <span class="text-gray-500">
              {{
                new Date(component.added_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
              }}
            </span>
          </div>
          <div class="flex mt-2 gap-2">
            <button
              :disabled="(component.user_id !== userSession?.user.id)"
              class="rounded flex bg-gray-200 flex-1 py-2 ring-gray-600 items-center justify-center select-none disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
            >
              <mdi:puzzle-edit class="mr-2" />Edit
            </button>
            <button
              :disabled="(userSession == null)"
              class="rounded flex bg-gray-200 flex-1 py-2 ring-gray-600 items-center justify-center select-none disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
            >
              <ri:heart-2-fill class="mr-2 text-red-600" />
              {{ component.likes }}
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