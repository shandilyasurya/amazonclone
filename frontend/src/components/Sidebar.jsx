import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, ChevronRight, X, LogOut, Settings, HelpCircle, Globe, Flag } from 'lucide-react';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout as logoutAction } from '../slices/authSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const { data: categoriesData } = useGetCategoriesQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const categories = categoriesData?.data || [];

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      onClose();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/search?category=${slug}`);
    onClose();
  };

  const handleSearchClick = (query) => {
    navigate(`/search?search=${query}`);
    onClose();
  };

  const handleSortClick = (sort) => {
    navigate(`/search?sort=${sort}`);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Close Button (Floating next to sidebar) */}
      <div className={`sidebar-close ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <X size={32} />
      </div>

      {/* Main Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="sidebar-header">
          <User size={28} />
          <span>Hello, {userInfo ? userInfo.name.split(' ')[0] : 'sign in'}</span>
        </div>

        {/* Trending Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Trending</h3>
          <div className="sidebar-item" onClick={() => handleSortClick('rating')}>
            <span className="sidebar-item-text">Best Sellers</span>
          </div>
          <div className="sidebar-item" onClick={() => handleSortClick('newest')}>
            <span className="sidebar-item-text">New Releases</span>
          </div>
          <div className="sidebar-item" onClick={() => handleSortClick('price_asc')}>
            <span className="sidebar-item-text">Movers and Shakers</span>
          </div>
        </div>

        {/* Digital Content */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Digital Content and Devices</h3>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Echo & Alexa</span>
            <ChevronRight size={18} color="#888" />
          </div>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Fire TV</span>
            <ChevronRight size={18} color="#888" />
          </div>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Kindle E-Readers & eBooks</span>
            <ChevronRight size={18} color="#888" />
          </div>
        </div>

        {/* Shop By Category */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Shop by Category</h3>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="sidebar-item" 
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <span className="sidebar-item-text">{cat.name}</span>
              <ChevronRight size={18} color="#888" />
            </div>
          ))}
          {categories.length === 0 && (
             <div className="text-gray-400 text-[12px] italic">Loading categories...</div>
          )}
        </div>

        {/* Programs & Features */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Programs & Features</h3>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Amazon Pay</span>
          </div>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Gift Cards & Mobile Recharges</span>
          </div>
          <div className="sidebar-item">
            <span className="sidebar-item-text">Amazon Launchpad</span>
          </div>
        </div>

        {/* Help & Settings */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Help & Settings</h3>
          <Link to="/orders" onClick={onClose} className="sidebar-item">
            <span className="sidebar-item-text">Your Account</span>
          </Link>
          <div className="sidebar-item" onClick={() => handleSearchClick('amazon pay')}>
            <Globe size={18} className="mr-2" color="#888" />
            <span className="sidebar-item-text">English</span>
          </div>
          <div className="sidebar-item">
            <Flag size={18} className="mr-2" color="#888" />
            <span className="sidebar-item-text">India</span>
          </div>
          <div className="sidebar-item" onClick={() => handleSearchClick('customer service')}>
            <span className="sidebar-item-text">Customer Service</span>
          </div>
          {userInfo ? (
             <div className="sidebar-item" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" color="#888" />
                <span className="sidebar-item-text" style={{ fontWeight: 600 }}>Sign Out</span>
             </div>
          ) : (
            <Link to="/login" onClick={onClose} className="sidebar-item">
              <span className="sidebar-item-text" style={{ fontWeight: 600 }}>Sign In</span>
            </Link>
          )}
        </div>

        {/* Footer padding */}
        <div className="h-10" />
      </div>
    </>
  );
};

export default Sidebar;
