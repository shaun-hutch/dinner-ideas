import { Action, ActionType, FoodItem, FoodItemsState } from './models/Models';

// ideally would have this obtained from SSM parameter store
const api = 'https://vf47fh2d73xkr2567uypgbcpc40pvhso.lambda-url.us-west-1.on.aws/';

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
    const response = await window.fetch(api, {
        method: 'POST',
        body: JSON.stringify({ type: 0 })
    });
    const data = await response.json();

    return data.FoodItems;
}


export const useFoodItemsReducer = (state: FoodItemsState, action: Action) => {
    switch (action.type) {
        case ActionType.Call: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case ActionType.Success: {
            return {
                ...state,
                foodItems: action.data,
                isLoading: false,
            }
        }
        case ActionType.Error: {
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        }
    }
}