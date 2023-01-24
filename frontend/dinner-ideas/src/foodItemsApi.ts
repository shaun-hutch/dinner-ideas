import { resolve } from 'path';
import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import { FoodItem } from './models/Models';

const api = 'https://vf47fh2d73xkr2567uypgbcpc40pvhso.lambda-url.us-west-1.on.aws/';

const useFoodItemsReducer = (state: FoodItemsState, action: Action) => {
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

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
    const initialState: FoodItemsState = {
        foodItems: [],
        isLoading: false,
        error: ''
    }   

    // const [state, dispatch] = useReducer(useFoodItemsReducer, initialState);

        // const call: Action = {
        //     type: ActionType.Call,
        //     data: [],
        //     error: ''
        // };
        // dispatch(call);



    const response = await window.fetch(api, {
        method: 'POST',
        body: JSON.stringify({ type: 0 })
    });
    const data = await response.json();

    return data.FoodItems;




        // await window.fetch(api, {
        //     method: 'POST',
        //     body: JSON.stringify(data)
        // }).then(response => {
        //     if (response.status === 200) {
        //         response.json().then(data => {
        //             const success: Action = {
        //                 type: ActionType.Success,
        //                 data: data.FoodItems,
        //                 error: ''
        //             };
        
        //             // dispatch(success);
        //             resolve(data.FoodItems);
        //         })
        //     }
        //     else {
        //         const failure: Action = {
        //             type: ActionType.Error,
        //             data: [],
        //             error: 'Something went wrong'
        //         }
        //         // 1dispatch(failure);
        //         return;
        //     }
        // });
}



interface FoodItemsState {
    foodItems: FoodItem[],
    isLoading: boolean,
    error: string
}

interface Action {
    type: ActionType,
    data: FoodItem[],
    error: string
}

enum ActionType {
    Call,
    Success,
    Error
}