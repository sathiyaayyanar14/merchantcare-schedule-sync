
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/types';
import { useApp } from '@/context/AppContext';
import { getAvailableTimeSlotsByDay, formatTime, getCurrentWeekDays } from '@/utils/dateUtils';
import TimeSlotsList from './TimeSlotsList';

const CalendarView = () => {
  const { selectedDate, setSelectedDate, timeSlots } = useApp();
  
  const weekDays = getCurrentWeekDays(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Get available time slots for the selected date
  const availableTimeSlots = getAvailableTimeSlotsByDay(timeSlots, selectedDate);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select a Date & Time</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevWeek}>
            Previous Week
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            Next Week
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekDays.map((day, index) => {
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const today = new Date();
          const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          
          // Check if day has slots or if it's a future date (we can generate slots for future dates)
          const dayHasSlots = timeSlots.some(slot => 
            slot.date === format(day, 'yyyy-MM-dd') && slot.available
          ) || !isPast;
          
          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className={`flex flex-col items-center justify-center h-20 ${
                isPast ? 'opacity-50' : ''
              } ${isSelected ? 'bg-merchantcare-600 hover:bg-merchantcare-700' : ''}`}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
            >
              <span className="text-xs">{format(day, 'EEE')}</span>
              <span className="text-lg font-semibold">{format(day, 'd')}</span>
              <span className="text-xs">{format(day, 'MMM')}</span>
            </Button>
          );
        })}
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Available Times for {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          
          {availableTimeSlots.length > 0 ? (
            <TimeSlotsList timeSlots={availableTimeSlots} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No available time slots for this date. Please select another date.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
