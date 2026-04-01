<script setup lang="ts">
import InfiniteLoading from 'v3-infinite-loading/lib/v3-infinite-loading.es.js'
import FileLogList from '@src/components/file/FileLogList.vue'
import FormSelect from '@src/components/form/FormSelect.vue'
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { usePage } from '@src/composables/usePage'
import { useLoadMore } from '@src/composables/useLoadMore'
import Api from '@src/services'
import { computed, onMounted, ref, watch } from 'vue'
import { DateTime } from 'luxon'
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()
const { loadMoreErrorCode, loadMoreIsLoading, loadMoreError, loadMoreLoading } = useLoadMore()

const items = ref({})
const loadCompleted = ref(false) // default; for infinite scroll
const sortBy = ref('Newest')

const itemsLength = computed(() => {
    return Object.keys(items.value).length
})
const itemsKey = computed(() => {
    return Object.keys(items.value)
})

async function loadMore($state: any): Promise<void> {
    if (loadMoreIsLoading.value) {
        return
    }

    console.warn('Hit load more')

    loadMoreLoading(true)

    const lastItem = items.value[itemsKey.value[itemsKey.value.length - 1]]
    const timestamp = DateTime.fromISO(lastItem.created_at).ts

    try {
        const res = await Api.get('/user/logs', {
                        params: {
                            oldest: sortBy.value === 'Oldest',
                            timestamp,
                        }
                    })

        if (res.data.items.length) {
            res.data.items.forEach((item: any) => {
                // Need to add prefix 'log-' here
                // Otherwise it will be sorted like numbers (integers)
                items.value[`log-${item.id}`] = item
            })

            if (res.data.items.length < 20) {
                $state.complete()

                loadCompleted.value = true
            } else {
                $state.loaded()
            }
        } else {
            $state.complete()

            loadCompleted.value = true
        }
    } catch (err: any) {
        console.error('Error when fetching more:', err)

        const errCode = err?.response?.status ?? 0

        await loadMoreError(errCode)

        $state.error()
    } finally {
        loadMoreLoading(false)
    }
}
async function getLogs(): Promise<void> {
    pageLoading(true)

    items.value = {}
    loadCompleted.value = false

    try {
        const res = await Api.get('/user/logs', {
                        params: {
                            oldest: sortBy.value === 'Oldest',
                        }
                    })

        if (res.data.items.length) {
            res.data.items.forEach((item: any) => {
                // Need to add prefix 'log-' here
                // Otherwise it will be sorted like numbers (integers)
                items.value[`log-${item.id}`] = item
            })

            if (res.data.items.length < 20) {
                loadCompleted.value = true
            }
        }
    } catch (err: any) {
        console.error('Error when fetching logs:', err)

        const errCode = err?.response?.status ?? 0

        pageIsError(errCode)
    } finally {
        pageLoading(false)
    }
}

watch(sortBy, (): void => {
    getLogs()
})

onMounted((): void => {
    getLogs()
})
</script>

<template>
    <PageLoading v-if="isLoading" class="min-h-[calc(100vh-4rem)]" />
    <PageError
        v-else-if="isError"
        @retry="getLogs"
        :error-code="errorCode"
        class="min-h-[calc(100vh-4rem)]"
    />
    <div v-else-if="itemsLength === 0">
        Hmm.. no logs, yet.

        <br />

        <button
            @click="getLogs"
            type="button"
            class="border border-stone-300 px-3 py-1.5 rounded-lg"
        >Refresh</button>
    </div>
    <div v-else>
        <div
            class="flex flex-col-reverse flex-grow-0 flex-shrink-0
            md:flex-col"
        >
            <div
                class="bg-yellow-100 border border-l-4 border-yellow-600 font-semibold text-yellow-600 p-3 mt-3 mx-3 rounded-lg
                md:mx-6"
            >
                Logs older than 90 days will be automatically deleted.
            </div>

            <div
                class="flex flex-row items-center justify-between mt-3 px-3
                md:mt-6 md:px-6"
            >
                <FormSelect
                    v-model="sortBy"
                    :options="['Newest', 'Oldest']"
                    class="border border-stone-300 font-semibold text-lg"
                />
            </div>
        </div>

        <div>
            <div
                class="flex flex-col gap-3 p-3
                md:p-6"
            >
                <FileLogList
                    v-for="id in itemsKey"
                    :list="items[id]"
                    :key="id"
                />
            </div>

            <InfiniteLoading
                v-if="!loadCompleted"
                @infinite="loadMore"
                :distance="193"
            >
                <template #spinner>
                    <PageLoading
                        class="pb-6 pt-3
                        md:pt-0"
                    />
                </template>
                <template #error="{ retry }">
                    <PageError
                        @retry="retry"
                        :errorCode="loadMoreErrorCode"
                        class="pt-0"
                    />
                </template>
                <template #complete></template>
            </InfiniteLoading>
        </div>
    </div>
</template>
