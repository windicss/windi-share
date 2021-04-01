<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Config } from 'windicss/types/interfaces'
import { createClient } from '@supabase/supabase-js'
import { useWindiCSS } from '~/logic'

// import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'
// const name = ref('')
// const router = useRouter()
// // const go = () => {
// //   if (name.value)
// //     router.push(`/hi/${encodeURIComponent(name.value)}`)
// // }
// const { t } = useI18n()

const props = defineProps({
  config: {
    type: Object as PropType<Config>,
  },
})

type windiComponent = {
  id: string
  html: string
  css: string
  likes: number,
  username: string,
  uploaded_at: string
}

const supabaseUrl = 'https://azrzntdriayvwuqzxvth.supabase.co'
const supabaseKey = ""
const supabase = createClient(supabaseUrl, supabaseKey)
const componentsArray = ref<windiComponent[]>([])
onMounted(async () => {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .order('likes', { ascending: false })
  if (error) console.error(error)
  data?.forEach((component: windiComponent) => {
    console.log(data)
    componentsArray.value.push(component)
  })
})

// INSERT NEW ENTRY
// const { data, error } = await supabase
//   .from('components')
//   .insert([
//     { some_column: 'someValue', other_column: 'otherValue' },
//   ])

// UPDATE ROW (LIKES)
// const { data, error } = await supabase
//   .from('components')
//   .update({ other_column: 'otherValue' })
//   .eq('some_column', 'someValue')
</script>

<template>
  <div class="grid gap-5 grid-cols-4 +sm:grid-cols-1 +md:grid-cols-2 +lg:grid-cols-3">
    <div
      v-for="component in componentsArray"
      :key="component.id"
      class="rounded flex flex-col bg-gray-400 h-350px w-350px items-center justify-center"
    >
      <div
        id="upperpart"
        style="flex: 4;"
        class="flex h-full w-full p-2 justify-center items-center"
      >
        <Iframe
          class="h-full w-full"
          :html="ref(component.html)"
          :css="ref(useWindiCSS(ref(component.html), ref(component.css), props.config).generatedCSS)"
        />
      </div>
      <div
        id="lowerpart"
        class="cursor-pointer flex-grow bg-gray-300 flex-1 p-2 place-self-stretch self-stretch justify-self-stretch hover:bg-gray-50 hover:ring"
      >
        <div>
          uploaded by
          <span class="text-gray-500">{{ component.username }}</span>
          at
          <span class="text-gray-500">
            {{
              new Date(component.uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
            }}
          </span>
        </div>
        <span class="flex items-center justify-center select-none">
          <ri:heart-2-fill class="mr-2 text-red-600" />
          {{ component.likes }}
        </span>
      </div>
    </div>
  </div>
</template>
