const QuantitySelector = ({ quantity, setQuantity, max = 10 }) => {
  return (
    <div className="flex border border-[#D5D9D9] rounded-[8px] overflow-hidden bg-[#F0F2F2] shadow-[0_2px_5px_rgba(15,17,17,0.15)] h-[31px] w-fit min-w-fit">
      <button 
        type="button"
        disabled={quantity <= 1}
        onClick={() => setQuantity(quantity - 1)}
        className="px-2 md:px-3 bg-[#F0F2F2] hover:bg-[#E3E6E6] text-black font-bold disabled:opacity-50 cursor-pointer w-8 md:w-9 flex-shrink-0 flex items-center justify-center transition-colors"
      >
        -
      </button>
      <div className="px-2 md:px-3 bg-white text-[14px] md:text-[15px] min-w-[32px] md:min-w-[44px] flex-shrink-0 flex justify-center items-center border-l border-r border-[#D5D9D9]">
        {quantity}
      </div>
      <button 
        type="button"
        disabled={quantity >= max}
        onClick={() => setQuantity(quantity + 1)}
        className="px-2 md:px-3 bg-[#F0F2F2] hover:bg-[#E3E6E6] text-black font-bold disabled:opacity-50 cursor-pointer w-8 md:w-9 flex-shrink-0 flex items-center justify-center transition-colors"
      >
        +
      </button>
    </div>
  );
};
export default QuantitySelector;
