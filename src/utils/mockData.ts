
import { TeamMember, TimeSlot, Booking } from '../types';
import { format, addDays, setHours, setMinutes } from 'date-fns';

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'member_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@merchantcare.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'member_2',
    name: 'Samantha Lee',
    email: 'samantha.lee@merchantcare.com',
    role: 'member',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'member_3',
    name: 'David Chen',
    email: 'david.chen@merchantcare.com',
    role: 'member',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'member_4',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@merchantcare.com',
    role: 'member',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
  },
];

export const generateMockTimeSlots = (date: Date, members: TeamMember[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const slotDuration = 30; // 30 minutes
  
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Generate slots for each member
  members.forEach(member => {
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = (minute + slotDuration) % 60;
        let endHour = hour;
        if (minute + slotDuration >= 60) endHour++;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Random availability, but more likely to be available than not
        const available = Math.random() > 0.3;
        
        slots.push({
          id: `slot_${formattedDate}_${startTime}_${member.id}`,
          date: formattedDate,
          startTime,
          endTime,
          available,
          memberId: member.id
        });
      }
    }
  });
  
  return slots;
};

export const generateMockBookings = (slots: TimeSlot[], members: TeamMember[]): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();
  
  // Sample company names
  const companies = [
    'TechGrowth',
    'Market Fusion',
    'DigitalEdge',
    'VentureWave',
    'RetailNexus',
    'CloudBoost',
    'DataSprint',
    'ShopifyPro',
    'eCommPower',
    'MobileMarket'
  ];
  
  // Generate some random bookings
  const bookedSlots = slots.filter(slot => !slot.available).slice(0, 8);
  
  bookedSlots.forEach((slot, index) => {
    const randomCompanyIndex = Math.floor(Math.random() * companies.length);
    const randomTicketId = `TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Parse date parts
    const dateParts = slot.date.split('-').map(part => parseInt(part));
    const timeParts = slot.startTime.split(':').map(part => parseInt(part));
    
    // Create booking date
    const bookingDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]);
    
    const isPast = bookingDate < today;
    
    let status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed' = 'scheduled';
    if (isPast) {
      const statuses: ('completed' | 'cancelled')[] = ['completed', 'completed', 'completed', 'cancelled'];
      status = statuses[Math.floor(Math.random() * statuses.length)];
    } else if (Math.random() > 0.8) {
      status = 'rescheduled';
    }
    
    bookings.push({
      id: `booking_${Date.now()}_${index}`,
      brandName: companies[randomCompanyIndex],
      ticketId: randomTicketId,
      description: `Discussion about ${['integration issues', 'new features', 'account setup', 'billing questions'][Math.floor(Math.random() * 4)]}`,
      additionalGuests: Math.random() > 0.5 ? [`guest${index}@example.com`] : [],
      timeSlot: slot,
      memberId: slot.memberId,
      status,
      createdAt: new Date(bookingDate.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days before
      updatedAt: new Date(bookingDate.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day before
    });
  });
  
  return bookings;
};
