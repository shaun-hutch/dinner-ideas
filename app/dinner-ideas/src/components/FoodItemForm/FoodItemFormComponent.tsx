import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../foodItemsApi";

export default function FoodItemFormComponent() {

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const navigate = useNavigate();

    const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setName(event.target.value);
    }, []);

    const onDescriptionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(event.target.value);
        setDescription(event.target.value);
    }, []);

    const onCreate = useCallback(() => {
        console.log(name, description);
        createItem(name, description).then(() => navigate('/'));
    },[]);

    return (
        <Box>
            <TextField 
                required
                label="Name"
                onChange={onNameChange}
            />
            <TextareaAutosize 
                required
                onChange={onDescriptionChange} 
            />
            <Button onClick={onCreate}>Create</Button>
        </Box>
    )
};