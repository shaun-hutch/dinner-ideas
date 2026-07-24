import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { generateItems } from "../../api/Api";
import { DinnerItem } from "../../models/DinnerItem";
import DinnerListItem from "../DinnerListItem/DinnerListItem";
import { useNavigate } from "react-router-dom";
import "./Generate.css";

const Generate: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const generatedItems = await generateItems(5);
            setItems(generatedItems);
            setGenerated(true);
        } catch (err) {
            console.error("Failed to generate items:", err);
        } finally {
            setLoading(false);
        }
    };

    const itemTemplate = (item: DinnerItem) => (
        <DinnerListItem
            key={item.id}
            isLoading={loading}
            name={item.name}
            tags={item.tags}
            totalTime={item.cookTime + item.prepTime}
            id={item.id}
            onClick={(id) => navigate(`/view/${id}`)}
            onEditButtonClick={(id) => navigate(`/edit/${id}`)}
        />
    );

    return (
        <div className="generate-container">
            <Card title="Meal Inspiration">
                <div className="generate-content">
                    <p className="generate-description">
                        Get random meal suggestions from your recipe collection.
                        Click generate to see 5 randomly selected dinner ideas.
                    </p>

                    <div className="generate-action">
                        <Button
                            label={loading ? "Generating..." : "Generate Ideas"}
                            icon={`pi ${loading ? "pi-spin pi-spinner" : "pi-sync"}`}
                            onClick={handleGenerate}
                            disabled={loading}
                            raised
                            size="large"
                        />
                    </div>

                    {generated && items.length > 0 && (
                        <div className="generate-results">
                            <h3>Your Picks</h3>
                            <DataView
                                value={items}
                                layout="grid"
                                itemTemplate={itemTemplate}
                            />
                        </div>
                    )}

                    {generated && items.length === 0 && (
                        <div className="generate-empty">
                            <p>No recipes found. Try adding some recipes first!</p>
                            <Button
                                label="Create Recipe"
                                icon="pi pi-plus"
                                onClick={() => navigate("/create")}
                                raised
                            />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Generate;
