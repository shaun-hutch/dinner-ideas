import './DinnerItemSteps.css';
import { DinnerItemStep } from 'models/DinnerItem';
import StepItem from 'components/StepItem/StepItem';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';

interface DinnerItemStepsProps {
    steps: DinnerItemStep[];
    onStepsChange: (value: DinnerItemStep[]) => void;
}

const DinnerItemSteps = (props: DinnerItemStepsProps) => {
    const { steps, onStepsChange } = props;

    const [loaded, setLoaded] = useState<boolean>(false);
    const [itemSteps, setItemSteps] = useState<DinnerItemStep[]>([]);

    const onRemove = useCallback((id: string) => {
        setItemSteps(prevItems => [...prevItems.filter(x => x.id !== id)]);
        onStepsChange(itemSteps);
    }, [itemSteps, onStepsChange]);

    const onAdd = useCallback(() => {
        setItemSteps(prevItems => [...prevItems, {
            id: crypto.randomUUID(),
            stepDescription: '',
            stepTitle: ''
        }]);
        onStepsChange(itemSteps);
    }, [itemSteps, onStepsChange]);

    const onUpdate = useCallback((title: string, description: string, id: string) => {
        const index = itemSteps.findIndex(x => x.id === id);
        if (index > -1) {
            itemSteps[index] = {
                id,
                stepDescription: description,
                stepTitle: title
            };
            onStepsChange(itemSteps);
        }
    }, [itemSteps, onStepsChange]);

    useEffect(() => {
        if (!loaded && steps) {
            setItemSteps(steps);
            setLoaded(true);
        }
    },[steps, loaded]);

    return (
        <div className="dinner-item-steps">
            <h4>Steps</h4>
            <ol className="dinner-item-steps-list">
                    {itemSteps.map(s => 
                        <>
                            <StepItem title={s.stepTitle} description={s.stepDescription} id={s.id} onRemove={onRemove} onUpdate={onUpdate} key={crypto.randomUUID()}/>
                        </>
                    )}
            </ol>

            <div className="dinner-item-add-action">
                <Button icon="pi pi-plus" className="remove-button" severity="success" raised rounded onClick={onAdd}/>
            </div>


        </div>
    )

};

export default DinnerItemSteps;