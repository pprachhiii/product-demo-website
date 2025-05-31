import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import TourEditor from "./pages/TourEditor";
import TourPreview from "./pages/TourPreview";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Route to create a new tour */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <TourEditor isNew={true} />
            </ProtectedRoute>
          }
        />

        {/* Route to edit an existing tour by ID */}
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <TourEditor />
            </ProtectedRoute>
          }
        />

        <Route path="/tour/:id" element={<TourPreview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
