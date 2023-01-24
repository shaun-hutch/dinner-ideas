import { Action, ActionType, FoodItem, FoodItemsState } from "../../models/Models";
import FoodItemComponent from "../FoodItem/FoodItemComponent";
import { getFoodItems } from "../../foodItemsApi";
import { useEffect, useState, useReducer } from "react";
import FoodItemContentLoader from "../FoodItem/FoodItemContentLoader";

interface FoodListProps
{
    listDate: Date;
}


const FoodList: React.FC<FoodListProps> = ({
    listDate
}) => {
    const initialState: FoodItemsState = {
        foodItems: [],
        isLoading: true,
        error: ''
    };

    const [state, dispatch] = useReducer(useFoodItemsReducer, initialState);
    const { isLoading, foodItems, error } = state;
    const formattedDate = listDate.toDateString();

    
    useEffect(() => {       
        getFoodItems('').then(data => {
            console.log(data);


            const success: Action = {
                type: ActionType.Success,
                data: data,
                error: ''
            };
            dispatch(success);

            // setFoodItems(data);
            // setIsLoading(false);
        });
    },[listDate]);

    console.log('is loading', isLoading);
    // if (isLoading) {
    //     return (
    //     <>
            
    //     </>
    //     );
    // }

    return (
        <>
            <h2>Food list thing</h2>
            <div className='date-label'>
                <h3>{formattedDate}</h3>
            </div>
                <div className="food-list">
            
                {isLoading ? 
                    <>
                        <ul>
                            {Array.from(Array(10).keys()).map(x => <li><FoodItemContentLoader key={`loading_${x}`}/></li>)}
                        </ul>
                    </> : <>
                            <ul>
                                {foodItems.map(foodItem => 
                                    <FoodItemComponent
                                        key={foodItem.Id}
                                        foodItem={foodItem}
                                    />
                                )}
                            </ul>
                    </>}
                </div>
        </>
    )
};

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

export default FoodList;