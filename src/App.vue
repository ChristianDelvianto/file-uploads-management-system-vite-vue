<script setup lang="ts">
import PageError from './components/page/PageError.vue'
import PageLoading from './components/page/PageLoading.vue'
import { usePage } from './composables/usePage'
import { hasToken } from './utils/localStorage'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { isAxiosError } from 'axios'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()

async function handleCheckAuthError(err: unknown): Promise<void> {
  pageErrorCode.value = 0

  if (isAxiosError(err) && err.response?.status) {
    if (err.response.status === 401) {
      // Guest currently in userOnly route, redirect to login page
      if (route.meta.userOnly) {
        await router.push('/login')
      }

      // Otherwise, let guest stays in current route
      return
    }

    pageErrorCode.value = err.response.status
  }

  pageIsError(pageErrorCode.value)
}
async function checkAuth(): Promise<void> {
  pageLoading(true)

  try {
    // No token
    if (!hasToken()) {
      // Guest in userOnly route, redirect to login page
      if (route.meta.userOnly) {
        await router.push('/login')
      }

      // End, switch to RouterView
      return
    }

    // Token exists in localStorage
    await store.dispatch('auth/check')

    // Token valid, and user currently in guestOnly route, replace route with user dashboard route
    if (route.meta.guestOnly) {
      await router.replace({ name: 'user.dashboard' })
    }
  } catch (err: unknown) {
    await handleCheckAuthError(err)
  } finally {
    pageLoading(false)
  }
}

/**
 * Why onBeforeMount, not onMounted?
 * 
 * Because we want to check authentication before the page is mounted and also to avoid flashing the page content.
 */
onBeforeMount((): void => {
  checkAuth()
})
</script>

<template>
  <PageLoading v-if="isPageLoading" class="min-h-screen" />
  <PageError
    v-else-if="isPageError"
    @retry="checkAuth"
    :error-code="pageErrorCode"
    class="min-h-screen"
  />
  <RouterView v-else />
</template>
