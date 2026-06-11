import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../redux/slices/authSlice";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirect = searchParams.get("redirect");

    if (token) {
      localStorage.setItem("impeccable_token", token);
      dispatch(fetchCurrentUser());
    }

    const timeout = setTimeout(() => {
      navigate(redirect || "/menu/impeccable-unisex-salon", { replace: true });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <svg viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="#D4AF37"/>
            <path d="M20 34l8 8 16-16" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-display text-2xl gold-text font-semibold mb-2">
          Welcome!
        </h1>
        <p className="text-text-secondary">Redirecting you back...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;