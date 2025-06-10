"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Event } from '@/data/events';
import { useEvents } from '@/context/EventContext';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import EditEventModal from '@/components/EditEventModal';
import './styles.css';

// Event Row Component
const EventRow: React.FC<{
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  role?: string;
}> = ({ event, onEdit, onDelete, role }) => {
  return (
    <tr key={event.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{event.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{event.type}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{event.date}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{`${event.startTime} - ${event.endTime}`}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(event)}
            className="px-2 py-1 hover:bg-gray-50 flex items-center text-sm text-gray-700"
          >
            <Image src="/update.png" alt="" width={18} height={18} className="inline mr-1 opacity-100" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="px-2 py-1 hover:bg-gray-50 flex items-center text-sm text-red-600"
          >
            <Image src="/delete.png" alt="" width={14} height={14} className="inline mr-1" />
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('view-event', { detail: event }))}
            className="px-2 py-1 hover:bg-gray-50 flex items-center text-sm"
          >
            <Image src="/view.png" alt="" width={14} height={14} className="inline mr-1" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const EventListPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, setEvents } = useEvents();
  const [role] = useState<string>("admin");
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    class: "",
    audience: "Staff Only",
    status: "active"
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleViewEvent = (e: CustomEvent<Event>) => {
      setSelectedEvent(e.detail);
      setShowEventModal(true);
    };

    window.addEventListener('view-event', handleViewEvent as EventListener);
    return () => window.removeEventListener('view-event', handleViewEvent as EventListener);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || activeTab !== "calendar") return;

    const calendarEl = document.getElementById("calendar-container");
    if (!calendarEl) return;

    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: events.map(event => ({
        id: String(event.id),
        title: event.title,
        start: `${event.date}T${event.startTime}`,
        end: `${event.date}T${event.endTime}`,
        className: event.type === "Exam" ? "event-type-exam" : 
                  event.type === "Holiday" ? "event-type-holiday" :
                  "event-type-meeting",
        extendedProps: {
          location: event.location,
          description: event.description,
          type: event.type
        }
      }))
    });

    calendar.render();
    return () => {
      calendar.destroy();
    };
  }, [events, activeTab, isClient]);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eventToAdd: Event = {
      id: events.length + 1,
      title: newEvent.title || '',
      type: newEvent.type || '',
      date: newEvent.date || '',
      startTime: newEvent.startTime || '',
      endTime: newEvent.endTime || '',
      description: newEvent.description || '',
      location: newEvent.location || '',
      class: newEvent.class || '',
      audience: newEvent.audience || '',
      status: 'active'
    };
    
    setEvents(prev => [...prev, eventToAdd]);
    setNewEvent({
      title: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      class: "",
      audience: "Staff Only",
      status: "active"
    });
    setActiveTab("events");
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (eventId: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
    setShowEventModal(false);
  };

  const handleEditSubmit = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  if (!isClient) {
    return <div className="p-4">Loading events...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "calendar"
                ? "bg-lamaPurple text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "events"
                ? "bg-lamaPurple text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "create"
                ? "bg-lamaPurple text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Create Event
          </button>
        </div>
      </div>

      {activeTab === "calendar" && (
        <div id="calendar-container" style={{ height: 'calc(100vh - 200px)' }}></div>
      )}

      {activeTab === "events" && (
        <div className="mt-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    role={role}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <form onSubmit={handleCreateSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleCreateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleCreateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Exam">Exam</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleCreateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleCreateInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                    required
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleCreateInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleCreateInputChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lamaPurple focus:border-lamaPurple"
                required
              />
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lamaPurple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamaPurple"
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      )}

      {showEditModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default EventListPage;
