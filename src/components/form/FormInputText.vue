<script setup lang="ts">
withDefaults(defineProps<Readonly<{
    errorMessage?: string,
    disabled?: boolean,
    placeholder?: string,
    type?: 'email' | 'password' | 'search' | 'text' | 'url',
}>>(), {
    disabled: false,
    type: 'text',
})

const model = defineModel({
    type: String,
    required: true,
})
</script>

<template>
    <input
        v-model="model"
        :type="$props.type"
        :disabled="$props.disabled"
        :placeholder="$props.placeholder"
        :class="{
            'bg-red-100 border-red-600 focus:border-red-600 focus:outline-red-300': $props.errorMessage,
            'bg-white border-stone-300 focus:border-blue-600 focus:outline-blue-300': !$props.errorMessage,
        }"
        class="border duration-300 ease-in-out px-3 py-1.5 rounded-lg transition-all
        focus:bg-white focus:outline-4"
    />
</template>
