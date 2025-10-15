// src/app/App.tsx
import { AppRouter } from "./Router";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "../components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}

export default App;