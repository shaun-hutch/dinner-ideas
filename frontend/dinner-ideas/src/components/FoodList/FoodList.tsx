import { FoodItem } from "../../models/FoodItem";
import FoodItemComponent from "../FoodItem/FoodItemComponent";

interface FoodListProps
{
    listDate: Date;
    weekItemId: string;
    isLoading: boolean;
}


const FoodList: React.FC<FoodListProps> = ({
    listDate,
    weekItemId,
    isLoading
}) => {

    const items = 10;

    const formattedDate = listDate.toDateString();

    

    const foodListItems = Array.from(Array(10).keys()).map(x => {
        const dummyItem: FoodItem = {
            Id: x.toString(),
            Description: 'test description here',
            Image: 'test',
            Name: `item ${x}`
        }
        return (
            <>
                <FoodItemComponent
                    foodItem={dummyItem}
                    isLoading={isLoading}
                />
            </>
        );
    })


    return (
        <>
            <h2>Food list thing</h2>
            <div className='date-label'>
                <h3>{formattedDate}</h3>
            </div>
            <div className="food-list">
                {foodListItems}
            </div>
        </>
    )
};

export default FoodList;