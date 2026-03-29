import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, Heart, LogOut, ChevronRight, User } from 'lucide-react';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout as logoutAction } from '../slices/authSlice';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <User size={64} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">Your Account</h1>
        <p className="text-gray-600 mb-6">Sign in for the best experience</p>
        <Link to="/login" className="w-full max-w-xs bg-[#FFD814] border border-[#FCD200] rounded-lg py-2.5 font-medium">
          Sign in
        </Link>
      </div>
    );
  }

  const menuItems = [
    { label: 'Your Orders', icon: <Package size={24} className="text-gray-600" />, link: '/orders', sub: 'Track, return, or buy things again' },
    { label: 'Your Wish List', icon: <Heart size={24} className="text-gray-600" />, link: '/wishlist', sub: 'See your saved items' },
    { label: 'Your Addresses', icon: <MapPin size={24} className="text-gray-600" />, link: '/orders', sub: 'Edit addresses for orders' }, // Reusing orders for placeholder or if/when addresses exist
  ];

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="bg-white p-4 border-b border-gray-300 mb-2">
        <h1 className="text-[22px] font-normal">Hello, <span className="font-bold">{userInfo.name}</span></h1>
      </div>

      <div className="max-w-xl mx-auto p-2 space-y-2">
        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.link} 
              className="bg-white p-4 rounded-md border border-gray-300 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <div>
                  <div className="text-[17px] font-medium text-[#0F1111]">{item.label}</div>
                  <div className="text-[13px] text-gray-600">{item.sub}</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-md border border-gray-300 overflow-hidden divide-y divide-gray-200 mt-4">
          <div className="p-4 bg-gray-50 font-bold text-[15px] text-[#0F1111] border-b border-gray-300">
            Account Settings
          </div>
          <button 
            onClick={handleLogout}
            className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 text-red-600">
              <LogOut size={24} />
              <span className="text-[17px] font-medium">Sign Out</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
