import { API, graphqlOperation } from 'aws-amplify';
import { Action, ActionType, FoodItem, FoodItemsState } from './models/Models';
import { listFoodItems } from './graphql/queries';
import { createFoodItem } from './graphql/mutations';
import { GraphQLQuery } from '@aws-amplify/api';
import { ListFoodItemsQuery } from './API';

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
    try {
        const foodData = await API.graphql<GraphQLQuery<ListFoodItemsQuery>>(graphqlOperation(listFoodItems));
        const foodList = foodData.data?.listFoodItems?.items as FoodItem[];
    
        return foodList;
    } catch (err) {
        console.error('error getting food item list:', err);
        return [];
    }

}

export async function createItem(name: string, description: string) {
    try {
        await API.graphql(graphqlOperation(createFoodItem, {input: {name, description }}));
    } catch (err) {
        console.error('error creating food item:', err);
    }
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