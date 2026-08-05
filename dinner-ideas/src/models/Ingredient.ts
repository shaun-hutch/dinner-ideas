import { Measurement } from "./Measurement";

export interface Ingredient {
    id: string;
    name: string;
    description: string;
    measurement: Measurement;
    amount: number;
    /** Optional free-form quantity for non-numeric measurements (e.g., "to taste", "1 can"). */
    quantity?: string;
    /** Optional reference to the step this ingredient is used in. */
    stepId?: string;
}
