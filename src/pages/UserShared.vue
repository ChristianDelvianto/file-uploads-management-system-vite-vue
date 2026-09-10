<script setup lang="ts">
import ImageErrorDefault from '@/assets/images/error-default.jpg'
import IconMDICounterclockwiseArrows from '@/components/svg/mdi/CounterclockwiseArrows.vue'
import FileCard from '@/components/file/FileCard.vue'
import FileListEmpty from '@/components/layout/file/FileListEmpty.vue'
import FileListHeadingForListMode from '@/components/layout/file/FileListHeadingForListMode.vue'
import FileListViewMode from '@/components/layout/file/FileListViewMode.vue'
import FormSelect from '@/components/form/FormSelect.vue'
import ModalFileDetail from '@/components/modals/file/FileDetail.vue'
import ModalFileViewer from '@/components/modals/file/FileViewer.vue'
import PageError from '@/components/page/PageError.vue'
import PageLoading from '@/components/page/PageLoading.vue'
import { useLoadMore } from '@/composables/useLoadMore'
import { usePage } from '@/composables/usePage'
import { useWindow } from '@/composables/useWindow'
import { getSharedFiles } from '@/services/user.service'
import { FileDB, FileViewMode } from '@/types/file'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { isAxiosError, isCancel } from 'axios'
import InfiniteLoading from 'v3-infinite-loading/lib/v3-infinite-loading.es.js'
const { windowWidth } = useWindow()
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()
const { isLoadMoreLoading, loadMoreErrorCode, loadMoreError, loadMoreLoading } = useLoadMore()
const abortController = new AbortController()

const fileModal = reactive<{ [modalName: string]: boolean }>({
    detail: false,
    view: false
})
const fileModalUuid = ref('')
const fileViewMode = ref<FileViewMode>('grid')
const items = ref<{ [uuid: string]: FileDB }>({})
const loadCompleted = ref(false)
const nextCursor = ref('')
const sortBy = ref('newest')
const sortOptions = ['newest', 'oldest']

const fileForModal = computed<FileDB | null>(() => {
    return items.value[fileModalUuid.value] || null
})
const itemsKey = computed<string[]>(() => {
    return Object.keys(items.value)
})
const showFileListHeading = computed<boolean>(() => {
    return fileViewMode.value === 'list' && windowWidth.value >= 1024
})

function fileNotFound(uuid: string): void {
    if (items.value[uuid]) {
        items.value[uuid].not_found = true
    }
}
async function load(): Promise<void> {
    pageLoading(true)

    items.value = {} // Reset
    loadCompleted.value = false

    const params = {
        oldest: sortBy.value === 'oldest' ? 1 : 0
    }

    try {
        const { has_more, next_cursor, items } = await getSharedFiles(params, abortController.signal)

        console.log('Files: ', items)

        if (items.length) {
            pushItems(items)
        }

        if (has_more) {
            nextCursor.value = next_cursor
        } else {
            loadCompleted.value = true
        }
    } catch (err: unknown) {
        console.log('Error :', err)

        if (isCancel(err)) {
            return
        }

        let errCode = 0

        if (isAxiosError(err) && err.response?.status) {
            errCode = err.response.status
        }

        pageIsError(errCode)
    } finally {
        pageLoading(false)
    }
}
async function loadMore($state: any): Promise<void> {
    if (isLoadMoreLoading.value) {
        return
    }

    loadMoreLoading(true)

    const params = {
        oldest: sortBy.value === 'oldest' ? 1 : 0,
        cursor: nextCursor.value
    }

    try {
        const { has_more, next_cursor, items } = await getSharedFiles(params, abortController.signal)

        console.log('Files: ', items)

        if (items.length) {
            pushItems(items)
        }

        if (has_more) {
            nextCursor.value = next_cursor
            
            $state.loaded()
        } else {
            $state.complete()

            loadCompleted.value = true
        }
    } catch (err: unknown) {
        console.log('Error :', err)

        if (isCancel(err)) {
            return
        }
 
        let errCode = 0

        if (isAxiosError(err) && err.response?.status) {
            errCode = err.response.status
        }

        loadMoreError(errCode)

        $state.error()
    } finally {
        loadMoreLoading(false)
    }
}
function pushItems(files: FileDB[]): void {
    files.forEach((item: FileDB) => {
        item.unauthorized = false
        item.not_found = false
        
        items.value[item.uuid] = item
    })
}
function toggleModal(modalName: string | null = null, uuid: string = ''): void {
    // Close all previous modals
    Object.keys(fileModal).forEach((key: string) => {
        fileModal[key] = false
    })

    // Close a modal and check if file is not found, if yes, remove from items
    if (!modalName && items.value[fileModalUuid.value].not_found) {
        delete items.value[fileModalUuid.value]
    }

    // Set new UUID for modal
    fileModalUuid.value = uuid

    // Open
    if (modalName) {
        fileModal[modalName] = true
    }
}

