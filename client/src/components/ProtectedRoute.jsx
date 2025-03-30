const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  
  // Check if token exists
  const token = localStorage.getItem('token');
  
  // Parse user data
  const userData = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  // Debug logging
  console.log("ProtectedRoute - Required role:", requiredRole);
  console.log("ProtectedRoute - User data from localStorage:", userData);
  
  if (userData) {
    console.log("ProtectedRoute - User role property:", userData.role);
    // Check all properties to find where the role might be
    console.log("ProtectedRoute - All user properties:", Object.keys(userData));
  }
  
  // If not authenticated, redirect to sign-in
  if (!token) {
    console.log("ProtectedRoute - No token found, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If a role is required and user doesn't have it
  if (requiredRole) {
    // Log detailed information about the comparison
    console.log(`ProtectedRoute - Comparing roles: user role="${userData?.role}", required role="${requiredRole}"`);
    console.log(`ProtectedRoute - Exact match: ${userData?.role === requiredRole}`);
    
    if (!userData || userData.role !== requiredRole) {
      console.log("ProtectedRoute - Role mismatch, redirecting to unauthorized");
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  console.log("ProtectedRoute - Authorization successful, rendering protected content");
  return <Outlet />;
};