<script setup lang="ts">
import InfiniteLoading from 'v3-infinite-loading/lib/v3-infinite-loading.es.js'
import FileCard from '@src/components/file/FileCard.vue'
import FileEditModal from '@src/components/file/modals/FileEdit.vue'
import FileDeleteModal from '@src/components/file/modals/FileDelete.vue'
import FileViewMode from '@src/components/layout/FileViewMode.vue'
import FileViewerModal from '@src/components/file/modals/FileViewer.vue'
import FormSelect from '@src/components/form/FormSelect.vue'
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { usePage } from '@src/composables/usePage'
import { useLoadMore } from '@src/composables/useLoadMore'
import Api from '@src/services'
import { FileDB, ViewMode } from '@src/stores/modules/file/types'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { DateTime } from 'luxon'
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()
const { loadMoreErrorCode, loadMoreIsLoading, loadMoreError, loadMoreLoading } = useLoadMore()

const fileModal = reactive({
    delete: false,
    edit: false,
    view: false,
})
const fileModalUuid = ref('')
const items = ref({})
const loadCompleted = ref(false) // default; for infinite scroll
const sortBy = ref('Newest')
const viewMode = ref<ViewMode>('grid') // grid / list

const fileForModal = computed<FileDB | null>(() => {
    if (!fileModalUuid.value) {
        return null
    }

    return items.value[fileModalUuid.value]
})
const itemsLength = computed(() => {
    return Object.keys(items.value).length
})
const itemsKey = computed(() => {
    return Object.keys(items.value)
})
const modalOpened = computed(() => {
    return Object.values(fileModal).some(value => value === true)
})

function fileDeleted(uuid: string): void {
    toggleModal(null)

    if (items.value[uuid]) {
        delete items.value[uuid]
    }
}
function fileUpdated(item: FileDB): void {
    // 
}
async function loadMore($state: any): Promise<void> {
    if (loadMoreIsLoading.value) {
        return
    }

    loadMoreLoading(true)

    const lastItem = items.value[itemsKey.value[itemsKey.value.length - 1]]
    const timestamp = DateTime.fromISO(lastItem.created_at).ts

    try {
        const res = await Api.get('/user/recent', {
                        params: {
                            oldest: sortBy.value === 'Oldest',
                            timestamp,
                        }
                    })

        if (res.data.files.length) {
            res.data.files.forEach((item: FileDB) => {
                items.value[item.uuid] = item
            })

            if (res.data.files.length < 20) {
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
async function getFiles(): Promise<void> {
    pageLoading(true)

    items.value = {}
    loadCompleted.value = false

    try {
        const res = await Api.get('/user/recent', {
                        params: {
                            oldest: sortBy.value === 'Oldest',
                        }
                    })

        if (res.data.files.length) {
            res.data.files.forEach((item: FileDB) => {
                items.value[item.uuid] = item
            })

            if (res.data.files.length < 20) {
                loadCompleted.value = true
            }
        }
    } catch (err: any) {
        console.error('Error when fetching files:', err)

        const errCode = err?.response?.status ?? 0

        pageIsError(errCode)
    } finally {
        pageLoading(false)
    }
}
function toggleModal(modalName: string | null, fileUuid: string = ''): void {
    fileModalUuid.value = fileUuid

    // Reset all modal (Set all value to false)
    Object.keys(fileModal).forEach((key: string) => {
        fileModal[key] = false
    })

    // Then we will set the right one to true (if modalName != null)
    if (modalName) {
        fileModal[modalName] = true
    }
}

watch(sortBy, (): void => {
    getFiles()
})

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
    <div v-else-if="itemsLength === 0">
        You haven't uploaded anything yet.

        <br />

        <button
            @click="getFiles"
            type="button"
            class="border border-stone-300 px-3 py-1.5 rounded-lg"
        >Refresh</button>
    </div>
    <div v-else>
        <div
            class="flex flex-row items-center justify-between mt-3 px-3
            md:mt-6 md:px-6"
        >
            <FormSelect
                v-model="sortBy"
                :options="['Newest', 'Oldest']"
                class="border border-stone-300 font-semibold text-lg"
            />
            
            <FileViewMode
                @update:view-mode="(mode: ViewMode) => viewMode = mode"
                :view-mode="viewMode"
            />
        </div>

        <div>
            <div
                :class="{
                    'gap-3 grid grid-cols-2 p-3 md:gap-6 lg:grid-cols-4 2xl:grid-cols-8': viewMode === 'grid',
                    'divide-y divide-stone-300 flex flex-col md:gap-3': viewMode === 'list',
                }"
                class="
                md:p-6"
            >
                <FileCard
                    v-for="uuid in itemsKey"
                    @open:delete-modal="toggleModal('delete', uuid)"
                    @open:edit-modal="toggleModal('edit', uuid)"
                    @open:view-modal="toggleModal('view', uuid)"
                    :file="items[uuid]"
                    :key="uuid"
                    :view-mode="viewMode"
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

        <!--  <FileLogModal
            @close="toggleModal(null)"
            :file="fileForModal"
            :open="fileModal.log"
        />
        <FileManageAccessModal
            @close="toggleModal(null)"
            :file="fileForModal"
            :open="fileModal.access"
        />
        <FileShareModal
            @close="toggleModal(null)"
            :file="fileForModal"
            :open="fileModal.share"
        /> -->
        <FileDeleteModal
            @close="toggleModal(null)"
            @delete:file="fileDeleted"
            :file="fileForModal"
            :open="fileModal.delete"
        />
        <FileEditModal
            @close="toggleModal(null)"
            @update:file="fileUpdated"
            :file="fileForModal"
            :open="fileModal.edit"
        />
        <FileViewerModal
            @close="toggleModal(null)"
            @update:file="fileUpdated"
            :as-modal="true"
            :file="fileForModal"
            :open="fileModal.view"
        />
    </div>
</template>
