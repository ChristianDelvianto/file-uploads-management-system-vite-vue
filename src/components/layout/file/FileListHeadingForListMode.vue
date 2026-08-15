<script setup lang="ts">
withDefaults(defineProps<{
    showOwner?: boolean
}>(), {
    showOwner: false
})
</script>

<template>
    <div class="bg-white flex flex-grow flex-row flex-shrink items-center mx-6 pb-1.5 py-6 sticky top-14 z-[2]">
        <div
            :class="{
                'max-w-[calc(50%-2.75rem)]': $props.showOwner,
                'max-w-[calc(60%-3rem)]': !$props.showOwner
            }"
            class="font-semibold pl-3 text-lg w-full"
        >
            Name
        </div>

        <div
            :class="{
                'pr-16': $props.showOwner,
                'pr-12': !$props.showOwner
            }"
            class="flex flex-grow flex-row flex-shrink items-center"
        >
            <div
                v-if="$props.showOwner"
                class="flex-grow font-semibold hidden text-lg w-1/3
                lg:block"
            >
                Owner
            </div>

            <div
                :class="{
                    'w-1/3': $props.showOwner,
                    'w-1/2': !$props.showOwner
                }"
                class="flex-grow font-semibold text-lg"
            >
                Visibility
            </div>

            <div
                :class="{
                    'w-1/3': $props.showOwner,
                    'w-1/2': !$props.showOwner
                }"
                class="flex-grow font-semibold text-lg"
            >
                File size
            </div>
        </div>
    </div>
</template>
