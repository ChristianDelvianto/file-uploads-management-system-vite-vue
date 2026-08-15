<script setup lang="ts">
defineProps<Readonly<{
    testId?: string,
    text: string
}>>()
</script>

<template>
    <label
        :data-testid="$props.testId"
        class="block font-semibold text-gray-600"
    >
        {{ $props.text }}
    </label>
</template>
