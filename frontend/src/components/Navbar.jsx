import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown, LogOut } from 'lucide-react';
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
        console.error('Failed to fetch IP location', err);
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
    <header style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* ══════════════════════════════════════════
          PRIMARY BAR  bg: #131921
      ══════════════════════════════════════════ */}
      <div
        className="flex items-center gap-0 w-full"
        style={{
          backgroundColor: '#131921',
          color: '#fff',
          height: '60px',
          padding: '0 10px',
        }}
      >

        {/* ─ LOGO ─ */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            flexShrink: 0,
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 4px',
            marginRight: '4px',
            transition: 'border-color 0.1s',
            height: '50px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
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

        {/* ─ LOCATION ─ */}
        <div
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 5px',
            marginRight: '6px',
            height: '50px',
            cursor: 'pointer',
            transition: 'border-color 0.1s',
          }}
          className="hidden lg:flex"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1, marginBottom: '3px' }}>
            {userInfo ? `Deliver to ${userInfo.name.split(' ')[0]}` : 'Delivering to'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', lineHeight: 1 }}>
            <MapPin size={12} /> {displayCity} {displayPincode}
          </span>
        </div>

        {/* ─ SEARCH BAR ─ */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            display: 'flex',
            height: '40px',
            borderRadius: '4px',
            overflow: 'hidden',
            minWidth: 0,
            marginRight: '8px',
          }}
        >
          {/* All dropdown */}
          <div
            style={{
              backgroundColor: '#f3f3f3',
              color: '#555',
              fontSize: '12px',
              padding: '0 8px',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              cursor: 'pointer',
              borderRight: '1px solid #ccc',
              whiteSpace: 'nowrap',
            }}
            className="hidden sm:flex"
          >
            All <ChevronDown size={11} />
          </div>

          {/* Text input */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Amazon.in"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '0 12px',
              fontSize: '14px',
              color: '#0F1111',
              backgroundColor: '#fff',
              minWidth: 0,
            }}
          />

          {/* Search button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#febd69',
              border: 'none',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3a847')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#febd69')}
          >
            <Search size={20} color="#0F1111" strokeWidth={2.5} />
          </button>
        </form>

        {/* ─ LANGUAGE ─ */}
        <div
          style={{
            alignItems: 'center',
            gap: '3px',
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 5px',
            height: '50px',
            cursor: 'pointer',
            flexShrink: 0,
            marginRight: '2px',
            transition: 'border-color 0.1s',
          }}
          className="hidden lg:flex"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg"
            style={{ width: '18px', height: '13px', objectFit: 'cover' }}
            alt="IN"
          />
          <span style={{ fontSize: '12px', fontWeight: 700 }}>EN</span>
          <ChevronDown size={11} color="#aaa" />
        </div>

        {/* ─ ACCOUNT ─ */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 8px',
            height: '50px',
            cursor: 'pointer',
            flexDirection: 'column',
            justifyContent: 'center',
            marginRight: '2px',
            transition: 'border-color 0.1s',
          }}
          className="hidden md:flex"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; setShowAccount(true); }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; setShowAccount(false); }}
        >
          <div className="flex flex-col justify-center">
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
          </div>

          {/* Dropdown */}
          {showAccount && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              width: '260px',
              backgroundColor: '#fff',
              color: '#0F1111',
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              border: '1px solid #d5d9d9',
              zIndex: 999,
              overflow: 'hidden',
            }}>
              {!userInfo ? (
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  <Link to="/login" style={{
                    display: 'block',
                    backgroundColor: '#FFD814',
                    border: '1px solid #FCD200',
                    borderRadius: '3px',
                    padding: '6px 0',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#0F1111',
                    textDecoration: 'none',
                    marginBottom: '8px',
                  }}>Sign In</Link>
                  <p style={{ fontSize: '12px', color: '#555' }}>
                    New customer?{' '}
                    <Link to="/register" style={{ color: '#007185' }}>Start here.</Link>
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>{userInfo.name}</p>
                    <p style={{ fontSize: '12px', color: '#767676' }}>{userInfo.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #eee' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Your Account</p>
                <Link to="/orders" style={{ display: 'block', fontSize: '12px', color: '#0F1111', padding: '2px 0' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C7511F')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#0F1111')}
                >Your Orders</Link>
              </div>
            </div>
          )}
        </div>

        {/* ─ RETURNS & ORDERS ─ */}
        <Link
          to="/orders"
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 8px',
            height: '50px',
            color: '#fff',
            textDecoration: 'none',
            marginRight: '2px',
            transition: 'border-color 0.1s',
          }}
          className="hidden md:flex"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1, marginBottom: '3px' }}>Returns</span>
          <span style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>&amp; Orders</span>
        </Link>

        {/* ─ CART ─ */}
        <Link
          to="/cart"
          style={{
            alignItems: 'center',
            gap: '4px',
            border: '2px solid transparent',
            borderRadius: '2px',
            padding: '2px 6px',
            height: '50px',
            color: '#fff',
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'border-color 0.1s',
          }}
          className="flex flex-col justify-center sm:flex-row sm:items-center"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          {/* Cart icon with count badge */}
          <div style={{ position: 'relative', width: '40px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={34} strokeWidth={1.5} style={{ position: 'absolute', bottom: '2px' }} />
            {/* Count — sits above the cart bowl, matching Amazon's exact position */}
            <span style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-40%)',
              color: '#FF9900',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: 1,
              fontFamily: 'Arial, sans-serif',
            }}>
              {cartCount}
            </span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, alignSelf: 'flex-end', marginBottom: '8px' }}
            className="hidden sm:block"
          >
            Cart
          </span>
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          SUB-NAV BAR  bg: #232F3E
      ══════════════════════════════════════════ */}
      <nav
        style={{
          backgroundColor: '#232F3E',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          height: '38px',
          overflowX: 'auto',
          borderBottom: '1px solid #3D3D3D',
        }}
        className="scrollbar-hide"
      >
        {/* Hamburger "All" */}
        <button
          onClick={onOpenSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#fff',
            background: 'none',
            border: '1px solid transparent',
            borderRadius: '2px',
            padding: '4px 8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginRight: '2px',
            transition: 'border-color 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <Menu size={20} /> All
        </button>

        {/* Nav links */}
        {SUB_NAV.map(({ label, link }) => (
          <Link
            key={label}
            to={link}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 400,
              padding: '4px 8px',
              border: '1px solid transparent',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'border-color 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
