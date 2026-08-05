import './DinnerItemSteps.css';
import { DinnerItemStep } from 'models/DinnerItem';
import { Ingredient } from 'models/Ingredient';
import StepItem from 'components/StepItem/StepItem';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';

interface DinnerItemStepsProps {
    steps: DinnerItemStep[];
    ingredients: Ingredient[];
    onStepsChange: (value: DinnerItemStep[]) => void;
    onIngredientsChange: (value: Ingredient[]) => void;
    loaded: boolean;
    readOnly: boolean | undefined;
    create: boolean | undefined;
}

const DinnerItemSteps = (props: DinnerItemStepsProps) => {
    const { steps: initialSteps, ingredients, onStepsChange, onIngredientsChange, loaded, readOnly, create } = props;
    const [localSteps, setLocalSteps] = useState<DinnerItemStep[]>([]);

    const onRemove = useCallback((id: string) => {
        const filtered = localSteps.filter(x => x.id !== id);

        // Also unassign any ingredients that were linked to this step
        const updatedIngredients = ingredients.map(ing =>
            ing.stepId === id ? { ...ing, stepId: undefined } : ing
        );
        onIngredientsChange(updatedIngredients);

        setLocalSteps(filtered);
        onStepsChange(filtered);

    }, [localSteps, ingredients, onStepsChange, onIngredientsChange]);

    const onAdd = useCallback(() => {
        const newSteps = [
            ...localSteps,
            {
                id: crypto.randomUUID(),
                stepDescription: '',
                stepTitle: ''
            }
        ];

        setLocalSteps(newSteps);
        onStepsChange(newSteps);

    }, [localSteps, onStepsChange]);

    const onUpdate = useCallback((title: string, description: string, id: string) => {
        const newItem = {
            id,
            stepDescription: description,
            stepTitle: title
        };

        const indexToUpdate = localSteps.findIndex(x => x.id === id);
        if (indexToUpdate > -1) {
            const updated = [...localSteps];
            updated[indexToUpdate] = newItem;
            setLocalSteps(updated);
            onStepsChange(updated);
        }
    }, [onStepsChange, localSteps]);

    /** Toggle ingredient association with a step. */
    const onToggleIngredient = useCallback((stepId: string, ingredientId: string) => {
        const updatedIngredients = ingredients.map(ing => {
            if (ing.id === ingredientId) {
                return { ...ing, stepId: ing.stepId === stepId ? undefined : stepId };
            }
            return ing;
        });
        onIngredientsChange(updatedIngredients);
    }, [ingredients, onIngredientsChange]);

    useEffect(() => {
        if (loaded) {
            setLocalSteps(initialSteps);
        } 

    }, [loaded]);

    return (
        <div className="dinner-item-steps">
            <h4>Steps</h4>
            <ol className="dinner-item-steps-list">
                    {!loaded && !create ? loadingSkeleton :
                    (localSteps.map(s => 
                        <StepItem
                            key={s.id}
                            title={s.stepTitle}
                            description={s.stepDescription}
                            id={s.id}
                            ingredients={ingredients}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            onToggleIngredient={onToggleIngredient}
                            readOnly={readOnly}
                        />
                    ))}
            </ol>

            {!readOnly && (
                <div className="dinner-item-add-action">
                    <Button icon="pi pi-plus" className="remove-button" severity="success" raised rounded onClick={onAdd}/>
                </div>
            )}

        </div>
    )

};

const loadingSkeleton = [...Array(3).keys()].map(x => 
    <div className="loading-skeleton" key={`skeleton_${x}`}>
        <Skeleton width="30rem" className="mb-1"></Skeleton>
        <Skeleton width="50rem" className="mb-2"></Skeleton>
        <Skeleton width="50rem" className="mb-2"></Skeleton>
        <Skeleton width="50rem" className="mb-2"></Skeleton>
    </div>
);

export default DinnerItemSteps;