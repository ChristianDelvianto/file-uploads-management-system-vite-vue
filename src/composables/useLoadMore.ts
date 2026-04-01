import { ErrorCode } from '@src/types/page'
import { ref, Ref } from 'vue'

export const useLoadMore = () => {
    const loadMoreErrorCode: Ref<ErrorCode> = ref(0)
    const loadMoreIsLoading = ref(false)

    async function loadMoreError(code: ErrorCode): Promise<void> {
        loadMoreErrorCode.value = code

        return Promise.resolve()
    }
    function loadMoreLoading(value: boolean): void {
        loadMoreIsLoading.value = value

        if (value) {
            loadMoreErrorCode.value = 0
        }
    }

    return {
        loadMoreErrorCode,
        loadMoreIsLoading,

        loadMoreError,
        loadMoreLoading,
    }
}
