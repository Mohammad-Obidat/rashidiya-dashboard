import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
// import AddEditProgram from './pages/AddEditProgram';
// import ProgramDetails from './pages/ProgramDetails';
// import Mentors from './pages/Mentors';
// import MentorForm from './pages/MentorForm';
// import Students from './pages/Students';
// import StudentForm from './pages/StudentForm';
// import AttendancePage from './pages/Attendance';
// import SchedulePage from './pages/Schedule';
// import ReportsPage from './pages/Reports';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50' dir='rtl'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/programs' element={<Dashboard />} />
            <Route path='/login' element={<Auth />} />
            {/* <Route path='/program/new' element={<AddEditProgram />} /> */}
            {/* <Route path='/program/edit/:id' element={<AddEditProgram />} /> */}
            {/* <Route path='/program/:id' element={<ProgramDetails />} /> */}
            {/* <Route path='/mentors' element={<Mentors />} /> */}
            {/* <Route path='/mentors/new' element={<MentorForm mode='new' />} /> */}
            {/* <Route path='/mentors/:id' element={<MentorForm mode='edit' />} /> */}
            {/* <Route
              path='/mentors/:id/edit'
              element={<MentorForm mode='edit' />}
            /> */}

            {/* <Route path='/students' element={<Students />} /> */}
            {/* <Route path='/students/new' element={<StudentForm mode='new' />} /> */}
            {/* <Route
              path='/students/:id/edit'
              element={<StudentForm mode='edit' />}
            /> */}

            {/* <Route path='/attendance' element={<AttendancePage />} /> */}
            {/* <Route path='/schedule' element={<SchedulePage />} /> */}
            {/* <Route path='/reports' element={<ReportsPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
