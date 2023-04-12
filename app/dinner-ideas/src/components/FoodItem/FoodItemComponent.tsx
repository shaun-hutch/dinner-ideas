import { FoodItem } from "../../models/Models";
import "./FoodItemComponent.scss";

interface FoodItemComponentProps {
  name: string;
  description: string;
}

export default function FoodItemComponent(props: FoodItemComponentProps) {
  return (
    <div className="food-item">
      <div className="image">
        <img src="https://picsum.photos/100" />
      </div>
      <div className="name">
        <h3>{props.name}</h3>
      </div>
      <div className="description">
        <p>{props.description}</p>
      </div>
    </div>
  );
}
