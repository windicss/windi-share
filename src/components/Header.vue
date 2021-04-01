
<script setup lang="ts">
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
  <nav class="container flex py-4">
    <RouterLink class="flex" to="/">
      <Logo class="m-auto -ml-1 text-2xl" />
      <div class="my-auto ml-2">
        <div class="text-xl">
          Windi Share Library
          <sup class="text-xs opacity-50 italic">Beta</sup>
        </div>
      </div>
      <!-- <button @click="login">login</button>
      <button @click="logout">logout</button>-->
    </RouterLink>
  </nav>
</template>
