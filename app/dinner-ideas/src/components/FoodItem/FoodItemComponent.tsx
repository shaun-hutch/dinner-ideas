import React from 'react';
import TrashCan from '../icons/TrashCan/TrashCan';
import './FoodItemComponent.css';

interface FoodItemComponentProps {
  name: string;
  description: string;
  id: string;
  onDeleteFoodItem: (id: string) => void;
}

export default function FoodItemComponent(props: FoodItemComponentProps) {
  const onDeleteClick = React.useCallback((id: string) => {
    props.onDeleteFoodItem(id);
  }, []);

  return (
    <div className="food-item">
      <div className="card w-96 glass">
        <figure><img src="https://placehold.co/200" /></figure>
        <div className="card-body">
          <h3 className="card-title">{props.name}</h3>
          <div className="description">
            <p>{props.description}</p>
          </div>
          <div className='card-actions justify-end'>
            <button className="btn btn-square btn-sm" onClick={() => onDeleteClick(props.id)}>
              <TrashCan />
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
}
