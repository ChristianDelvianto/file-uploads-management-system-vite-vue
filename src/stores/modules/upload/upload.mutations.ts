import {
    ModuleState,
    UploadId,
    UploadList,
    UploadStatus
} from '@/types/upload'

/**
 * Insert new upload into the list.
 */
function NEW_ITEM(state: ModuleState, payload: UploadList): void {
    const item: UploadList = state.items[payload.id]

    if (!item) {
        state.items[payload.id] = payload
    }
}

/**
 * Remove an upload from the list.
 */
function REMOVE_ITEM(state: ModuleState, id: UploadId): void {
    const item: UploadList = state.items[id]

    if (item) {
        delete state.items[id]
    }
}

/**
 * Clear all upload list.
 */
function REMOVE_ALL_ITEMS(state: ModuleState): void {
    state.items = {}
}

/**
 * Modify `duration` attribute from an upload.
 */
function SET_ITEM_DURATION(state: ModuleState, payload: { id: UploadId, value: number }): void {
    const item: UploadList = state.items[payload.id]

    if (item) {
        item.duration = payload.value
    }
}

/**
 * Modify `last_chunk_index` attribute from an upload.
 */
function SET_ITEM_LAST_CHUNK_INDEX(state: ModuleState, payload: { id: UploadId, value: number }): void {
    const item: UploadList = state.items[payload.id]

    if (item) {
        item.last_chunk_index = payload.value
    }
}

/**
 * Modify `status` attribute from an upload.
 */
function SET_ITEM_STATUS(state: ModuleState, payload: { id: UploadId, value: UploadStatus }): void {
    const item: UploadList = state.items[payload.id]

    if (item) {
        item.status = payload.value
    }
}

/**
 * Modify `thumbnail` attribute from an upload.
 */
function SET_ITEM_THUMBNAIL(state: ModuleState, payload: { id: UploadId, value: File }): void {
    const item: UploadList = state.items[payload.id]

    if (item) {
        item.thumbnail = payload.value
    }
}

/**
 * Modify `uuid` attribute from an upload.
 */
function SET_ITEM_UUID(state: ModuleState, payload: { id: UploadId, value: string }): void {
    const item: UploadList = state.items[payload.id]

    if (item) {
        item.uuid = payload.value
    }
}

export default {
    NEW_ITEM,
    REMOVE_ITEM,
    REMOVE_ALL_ITEMS,
    SET_ITEM_DURATION,
    SET_ITEM_LAST_CHUNK_INDEX,
    SET_ITEM_STATUS,
    SET_ITEM_THUMBNAIL,
    SET_ITEM_UUID
}
