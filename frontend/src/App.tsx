import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50' dir='rtl'>
        <Header />
        <main>
          <Routes>
            <Route path='/login' element={<Auth />} />

            <Route path='/' element={<Dashboard />} />
            <Route path='/programs' element={<Dashboard />} />
            <Route path='/program/new' element={<AddEditProgram />} />
            <Route path='/program/:id' element={<ProgramDetails />} />
            <Route path='/program/edit/:id' element={<AddEditProgram />} />

            <Route path='/mentors' element={<Mentors />} />
            <Route path='/mentors/new' element={<MentorForm />} />
            <Route path='/mentors/edit/:id' element={<MentorForm />} />

            <Route path='/students' element={<Students />} />
            <Route path='/students/new' element={<StudentForm />} />
            <Route path='/students/edit/:id' element={<StudentForm />} />

            <Route path='/attendance' element={<Attendance />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/reports' element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
