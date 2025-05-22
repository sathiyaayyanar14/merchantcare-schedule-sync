
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { TimeSlot } from '../types';

export const formatDate = (date: Date, formatString: string = 'MMM d, yyyy'): string => {
  return format(date, formatString);
};

export const formatTime = (timeString: string): string => {
  const [hour, minute] = timeString.split(':');
  const hourNum = parseInt(hour);
  const amPm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${amPm}`;
};

export const getCurrentWeekDays = (date: Date): Date[] => {
  const startDay = startOfWeek(date, { weekStartsOn: 0 });
  const endDay = endOfWeek(date, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: startDay, end: endDay });
};

export const getTimeSlotsByDay = (timeSlots: TimeSlot[], date: Date): TimeSlot[] => {
  const dateString = format(date, 'yyyy-MM-dd');
  return timeSlots.filter(slot => slot.date === dateString);
};

export const getAvailableTimeSlotsByDay = (timeSlots: TimeSlot[], date: Date): TimeSlot[] => {
  const dateString = format(date, 'yyyy-MM-dd');
  return timeSlots.filter(slot => slot.date === dateString && slot.available);
};

export const groupTimeSlotsByHour = (timeSlots: TimeSlot[]): Record<string, TimeSlot[]> => {
  const grouped: Record<string, TimeSlot[]> = {};
  
  timeSlots.forEach(slot => {
    const hour = slot.startTime.split(':')[0];
    if (!grouped[hour]) {
      grouped[hour] = [];
    }
    grouped[hour].push(slot);
  });
  
  return grouped;
};
