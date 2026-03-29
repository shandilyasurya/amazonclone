const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-8 text-white w-full mt-auto">
      <button 
        onClick={scrollToTop} 
        className="w-full bg-[#37475A] hover:bg-[#485769] text-center py-4 text-[13px] font-semibold transition-colors focus:outline-none"
      >
        Back to top
      </button>
      <div className="bg-[var(--color-amazon-subheader)] py-10 px-4 flex justify-center border-b border-[#3a4553]">
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-8 text-[15px]">
          <div>
            <h4 className="font-bold mb-3 text-white">Get to Know Us</h4>
            <ul className="space-y-2 text-[#DDDDDD] flex flex-col">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press Releases</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white">Connect with Us</h4>
            <ul className="space-y-2 text-[#DDDDDD] flex flex-col">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white">Make Money with Us</h4>
            <ul className="space-y-2 text-[#DDDDDD] flex flex-col">
              <li><a href="#" className="hover:underline">Sell on Amazon Clone</a></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white">Let Us Help You</h4>
            <ul className="space-y-2 text-[#DDDDDD] flex flex-col">
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Returns Centre</a></li>
              <li><a href="#" className="hover:underline">100% Purchase Protection</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-amazon-navbar)] text-center py-6 text-sm text-[#DDDDDD]">
        <div className="flex justify-center gap-6 mb-2 text-xs">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
        </div>
        <p className="text-xs">&copy; 2026, Amazon Clone Demo By Agent. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
