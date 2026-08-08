import { PlanUser } from '@/types/plan'
import { User } from '@/types/user'
import { useStore } from 'vuex'
import { computed } from 'vue'

export const useAuth = () => {
    const store = useStore()

    const authenticated = computed<boolean>(() => {
        return store.getters['auth/authenticated']
    })
    const profile = computed<User | null>(() => {
        return store.getters['auth/profile']
    })
    const usedBytes = computed<number>(() => {
        return store.getters['auth/used_bytes']
    })
    const userPlan = computed<PlanUser>(() => {
        return {
            id: store.getters['auth/plan_id'],
            limit_bytes: store.getters['auth/plan_limit_bytes'],
            name: store.getters['auth/plan_name']
        }
    })

    return {
        authenticated,
        profile,
        usedBytes,
        userPlan
    }
}
