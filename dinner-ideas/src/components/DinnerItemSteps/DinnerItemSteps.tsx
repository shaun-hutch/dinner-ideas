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
    const [itemSteps, setItemSteps] = useState<DinnerItemStep[]>(steps);

    const onRemove = useCallback((id: string) => {
        setItemSteps(prevItems => [...prevItems.filter(x => x.id !== id)]);
    }, []);

    const onAdd = useCallback(() => {
        setItemSteps(prevItems => [...prevItems, {
            id: crypto.randomUUID(),
            stepDescription: '',
            stepTitle: ''
        }]);
    }, []);

    const onUpdate = useCallback((title: string, description: string, id: string) => {
        // todo update this to set the item in the list
        // or recreate the list each time? surely no 
        const newItem = {
            id,
            stepDescription: description,
            stepTitle: title
        };

        setItemSteps(prevItems => 
            prevItems.map(prevItem => prevItem.id === id ? newItem : prevItem)
        );

    }, []);

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