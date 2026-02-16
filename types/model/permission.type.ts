export interface Permission {
    id: number;
    userId: string;
    name?: string; // Optional since it's not marked as `notNull()`
}