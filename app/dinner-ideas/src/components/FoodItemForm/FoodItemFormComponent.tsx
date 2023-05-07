import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createItem, updateItem } from '../../foodItemsApi';
import './FoodItemFormComponent.css';
import { UserContext } from '../../App';

export default function FoodItemFormComponent() {
    const location = useLocation();

    const user = useContext(UserContext) as any;
    const sub = user?.attributes?.sub;

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [foodItemId, setFoodItemId] = useState<string>('');
    const [file, setFile] = useState<string>('');

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

    const onFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.currentTarget?.files) {
            const reader = new FileReader();
            reader.readAsDataURL(event?.currentTarget?.files[0]);
            
            reader.onload = () => {
                console.log(reader.result as string);
                setFile(reader.result as string);
            };
        } 
    }, [setFile]);    

    const onUpdate = useCallback(() => {
        console.log(file);
        if (foodItemId !== '') {
            updateItem(name, description, foodItemId, file).then(() => navigate('/'));
        } else {
            createItem(name, description, file).then(() => navigate('/'));
        }
    }, [name, description, foodItemId, file]);

    const nameValid = useMemo(() => {
        return name !== '';
    }, [name]);

    const descriptionValid = useMemo(() => {
        return description !== '';
    }, [description]);

    const imageValid = useMemo(() => {
        return file !== '';
    }, [file]);

    

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
                    <div className="food-form-card-content">
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs" accept="image/jpeg, image/png, image/jpg" onChange={onFileUpload}/>
                        <div className="upload-image">
                            { file && (
                                <img src={file} alt="image" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-actions">
                    <button
                        className="btn btn-primary"
                        onClick={onUpdate}
                        disabled={!nameValid || !descriptionValid || !imageValid}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
