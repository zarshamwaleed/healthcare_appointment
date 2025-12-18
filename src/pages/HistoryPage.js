import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { mockDataService } from '../services/mockDataService';
import { useAccessibility } from '../context/AccessibilityContext';

const StatusBadge = ({ status }) => {
  const map = {
    completed: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || map.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const HistoryPage = () => {
  const { settings } = useAccessibility();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let mounted = true;
    mockDataService.getUserAppointments()
      .then(data => {
        if (mounted) setAppointments(data || []);
      })
      .catch(err => console.error(err));
    return () => { mounted = false; };
  }, []);

  return (
    <div className={`w-full px-6 py-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`font-bold mb-6 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>Appointment History</h1>

        {appointments.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-700 dark:text-white">No appointment history available.</p>
          </Card>
        )}

        <div className="space-y-4">
          {appointments.map(app => (
            <Card key={app.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{app.doctorName} <span className="text-sm font-normal text-gray-600 dark:text-gray-300">• {app.department}</span></h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{app.date} • {app.time}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-100 mb-2">
                    <strong>Symptoms:</strong> {app.symptoms?.join(', ') || 'N/A'}
                  </div>
                  {app.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-200">Notes: {app.notes}</div>
                  )}
                </div>

                <div className="w-36 text-right text-sm">
                  <div className="mb-2 text-gray-700 dark:text-white">{app.location}</div>
                  {app.followUpRequired && app.followUpDate && (
                    <div className="text-xs text-amber-700 dark:text-amber-200">Follow-up: {app.followUpDate}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
