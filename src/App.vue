<script setup lang="ts">
import PageError from './components/page/PageError.vue'
import PageLoading from './components/page/PageLoading.vue'
import { usePage } from './composables/usePage'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { isAxiosError } from 'axios'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()

async function handleStartAppError(err: unknown): Promise<void> {
  pageErrorCode.value = 0

  if (isAxiosError(err) && err.response?.status) {
    if (err.response.status === 401) {
      // Guest currently in userOnly route, redirect to login page
      if (route.meta.userOnly) {
        await router.push({ name: 'login' })
      }

      // Otherwise, let guest stays in current route
      return
    }

    pageErrorCode.value = err.response.status
  }

  pageIsError(pageErrorCode.value)
}
async function startApp(): Promise<void> {
  pageLoading(true)

  try {
    if (navigator.cookieEnabled === false) {
      pageErrorCode.value = 2
      pageIsError(pageErrorCode.value)

      return
    }

    await store.dispatch('auth/check')

    if (route.meta.guestOnly) {
      await router.replace({ name: 'user.dashboard' })
    }
  } catch (err: unknown) {
    console.error('Error startApp: ', err)

    await handleStartAppError(err)
  } finally {
    pageLoading(false)
  }
}

/**
 * Why onBeforeMount, not onMounted?
 * Because we want to check authentication before the page is mounted and also to avoid flashing the page content.
 */
onBeforeMount((): void => {
  startApp()
})
</script>

<template>
  <PageLoading v-if="isPageLoading" class="min-h-screen" />
  <PageError
    v-else-if="isPageError"
    @retry="startApp"
    :error-code="pageErrorCode"
    class="min-h-screen"
  />
  <RouterView v-else />
</template>
