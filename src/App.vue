<script setup lang="ts">
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { usePage } from '@src/composables/usePage'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()

async function handleApiError(err: any): Promise<void> {
  console.error('Error checking authentication:', err)

  const errCode = err?.response?.status ?? 0
  
  if (errCode === 401) {
    // Redirect to login
    if (route.meta.userOnly) {
      await router.push('/login')
    }

    return
  }
  
  pageIsError(errCode)
}
async function checkAuth(): Promise<void> {
  pageLoading()

  try {
    const { profile } = await store.dispatch('auth/check')

    if (route.meta.guestOnly || route.meta.role && route.meta.role !== profile.role) {
      await router.replace({
        name: `${profile.role}.dashboard`,
      })
    }
  } catch (err) {
    await handleApiError(err)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount((): void => {
  checkAuth()
})
</script>

<template>
  <PageLoading v-if="isLoading" class="min-h-screen" />
  <PageError
    v-else-if="isError"
    @retry="checkAuth"
    :error-code="errorCode"
    class="min-h-screen"
  />
  <RouterView v-else />
</template>
