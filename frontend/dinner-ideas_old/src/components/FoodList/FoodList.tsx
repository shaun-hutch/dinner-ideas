import { Action, ActionType, FoodItem, FoodItemsState } from "../../models/Models";
import FoodItemComponent from "../FoodItem/FoodItemComponent";
import { getFoodItems, useFoodItemsReducer } from "../../foodItemsApi";
import { useEffect, useState, useReducer } from "react";
import FoodItemContentLoader from "../FoodItem/FoodItemContentLoader";
import './FoodList.scss';

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
            const success: Action = {
                type: ActionType.Success,
                data: data,
                error: ''
            };
            dispatch(success);
        });
    },[listDate]);

    console.log('is loading', isLoading);
    return (
        <>
            <h2>Food list thing</h2>
            <div className='date-label'>
                <h3>{formattedDate}</h3>
            </div>
            <div className="food-list-items">
            {isLoading ? 
                    <>
                        {Array.from(Array(10).keys()).map(x => <FoodItemContentLoader key={`loading_${x}`}/>)}
                    </> : <>
                        <div>
                            {foodItems.map(foodItem => 
                                <FoodItemComponent
                                    key={foodItem.Id}
                                    foodItem={foodItem}
                                />
                            )}
                        </div>
                </>}
            </div>
        </>
    )
};



export default FoodList;