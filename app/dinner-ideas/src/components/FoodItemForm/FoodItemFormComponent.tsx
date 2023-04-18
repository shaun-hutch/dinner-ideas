import { Box, Button, Card, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../foodItemsApi';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import './FoodItemFormComponent.scss';

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
    <div className="food-form">
      <Card className="food-form-card">
        <CardContent>
          <Box className="food-form-card-content">
              <TextField
                required
                variant="filled"
                error={!nameValid}
                label="Name"
                className="food-form-card-content-item"
                onChange={onNameChange}
              />
              <TextField
                required
                variant="filled"
                error={!descriptionValid}
                label="Description"
                onChange={onDescriptionChange}
                className="food-form-card-content-item"
              />
          </Box>
        </CardContent>
        <CardActions>
          <Box>
            <Button
              variant="outlined"
              onClick={onCreate}
              disabled={!nameValid || !descriptionValid}
            >
              Create
            </Button>
          </Box>
        </CardActions>
      </Card>
    </div>
  );
}
