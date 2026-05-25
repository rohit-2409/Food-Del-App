import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false);

  const { getTotalCartAmount, token, setToken, setCartItems } = useContext(StoreContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (section, selectedMenu, event, href) => {
    event.preventDefault();
    setMenu(selectedMenu);
    const scroll = () => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate(href);
      setTimeout(scroll, 150);
    } else {
      scroll();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setToken("");
    setCartItems({});
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>

      <ul className="navbar-menu">
        <li><a href='/' onClick={(e) => { e.preventDefault(); setMenu('home'); navigate('/'); }} className={`${menu === "home" ? "active" : ""}`}>home</a></li>
        <li><a href='/#explore-menu' onClick={(e) => scrollToSection('explore-menu', 'menu', e, '/')} className={`${menu === "menu" ? "active" : ""}`}>menu</a></li>
        <li><a href='/#app-download' onClick={(e) => scrollToSection('app-download', 'mob-app', e, '/')} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a></li>
        <li><a href='/#footer' onClick={(e) => scrollToSection('footer', 'contact', e, '/')} className={`${menu === "contact" ? "active" : ""}`}>contact us</a></li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        {!token
          ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : (
            <div className='navbar-profile' ref={profileRef}>
              {/* Click to toggle — stays open until clicked away */}
              <img
                src={assets.profile_icon}
                alt="profile"
                onClick={() => setProfileOpen((prev) => !prev)}
                className={profileOpen ? 'profile-icon-active' : ''}
              />

              {profileOpen && (
                <ul className='navbar-profile-dropdown'>
                  <li onClick={() => { navigate('/myorders'); setProfileOpen(false); }}>
                    <img src={assets.bag_icon} alt="" />
                    <p>Orders</p>
                  </li>
                  <hr />
                  <li onClick={logout}>
                    <img src={assets.logout_icon} alt="" />
                    <p>Logout</p>
                  </li>
                </ul>
              )}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Navbar
