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
    <div className="min-h-screen bg-white flex flex-col items-center py-6">
      <Link to="/" className="mb-4">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon Logo" 
          className="w-[103px] object-contain"
        />
      </Link>
      
      <div className="w-[350px] border border-gray-300 rounded p-6">
        <h1 className="text-3xl font-normal mb-4">Create Account</h1>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Your name</label>
            <input 
              type="text" 
              required
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Password</label>
            <input 
              type="password" 
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Re-enter password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          
          <Button type="submit" fullWidth disabled={isLoading} className="mt-2 rounded-md">
            {isLoading ? 'Creating account...' : 'Create your Amazon account'}
          </Button>
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
