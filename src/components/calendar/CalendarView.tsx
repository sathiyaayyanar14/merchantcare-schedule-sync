
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import TimeSlotsList from './TimeSlotsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  memberId?: string;
}

const CalendarView = ({ memberId }: CalendarViewProps) => {
  const { selectedDate, setSelectedDate, timeSlots, teamMembers } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter time slots by member if memberId is provided
  const filteredTimeSlots = memberId 
    ? timeSlots.filter(slot => slot.memberId === memberId)
    : timeSlots;

  const availableTimeSlots = filteredTimeSlots.filter(slot => 
    slot.date === format(selectedDate, 'yyyy-MM-dd') && slot.available
  );

  const teamMember = memberId ? teamMembers.find(m => m.id === memberId) : null;

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <Card data-testid="calendar-view" className="calendar-view">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {teamMember ? `Available Times - ${teamMember.name}` : 'Select a Date'}
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border"
          disabled={(date) => {
            const dateString = format(date, 'yyyy-MM-dd');
            const hasSlots = filteredTimeSlots.some(slot => 
              slot.date === dateString && slot.available
            );
            return date < new Date() || !hasSlots;
          }}
        />
        
        <TimeSlotsList 
          selectedDate={selectedDate} 
          availableSlots={availableTimeSlots}
          showMemberInfo={!memberId}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarView;
