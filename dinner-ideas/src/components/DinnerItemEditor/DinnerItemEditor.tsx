import { useParams } from 'react-router-dom';
import './DinnerItemEditor.css';
import { DinnerItemContext, useDiinnerItemListContext } from 'hooks/useDinnerItemListContext';
import { useContext } from 'react';

interface DinnerItemEditorProps {
    readOnly?: boolean;
}


const DinnerItemEditor = (props: DinnerItemEditorProps) => {
    const { dinnerItemId } = useParams();
    const { getDinnerItem } = useContext(DinnerItemContext);

    if (!dinnerItemId) {
        return null;
    } else {

        const item = getDinnerItem(dinnerItemId);
    
        console.log('item', item);
    }
    

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