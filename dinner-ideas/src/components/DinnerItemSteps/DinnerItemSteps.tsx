import { Dictionary } from 'models/Dictionary';
import './DinnerItemSteps.css';
import { DinnerItemStep } from 'models/DinnerItem';

interface DinnerItemStepsProps {
    steps: DinnerItemStep[];
    onStepsChange: (value: DinnerItemStep[]) => void;
}

const DinnerItemSteps = (props: DinnerItemStepsProps) => {
    const { steps } = props;



    const step = (title: string, description: string) => {
        return (
            <li>
                <p>{title}</p>
                <p>{description}</p>
            </li>
        );
    };

    return (
        <div className="dinner-item-steps">
            <ul className="dinner-item-steps-list">
                {
                    steps.map(s => step(s.stepTitle, s.stepDescription))
                }
                
            </ul>


        </div>
    )

};

export default DinnerItemSteps;