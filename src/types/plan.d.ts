export interface ModuleState {
    items: Plan[]
}

export interface Plan {
    id: number,
    name: string,
    price_cents?: number,
    is_active?: boolean,
    limit_bytes: number // Max size
}

export interface PlanUser {
    id: number,
    name: string,
    limit_bytes: number
}
