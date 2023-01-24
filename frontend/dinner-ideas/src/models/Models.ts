export interface FoodItem
{
    Id: string;
    Name: string;
    Description: string;
    ImageBase64: string;
}

export interface FoodItemsState {
    foodItems: FoodItem[],
    isLoading: boolean,
    error: string
}

export interface Action {
    type: ActionType,
    data: FoodItem[],
    error: string
}

export enum ActionType {
    Call,
    Success,
    Error
}