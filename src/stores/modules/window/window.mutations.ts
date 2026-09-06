import { ModuleState } from '@/types/window'

/**
 * Modify `width`.
 * 
 * @params number `Window inner width`
 * @returns void
 */
function SET_WIDTH(state: ModuleState, value: number): void {
    state.width = value
}

export default {
    SET_WIDTH
}
