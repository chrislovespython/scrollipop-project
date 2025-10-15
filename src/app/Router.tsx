// src/app/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "../features/posts/pages/Feed";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Profile from "../features/profiles/pages/Profile";
import ProtectedRoute from "./providers/ProtectedRoute";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute isAuthenticated={false}>
        <Login />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
        { index: true, element: <Feed /> },
        { path: "profile/:username", element: <Profile /> },
        {
        path: "/search"
        },
        {
        path: "/post/:PostId"
        }
      // Add Search page later
      // { path: "search", element: <Search /> },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login/>
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;