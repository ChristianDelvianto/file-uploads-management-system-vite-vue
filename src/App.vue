<script setup lang="ts">
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { useAuth } from '@src/composables/useAuth'
import { usePage } from '@src/composables/usePage'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { isAxiosError } from 'axios'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { role } = useAuth()
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()

async function handleCheckAuthError(err: unknown): Promise<void> {
  console.error('Error checking authentication:', err)

  let errCode = 0
  
  if (isAxiosError(err) && err.response?.status) {
    const statusCode = err.response.status

    if (statusCode === 401) {
      if (route.meta.userOnly) {
        await router.push('/login')
      }

      return
    }

    errCode = statusCode
  }
  
  await pageIsError(errCode)
}
async function checkAuth(): Promise<void> {
  pageLoading(true)

  try {
    await store.dispatch('auth/check')

    if (route.meta.guestOnly || route.meta.role && route.meta.role !== role.value) {
      await router.replace({
        name: `${role.value}.dashboard`,
      })
    }
  } catch (err: unknown) {
    await handleCheckAuthError(err)
  } finally {
    pageLoading(false)
  }
}

onBeforeMount(function (): void {
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
