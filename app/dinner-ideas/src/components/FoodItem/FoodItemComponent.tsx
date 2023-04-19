import './FoodItemComponent.css';

interface FoodItemComponentProps {
  name: string;
  description: string;
}

export default function FoodItemComponent(props: FoodItemComponentProps) {
  return (
    <div className="card w-96 glass">
      <figure><img src="https://placehold.co/200" /></figure>
      <div className="card-body">
        <div className="card-title">
          <h3>{props.name}</h3>
        </div>
        <div className="description">
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
}
