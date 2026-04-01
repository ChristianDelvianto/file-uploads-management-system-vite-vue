<script setup lang="ts">

const props = defineProps<{
    list: any,
}>()
</script>

<template>
    <div
        class="bg-white border border-stone-300 p-3 rounded-xl shadow-lg shadow-stone-600/30
        md:border-0"
    >
        {{ props.list }}
    </div>
</template>
