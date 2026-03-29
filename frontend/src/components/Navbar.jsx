import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown, LogOut, User } from 'lucide-react';
import { useGetCartQuery } from '../slices/cartApiSlice';
import { useLogoutMutation, useGetAddressesQuery } from '../slices/userApiSlice';
import { logout as logoutAction } from '../slices/authSlice';
import { useDebounce } from '../hooks/useDebounce';

const SUB_NAV = [
  { label: 'Fresh', link: '/search?category=home-kitchen' },
  { label: 'MX Player', link: '/search' },
  { label: 'Sell', link: '/search' },
  { label: 'Bestsellers', link: '/search?sort=rating' },
  { label: 'Mobiles', link: '/search?category=electronics&search=mobile' },
  { label: "Today's Deals", link: '/search?sort=price_asc' },
  { label: 'Customer Service', link: '/search' },
  { label: 'Prime', link: '/search?search=prime' },
  { label: 'New Releases', link: '/search?sort=newest' },
  { label: 'Fashion', link: '/search?category=clothing' },
  { label: 'Electronics', link: '/search?category=electronics' },
];

const Navbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);
  const { data: addressesData } = useGetAddressesQuery(undefined, { skip: !userInfo });

  const [searchInput, setSearchInput] = useState('');
  const [showAccount, setShowAccount] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState({ city: 'New Delhi', pincode: '110001' });
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.postal) {
          setDetectedLocation({ city: data.city, pincode: data.postal });
        }
      } catch (err) {
        // Silently fail to avoid console clutter if API is down or rate-limited
      }
    };

    if (!userInfo || !addressesData?.data?.length) {
      fetchIPLocation();
    }
  }, [userInfo, addressesData]);

  const primaryAddress = addressesData?.data?.[0];
  const displayCity = primaryAddress ? primaryAddress.city : detectedLocation.city;
  const displayPincode = primaryAddress ? primaryAddress.pincode : detectedLocation.pincode;

  const { data: cartData } = useGetCartQuery(undefined, { skip: !userInfo });
  const cartCount = cartData?.data?.reduce((a, i) => a + i.quantity, 0) || 0;

  const [logoutApi] = useLogoutMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) navigate(`/search?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch { }
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <header className="flex flex-col w-full" style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* ──────────────────────────────────────────────────────────────────────
          ROW 1: MOBILE TOP BAR (Logo, Account, Cart) | DESKTOP SHARED TOP
          bg: #131921
      ────────────────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between md:justify-start gap-1 md:gap-0 w-full"
        style={{
          backgroundColor: '#131921',
          color: '#fff',
          height: '60px',
          padding: '0 10px',
        }}
      >
        {/* MOBILE: Hamburger & Logo */}
        <div className="flex items-center md:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 mr-1"
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-end h-[36px] ml-1">
            <img
              src="https://links.papareact.com/f90"
              alt="amazon"
              style={{ width: '75px', height: '22px', objectFit: 'contain', marginBottom: '4px' }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, marginLeft: '-8px', marginBottom: '5px', lineHeight: 3 }}>
              .in
            </span>
          </Link>
        </div>

        {/* DESKTOP: Logo */}
        <Link
          to="/"
          className="hidden md:flex items-end flex-shrink-0 border-2 border-transparent rounded-[2px] p-[2px_4px] mr-1 h-[50px] transition-colors hover:border-white"
        >
          <img
            src="https://links.papareact.com/f90"
            alt="amazon"
            style={{ width: '86px', height: '26px', objectFit: 'contain', marginBottom: '4px' }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, marginLeft: '-8px', marginBottom: '5px', lineHeight: 3 }}>
            .in
          </span>
        </Link>

        {/* DESKTOP: LOCATION (Hidden on mobile row 1) */}
        <div
          className="hidden lg:flex flex-col justify-center flex-shrink-0 border-2 border-transparent rounded-[2px] p-[2px_5px] mr-1.5 h-[50px] cursor-pointer transition-colors hover:border-white"
        >
          <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1, marginBottom: '3px' }}>
            {userInfo ? `Deliver to ${userInfo.name.split(' ')[0]}` : 'Delivering to'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', lineHeight: 1 }}>
            <MapPin size={12} /> {displayCity} {displayPincode}
          </span>
        </div>

        {/* DESKTOP: SEARCH BAR (Hidden on mobile row 1) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 items-center h-[40px] rounded-[4px] overflow-hidden mr-2"
        >
          <div className="hidden sm:flex bg-[#f3f3f3] text-[#555] text-[12px] p-[0_8px] items-center gap-1 shrink-0 cursor-pointer border-r border-[#ccc] whitespace-nowrap h-full">
            All <ChevronDown size={11} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Amazon.in"
            className="flex-1 border-none outline-none p-[0_12px] text-[14px] text-[#0F1111] bg-white h-full"
          />
          <button
            type="submit"
            className="bg-[#febd69] border-none p-[0_14px] flex items-center justify-center cursor-pointer shrink-0 transition-colors hover:bg-[#f3a847] h-full"
          >
            <Search size={20} color="#0F1111" strokeWidth={2.5} />
          </button>
        </form>

        {/* SHARED RIGHT SECTION (Sign-in, Cart) */}
        <div className="flex items-center gap-1 md:gap-0">

          {/* MOBILE SIGN IN LINK */}
          <Link to={userInfo ? "/profile" : "/login"} className="flex items-center md:hidden pr-2 text-white no-underline">
            <span className="text-[13px] mr-1 font-medium">
              {userInfo ? (userInfo.name.split(' ')[0]) : 'Sign in ›'}
            </span>
            <User size={24} strokeWidth={1.5} />
          </Link>

          {/* DESKTOP: LANGUAGE */}
          <div className="hidden lg:flex items-center gap-0.5 border-2 border-transparent rounded-[2px] p-[2px_5px] h-[50px] cursor-pointer shrink-0 mr-0.5 transition-colors hover:border-white">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg"
              style={{ width: '18px', height: '13px', objectFit: 'cover' }}
              alt="IN"
            />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>EN</span>
            <ChevronDown size={11} color="#aaa" />
          </div>

          {/* DESKTOP: ACCOUNT & LISTS */}
          <div
            className="hidden md:flex relative shrink-0 border-2 border-transparent rounded-[2px] p-[2px_8px] h-[50px] cursor-pointer flex-col justify-center mr-0.5 transition-colors hover:border-white"
            onMouseEnter={() => setShowAccount(true)}
            onMouseLeave={() => setShowAccount(false)}
          >
            <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1, marginBottom: '2px' }}>
              Hello, {userInfo ? (
                <span className="animate-[fadeIn_0.5s_ease-out] text-white font-medium">
                  {userInfo.name?.split(' ')[0] || 'User'}
                </span>
              ) : 'sign in'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              Account &amp; Lists <ChevronDown size={11} className="mt-0.5 text-[#aaa]" />
            </span>

            {showAccount && (
              <div className="absolute top-full right-0 mt-1 w-[260px] bg-white text-[#0F1111] rounded-[4px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[#d5d9d9] z-[999] overflow-hidden">
                {!userInfo ? (
                  <div className="p-4 border-b border-[#eee] text-center">
                    <Link to="/login" className="block bg-[#FFD814] border border-[#FCD200] rounded-[3px] p-[6px_0] text-[13px] font-normal text-[#0F1111] no-underline mb-2">Sign In</Link>
                    <p className="text-[12px] color-[#555]">
                      New customer? <Link to="/register" className="text-[#007185]">Start here.</Link>
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="p-[12px_16px] border-b border-[#eee]">
                      <p className="text-[13px] font-bold">{userInfo.name}</p>
                      <p className="text-[12px] text-[#767676]">{userInfo.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-[10px_16px] text-[13px] bg-none border-none cursor-pointer flex items-center gap-2 hover:bg-[#f5f5f5]"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
                <div className="p-[12px_16px] border-t border-[#eee]">
                  <p className="text-[12px] font-bold mb-1.5">Your Account</p>
                  <div className="flex flex-col gap-1.5">
                    <Link to="/orders" className="block text-[12px] text-[#0F1111] p-[2px_0] hover:text-[#C7511F] hover:underline">Your Orders</Link>
                    <Link to="/wishlist" className="flex items-center gap-1.5 text-[12px] text-[#0F1111] p-[2px_0] hover:text-[#C7511F] hover:underline">Your Wish List</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DESKTOP: RETURNS & ORDERS */}
          <Link
            to="/orders"
            className="hidden md:flex flex-col justify-center shrink-0 border-2 border-transparent rounded-[2px] p-[2px_8px] h-[50px] text-white no-underline mr-0.5 transition-colors hover:border-white"
          >
            <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1, marginBottom: '3px' }}>Returns</span>
            <span style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>&amp; Orders</span>
          </Link>

          {/* SHARED: CART */}
          <Link
            to="/cart"
            className="flex items-center gap-1 border-2 border-transparent rounded-[2px] p-[2px_6px] h-[50px] text-white no-underline shrink-0 transition-colors hover:border-white"
          >
            <div className="relative w-[40px] h-[46px] flex items-center justify-center">
              <ShoppingCart size={34} strokeWidth={1.5} className="absolute bottom-0.5" />
              <span className="absolute top-[2px] left-1/2 -translate-x-1/2 text-[#FF9900] text-[18px] font-bold leading-none font-sans">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:block text-[13px] font-bold self-end mb-2">Cart</span>
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          ROW 2: MOBILE SEARCH BAR
          bg: #131921
      ────────────────────────────────────────────────────────────────────── */}
      <div className="md:hidden mobile-search-row">
        <form
          onSubmit={handleSearch}
          className="flex items-center h-[44px] rounded-[4px] overflow-hidden"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Amazon.in"
            className="flex-1 border-none outline-none p-[0_12px] text-[15px] text-[#0F1111] bg-white h-full"
          />
          <button
            type="submit"
            className="bg-[#febd69] border-none p-[0_14px] flex items-center justify-center cursor-pointer shrink-0 h-full"
          >
            <Search size={22} color="#0F1111" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          ROW 3: SUB-NAV (Horizontal Scroll)
          bg: #232F3E
      ────────────────────────────────────────────────────────────────────── */}
      <nav
        style={{
          backgroundColor: '#232F3E',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          height: '42px',
          overflowX: 'auto',
          borderBottom: '1px solid #3D3D3D',
        }}
        className="scrollbar-hide"
      >
        {/* Hamburger "All" (Desktop only version or Desktop styled) */}
        <button
          onClick={onOpenSidebar}
          className="hidden md:flex items-center gap-1 color-white bg-none border border-transparent rounded-[2px] p-[4px_8px] text-[13px] font-bold cursor-pointer whitespace-nowrap shrink-0 mr-0.5 transition-colors hover:border-white text-white"
        >
          <Menu size={20} /> All
        </button>

        {/* Mobile Specific "Category" link as seen in Screenshot */}
        <Link to="/search" className="md:hidden text-white no-underline text-[14px] font-medium p-[4px_10px] whitespace-nowrap border-b-2 border-transparent">
          Shop By Category
        </Link>

        {/* Categories / SubNav items */}
        {SUB_NAV.map(({ label, link }) => (
          <Link
            key={label}
            to={link}
            className="text-white no-underline text-[14px] md:text-[13px] font-normal md:font-medium p-[4px_10px] md:p-[4px_8px] border border-transparent rounded-[2px] whitespace-nowrap shrink-0 transition-colors hover:border-white"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* ──────────────────────────────────────────────────────────────────────
          ROW 4: LOCATION BAR (Mobile focus)
          bg: #37475a
      ────────────────────────────────────────────────────────────────────── */}
      <div className="mobile-location-row md:hidden">
        <MapPin size={16} className="text-white" />
        <span className="flex-1 truncate">
          {userInfo ? `Deliver to ${userInfo.name} - ${displayCity} ${displayPincode}` : `Delivering to ${displayCity} ${displayPincode}`}
        </span>
        <ChevronDown size={14} className="text-gray-300" />
      </div>
    </header>
  );
};

export default Navbar;
