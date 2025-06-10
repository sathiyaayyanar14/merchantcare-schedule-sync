
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSlot } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Clock, User } from 'lucide-react';

interface TimeSlotsListProps {
  selectedDate: Date;
  availableSlots: TimeSlot[];
  showMemberInfo?: boolean;
}

const TimeSlotsList = ({ selectedDate, availableSlots, showMemberInfo = true }: TimeSlotsListProps) => {
  const { selectedTimeSlotId, setSelectedTimeSlotId, teamMembers } = useApp();

  const handleSlotSelect = (slotId: string) => {
    setSelectedTimeSlotId(slotId);
  };

  if (availableSlots.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Times</h3>
            <p className="text-gray-500">
              No available time slots for {formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}.
              Please select another date.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Available Times - {formatDate(selectedDate, 'EEEE, MMMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {availableSlots.map((slot) => {
            const isSelected = selectedTimeSlotId === slot.id;
            const teamMember = teamMembers.find(m => m.id === slot.memberId);
            
            return (
              <Button
                key={slot.id}
                variant={isSelected ? "default" : "outline"}
                className={`justify-start h-auto p-4 ${
                  isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
                onClick={() => handleSlotSelect(slot.id)}
              >
                <div className="flex flex-col items-start text-left w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                    {showMemberInfo && teamMember && (
                      <div className="flex items-center text-xs opacity-75">
                        <User className="mr-1 h-3 w-3" />
                        {teamMember.name}
                      </div>
                    )}
                  </div>
                  {showMemberInfo && teamMember && (
                    <span className="text-xs opacity-75 mt-1">
                      with {teamMember.name}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotsList;
