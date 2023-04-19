import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../foodItemsApi';
import './FoodItemFormComponent.css';

export default function FoodItemFormComponent() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const navigate = useNavigate();

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value);
    },
    [setDescription]
  );

  const onCreate = useCallback(() => {
    createItem(name, description).then(() => navigate('/'));
  }, [name, description]);

  const nameValid = useMemo(() => {
    return name !== '';
  }, [name]);

  const descriptionValid = useMemo(() => {
    return description !== '';
  }, [description]);

  return (
    <div className="food-form">
      <div className="food-form-card">
        <div>
          <div className="food-form-card-content">
            <input
              type="text"
              required
              className="food-form-card-content-item"
              onChange={onNameChange}
            />
            <input
              type="text"
              required
              onChange={onDescriptionChange}
              className="food-form-card-content-item"
            />
          </div>
        </div>
        <div>
          <div>
            <input type="button"
              onClick={onCreate}
              disabled={!nameValid || !descriptionValid}
            />
              Create
          </div>
        </div>
      </div>
    </div>
  );
}
