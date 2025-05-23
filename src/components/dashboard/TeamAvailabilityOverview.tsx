
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';

const TeamAvailabilityOverview = () => {
  const { teamMembers, timeSlots, selectedDate } = useApp();
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  // Calculate availability for each team member on the selected date
  const memberAvailability = teamMembers.map(member => {
    const memberSlots = timeSlots.filter(
      slot => slot.date === dateString && slot.memberId === member.id
    );
    
    const totalSlots = memberSlots.length;
    const availableSlots = memberSlots.filter(slot => slot.available).length;
    const bookedSlots = totalSlots - availableSlots;
    
    // Calculate percentage of availability
    const availabilityPercentage = totalSlots > 0 
      ? Math.round((availableSlots / totalSlots) * 100) 
      : 0;
    
    return {
      member,
      totalSlots,
      availableSlots,
      bookedSlots,
      availabilityPercentage
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Team Availability Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberAvailability.map(({ member, totalSlots, availableSlots, bookedSlots, availabilityPercentage }) => (
            <div key={member.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge 
                    className={availabilityPercentage > 50 ? 'bg-green-500' : 
                              availabilityPercentage > 0 ? 'bg-yellow-500' : 'bg-red-500'}
                  >
                    {availabilityPercentage}% Available
                  </Badge>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ width: `${availabilityPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-green-600" /> 
                    <span>{availableSlots} slots available</span>
                  </div>
                  <div>
                    {bookedSlots} booked / {totalSlots} total
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAvailabilityOverview;
