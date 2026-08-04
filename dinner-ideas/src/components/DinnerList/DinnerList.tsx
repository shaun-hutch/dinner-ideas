import { Skeleton } from "primereact/skeleton";
import DinnerListItem from "components/DinnerListItem/DinnerListItem";
import { DataView } from "primereact/dataview";
import { DinnerItem } from "models/DinnerItem";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import './DinnerList.css';
import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DinnerItemContext } from "hooks/useDinnerItemListContext";
import { seedRecipes } from "api/Api";

const DinnerList = () => {  

    const { dinnerItemList, loading, addDinnerItem } = useContext(DinnerItemContext);
    const [seeding, setSeeding] = useState(false);
    const navigate = useNavigate();

    const onItemClick = React.useCallback((id: string) => {
        navigate(`/view/${id}`);
    }, [navigate]);

    const onEditItemClick = React.useCallback((id: string) => {
        navigate(`/edit/${id}`);
    }, [navigate]);

    const handleSeed = useCallback(async () => {
        setSeeding(true);
        try {
            const recipes = await seedRecipes();
            recipes.forEach(r => addDinnerItem?.(r));
        } catch (err) {
            console.error("Failed to seed recipes:", err);
        } finally {
            setSeeding(false);
        }
    }, [addDinnerItem]);

    const itemTemplate = (item: DinnerItem) => 
    {
        return (
            <DinnerListItem 
                key={item.id} 
                isLoading={loading} 
                name={item.name} 
                tags={item.tags} 
                totalTime={item.cookTime + item.prepTime} 
                imageKey={item.imageKey}
                id={item.id} 
                onClick={onItemClick} 
                onEditButtonClick={onEditItemClick}
                />
        );
    }

    const emptyState = (
        <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h2>No recipes yet</h2>
            <p>Get started by creating your first recipe or importing our starter collection.</p>
            <div className="empty-state-actions">
                <Button
                    label="Create Recipe"
                    icon="pi pi-plus"
                    onClick={() => navigate("/create")}
                    raised
                    size="large"
                />
                <Button
                    label={seeding ? "Importing..." : "Import Starter Recipes"}
                    icon={`pi ${seeding ? "pi-spin pi-spinner" : "pi-download"}`}
                    onClick={handleSeed}
                    raised
                    size="large"
                    severity="success"
                    disabled={seeding}
                />
            </div>
        </div>
    );

    return (
        <div>
            {!loading && dinnerItemList.length > 0 && (
                <div className="welcome-banner">
                    <h2>Your Recipes</h2>
                    <p>{dinnerItemList.length} recipe{dinnerItemList.length !== 1 ? 's' : ''} in your collection</p>
                </div>
            )}
            <Card>
                {loading ? (
                    <div className="grid">
                        {loadingSkeleton}
                    </div>
                ) : dinnerItemList.length === 0 ? (
                    emptyState
                ) : (
                    <DataView value={dinnerItemList} layout={"grid"} itemTemplate={itemTemplate}/>
                )}
            </Card>
        </div>
    )
}

export default DinnerList;


const loadingSkeleton = [...Array(6).keys()].map(x => 
    <div className="loading-skeleton" key={`skeleton_${x}`}>
        <Skeleton width="15rem" height="15rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" height="4rem"></Skeleton>
    </div>
);