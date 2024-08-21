import { useNavigate, useParams } from 'react-router-dom';
import './DinnerItemEditor.css';
import { DinnerItemContext } from 'hooks/useDinnerItemListContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import './DinnerItemEditor.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { update } from 'api/Api';
import { DinnerItem } from 'models/DinnerItem';

interface DinnerItemEditorProps {
    readOnly?: boolean;
}

const DinnerItemEditor = (props: DinnerItemEditorProps) => {
    const navigate = useNavigate();

    const {
        readOnly
    } = props;

    const [loaded, setLoaded] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [dinnerItem, setDinnerItem] = useState<DinnerItem>();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const { dinnerItemId } = useParams();
    const { getDinnerItem } = useContext(DinnerItemContext);

    useEffect(() => {
        if (dinnerItemId && getDinnerItem) {
            const item = getDinnerItem(dinnerItemId);
            if (item && !loaded) {
                setLoaded(true);
                setDinnerItem(item);

                // set all the other items
                setName(item.name);
                setDescription(item.description);
            }
        }
    }, [dinnerItemId, getDinnerItem, loaded]);

    const onNameChange = useCallback((content: string) => {
        console.log('name change', content);
        setName(content);
    },[setName]);

    const onDescriptionChange = useCallback((content: string) => {
        setDescription(content);
    },[setName]);

    const onSave = useCallback(() => {
        const payload: DinnerItem = {
            ...dinnerItem!,
            name,
            description
        };
        setIsSaving(true);

            update(payload).then((response: DinnerItem) => {
                setIsSaving(false);
                console.log(response);
                navigate('/');
            }, (error) => {
                setIsSaving(false);
                console.error(error);
            });
    }, [navigate, dinnerItem, setIsSaving, name, description]);

    return (
        <div className="dinner-item-form">
            {readOnly ? (
                <div className="dinner-item-form-viewer">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            ) : (
                <div className="dinner-item-form-editor">
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputText id="name" className="dinner-item-text-input" value={name} onChange={e => onNameChange(e.target.value)} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={description} onChange={e => onDescriptionChange(e.target.value)}/>
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                    </div>

                    <div className="dinner-item-form-buttons">
                        <Button icon="pi pi-save" className="save-button" raised rounded onClick={onSave} label="Save" disabled={isSaving} />
                    </div>
                </div>
            )}


        </div>

    )
}

export default DinnerItemEditor;