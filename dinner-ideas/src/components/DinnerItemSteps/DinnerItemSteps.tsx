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
    const { steps } = props;

    const [itemSteps, setItemSteps] = useState<DinnerItemStep[]>([]);

    const onRemove = useCallback((id: string) => {
        setItemSteps(prevItems => [...prevItems.filter(x => x.id !== id)]);
    }, [itemSteps]);

    const onAdd = useCallback(() => {
        setItemSteps(prevItems => [...prevItems, {
            id: crypto.randomUUID(),
            stepDescription: '',
            stepTitle: ''
        }])
    }, []);

    useEffect(() => {
        setItemSteps(steps);
    },[steps]);

    return (
        <div className="dinner-item-steps">
            <ol className="dinner-item-steps-list">
                    {itemSteps.map(s => 
                        <>
                            <StepItem title={s.stepTitle} description={s.stepDescription} id={s.id} onRemove={onRemove} key={crypto.randomUUID()}/>
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