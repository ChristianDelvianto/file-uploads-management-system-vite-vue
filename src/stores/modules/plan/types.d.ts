export interface StoreState {
    plans: Plan[],
}

export interface Plan {
    id: number,
    name: string,
    price: number,
    is_active: boolean,
    size: number, // Max size
}

export interface PlanUser {
    id: number,
    name: string,
    size: number,
}
