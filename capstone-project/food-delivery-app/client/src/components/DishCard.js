//DishCard.js

import React, { useContext } from "react";
import { RestaurantContext } from "../contexts/RestaurantContext";

const DishCard = ({ dish }) => {
    const { handleAddItems, handleRemoveItems } = useContext(RestaurantContext);

    const handleAdd = () => {
        handleAddItems(dish);
    };

    const handleRemove = () => {
        handleRemoveItems(dish);
    };

    return (
        <div className="dish-card">
            <h3>{dish.name}</h3>
            <img src={dish.image} alt="" />
            <p>Price: ₹{dish.price}</p>

            <div
                style={{
                    width: "40%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <button onClick={handleAdd}>+</button>
                <button onClick={handleRemove}>-</button>
            </div>

            <span className={dish.isVeg ? "veg" : "nonveg"}>
            {dish.isVeg ? "VEG" : "NON-VEG"}
            </span>

        </div>
    );
};

export default DishCard;