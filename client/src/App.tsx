import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Todo from "./screens/Todo";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import AuthProvider from "./context/AuthProvider";
import GuestRoutes from "./routes/GuestRoutes";
import { ToastContainer } from "react-toastify";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Todo />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/signin",
    element: (
      <GuestRoutes>
        <Signin />
      </GuestRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestRoutes>
        <Signup />
      </GuestRoutes>
    ),
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;
