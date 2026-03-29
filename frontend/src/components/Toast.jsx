import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../slices/uiSlice';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, dispatch]);

  if (!toast.isVisible) return null;

  const bgColors = {
    success: 'bg-[#E7F4E4] border border-[#067D62]',
    error: 'bg-[#FDF4F4] border border-[#C40000]',
    info: 'bg-[#EAF3FE] border border-[#007185]',
  };

  const textColors = {
    success: 'text-[#067D62]',
    error: 'text-[#C40000]',
    info: 'text-[#007185]',
  };

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${textColors.success}`} />,
    error: <AlertCircle className={`w-5 h-5 ${textColors.error}`} />,
    info: <Info className={`w-5 h-5 ${textColors.info}`} />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-slide-up">
      <div className={`p-4 rounded-md shadow-lg flex items-start gap-3 min-w-[300px] ${bgColors[toast.type] || bgColors.info}`}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type] || icons.info}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 font-medium">{toast.message}</p>
        </div>
        <button 
          onClick={() => dispatch(hideToast())}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default Toast;