watch(sortBy, (): void => {
    load()
})

onMounted((): void => {
    load()
})
onBeforeUnmount((): void => {
    if (isPageLoading.value || isLoadMoreLoading.value) {
        abortController.abort()
    }
})
</script>

<template>
    <PageLoading v-if="isPageLoading" class="min-h-[calc(100vh-4rem)]" />
    <PageError
        v-else-if="isPageError"
        @retry="load"
        :error-code="pageErrorCode"
        :error-image="ImageErrorDefault"
        class="min-h-[calc(100vh-4rem)]"
    />
    <div v-else>
        <div
            class="flex flex-row items-center justify-between mt-3 pl-3 pr-3
                md:mt-6 md:pl-6 md:pr-4"
        >
            <div class="flex flex-row flex-shrink-0 gap-3 items-center justify-start">
                <FormSelect
                    v-model="sortBy"
                    :options="sortOptions"
                    class="border border-stone-600/30 font-semibold px-1! rounded-lg! text-[16px]
                    sm:px-3!
                    md:border-stone-600/60"
                />
            </div>

            <div class="flex flex-grow-0 flex-row flex-shrink-0 gap-1.5 items-center">
                <FileListViewMode
                    @update="(mode: FileViewMode) => fileViewMode = mode"
                    :view-mode="fileViewMode"
                />

                <button
                    @click="load"
                    type="button"
                    class="bg-white border border-transparent flex items-center justify-center rounded-full size-9
                    focus:bg-stone-300
                    hover:bg-stone-300"
                >
                    <IconMDICounterclockwiseArrows />
                </button>
            </div>
        </div>

        <FileListEmpty
            v-if="itemsKey.length === 0"
            @refresh="load"
        />
        <template v-else>
            <div>
                <FileListHeadingForListMode v-if="showFileListHeading" :show-owner="true" />

                <div
                    :class="{
                        'gap-3 grid grid-cols-2 p-3 md:gap-6 md:p-6 lg:grid-cols-4 2xl:grid-cols-8': fileViewMode === 'grid',
                        'divide-y divide-stone-300 flex flex-col md:divide-y-0 md:gap-1 md:pb-6 md:pt-3 md:px-6 lg:gap-3 lg:pt-0': fileViewMode === 'list'
                    }"
                >
                    <FileCard
                        v-for="uuid in itemsKey"
                        @open-modal="(modalName: string) => toggleModal(modalName, uuid)"
                        :file="items[uuid]"
                        :key="uuid"
                        :show-owner="true"
                        :view-mode="fileViewMode"
                    />
                </div>

                <InfiniteLoading v-if="!loadCompleted" @infinite="loadMore">
                    <template #spinner>
                        <PageLoading
                            class="pb-6! pt-3!
                            md:pt-0!"
                        />
                    </template>
                    <template #error="{ retry }">
                        <PageError
                            @retry="retry"
                            :error-code="loadMoreErrorCode"
                            class="pt-0!"
                        />
                    </template>
                    <template #complete></template>
                </InfiniteLoading>
            </div>

            <ModalFileDetail
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                :file="fileForModal"
                :open="fileModal.detail"
            />
            <ModalFileViewer
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                @update-file="{}"
                :file="fileForModal"
                :open="fileModal.view"
            />
        </template>
    </div>
</template>
