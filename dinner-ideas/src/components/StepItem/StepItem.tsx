import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useCallback, useState } from "react";
import './StepItem.css';

interface StepItemProps {
    title: string;
    description: string;
    id: string;
    onRemove: (id: string) => void;
    onUpdate: (title: string, description: string, id: string) => void;
}

const StepItem = (props: StepItemProps) => {
    const { title, description, id, onRemove, onUpdate } = props;

    const [stepTitle, setStepTitle] = useState<string>(title);
    const [stepDescription, setStepDescription] = useState<string>(description);
    const [stepId] = useState<string>(id);

    console.log('step id', id);

    const handleBlur = useCallback((titleValue: string, descriptionValue: string) => {

        console.log(titleValue, descriptionValue);
        onUpdate(titleValue, descriptionValue, stepId);
    },[stepTitle, stepDescription, stepId, onUpdate]);

    return (
        <li>
            <div className="dinner-item-step">
                <div className="dinner-item-fields">
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputText id="name" className="dinner-item-text-input" value={stepTitle} onChange={e => setStepTitle(e.target.value)} onBlur={e => handleBlur(e.target.value, stepDescription)} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={stepDescription} onChange={e => setStepDescription(e.target.value)} onBlur={e => handleBlur(stepTitle, e.target.value)} />
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                    </div>
                </div>
                <div className="dinner-item-delete-action">
                    <Button icon="pi pi-trash" className="remove-button" severity="danger" raised rounded onClick={() => onRemove(stepId)}/>
                </div>
            </div>
        </li>
        );
}

export default StepItem;