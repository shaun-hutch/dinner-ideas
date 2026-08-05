import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { useCallback, useMemo, useState } from "react";
import { Ingredient } from "models/Ingredient";
import { formatIngredient } from "helpers/componentHelpers";
import './StepItem.css';

interface StepItemProps {
    title: string;
    description: string;
    id: string;
    ingredients: Ingredient[];
    onRemove: (id: string) => void;
    onUpdate: (title: string, description: string, id: string) => void;
    onToggleIngredient: (stepId: string, ingredientId: string) => void;
    readOnly: boolean | undefined;
}

const StepItem = (props: StepItemProps) => {
    const { title, description, id, ingredients, onRemove, onUpdate, onToggleIngredient, readOnly } = props;

    const [stepTitle, setStepTitle] = useState<string>(title);
    const [stepDescription, setStepDescription] = useState<string>(description);
    const [stepId] = useState<string>(id);

    const handleBlur = useCallback((titleValue: string, descriptionValue: string) => {
        onUpdate(titleValue, descriptionValue, stepId);
    },[stepId, onUpdate]);

    // Ingredients associated with this step (via stepId) OR unassigned (shown as available)
    const stepIngredients = useMemo(
        () => ingredients.filter(ing => ing.stepId === stepId),
        [ingredients, stepId]
    );

    // Unassigned ingredients available for this step to pick up
    const availableIngredients = useMemo(
        () => ingredients.filter(ing => !ing.stepId || ing.stepId === stepId),
        [ingredients, stepId]
    );

    return (
        <li>
            <div className="dinner-item-step">
                <div className="dinner-item-fields">
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputText id="name" className="dinner-item-text-input" value={stepTitle} onChange={e => setStepTitle(e.target.value)} onBlur={e => handleBlur(e.target.value, stepDescription)} readOnly={readOnly} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={stepDescription} onChange={e => setStepDescription(e.target.value)} onBlur={e => handleBlur(stepTitle, e.target.value)} readOnly={readOnly} />
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                    </div>

                    {/* ── Step Ingredients ──────────────────────────────── */}
                    {stepIngredients.length > 0 && (
                        <div className="step-ingredients">
                            <span className="step-ingredients-label">Ingredients for this step:</span>
                            <ul className="step-ingredients-list">
                                {stepIngredients.map(ing => (
                                    <li key={ing.id} className="step-ingredient-item">
                                        {readOnly ? (
                                            <span>{formatIngredient(ing)}</span>
                                        ) : (
                                            <label className="step-ingredient-checkbox">
                                                <Checkbox
                                                    checked={true}
                                                    onChange={() => onToggleIngredient(stepId, ing.id)}
                                                />
                                                <span>{formatIngredient(ing)}</span>
                                            </label>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Available ingredients to assign ───────────────── */}
                    {!readOnly && availableIngredients.filter(ing => ing.stepId !== stepId).length > 0 && (
                        <div className="step-ingredients step-ingredients-available">
                            <span className="step-ingredients-label">Add ingredient to this step:</span>
                            <ul className="step-ingredients-list">
                                {availableIngredients
                                    .filter(ing => ing.stepId !== stepId && ing.name.trim())
                                    .map(ing => (
                                        <li key={ing.id} className="step-ingredient-item">
                                            <label className="step-ingredient-checkbox">
                                                <Checkbox
                                                    checked={false}
                                                    onChange={() => onToggleIngredient(stepId, ing.id)}
                                                />
                                                <span>{formatIngredient(ing)}</span>
                                            </label>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>
            {!readOnly && (
                <div className="dinner-item-delete-action">
                    <Button icon="pi pi-trash" className="remove-button" severity="danger" raised rounded onClick={() => onRemove(stepId)}/>
                </div>
            )}
            </div>
        </li>
        );
}

export default StepItem;