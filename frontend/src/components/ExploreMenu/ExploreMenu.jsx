import { useContext } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../../Context/StoreContext';

const ExploreMenu = ({ category, setCategory }) => {
  // Destructuring menu_list directly out of our global state layer
  const { menu_list } = useContext(StoreContext);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </p>
      
      <div className="explore-menu-list">
        {menu_list.map((item) => {
          const isCategoryActive = category === item.menu_name;

          return (
            <div 
              // 🎯 Toggles active selection back to "All" if clicked twice
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              // 🎯 FIXED: Replaced array index with item name to ensure structural render stability
              key={item.menu_name} 
              className='explore-menu-list-item'
            >
              <img 
                src={item.menu_image} 
                // 🎯 Applied clean ternary conditional styling for the ring/glow active class
                className={isCategoryActive ? "active" : ""} 
                // 🎯 FIXED: Provided descriptive alt strings for accessibility
                alt={`${item.menu_name} category menu item`} 
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;