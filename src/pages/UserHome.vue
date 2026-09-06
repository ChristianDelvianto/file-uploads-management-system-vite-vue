<script setup lang="ts">
import ImageErrorDefault from '@/assets/images/error-default.jpg'
import IconMDIReload from '@/components/svg/mdi/Reload.vue'
import FileCard from '@/components/file/FileCard.vue'
import FileListEmpty from '@/components/layout/file/FileListEmpty.vue'
import FileListHeadingForListMode from '@/components/layout/file/FileListHeadingForListMode.vue'
import FileListViewMode from '@/components/layout/file/FileListViewMode.vue'
import FormSelect from '@/components/form/FormSelect.vue'
import ModalFileDetail from '@/components/modals/file/FileDetail.vue'
import ModalFileRename from '@/components/modals/file/FileRename.vue'
// import ModalFileShare from '@/components/modals/file/FileShare.vue'
import ModalFileTrash from '@/components/modals/file/FileTrash.vue'
import ModalFileViewer from '@/components/modals/file/FileViewer.vue'
import ModalFileVisibility from '@/components/modals/file/FileVisibility.vue'
import PageError from '@/components/page/PageError.vue'
import PageLoading from '@/components/page/PageLoading.vue'
import { useLoadMore } from '@/composables/useLoadMore'
import { usePage } from '@/composables/usePage'
import { useWindow } from '@/composables/useWindow'
import { MIN_WIDTH_LG } from '@/const/window'
import { getFiles } from '@/services/user.service'
import { FileDB, FileStatus, FileViewMode } from '@/types/file'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { isAxiosError, isCancel } from 'axios'
import InfiniteLoading from 'v3-infinite-loading/lib/v3-infinite-loading.es.js'
const { windowWidth } = useWindow()
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()
const {
    isLoadMoreCompleted,
    isLoadMoreError,
    isLoadMoreLoading,
    loadMoreCompleted,
    loadMoreError,
    loadMoreErrorCode,
    loadMoreLoading,
    nextCursor,
    $resetLoadMore
} = useLoadMore()
let abortController: AbortController | null = null

const categoryBy = ref('all')
const categoryOptions = ['all', 'audio', 'document', 'image', 'other', 'video']
const fileModal = reactive<{ [modalName: string]: boolean }>({
    detail: false,
    rename: false,
    share: false,
    trash: false,
    view: false,
    visibility: false
})
const fileModalUuid = ref('')
const fileViewMode = ref<FileViewMode>('grid')
const items = ref<{ [uuid: string]: FileDB }>({})
const sortBy = ref('newest')
const sortOptions = ['newest', 'oldest']

const fileForModal = computed<FileDB | null>(() => {
    return items.value[fileModalUuid.value] || null
})
const itemsKey = computed<string[]>(() => {
    return Object.keys(items.value)
})
const showFileListHeading = computed<boolean>(() => {
    return fileViewMode.value === 'list' && windowWidth.value >= MIN_WIDTH_LG
})

function fileNotFound(uuid: string): void {
    if (items.value[uuid]) {
        items.value[uuid].not_found = true
    }
}
function fileTrashed(uuid: string): void {
    toggleModal()

    delete items.value[uuid]
}
function fileUpdate(item: FileDB): void {
    items.value[item.uuid] = item
}
function fileUpdateStatus(uuid: string, status: FileStatus): void {
    if (items.value[uuid]) {
        items.value[uuid].status = status
    }
}
async function load(): Promise<void> {
    pageLoading(true)

    abortController?.abort()
    abortController = new AbortController()

    $resetLoadMore()
    items.value = {}

    const params = {
        category: categoryBy.value,
        oldest: sortBy.value === 'oldest' ? 1 : 0
    }

    try {
        const { has_more, next_cursor, items } = await getFiles(params, abortController.signal)

        if (items.length !== 0) {
            pushItems(items)
        }

        if (has_more) {
            nextCursor.value = next_cursor
        } else {
            loadMoreCompleted()
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
    if (isLoadMoreCompleted.value || isLoadMoreLoading.value) {
        return
    }

    loadMoreLoading(true)

    abortController?.abort()
    abortController = new AbortController()

    const params = {
        category: categoryBy.value,
        oldest: sortBy.value === 'oldest' ? 1 : 0,
        cursor: nextCursor.value
    }

    try {
        const { has_more, next_cursor, items } = await getFiles(params, abortController.signal)

        if (items.length !== 0) {
            pushItems(items)
        }

        if (has_more) {
            nextCursor.value = next_cursor
            
            $state.loaded()
        } else {
            $state.complete()

            loadMoreCompleted()
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

        // Store the error code first
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

    // Close a modal and if file not found, remove from item
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

watch([categoryBy, sortBy], (): void => {
    load()
})

onMounted((): void => {
    load()
})
onBeforeUnmount((): void => {
    abortController?.abort()
})
</script>

<template>
    <PageLoading
        v-if="isPageLoading"
        class="min-h-[calc(100vh-4rem)]"
    />
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
                <!-- Sort by -->
                <FormSelect
                    v-model="sortBy"
                    :options="sortOptions"
                    class="border border-stone-600/30 font-semibold px-1! rounded-lg! text-[16px]
                    sm:px-3!
                    md:border-stone-600/60"
                />

                <!-- Category -->
                <FormSelect
                    v-model="categoryBy"
                    :options="categoryOptions"
                    class="border border-stone-600/30 font-semibold px-0! rounded-lg! text-[16px]
                    sm:px-1.5!
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
                    <IconMDIReload color="#000" />
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

                <InfiniteLoading v-if="!isLoadMoreCompleted" @infinite="loadMore">
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
            <ModalFileRename
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                @updated="fileUpdate"
                :file="fileForModal"
                :open="fileModal.rename"
            />
            <!-- <ModalFileShare
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                :file="fileForModal"
                :open="fileModal.share"
            /> -->
            <ModalFileTrash
                @close="toggleModal"
                @trashed="fileTrashed"
                :file="fileForModal"
                :open="fileModal.trash"
            />
            <ModalFileViewer
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                @updated="fileUpdate"
                @status-updated="(status: FileStatus) => fileUpdateStatus(fileModalUuid, status)"
                :file="fileForModal"
                :open="fileModal.view"
            />
            <ModalFileVisibility
                @close="toggleModal"
                @not-found="fileNotFound(fileModalUuid)"
                @updated="fileUpdate"
                :file="fileForModal"
                :open="fileModal.visibility"
            />
        </template>
    </div>
</template>
