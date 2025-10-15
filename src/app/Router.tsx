// src/app/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "../features/posts/pages/Feed";
import Login from "../features/auth/pages/Login";
import Profile from "../features/profiles/pages/Profile";
import ProtectedRoute from "./providers/ProtectedRoute";
import ErrorPage from "./ErrorPage";
import { ThemeProvider } from "./providers/ThemeProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute isAuthenticated={false}>
        <Login />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  { path: "/feed", element: <Feed /> },
  { path: "profile/:username", element: <Profile /> },
  {
  path: "/search"
  },
  {
  path: "/post/:PostId"
  },
  {
    path: "/login",
    element: <Login/>
  }
]);

export const AppRouter = () => <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
  