import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import { useTranslation } from "react-i18next";
import { getLanguageDirection } from "./lib/i18n.ts";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth/Auth";
import ProgramDetails from "./pages/ProgramDetails";
import Mentors from "./pages/Mentors";
import MentorForm from "./pages/MentorForm";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import Attendance from "./pages/Attendance";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import AddEditProgram from "./pages/AddEditProgram";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthProvider";
import ToastContainer from "./components/common/Toast";
import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  const { i18n } = useTranslation();
  const dir = getLanguageDirection(i18n.language);

  // Update document direction and font-family based on language
  useEffect(() => {
    document.documentElement.dir = dir;
    // Assuming a font-family change might be needed for Arabic/Hebrew
    // For simplicity, we'll just set the direction for now.
    // TailwindCSS utility classes might be enough for most styling.
  }, [dir]);
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50" dir={dir}>
            <Header />
            <main>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-2">
                  <Routes>
                    {/* Public route */}
                    <Route path="/auth" element={<Auth />} />

                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                      <Route
                        path="/"
                        element={<Navigate to="/programs" replace />}
                      />
                      <Route path="/programs" element={<Dashboard />} />
                      <Route
                        path="/programs/new"
                        element={<AddEditProgram />}
                      />
                      <Route
                        path="/programs/:id"
                        element={<ProgramDetails />}
                      />
                      <Route
                        path="/programs/edit/:id"
                        element={<AddEditProgram />}
                      />

                      <Route path="/mentors" element={<Mentors />} />
                      <Route path="/mentors/new" element={<MentorForm />} />
                      <Route
                        path="/mentors/edit/:id"
                        element={<MentorForm />}
                      />

                      <Route path="/students" element={<Students />} />
                      <Route path="/students/new" element={<StudentForm />} />
                      <Route
                        path="/students/edit/:id"
                        element={<StudentForm />}
                      />

                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/reports" element={<Reports />} />
                    </Route>
                  </Routes>
                </div>
              </div>
            </main>
            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
