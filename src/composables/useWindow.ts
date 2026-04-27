import { useStore } from 'vuex'
import { computed } from 'vue'

export const useWindow = () => {
    const store = useStore()

    const windowWidth = computed<number>(function () {
        return store.getters['window/width']
    })

    return {
        windowWidth
    }
}
