import { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';

const FoodDisplay = ({ category }) => {
  // Pulling our dynamic global inventory array from the store context
  const { food_list } = useContext(StoreContext);

  // 🎯 STEP 1: Filter the food items based on the active category selection
  const filteredFoodList = food_list.filter((item) => {
    return category === "All" || category === item.category;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      
      {/* 🎯 STEP 2: Render items if they exist, otherwise show a friendly message */}
      {filteredFoodList.length > 0 ? (
        <div className='food-display-list'>
          {filteredFoodList.map((item) => (
            <FoodItem 
              key={item._id} 
              id={item._id}
              name={item.name} 
              desc={item.description} 
              price={item.price} 
              image={item.image} 
            />
          ))}
        </div>
      ) : (
        <div className="food-display-empty">
          <p>No delicious dishes found in this category right now.</p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;