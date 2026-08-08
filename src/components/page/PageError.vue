<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import IconMDIErrorOutline from '@/components/svg/mdi/ErrorOutline.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

defineEmits<{
    (eventName: 'retry'): void
}>()

const props = withDefaults(defineProps<Readonly<{
    errorCode: number,
    errorImage?: string,
    errorMessage?: string
}>>(), {
    errorCode: 0
})

const errorMessage = {
    0: 'Something went wrong, please try again or refresh the page', // Default
    400: 'Bad request',
    401: 'It seems that you are not logged in, please log in to continue',
    403: 'Sorry, you are not allowed to access this',
    404: 'Opps, sorry but page not found',
    429: 'Too many requests, please slow down and try again later',
    500: 'Internal server error, please try again',
    503: 'Service unavailable, please try again later'
}[props.errorCode]

async function toLoginPage(): Promise<void> {
    store.dispatch('auth/loggedOut')

    await router.push('/login')
        .then(() => {
            store.dispatch('auth/logout')

            store.dispatch('upload/removeAll')
        })
}
</script>

<template>
    <div
        data-testid="page-error"
        class="flex flex-col gap-y-3 items-center justify-center p-6"
    >
        <img
            v-if="$props.errorImage"
            :src="$props.errorImage"
            draggable="false"
            class="max-w-md select-none w-full"
        />
        <IconMDIErrorOutline v-else :size="64" />

        <div
            role="alert"
            class="text-center"
        >
            {{ $props.errorMessage || errorMessage }}
        </div>

        <Button
            v-if="$props.errorCode === 401"
            @click="toLoginPage"
            test-id="page-error-login-button"
            class="border-stone-300/60! rounded-full!
            md:border-stone-600/60!"
        >Log in</Button>
        <Button
            v-else-if="$props.errorCode !== 403 && $props.errorCode !== 404"
            @click="$emit('retry')"
            test-id="page-error-retry-button"
            class="border-stone-300/60! rounded-full!
            md:border-stone-600/60!"
        >Try again</Button>
    </div>
</template>
