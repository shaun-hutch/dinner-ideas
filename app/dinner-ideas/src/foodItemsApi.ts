import { API, graphqlOperation } from "aws-amplify";
import { Action, ActionType, FoodItem, FoodItemsState } from "./models/Models";
import { listFoodItems } from "./graphql/queries";
import { createFoodItem, deleteFoodItem } from "./graphql/mutations";
import { GraphQLQuery } from "@aws-amplify/api";
import { CreateFoodItemInput, CreateFoodItemMutation, DeleteFoodItemInput, DeleteFoodItemMutation, ListFoodItemsQuery } from "./API";

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
  try {
    const foodData = await API.graphql<GraphQLQuery<ListFoodItemsQuery>>(
      graphqlOperation(listFoodItems)
    );
    const foodList = foodData.data?.listFoodItems?.items as FoodItem[];

    return foodList;
  } catch (err) {
    console.error("error getting food item list:", err);
    return [];
  }
}

export async function createItem(name: string, description: string) {
  try {
    const input: CreateFoodItemInput = {
      description,
      name
    };

    await API.graphql<GraphQLQuery<CreateFoodItemMutation>>(
      graphqlOperation(createFoodItem, { input })
    );
  } catch (err) {
    console.error("error creating food item:", err);
  }
}

export async function deleteItem(id: string) {
  try {
    const input: DeleteFoodItemInput = {
      id
    };

    await API.graphql<GraphQLQuery<DeleteFoodItemMutation>>(graphqlOperation(deleteFoodItem, { input }));
  } catch (err) {
    console.error('error deleting food item');
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
      };
    }
    case ActionType.Error: {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
  }
};
