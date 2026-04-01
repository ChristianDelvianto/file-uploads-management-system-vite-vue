<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import IconMDIBoxVariant from '@src/components/svg/mdi/BoxVariant.vue'
import IconMDICounterclockwiseArrows from '@src/components/svg/mdi/CounterclockwiseArrows.vue'
import { useAuth } from '@src/composables/useAuth'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
const store = useStore()
const { plan, usedBytes } = useAuth()

const isLoading = ref(false)

const totalLimit = computed(() => {
    if (!plan.value || !plan.value.maxSize) {
        return 0
    }

    // Plan comes in bytes

    // GB
    if (plan.value.maxSize >= 1073_741_824) {
        return `${(plan.value.maxSize / 1_073_741_824).toFixed(2)} GB`
    }

    // MB
    return `${(plan.value.maxSize / 1_048_576).toFixed(0)} MB`
})
const usagePercentage = computed(() => {
    return ((usedBytes.value / plan.value.maxSize) * 100).toFixed(2)
})

function openPlanModal(): void {
    window.alert('Not in development scope')
}
</script>

<template>
    <div
        class="border-t border-stone-300 flex flex-grow-0 flex-row flex-shrink-0 gap-3 pt-3 px-3
        md:border-b md:border-t-0 md:pb-3 md:pt-0"
    >
        <div class="relative">
            <IconMDIBoxVariant :size="64" />

            <span class="absolute bg-blue-600 bottom-0 font-bold mx-auto px-3 py-1 rounded-full text-white">{{ plan.name }}</span>
        </div>

        <div class="w-full">
            <div class="bg-stone-300 flex flex-col h-3 justify-start overflow-hidden rounded-full w-full">
                <div
                    :style="{
                        width: `${usagePercentage}%`
                    }"
                    class="bg-blue-600 h-full rounded-full"
                ></div>
            </div>

            <div class="font-semibold pt-1.5 text-gray-600">{{ usagePercentage }}% used of {{ totalLimit }}</div>

            <div class="flex flex-grow flex-row flex-shrink gap-3 items-center mt-1.5">
                <Button
                    @click="openPlanModal"
                    level="neutral"
                    class="flex-grow flex-shrink font-semibold"
                >Upgrade Plan</Button>

                <button
                    @click="isLoading = !isLoading"
                    type="button"
                    class="border border-stone-300 flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-lg size-10"
                >
                    <IconMDICounterclockwiseArrows
                        :class="{
                            'animate-spin': isLoading,
                        }"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
