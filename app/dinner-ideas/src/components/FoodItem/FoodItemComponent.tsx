import { FoodItem } from "../../models/Models";
import './FoodItemComponent.scss';

interface FoodItemProps
{
    foodItem: FoodItem;
}

const FoodItemComponent: React.FC<FoodItemProps> = ({
    foodItem,
}) => {
    return (
        <div className="food-item">
            <div className="image">
                <img src={foodItem.ImageUrl} height="100" width="100" />
            </div>
            <div className="name">
                <h3>{foodItem.Name}</h3>
            </div>
            <div className="description">
                <p>{foodItem.Description}</p>
                test hello yee
            </div>
        </div>
    );
}

export default FoodItemComponent;