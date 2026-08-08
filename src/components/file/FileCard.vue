<script setup lang="ts">
import IconMDIDotsVertical from '@/components/svg/mdi/DotsVertical.vue'
import FileCardMenu from '@/components/file/FileCardMenu.vue'
import FileCardOwner from '@/components/file/FileCardOwner.vue'
import FileCardThumbnail from '@/components/file/FileCardThumbnail.vue'
import FileCardVisibility from '@/components/file/FileCardVisibility.vue'
import { useFileCard } from '@/composables/useFileCard'
import { FileDB, FileViewMode } from '@/types/file'
import { computed, provide, ref, toRef } from 'vue'

const emit = defineEmits<{
    (eventName: 'open-modal', modalName: string): void
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB,
    showOwner?: boolean,
    viewMode: FileViewMode
}>>(), {
    showOwner: false,
    viewMode: 'grid'
})

const fileRef = toRef(() => props.file)

const isMenuOpen = ref(false)

const {
    fileIcon,
    fileName,
    fileSize,
    imageURL,
    owner,
    shared,
    showImage
} = useFileCard(fileRef)

provide('file', fileRef)
provide('viewMode', computed<FileViewMode>(() => props.viewMode))

function openModal(modalName: string): void {
    isMenuOpen.value = false

    if (fileRef.value?.deleted_at) {
        emit('open-modal', 'restore') // For trash page

        return
    }

    emit('open-modal', modalName) // Normal usage
}
</script>

<template>
    <div
        :class="{
            'bg-[rgb(234,250,234)] flex-col-reverse rounded-xl': $props.viewMode === 'grid',
            'flex-row gap-3 items-center px-3 py-3 md:px-0 md:rounded-xl lg:bg-[rgb(234,250,234)] lg:px-3': $props.viewMode === 'list'
        }"
        class="duration-300 ease-in-out flex flex-grow-0 flex-shrink relative transition-colors w-full"
    >
        <!-- Overlay Button covering entire element, easy for user to click -->
        <button
            v-if="$props.file"
            @click="openModal('view')"
            :data-testid="`view_button_${$props.file.uuid}`"
            type="button"
            class="absolute bg-transparent inset-0 text-[0px] z-1"
            title="View file"
        >View file</button>

        <FileCardThumbnail
            :file-icon="fileIcon"
            :file-name="fileName"
            :imageURL="imageURL"
            :show-image="showImage"
            :view-mode="$props.viewMode"
        />

        <div
            :class="{
                'rounded-t-[inherit] max-w-full': $props.viewMode === 'grid',
                'max-w-[calc(100%-3.75rem)]': $props.viewMode === 'list'
            }"
            class="flex flex-grow flex-shrink items-center overflow-ellipsis w-full"
        >
            <div
                :class="{
                    'gap-1.5 items-center pl-3 py-2': $props.viewMode === 'grid'
                }"
                class="flex flex-grow flex-shrink overflow-ellipsis overflow-hidden w-full"
            >
                <component 
                    v-if="$props.viewMode === 'grid'"
                    :is="fileIcon"
                    color="#155DFC"
                    class="flex-grow-0 flex-shrink-0"
                />

                <div
                    :class="{
                        'flex flex-grow flex-col gap-0.5 lg:flex-row lg:gap-0 lg:items-center': $props.viewMode === 'list'
                    }"
                    class="overflow-ellipsis overflow-hidden"
                >
                    <div
                        v-text="fileName"
                        :class="{
                            'lg:max-w-[calc(50%-3.5rem)]': ($props.viewMode === 'list' && $props.showOwner),
                            'lg:max-w-[calc(60%-3rem)]': ($props.viewMode === 'list' && !$props.showOwner),
                            'font-semibold lg:flex-grow-0 lg:flex-shrink-0 lg:pr-3': $props.viewMode === 'list'
                        }"
                        class="leading-snug overflow-ellipsis overflow-hidden whitespace-nowrap w-full"
                    ></div>

                    <div
                        v-if="$props.viewMode === 'list'"
                        :class="{
                            'lg:pr-4': $props.showOwner
                        }"
                        class="flex flex-grow flex-row items-center"
                    >
                        <FileCardOwner
                            v-if="$props.showOwner"
                            :owner="owner"
                        />

                        <FileCardVisibility
                            :shared="shared"
                            :class="{
                                'lg:w-1/3': $props.showOwner,
                                'lg:w-1/2': !$props.showOwner
                            }"
                        />

                        <div
                            :class="{
                                'lg:w-1/3': $props.showOwner,
                                'lg:w-1/2': !$props.showOwner
                            }"
                            class="text-gray-600
                            lg:text-black"
                        >
                            {{ fileSize }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                :class="{
                    'md:pr-1.5': $props.viewMode === 'grid'
                }"
                class="flex-grow-0 flex-shrink-0 relative"
            >
                <button
                    @click.stop="isMenuOpen = !isMenuOpen"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center relative rounded-full size-9 z-1
                    focus:bg-stone-300
                    hover:bg-stone-300"
                >
                    <IconMDIDotsVertical color="#000" :size="20" />
                </button>

                <FileCardMenu
                    v-if="isMenuOpen"
                    @close="isMenuOpen = false"
                    @open-modal="openModal"
                />
            </div>
        </div>
    </div>
</template>
