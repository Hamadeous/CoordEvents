import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { supabase } from '../lib/supabase';
import 'react-day-picker/dist/style.css';

export default function EventParticipation() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create participant
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .insert([
          { event_id: id, name }
        ])
        .select()
        .single();

      if (participantError) throw participantError;

      // Add availability for each selected day
      const availabilityData = selectedDays.map(date => ({
        participant_id: participant.id,
        date: date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
      }));

      const { error: availabilityError } = await supabase
        .from('availability')
        .insert(availabilityData);

      if (availabilityError) throw availabilityError;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting availability:', error);
      alert('Failed to submit availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Merci de votre participation !</h2>
        <p className="text-gray-600">Votre disponibilité a été enregistrée.</p>
      </div>
    );
  }

  const css = `
    .rdp-day_selected:not([disabled]) { 
      background-color: #4f46e5;
      color: white;
    }
    .rdp-day_selected:hover:not([disabled]) { 
      background-color: #4338ca;
    }
    .rdp-day:hover:not([disabled]) {
      background-color: #e0e7ff;
    }
  `;

  return (
    <div className="max-w-2xl mx-auto">
      <style>{css}</style>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sélectionnez votre disponibilité</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Votre Prénom
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner les jours disponibles
          </label>
          <div className="border rounded-md p-4">
            <DayPicker
              mode="multiple"
              selected={selectedDays}
              onSelect={setSelectedDays as (days: Date[] | undefined) => void}
              className="mx-auto"
              modifiersStyles={{
                selected: {
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  borderRadius: '100%'
                }
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || selectedDays.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Availability'}
        </button>
      </form>
    </div>
  );
}
