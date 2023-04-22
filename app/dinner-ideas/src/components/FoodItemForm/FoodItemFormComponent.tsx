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
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="food-item-form">
      <div className="card">
        <h2 className='card-title'>Create Food Item</h2>
        <div className='card-body'>
          <div className="food-form-card-content">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              onChange={onNameChange}
            />
          </div>
          <div className="food-form-card-content">
            <textarea className="textarea textarea-bordered w-full max-w-xs" placeholder="Description" onChange={onDescriptionChange}></textarea>
          </div>
        </div>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={onCreate}
              disabled={!nameValid || !descriptionValid}
            >
              Create
            </button>
          </div>
      </div>

    </div>
  );
}
