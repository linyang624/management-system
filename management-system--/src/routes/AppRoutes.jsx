import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import UpdatePasswordPage from '../pages/UpdatePasswordPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;