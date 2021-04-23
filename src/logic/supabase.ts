import { Provider, Session } from '@supabase/gotrue-js/dist/main/lib/types'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
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
  user_name: string,
  user_id: string,
  added_at: string,
  stars: number,
  banned: boolean
}
const allComponents = ref<windiComponent[]>([])

/**
 * Retreive all components
 */
async function fetchComponents() {
// TODO: add pagination
  try {
    const { data: components, error } = await supabase
      .from('components')
      .select('*')
      .neq('banned', true)

    if (error) {
      console.log('error', error)
      return
    }
    if (components === null) {
      allComponents.value = []
      return
    }
    for (const component of components) {
      const { data, count } = await supabase
        .from('stars')
        .select('*', { count: 'exact' })
        .eq("component_id", component.id)
        let _ = data
        component.stars = count
    }
    components.sort((a,b) =>  {
      return b.stars - a.stars
    })
    allComponents.value = components
    console.log('got todos!', allComponents.value)
  } catch (err) {
    console.error('Error retrieving data from db', err)
  }
}

/**
 * Retrieve one component by ID
 */
 async function fetchComponent(uid: string): Promise<windiComponent | undefined > {
  try {
    const { data: component, error } = await supabase
      .from('components')
      .select('*')
      .neq('banned', true)
      .eq('id', uid)


    if (error) {
      console.log('error', error)
      return
    }

    console.log('get component!', component)
    if (component && component[0]) {
      return component[0]!
    } else {
      return
    }
  } catch (err) {
    console.error('Error retrieving data from db', err)
  }
}

/**
 *  Add a new component to supabase
 */
async function addComponent(component: windiComponent): Promise<null | windiComponent> {
  try {
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .single()

    if (error) {
      // alert(error.message)
      console.error('There was an error inserting', error)
      return null
    }

    console.log('created a new component')
    return data
  } catch (err) {
    // alert('Error')
    console.error('Unknown problem inserting to db', err)
    return null
  }
}

/**
 * Add a new star
 */
async function addStar(componentId: string | undefined, userId: string | undefined): Promise<boolean> {
  try {
    if (!componentId) return false
    if (!userId) return false
    const { data, error } = await supabase
      .from('stars')
      .insert({component_id: componentId, user_id:userId})
      .single()

    if (error) {
      // alert(error.message)
      console.error('There was an error inserting', error)
      return false
    }

    console.log('created a new star')
    fetchStars(userId)
    return data
  } catch (err) {
    // alert('Error')
    console.error('Unknown problem inserting to db', err)
    return false
  }
}

type windiStar = {
  id: string
  component_id: string
  user_id: string
  liked_at: string
}
const myStars = ref<windiStar[]>([])
/**
 * Get my stars
 */
 async function fetchStars(userId: string | undefined) {
  try {
    if (!userId) return
    const { data: stars, error } = await supabase
    .from('stars')
    .select('*')
    .eq('user_id', userId)

    if (error) {
      console.log('error', error)
      return
    }
    if (stars === null) {
      myStars.value = []
      return
    }
    myStars.value = stars
    console.log('got stars!', myStars.value)
  } catch (err) {
    // alert('Error')
    console.error('Unknown problem', err)
    return
  }
}

export {
  userSession,
  handleOAuthLogin,
  handleLogout,
  fetchComponents,
  allComponents,
  addComponent,
  addStar,
  myStars,
  fetchStars,
  fetchComponent,
  windiComponent
}
