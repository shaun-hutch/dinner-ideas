import { Box, Button, Card, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../foodItemsApi";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import './FoodItemFormComponent.scss';

export default function FoodItemFormComponent() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [nameValid, setNameValid] = useState<boolean>(true);
  const [descriptionValid, setDescriptionValid] = useState<boolean>(true);

  const navigate = useNavigate();

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNameValid(event.target.value !== '');
      setName(event.target.value);
    },
    [setNameValid, setName]
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescriptionValid(event.target.value !== '');
      setDescription(event.target.value);
    },
    [setDescriptionValid, setDescription]
  );

  const onCreate = useCallback(() => {
    setNameValid(name !== '');
    setDescriptionValid(description !== '');

    if (!nameValid || !descriptionValid) {
      return;
    }

    createItem(name, description).then(() => navigate("/"));
  }, [nameValid, descriptionValid, name, description, setNameValid, setDescriptionValid]);

  return (
    <div className='food-form'>
    <Card className='food-form-card'>
      <CardContent>
        <Box className='food-form-card-content' component="form">
          <div className='food-form-card-content-item'>
            <TextField required variant="filled" error={!nameValid} label="Name" onChange={onNameChange} />
          </div>
          <div className='food-form-card-content-item'>
            <TextField required variant="filled" error={!descriptionValid} label="Description" onChange={onDescriptionChange} />
          </div>
        </Box>
      </CardContent>
      <CardActions>
        <Box>
          <Button variant="outlined" onClick={onCreate}>Create</Button>
        </Box>
      </CardActions>
    </Card>
    </div>
      


  );
}
