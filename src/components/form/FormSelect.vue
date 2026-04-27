<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<Readonly<{
    errorMessage?: string,
    disabled?: boolean,
    modelValue: string,
    name?: string,
    options: string[],
    testId?: string
}>>(), {
    disabled: false
})

const emit = defineEmits<{
    (eventName: 'update:modelValue', value: string): void
}>()

const uppercasedOptions = computed(function () {
    // For array of objects, we will require different approach
    return props.options.map((option: string) => {
        const uppercasedOption = option[0].toUpperCase() + option.slice(1)

        return {
            text: uppercasedOption,
            value: option
        }
    })
})

function handleChange(event: Event): void {
    if (!props.disabled) {
        emit('update:modelValue', (event.target as HTMLSelectElement).value)
    }
}
</script>

<template>
    <select
        @change="handleChange"
        :data-testid="testId"
        :value="modelValue"
        :name="name"
        :disabled="disabled"
        :class="{
            'bg-red-100 border-red-600 focus:border-red-600 focus:outline-4 focus:outline-red-300': errorMessage,
            'bg-white border-stone-300 focus:border-blue-600 focus:outline-4 focus:outline-blue-300': !errorMessage,
        }"
        class="border duration-300 ease-in-out overflow-hidden px-3 py-1.5 rounded-lg transition-all"
    >
        <option
            v-for="option in uppercasedOptions"
            :key="option.value"
            :value="option.value"
            :selected="modelValue === option.value"
            class="block text-center"
        >{{ option.text }}</option>
    </select>
</template>
