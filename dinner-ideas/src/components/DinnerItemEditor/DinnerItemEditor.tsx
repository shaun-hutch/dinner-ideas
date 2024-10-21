import { useNavigate, useParams } from 'react-router-dom';
import './DinnerItemEditor.css';
import { DinnerItemContext } from 'hooks/useDinnerItemListContext';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import './DinnerItemEditor.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { update } from 'api/Api';
import { DinnerItem, DinnerItemStep } from 'models/DinnerItem';
import { Dictionary } from 'models/Dictionary';
import { FoodTag } from 'models/FoodTag';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { foodTagListItems, totalTime } from 'helpers/componentHelpers';
import DinnerItemSteps from 'components/DinnerItemSteps/DinnerItemSteps';

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
    const [prepTime, setPrepTime] = useState<number>(0);
    const [cookTime, setCookTime] = useState<number>(0);
    const [steps, setSteps] = useState<DinnerItemStep[]>([]);
    const [tags, setTags] = useState<FoodTag[]>([]);

    const { dinnerItemId } = useParams();
    const { getDinnerItem, updateDinnerItem } = useContext(DinnerItemContext);

    useEffect(() => {
        if (dinnerItemId && getDinnerItem) {
            const item = getDinnerItem(dinnerItemId);
            if (item && !loaded) {
                setLoaded(true);
                setDinnerItem(item);

                // set all the other items
                setName(item.name);
                setDescription(item.description);
                setPrepTime(item.prepTime);
                setCookTime(item.cookTime);
                setTags(item.tags);
                setSteps(item.steps);
            }
        }
    }, [dinnerItemId, getDinnerItem, loaded]);

    useEffect(() => {
        console.log('steps', steps);
    }, [steps])

    const onSave = useCallback(() => {
        const payload: DinnerItem = {
            ...dinnerItem!,
            name,
            description,
            tags,
            steps

        };
        setIsSaving(true);

        update(payload).then((response: DinnerItem) => {
            setIsSaving(false);
            console.log(response);
            if (updateDinnerItem) {
                updateDinnerItem(response);
                navigate('/');
            }
        }, (error) => {
            setIsSaving(false);
            console.error(error);
        });
    }, [navigate, dinnerItem, setIsSaving, name, description, tags, steps, updateDinnerItem]);

    const totalItemTime = useMemo(() => totalTime(cookTime, prepTime), [cookTime, prepTime]);

    const tagListItems = foodTagListItems();

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
                            <InputText id="name" className="dinner-item-text-input" value={name} onChange={e => setName(e.target.value)} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={description} onChange={e => setDescription(e.target.value)}/>
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-times dinner-item-form-field">
                        <FloatLabel>
                            <InputNumber id="prepTime" className="dinner-item-number-input" value={prepTime} suffix=" mins" onChange={e => setPrepTime(e.value!)}/>
                            <label htmlFor="prepTime">Preparation Time</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputNumber id="cookTime" className="dinner-item-number-input" value={cookTime} suffix=" mins" onChange={e => setCookTime(e.value!)}/>
                            <label htmlFor="cookTime">Cooking Time</label>
                        </FloatLabel>
                        <div className='dinner-item-total-times'>
                            {totalItemTime && (
                                <FloatLabel>
                                    <InputText id="totalTime" className="dinner-item-number-input total" value={totalItemTime} readOnly={true}/>
                                    <label htmlFor="totalTime">Total Time</label>
                                </FloatLabel>
                            )}
                        </div>
                    </div>
                    <div className="dinner-item-form-field multi-select">
                        <FloatLabel>
                            <MultiSelect 
                                className="dinner-item-input" 
                                id="tags" 
                                value={tags} 
                                options={tagListItems} 
                                display="chip" 
                                maxSelectedLabels={3} 
                                placeholder="Select up to 3 Tags" 
                                onChange={e => setTags(e.value)} 
                                selectionLimit={3}
                                showSelectAll={false} 
                                showClear={false}
                                panelHeaderTemplate={() => <div style={{display: 'none'}}/>} />
                            <label htmlFor="tags">Tags</label>
                        </FloatLabel>
                    </div>

                    <div className="dinner-item-form-field">
                        <DinnerItemSteps steps={steps} onStepsChange={setSteps} />
                    </div>

                    <div className="dinner-item-form-buttons">
                        <Button icon={`pi ${isSaving ? "pi-spin pi-spinner" : "pi-save"}`} className="save-button" raised rounded onClick={onSave} label="Save" disabled={isSaving} />
                    </div>
                </div>
            )}


        </div>

    )
}

export default DinnerItemEditor;