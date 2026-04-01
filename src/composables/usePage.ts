import { ErrorCode } from '@src/types/page'
import { ref, Ref } from 'vue'

export const usePage = () => {
    const errorCode: Ref<ErrorCode> = ref(0)
    const isError = ref(false)
    const isLoading = ref(false)

    async function pageIsError(code: ErrorCode): Promise<void> {
        isError.value = true
        errorCode.value = code

        return Promise.resolve()
    }
    function pageLoading(value: boolean): void {
        isLoading.value = value

        if (value) {
            isError.value = false
            errorCode.value = 0
        }
    }

    return {
        errorCode,
        isError,
        isLoading,

        pageIsError,
        pageLoading,
    }
}
