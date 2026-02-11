<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import IconMDIError from '@src/components/svg/mdi/Error.vue'
import { ErrorCode } from '@src/types/page'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

defineEmits<{
    (eventName: 'retry'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    errorCode: ErrorCode,
}>>(), {
    errorCode: 0,
})

const message = {
    0: 'Sorry, something went wrong [Code 0]', // Default
    400: 'Bad request',
    401: 'It seems that you are not logged in, please log in to access this page',
    403: 'Sorry, you are not allowed to access this page',
    404: 'Oopps, sorry but page not found',
    500: 'Internal server error, please try again',
}[props.errorCode]

async function toLoginPage(): Promise<void> {
    store.dispatch('auth/logout')

    await router.push('/login')
        .then(() => {
            store.dispatch('auth/loggedOut')
        })
}
</script>

<template>
    <div
        role="alert"
        class="flex flex-col gap-y-3 items-center justify-center p-6"
    >
        <IconMDIError :size="64" />

        <div class="text-center">{{ message }}</div>

        <Button
            v-if="$props.errorCode === 401"
            @click="toLoginPage"
            level="neutral"
        >To log in</Button>
        <Button
            v-else-if="$props.errorCode !== 404"
            @click="$emit('retry')"
        >Try again</Button>
    </div>
</template>
