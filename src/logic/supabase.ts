import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
import { Session, Provider } from '@supabase/gotrue-js/dist/main/lib/types'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
)

const userSession = ref<Session | null>(null)

/**
 * Handles signup via Third Pary Login.
 * https://supabase.io/docs/guides/auth#third-party-logins
 */
async function handleOAuthLogin(provider: Provider) {
  const { error } = await supabase.auth.signIn({ provider })
  if (error) console.error('Error: ', error.message)
}


/**
 * Handles logging a user out of a superbase session
 */
async function handleLogout() {
  console.log('logging out')
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      // alert('Error signing out')
      console.error('Error', error)
      return
    }

    // alert('You have signed out!')
  } catch (err) {
    // alert('Unknown error signing out')
    console.error('Error', err)
  }
}
type windiComponent = {
  id: string
  html: string
  css: string
  likes: number,
  username: string,
  uploaded_at: string
}
const allComponents = ref<windiComponent[]>([])
/**
 * Retreive all components
 */
async function fetchComponents() {
  try {
    const { data: components, error } = await supabase
      .from('components')
      .select('*')
      .order('likes')

    if (error) {
      console.log('error', error)
      return
    }
    // handle for when no todos are returned
    if (components === null) {
      allComponents.value = []
      return
    }
    // store response to allTodos
    allComponents.value = components
    console.log('got todos!', allComponents.value)
  } catch (err) {
    console.error('Error retrieving data from db', err)
  }
}


export {
  userSession,
  handleOAuthLogin,
  handleLogout,
  fetchComponents,
  allComponents
}
