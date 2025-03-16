import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import CreateEvent from './components/CreateEvent';
import EventParticipation from './components/EventParticipation';
import EventDashboard from './components/EventDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">ScheduleSync</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventParticipation />} />
            <Route path="/dashboard/:id" element={<EventDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
