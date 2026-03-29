import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import Button from '../components/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerApi, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const res = await registerApi({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res.data }));
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.data?.message || err.error || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16">
      <Link to="/" className="mb-6">
        <img 
          src="https://links.papareact.com/f90" 
          alt="Amazon Logo" 
          className="w-[103px] object-contain"
          onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"; }}
        />
      </Link>
      
      <div className="w-[350px] border border-[#ddd] rounded-[4px] p-6 shadow-sm">
        <h1 className="text-[28px] font-normal leading-tight mb-4">Create account</h1>
        
        {errorMsg && (
          <div className="border border-[#C40000] bg-[#FFF6F6] rounded px-3 py-2 mb-4 text-[13px] text-[#C40000]">
            <strong>There was a problem.</strong>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold text-[13px] mb-1">Your name</label>
            <input 
              type="text" 
              required
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="amz-input" 
            />
          </div>

          <div>
            <label className="block font-bold text-[13px] mb-1">Email</label>
            <input 
              type="email" 
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amz-input" 
            />
          </div>
          
          <div className="relative">
            <label className="block font-bold text-[13px] mb-1">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amz-input pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[26px] text-[11px] text-gray-500 hover:text-[#007185] font-medium"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1 italic">
              ⓘ Passwords must be at least 6 characters.
            </p>
          </div>

          <div>
            <label className="block font-bold text-[13px] mb-1">Re-enter password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="amz-input" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn-primary w-full h-[33px] rounded-[3px] text-[13px] shadow-sm hover:shadow-md active:shadow-inner transition-all mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>
        
        <p className="text-[12px] mt-4 text-gray-800">
          By creating an account, you agree to Amazon's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-[13px]">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline hover:text-red-700">Sign in ⯈</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
