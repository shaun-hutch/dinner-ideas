import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createItem, updateItem } from '../../foodItemsApi';
import './FoodItemFormComponent.css';

export default function FoodItemFormComponent() {
  const location = useLocation();
  console.log(location);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [foodItemId, setFoodItemId] = useState<string>('');

  const navigate = useNavigate();

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(event.target.value);
    },
    [setDescription]
  );

  const onUpdate = useCallback(() => {
    if (foodItemId !== '') {
      updateItem(name, description, foodItemId).then(() => navigate('/'));
    } else {
      createItem(name, description).then(() => navigate('/'));
    }
  }, [name, description, foodItemId]);

  const nameValid = useMemo(() => {
    return name !== '';
  }, [name]);

  const descriptionValid = useMemo(() => {
    return description !== '';
  }, [description]);

  useEffect(() => {
    setName(location?.state?.name ?? '');
    setDescription(location?.state?.description ?? '');
    setFoodItemId(location?.state?.id ?? '');
  }, []);

  return (
    <div className="food-item-form">
      <div className="card">
        <h2 className="card-title">Create Food Item</h2>
        <div className="card-body">
          <div className="food-form-card-content">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              onChange={onNameChange}
              value={name}
            />
          </div>
          <div className="food-form-card-content">
            <textarea
              className="textarea textarea-bordered w-full max-w-xs"
              placeholder="Description"
              onChange={onDescriptionChange}
              value={description}
            ></textarea>
          </div>
        </div>
        <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={onUpdate}
              disabled={!nameValid || !descriptionValid}
            >
              Save
            </button>
    
        </div>
      </div>
    </div>
  );
}
