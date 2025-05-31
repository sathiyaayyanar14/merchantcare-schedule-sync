
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/types';
import { formatTime, groupTimeSlotsByHour } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';

type TimeSlotListProps = {
  timeSlots: TimeSlot[];
};

const TimeSlotsList = ({ timeSlots }: TimeSlotListProps) => {
  const { selectedTimeSlotId, setSelectedTimeSlotId } = useApp();
  const groupedTimeSlots = groupTimeSlotsByHour(timeSlots);

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    setSelectedTimeSlotId(timeSlot.id);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTimeSlots).map(([hour, slots]) => (
        <div key={hour} className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            {formatTime(`${hour}:00`)}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {slots.map((slot) => (
              <Button
                key={slot.id}
                variant={selectedTimeSlotId === slot.id ? "default" : "outline"}
                className={`text-sm py-2 px-3 ${
                  selectedTimeSlotId === slot.id 
                  ? "bg-gokwik-500 hover:bg-gokwik-600 text-white" 
                  : "hover:bg-gokwik-50"
                }`}
                onClick={() => handleTimeSlotClick(slot)}
              >
                {formatTime(slot.startTime)}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotsList;
