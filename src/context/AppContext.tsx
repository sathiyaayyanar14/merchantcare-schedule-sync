
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeamMember, TimeSlot, Booking, WeeklyReport } from '../types';
import { mockTeamMembers, generateMockBookings } from '../utils/mockData';
import { format } from 'date-fns';
import { getStandardTimeSlots, assignTimeSlotsToTeamMembers } from '../utils/dateUtils';
import { googleCalendarService } from '../services/googleCalendarService';

type AppContextType = {
  teamMembers: TeamMember[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  weeklyReports: WeeklyReport[];
  selectedDate: Date;
  selectedTimeSlotId: string | null;
  setSelectedDate: (date: Date) => void;
  setSelectedTimeSlotId: (id: string | null) => void;
  createBooking: (bookingData: any) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  rescheduleBooking: (bookingId: string, newTimeSlotId: string) => Promise<boolean>;
  getBookingByUuid: (uuid: string) => Booking | undefined;
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
  updateTeamMemberCalendarStatus: (memberId: string, connected: boolean, googleCalendarId?: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [weeklyReports] = useState<WeeklyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);

  useEffect(() => {
    // Generate 16 standard time slots for the selected date and assign them to team members
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const standardSlots = getStandardTimeSlots();
    const assignedSlots = assignTimeSlotsToTeamMembers(dateString, standardSlots, teamMembers);
    
    setTimeSlots(assignedSlots);
    
    // Initialize Google Calendar service
    googleCalendarService.init();
    
    // Generate mock bookings based on the new slots
    const mockBookings = generateMockBookings(assignedSlots, teamMembers);
    setBookings(mockBookings);
  }, [selectedDate, teamMembers]);

  const createBooking = async (bookingData: any): Promise<Booking> => {
    const timeSlot = timeSlots.find(ts => ts.id === bookingData.timeSlotId);
    if (!timeSlot) throw new Error('Time slot not found');

    // Create the booking
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      brandName: bookingData.brandName,
      ticketId: bookingData.ticketId,
      description: bookingData.description,
      additionalGuests: bookingData.additionalGuests.split(',').map((email: string) => email.trim()).filter(Boolean),
      timeSlot: timeSlot,
      memberId: timeSlot.memberId,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try to create Google Calendar event
    const teamMember = teamMembers.find(m => m.id === timeSlot.memberId);
    if (teamMember?.calendarConnected) {
      const result = await googleCalendarService.createEvent(newBooking);
      if (result.success) {
        newBooking.googleEventId = result.eventId;
      }
    }

    setBookings(prev => [...prev, newBooking]);
    
    // Update the time slot availability
    setTimeSlots(prev =>
      prev.map(ts =>
        ts.id === timeSlot.id ? { ...ts, available: false } : ts
      )
    );

    return newBooking;
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return false;

    // If Google Calendar integrated, delete the event
    if (bookingToCancel.googleEventId) {
      const teamMember = teamMembers.find(m => m.id === bookingToCancel.memberId);
      if (teamMember?.calendarConnected) {
        await googleCalendarService.deleteEvent(bookingToCancel.googleEventId);
      }
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled', updatedAt: new Date().toISOString() } : b
      )
    );

    // Make the time slot available again
    setTimeSlots(prev =>
      prev.map(ts =>
        ts.id === bookingToCancel.timeSlot.id ? { ...ts, available: true } : ts
      )
    );

    return true;
  };

  const rescheduleBooking = async (bookingId: string, newTimeSlotId: string): Promise<boolean> => {
    const bookingToReschedule = bookings.find(b => b.id === bookingId);
    const newTimeSlot = timeSlots.find(ts => ts.id === newTimeSlotId);
    
    if (!bookingToReschedule || !newTimeSlot) return false;

    // Update booking with new time slot
    const updatedBooking: Booking = {
      ...bookingToReschedule,
      timeSlot: newTimeSlot,
      memberId: newTimeSlot.memberId, // This might change if assigned to a different team member
      status: 'rescheduled' as const,
      updatedAt: new Date().toISOString()
    };

    // If Google Calendar integrated, update the event
    if (bookingToReschedule.googleEventId) {
      const teamMember = teamMembers.find(m => m.id === updatedBooking.memberId);
      if (teamMember?.calendarConnected) {
        await googleCalendarService.updateEvent(bookingToReschedule.googleEventId, updatedBooking);
      }
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? updatedBooking : b
      )
    );

    // Make old time slot available and new time slot unavailable
    setTimeSlots(prev =>
      prev.map(ts =>
        ts.id === bookingToReschedule.timeSlot.id ? { ...ts, available: true } :
        ts.id === newTimeSlotId ? { ...ts, available: false } : ts
      )
    );

    return true;
  };

  const updateTeamMemberCalendarStatus = (
    memberId: string, 
    connected: boolean, 
    googleCalendarId?: string
  ) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              calendarConnected: connected,
              googleCalendarId: connected ? googleCalendarId || member.googleCalendarId : undefined
            } 
          : member
      )
    );
  };

  const getBookingByUuid = (uuid: string): Booking | undefined => {
    return bookings.find(b => b.id === uuid);
  };

  const getUpcomingBookings = (): Booking[] => {
    const now = new Date();
    return bookings.filter(booking => {
      // Convert the booking date and time to a Date object
      const bookingDateParts = booking.timeSlot.date.split('-');
      const bookingTimeParts = booking.timeSlot.startTime.split(':');
      
      const bookingDate = new Date(
        parseInt(bookingDateParts[0]),
        parseInt(bookingDateParts[1]) - 1,
        parseInt(bookingDateParts[2]),
        parseInt(bookingTimeParts[0]),
        parseInt(bookingTimeParts[1])
      );
      
      return bookingDate > now && booking.status !== 'cancelled';
    });
  };

  const getPastBookings = (): Booking[] => {
    const now = new Date();
    return bookings.filter(booking => {
      // Convert the booking date and time to a Date object
      const bookingDateParts = booking.timeSlot.date.split('-');
      const bookingTimeParts = booking.timeSlot.startTime.split(':');
      
      const bookingDate = new Date(
        parseInt(bookingDateParts[0]),
        parseInt(bookingDateParts[1]) - 1,
        parseInt(bookingDateParts[2]),
        parseInt(bookingTimeParts[0]),
        parseInt(bookingTimeParts[1])
      );
      
      return bookingDate <= now || booking.status === 'cancelled';
    });
  };

  const value = {
    teamMembers,
    timeSlots,
    bookings,
    weeklyReports,
    selectedDate,
    selectedTimeSlotId,
    setSelectedDate,
    setSelectedTimeSlotId,
    createBooking,
    cancelBooking,
    rescheduleBooking,
    getBookingByUuid,
    getUpcomingBookings,
    getPastBookings,
    updateTeamMemberCalendarStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
