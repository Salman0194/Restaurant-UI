import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // 1. Handle the loading state to prevent flickering or blank screens
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Loading Authentication...</h3>
      </div>
    );
  }

  // 2. Redirect to login if no user is found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check for Role Authorization (Case-insensitive check is safer)
  const hasAccess = !allowedRoles || 
    allowedRoles.some(role => role.toLowerCase() === user.role?.toLowerCase());

  if (!hasAccess) {
    return <Navigate to="/login" replace />; 
  }

  // 4. Render 'children' if provided, otherwise render 'Outlet' for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;