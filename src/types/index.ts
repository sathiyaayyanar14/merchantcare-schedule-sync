
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
};

export type TimeSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  memberId: string;
};

export type BookingFormData = {
  brandName: string;
  ticketId: string;
  description: string;
  additionalGuests: string;
  timeSlotId: string;
  date: string;
};

export type Booking = {
  id: string;
  brandName: string;
  ticketId: string;
  description: string;
  additionalGuests: string[];
  timeSlot: TimeSlot;
  memberId: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
};

export type WeeklyReport = {
  id: string;
  weekStart: string;
  weekEnd: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  rescheduledBookings: number;
  memberStats: {
    memberId: string;
    memberName: string;
    bookingsCount: number;
  }[];
};
