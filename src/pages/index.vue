<script setup lang="ts">
import { defineProps, ref, onMounted, computed } from 'vue'
import type { PropType } from 'vue'
import type { Config } from 'windicss/types/interfaces'
import { userSession, useWindiCSS, fetchComponents, allComponents, addStar, myStars, fetchStars } from '~/logic'
import { IframePreview } from "@windicss/shared-components";

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const props = defineProps({
  config: {
    type: Object as PropType<Config>,
  },
})

let pickedOrder = ref("stars")
let sortedComponent = computed(() => allComponents.value.sort((a, b) => {
  if (pickedOrder.value == "added_at") {
    return b.added_at.localeCompare(a.added_at)
  } else {
    if (b.stars === a.stars) {
      return b.added_at.localeCompare(a.added_at)
    }
    return b.stars - a.stars
  }
}))
onMounted(async () => {
  // if (userSession.value?.user.id) {
  //   await fetchStars(userSession.value?.user.id)
  // }
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
  <div class="mb-2 text-right text-gray-600">
    <label>
      <input type="radio" name="order" value="added_at" v-model="pickedOrder" />
      by date
    </label>
    <label>
      <input type="radio" name="order" value="stars" v-model="pickedOrder" />
      by stars
    </label>
  </div>
  <div v-if="sortedComponent.length < 1" class="w-full h-85vh grid place-content-center">
    <ant-design:loading-3-quarters-outlined class="animate-spin" />
    <span>Loading</span>
  </div>
  <ClientOnly>
    <div class="grid gap-5 grid-cols-3">
      <div
        v-for="component in sortedComponent"
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
              class="rounded-md flex bg-gray-100 flex-1 shadow py-2 ring-gray-600 items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
              :href="'/editor/' + component.id"
            >
              <template v-if="(component.user_id !== userSession?.user.id)">
                <mdi:code-tags class="mr-2" />Open code
              </template>
              <template v-else>
                <mdi:puzzle-edit class="mr-2" />Edit
              </template>
            </a>

            <button
              :disabled="(userSession == null || myStars.map(star => star.component_id).indexOf(component.id) !== -1)"
              class="rounded-md flex bg-gray-100 disabled:bg-gray-200 flex-1 py-2 ring-gray-600 items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-60 not-disabled:hover:bg-gray-300 not-disabled:hover:ring"
              @click="(_) => addStar(component.id, userSession?.user.id)"
            >
              <mdi:star class="mr-2 text-yellow-600" />
              {{ component.stars }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style>
.preview-container,
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
