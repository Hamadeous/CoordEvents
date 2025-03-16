import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Participant {
  id: string;
  name: string;
  availability: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
}

export default function EventDashboard() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch participants and their availability
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select(`
            id,
            name,
            availability (date)
          `)
          .eq('event_id', id);

        if (participantsError) throw participantsError;

        const formattedParticipants = participantsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          availability: p.availability.map((a: any) => a.date)
        }));

        setParticipants(formattedParticipants);
      } catch (error) {
        console.error('Error fetching event data:', error);
        alert('Failed to load event data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/event/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            {event.description && (
              <p className="mt-2 text-gray-600">{event.description}</p>
            )}
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Share Link'}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Participants ({participants.length})</h2>
          {participants.length === 0 ? (
            <p className="text-gray-600">No participants yet. Share the link to invite people!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {participant.availability.length > 0 ? (
                          <ul>
                            {participant.availability.map((date) => (
                              <li key={date}>
                                {new Date(date).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No dates selected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
