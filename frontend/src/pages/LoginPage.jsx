import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => { if (userInfo) navigate('/'); }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res.data }));
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16">
      {/* Logo */}
      <Link to="/" className="mb-6">
        <img
          src="https://links.papareact.com/f90"
          alt="Amazon"
          className="w-[103px] object-contain"
        />
      </Link>

      {/* Card */}
      <div className="w-[350px] border-card rounded p-6 bg-white">
        <h1 className="text-[28px] font-normal text-amz-body mb-5">Sign in</h1>

        {errorMsg && (
          <div className="border border-[#C40000] bg-[#FFF6F6] rounded px-3 py-2 mb-4 text-[13px] text-[#C40000]">
            <strong>There was a problem.</strong>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold text-[13px] text-amz-body mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amz-input"
            />
          </div>

          <div>
            <label className="block font-bold text-[13px] text-amz-body mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amz-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full rounded-[3px] !rounded-[3px] h-[33px] text-[13px]"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-[12px] mt-4 text-amz-gray-4 leading-relaxed">
          By continuing, you agree to Amazon's{' '}
          <span className="text-link cursor-pointer">Conditions of Use</span> and{' '}
          <span className="text-link cursor-pointer">Privacy Notice</span>.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center w-[350px] mt-5 gap-3 text-amz-gray-4 text-[12px]">
        <div className="flex-1 border-t border-amz-gray-3" />
        New to Amazon?
        <div className="flex-1 border-t border-amz-gray-3" />
      </div>

      <div className="w-[350px] mt-3">
        <Link to="/register">
          <button className="btn-ghost w-full h-[33px] rounded-[3px] text-[13px]">
            Create your Amazon account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
