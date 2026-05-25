import React, { useContext } from 'react';
import './NewArrivals.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const NewArrivals = () => {
    const { db_food_list, food_list } = useContext(StoreContext);

    // If admin has uploaded items, display those. Otherwise, fallback to last 4 items as simulated new arrivals.
    const hasDbItems = db_food_list && db_food_list.length > 0;
    const arrivalsList = hasDbItems ? db_food_list : food_list.slice(-4);

    return (
        <div className="new-arrivals" id="new-arrivals">
            <div className="new-arrivals-header">
                <span className="new-tag">FRESH FROM THE KITCHEN</span>
                <h2>New Arrivals</h2>
                <p>Hot off the grill! Explore the latest additions uploaded by our culinary team.</p>
            </div>
            
            <div className="new-arrivals-list">
                {arrivalsList.map((item) => (
                    <div className="new-arrival-card-wrapper" key={item._id}>
                        <span className="badge-new">NEW</span>
                        <FoodItem 
                            id={item._id}
                            name={item.name}
                            desc={item.description}
                            price={item.price}
                            image={item.image}
                        />
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
};

export default NewArrivals;
