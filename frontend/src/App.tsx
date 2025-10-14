import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ProgramDetails from './pages/ProgramDetails';
import Mentors from './pages/Mentors';
import MentorForm from './pages/MentorForm';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Attendance from './pages/Attendance';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import AddEditProgram from './pages/AddEditProgram';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthProvider';
import ToastContainer from './components/common/Toast';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className='min-h-screen bg-gray-50' dir='rtl'>
            <Header />
            <main>
              <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
                <div className='container mx-auto px-4 py-8'>
                  <Routes>
                    {/* Public route */}
                    <Route path='/auth' element={<Auth />} />

                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                      <Route
                        path='/'
                        element={<Navigate to='/programs' replace />}
                      />
                      <Route path='/programs' element={<Dashboard />} />
                      <Route
                        path='/programs/new'
                        element={<AddEditProgram />}
                      />
                      <Route
                        path='/programs/:id'
                        element={<ProgramDetails />}
                      />
                      <Route
                        path='/programs/edit/:id'
                        element={<AddEditProgram />}
                      />

                      <Route path='/mentors' element={<Mentors />} />
                      <Route path='/mentors/new' element={<MentorForm />} />
                      <Route
                        path='/mentors/edit/:id'
                        element={<MentorForm />}
                      />

                      <Route path='/students' element={<Students />} />
                      <Route path='/students/new' element={<StudentForm />} />
                      <Route
                        path='/students/edit/:id'
                        element={<StudentForm />}
                      />

                      <Route path='/attendance' element={<Attendance />} />
                      <Route path='/schedule' element={<Schedule />} />
                      <Route path='/reports' element={<Reports />} />
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
