
<script lang="ts">
import { userSession, handleLogout, handleOAuthLogin } from '~/logic'
export default {
  setup() {

    return { userSession, handleLogout, handleOAuthLogin }
  }
}
// LOGIN & LOGOUT
// secret id 14f2f11e64315c71f33537ecfabd65c82cb69750
// const login = async () => {
//   const result = await props.supabase.auth.signIn({
//     provider: 'github',
//   })
//   // if (error) console.error(error)
//   console.log(result)
// }
// const logout = async () => {
//   let { error } = await props.supabase.auth.signOut()
//   if (error) console.error(error)
// }
//
</script>

<template>
  <nav class="container flex flex-row w-full py-4 justify-between">
    <RouterLink class="flex" to="/">
      <Logo class="m-auto -ml-1 text-2xl" />
      <div class="my-auto ml-2">
        <div class="text-xl">
          Windi Share Library
          <sup class="text-xs opacity-50 italic">Beta</sup>
        </div>
      </div>
    </RouterLink>

    <div v-if="userSession === null">
      <button
        @click="handleOAuthLogin('github')"
        class="rounded bg-gray-900 p-4 text-gray-50"
      >GitHub Login</button>
    </div>

    <div v-else class="flex flex-row gap-3 justify-center items-center">
      {{ userSession.user.user_metadata.full_name }}
      <button
        @click="handleLogout"
        class="rounded bg-gray-400 p-4"
      >Logout</button>
    </div>
  </nav>
</template>
