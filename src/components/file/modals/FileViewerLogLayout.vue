<script setup lang="ts">
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import FileLogList from './FileViewerLogList.vue'
import { usePage } from '@src/composables/usePage'
import { useStore } from 'vuex'
import { ref, watch } from 'vue'
const store = useStore()
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()

defineEmits<{
    (eventName: 'close'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    open?: boolean
    uuid: string,
}>>(), {
    open: false,
})

const items = ref([])

async function getLogs(): Promise<void> {
    pageLoading(true)

    const thalya = {
        id: new Date().getTime(),
        avatar: 'https://www.shutterstock.com/image-photo/beautiful-young-asian-woman-pointing-600nw-2341582245.jpg',
        name: 'Thalya'
    }

    const kevin = {
        id: new Date().getTime(),
        avatar: 'https://www.tourradar.com/days-to-come/wp-content/uploads/2016/02/Nightlife-in-Yurakucho-Tokyo-Japan-000022600389_Full.jpeg',
        name: 'Kevin'
    }

    const grace = {
        id: new Date().getTime(),
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpTskDetfiAEUhLRELJyFa8P2Q79-PYWFZug&s',
        name: 'Grace'
    }

    const japangirl1 = {
        id: new Date().getTime(),
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoy0tmSWL2POJEYz4rVYw0her3xadqEpm3Kw&s',
        name: '詩織'
    }

    const japangirl2 = {
        id: new Date().getTime(),
        avatar: 'https://cdn.pixabay.com/photo/2018/12/08/16/02/asian-3863541_1280.jpg',
        name: '沙也香'
    }

    const mockData = [
        { action: 'view', created_at: '2026-03-27T11:28:31.000000Z', user: thalya },
        { action: 'view', created_at: '2026-03-27T11:30:01.000000Z', user: kevin },
        { action: 'download', created_at: '2026-03-27T11:30:30.000000Z', user: kevin },
        { action: 'view', created_at: '2026-03-27T13:14:20.000000Z', user: japangirl1 },
        { action: 'view', created_at: '2026-03-27T14:22:20.000000Z', user: japangirl2 },
    ]

    try {
        const logs = await store.dispatch('file/getLogs', props.uuid)

        mockData.forEach(data => {
            logs.unshift(data)
        })

        items.value = logs
    } catch (err) {
        console.error('Error when fetching more:', err)

        const errCode = err?.response?.status ?? 0

        pageIsError(errCode)
    } finally {
        pageLoading(false)
    }
}

watch(() => props.open, (newValue) => {
    if (newValue) {
        getLogs()
    }
})
</script>

<template>
    <div
        v-if="$props.open"
        class="bg-white fixed inset-0 w-full z-20
        md:flex-grow-0 md:flex-shrink-0 md:h-screen md:inset-auto md:static md:w-96"
    >
        <!-- Navigation -->
        <div
            class="border-b border-stone-300 flex flex-grow flex-row flex-shrink gap-1.5 h-16 items-center pr-3
            md:flex-row-reverse md:justify-between md:pl-3 md:pr-0"
        >
            <button
                @click="$emit('close')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-12"
            >
                <IconMDIClose />
            </button>

            <span
                class="font-bold text-xl
                lg:flex-grow"
            >Logs</span>
        </div>

        <PageLoading v-if="isLoading" class="min-h-[calc(100vh-4rem)]" />
        <PageError
            v-else-if="isError"
            @retry="getLogs"
            :error-code="errorCode"
            class="min-h-[calc(100vh-4rem)]"
        />
        <div
            v-else
            class="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-1.5"
        >
            <FileLogList
                v-for="item in items"
                :key="item.created_at"
                :list="item"
            />
        </div>
    </div>
</template>
