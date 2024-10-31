import './DinnerItemSteps.css';
import { DinnerItemStep } from 'models/DinnerItem';
import StepItem from 'components/StepItem/StepItem';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';

interface DinnerItemStepsProps {
    steps: DinnerItemStep[];
    onStepsChange: (value: DinnerItemStep[]) => void;
    loaded: boolean;
}

const DinnerItemSteps = (props: DinnerItemStepsProps) => {
    const { steps: initialSteps, onStepsChange, loaded } = props;
    const [localSteps, setLocalSteps] = useState<DinnerItemStep[]>([]);

    const onRemove = useCallback((id: string) => {
        setLocalSteps(prevItems => [...prevItems.filter(x => x.id !== id)]);
    }, []);

    const onAdd = useCallback(() => {
        setLocalSteps(prevItems => [...prevItems, {
            id: crypto.randomUUID(),
            stepDescription: '',
            stepTitle: ''
        }]);
    }, []);

    const onUpdate = useCallback((title: string, description: string, id: string) => {
        const newItem = {
            id,
            stepDescription: description,
            stepTitle: title
        };

        console.log(title, description, 'results');

        setLocalSteps(prevItems => 
            prevItems.map(prevItem => prevItem.id === id ? newItem : prevItem)
        );

        console.log('local steps', localSteps);

        onStepsChange(localSteps);
    }, [onStepsChange, localSteps]);

    useEffect(() => {
        if (loaded) {
            setLocalSteps(initialSteps);
        } 

    }, [loaded]);

    return (
        <div className="dinner-item-steps">
            <h4>Steps</h4>
            <ol className="dinner-item-steps-list">
                    {!loaded ? loadingSkeleton :
                    (localSteps.map(s => 
                        <>
                            <StepItem title={s.stepTitle} description={s.stepDescription} id={s.id} onRemove={onRemove} onUpdate={onUpdate} key={crypto.randomUUID()}/>
                        </>
                    ))}
            </ol>

            <div className="dinner-item-add-action">
                <Button icon="pi pi-plus" className="remove-button" severity="success" raised rounded onClick={onAdd}/>
            </div>


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