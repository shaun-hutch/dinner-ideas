import { useParams } from 'react-router-dom';
import './DinnerItemEditor.css';

interface DinnerItemEditorProps {
    readOnly?: boolean;
}


const DinnerItemEditor = (props: DinnerItemEditorProps) => {
    const { dinnerItemId } = useParams();


    return (
        dinnerItemId ? (
            <>
            {dinnerItemId}
            {props.readOnly ? "read only" : ""}
            </>
        ) : <>create</>

    )
}

export default DinnerItemEditor;