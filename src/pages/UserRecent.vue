<script setup lang="ts">
import FileCard from '@src/components/file/FileCard.vue'
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { usePage } from '@src/composables/usePage'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
const store = useStore()
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()

async function handleApiError(err: any): Promise<void> {
    console.error('Error fetching recent files:', err)

    const errCode = err?.response?.status ?? 0

    pageIsError(errCode)
}
async function getFiles(): Promise<void> {
    pageLoading()

    try {
        // await store.dispatch('files/getRecent')
    } catch (err) {
        await handleApiError(err)
    } finally {
        isLoading.value = false
    }
}

onMounted((): void => {
    getFiles()
})
</script>

<template>
    <PageLoading v-if="isLoading" class="min-h-[calc(100vh-4rem)]" />
    <PageError
        v-else-if="isError"
        @retry="getFiles"
        :error-code="errorCode"
        class="min-h-[calc(100vh-4rem)]"
    />
    <div
        v-else
    >
        <div>
            <!-- Select -->
        </div>

        <div
            class="bg-stone-300/30 gap-3 grid grid-cols-1 p-3
            sm:bg-transparent sm:grid-cols-2
            md:gap-6 md:grid-cols-3 md:p-6
            lg:grid-cols-4"
        >
            <FileCard
                v-for="i in 200"
                :key="i"
            />
        </div>
    </div>
</template>
