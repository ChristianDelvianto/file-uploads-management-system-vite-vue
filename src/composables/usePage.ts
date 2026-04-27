import { ref, Ref } from 'vue'

export const usePage = () => {
    const isPageError = ref(false)
    const isPageLoading = ref(false)
    const pageErrorCode: Ref<number> = ref(0)

    async function pageIsError(code: number): Promise<void> {
        isPageError.value = true
        pageErrorCode.value = code

        return Promise.resolve()
    }
    function pageLoading(value: boolean): void {
        isPageLoading.value = value

        if (value) {
            isPageError.value = false
            pageErrorCode.value = 0
        }
    }

    return {
        isPageError,
        isPageLoading,
        pageErrorCode,

        pageIsError,
        pageLoading
    }
}
