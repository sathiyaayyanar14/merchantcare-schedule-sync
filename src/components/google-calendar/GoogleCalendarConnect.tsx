
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const GoogleCalendarConnect = ({ teamMemberId }: { teamMemberId?: string }) => {
  const { teamMembers, updateTeamMemberCalendarStatus } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const teamMember = teamMemberId 
    ? teamMembers.find(m => m.id === teamMemberId)
    : teamMembers.find(m => m.role === 'admin'); // Default to admin if no member specified
  
  if (!teamMember) return null;
  
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // In a real app, this would initiate the OAuth flow with Google
      setTimeout(() => {
        updateTeamMemberCalendarStatus(teamMember.id, true, `google_calendar_${teamMember.id}`);
        toast.success(`Connected ${teamMember.name}'s Google Calendar`);
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      toast.error('Failed to connect to Google Calendar');
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    setIsConnecting(true);
    try {
      // In a real app, this would revoke access to Google Calendar
      setTimeout(() => {
        updateTeamMemberCalendarStatus(teamMember.id, false);
        toast.success(`Disconnected ${teamMember.name}'s Google Calendar`);
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      toast.error('Failed to disconnect Google Calendar');
      setIsConnecting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Sync your bookings with Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connection Status:</span>
            {teamMember.calendarConnected ? (
              <Badge className="bg-green-500">Connected</Badge>
            ) : (
              <Badge variant="outline">Not Connected</Badge>
            )}
          </div>
          
          {teamMember.calendarConnected && (
            <div className="text-sm text-gray-500">
              All bookings will automatically sync with {teamMember.name}'s Google Calendar
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {teamMember.calendarConnected ? (
          <Button 
            variant="outline" 
            onClick={handleDisconnect} 
            disabled={isConnecting}
          >
            {isConnecting ? 'Disconnecting...' : 'Disconnect Calendar'}
          </Button>
        ) : (
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarConnect;
