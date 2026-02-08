<script setup lang="ts">
defineProps<Readonly<{
    text: string,
}>>()
</script>

<template>
    <label
        class="block font-semibold text-gray-600"
    >
        {{ $props.text }}
    </label>
</template>
