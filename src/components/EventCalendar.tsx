"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEvents } from "@/context/EventContext";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(null);
  const { events } = useEvents();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    onChange(new Date());
  }, []);
  
  const getTodaysEvents = (date: Date) => {
    const formattedDate = formatDate(date);
    return events.filter(event => event.date === formattedDate);
  };

  if (!isClient) {
    return <div className="bg-white p-4 rounded-md">Loading calendar...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {value instanceof Date && (
          getTodaysEvents(value).length > 0 ? (
            getTodaysEvents(value).map((event) => (
              <div
                className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
                key={event.id}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-gray-600">{event.title}</h1>
                  <span className="text-gray-300 text-xs">{event.startTime} - {event.endTime}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {event.type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No events for this day</div>
          )
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
