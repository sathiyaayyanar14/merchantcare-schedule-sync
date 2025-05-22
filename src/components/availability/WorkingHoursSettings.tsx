
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const WorkingHoursSettings = () => {
  const { teamMembers } = useApp();
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  
  const [dayHours, setDayHours] = useState({
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '10:00', end: '15:00' },
    sunday: { start: '10:00', end: '15:00' },
  });
  
  const toggleWorkingDay = (day: string) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev]
    }));
  };
  
  const updateHours = (day: string, type: 'start' | 'end', value: string) => {
    setDayHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [type]: value
      }
    }));
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Your Working Hours</h3>
        <p className="text-gray-500 text-sm">
          Set the hours when you're generally available for meetings. These will be used as your default availability.
        </p>
      </div>
      
      <div className="space-y-4">
        {DAYS_OF_WEEK.map(day => (
          <div 
            key={day.id} 
            className={`p-4 rounded-lg border ${workingDays[day.id as keyof typeof workingDays] ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`day-${day.id}`} 
                  checked={workingDays[day.id as keyof typeof workingDays]} 
                  onCheckedChange={() => toggleWorkingDay(day.id)}
                />
                <Label htmlFor={`day-${day.id}`} className="font-medium">{day.label}</Label>
              </div>
              
              {workingDays[day.id as keyof typeof workingDays] && (
                <div className="flex items-center space-x-2">
                  <Input 
                    type="time" 
                    value={dayHours[day.id as keyof typeof dayHours].start} 
                    onChange={(e) => updateHours(day.id, 'start', e.target.value)} 
                    className="w-32"
                  />
                  <span className="text-gray-500">to</span>
                  <Input 
                    type="time" 
                    value={dayHours[day.id as keyof typeof dayHours].end} 
                    onChange={(e) => updateHours(day.id, 'end', e.target.value)} 
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHoursSettings;
