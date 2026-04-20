import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, clearAuthMessage } from '../../features/auth/authSlice';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogOut = async () => {
    dispatch(clearAuthMessage());
    await dispatch(logOut());
    navigate('/signin');
  };

  return (
    <header>
      <h2>Management</h2>

      {!isAuthenticated ? (
        <div>
          <Link to="/signin">Sign In</Link>
        </div>
      ) : (
        <div>
          <button onClick={handleLogOut}>Sign Out</button>
        </div>
      )}
    </header>
  );
}

export default Header;