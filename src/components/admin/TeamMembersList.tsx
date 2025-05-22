
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { TeamMember } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamMembersList = () => {
  const { teamMembers, bookings } = useApp();
  
  // Calculate how many bookings each team member has
  const memberBookings = teamMembers.map(member => {
    const memberBookingsCount = bookings.filter(b => b.memberId === member.id).length;
    const upcomingBookingsCount = bookings.filter(
      b => b.memberId === member.id && b.status === 'scheduled'
    ).length;
    
    return {
      ...member,
      totalBookings: memberBookingsCount,
      upcomingBookings: upcomingBookingsCount,
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>MerchantCare scheduling team members and their workload.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberBookings.map(member => (
            <div key={member.id} className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col sm:flex-row flex-1 sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    member.role === 'admin' ? 'bg-merchantcare-100 text-merchantcare-800' : 'bg-gray-100'
                  } inline-block mt-1`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-col sm:items-end">
                  <div className="text-lg font-medium text-merchantcare-600">
                    {member.upcomingBookings} <span className="text-sm text-gray-500">upcoming</span>
                  </div>
                  <div className="text-sm text-gray-500">{member.totalBookings} total bookings</div>
                  
                  <div className="flex space-x-2 mt-2">
                    <Link to={`/team/availability/${member.id}`}>
                      <Button variant="outline" size="sm">
                        <CalendarPlus className="mr-1 h-4 w-4" />
                        Manage Availability
                      </Button>
                    </Link>
                    <Link to={`/admin/team/${member.id}`}>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-1 h-4 w-4" />
                        Manage Bookings
                      </Button>
                    </Link>
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

export default TeamMembersList;
