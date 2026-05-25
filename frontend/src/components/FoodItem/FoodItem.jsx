import { useContext } from 'react'; // 🎯 REMOVED: Unused 'useState' import hook
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    // 🎯 REMOVED: Local 'itemCount' state since we use the shared global 'cartItems' store context
    const { cartItems, addToCart, removeFromCart, url, currency, token, setShowLogin } = useContext(StoreContext);

    // 🎯 ENHANCEMENT: Clean template string layout formatting for server or local static file assets
    const imageSrc = (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')))
        ? image
        : `${url}/images/${image}`;

    const handleAddToCart = () => {
        addToCart(id);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(id);
    };

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={imageSrc} alt={`${name} item visual`} />
                
                {!cartItems[id] ? (
                    <img 
                        className='add' 
                        onClick={handleAddToCart} 
                        src={assets.add_icon_white} 
                        alt="Add to cart button" 
                    />
                ) : (
                    <div className="food-item-counter">
                        <img 
                            src={assets.remove_icon_red} 
                            onClick={handleRemoveFromCart} 
                            alt="Reduce item count" 
                        />
                        <p>{cartItems[id]}</p>
                        <img 
                            src={assets.add_icon_green} 
                            onClick={handleAddToCart} 
                            alt="Increase item count" 
                        />
                    </div>
                )}
            </div>
            
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> 
                    <img src={assets.rating_starts} alt="Product star review ratings" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;