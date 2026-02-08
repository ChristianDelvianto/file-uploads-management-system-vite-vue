<script setup lang="ts">
const props = withDefaults(defineProps<Readonly<{
    errorMessage?: string,
    disabled?: boolean,
    modelValue?: string,
    name?: string,
    options: string[],
}>>(), {
    disabled: false,
})

const emit = defineEmits<{
    (eventName: 'update:modelValue', value: string): void,
}>()

// const model = defineModel({
//     type: String,
//     required: true,
// })

function handleChange(event: InputEvent): void {
    if (!props.disabled) {
        emit('update:modelValue', (event.target as HTMLSelectElement).value)
    }
}
</script>

<template>
    <select
        @change="handleChange"
        :name="$props.name"
        :disabled="$props.disabled"
        :class="{
            'bg-red-100 border-red-600 focus:border-red-600 focus:outline-4 focus:outline-red-300': $props.errorMessage,
            'bg-white border-stone-300 focus:border-blue-600 focus:outline-4 focus:outline-blue-300': !$props.errorMessage,
        }"
        class="border duration-300 ease-in-out overflow-hidden px-3 py-1.5 rounded-lg transition-all"
    >
        <option
            v-for="option in $props.options"
            :value="option"
            :selected="$props.modelValue === option"
            class="block text-center"
        >{{ option }}</option>
    </select>
</template>
