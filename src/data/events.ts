export interface Event {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  audience: string;
  location: string;
  description: string;
  status: string;
}

export const eventsData: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    class: "Business",
    date: "2025-05-28",
    startTime: "10:00",
    endTime: "11:00",
    type: "Meeting",
    audience: "Staff Only",
    location: "Conference Room A",
    description: "Weekly team sync meeting",
    status: "scheduled"
  },
  {
    id: 2,
    title: "End of Month Review",
    class: "Business",
    date: "2025-05-28",
    startTime: "14:00",
    endTime: "16:00",
    type: "Meeting",
    audience: "Staff Only",
    location: "Meeting Room 2",
    description: "Monthly performance review",
    status: "scheduled"
  },
  {
    id: 3,
    title: "Staff Training",
    class: "Education",
    date: "2025-05-29",
    startTime: "09:00",
    endTime: "12:00",
    type: "Training",
    audience: "Staff Only",
    location: "Training Room 1",
    description: "Professional development session",
    status: "scheduled"
  }
];
