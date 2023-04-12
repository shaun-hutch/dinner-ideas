import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../foodItemsApi";

export default function FoodItemFormComponent() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const navigate = useNavigate();

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [name]
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(event.target.value);
    },
    [description]
  );

  const onCreate = useCallback(() => {
    createItem(name, description).then(() => navigate("/"));
  }, [name, description]);

  return (
    <Box>
      <TextField required label="Name" onChange={onNameChange} />
      <TextareaAutosize required onChange={onDescriptionChange} />
      <Button onClick={onCreate}>Create</Button>
    </Box>
  );
}
