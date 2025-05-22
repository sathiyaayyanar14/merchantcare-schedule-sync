
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { TimeSlot, TeamMember } from '../types';

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

// Generate exactly 16 standard 30-minute time slots from 9am to 5pm
export const getStandardTimeSlots = () => [
  { start: '09:00', end: '09:30' },
  { start: '09:30', end: '10:00' },
  { start: '10:00', end: '10:30' },
  { start: '10:30', end: '11:00' },
  { start: '11:00', end: '11:30' },
  { start: '11:30', end: '12:00' },
  { start: '12:00', end: '12:30' },
  { start: '12:30', end: '13:00' },
  { start: '13:00', end: '13:30' },
  { start: '13:30', end: '14:00' },
  { start: '14:00', end: '14:30' },
  { start: '14:30', end: '15:00' },
  { start: '15:00', end: '15:30' },
  { start: '15:30', end: '16:00' },
  { start: '16:00', end: '16:30' },
  { start: '16:30', end: '17:00' }
];

// Assign time slots to team members based on their availability
// For 4 team members, each gets 4 slots (total 16 slots per day)
export const assignTimeSlotsToTeamMembers = (date: string, timeSlots: { start: string, end: string }[], teamMembers: TeamMember[]) => {
  if (!teamMembers.length) return [];
  
  const availableMembers = teamMembers.filter(member => {
    // In a real app, we would check member's availability here
    return true;
  });
  
  if (!availableMembers.length) return [];
  
  // Group slots into 4 per team member (for 4 team members)
  return timeSlots.map((slot, index) => {
    // Calculate which team member gets this slot based on index
    // With 4 team members, each gets 4 consecutive slots
    const memberIndex = Math.floor(index / 4) % availableMembers.length;
    const assignedMember = availableMembers[memberIndex];
    
    return {
      id: `slot_${date}_${slot.start}`,
      date,
      startTime: slot.start,
      endTime: slot.end,
      available: true,
      memberId: assignedMember.id
    };
  });
};
