import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useCallback, useEffect, useState } from "react";

interface StepItemProps {
    title: string;
    description: string;
    id: string;
    onRemove: (id: string) => void;
}

const StepItem = (props: StepItemProps) => {
    const { title, description, id, onRemove } = props;

    const [stepTitle, setStepTitle] = useState<string>();
    const [stepDescription, setStepDescription] = useState<string>();
    const [stepId, setStepId] = useState<string>('');

    useEffect(() => {
        if (props) {
            setStepTitle(title);
            setStepDescription(description);
            setStepId(id);
        }
    }, [title, description, id]);

    return (
        <li>
            <div className="dinner-item-step">
                <div className="dinner-item-fields">
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputText id="name" className="dinner-item-text-input" value={stepTitle} onChange={e => setStepTitle(e.target.value)} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={stepDescription} onChange={e => setStepDescription(e.target.value)}/>
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