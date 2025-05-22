
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { TeamMember } from '@/types';

interface BlockedTimeManagerProps {
  teamMember: TeamMember;
}

// Mock data for blocked times
const initialBlockedTimes = [
  { 
    id: '1', 
    date: new Date(2025, 4, 28), 
    startTime: '09:00', 
    endTime: '12:00', 
    reason: 'Team Meeting' 
  },
  { 
    id: '2', 
    date: new Date(2025, 4, 29), 
    startTime: '13:00', 
    endTime: '15:00', 
    reason: 'Doctor Appointment' 
  },
];

const BlockedTimeManager: React.FC<BlockedTimeManagerProps> = ({ teamMember }) => {
  const [blockedDate, setBlockedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [blockedTimes, setBlockedTimes] = useState(initialBlockedTimes);
  
  const addBlockedTime = () => {
    if (!blockedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }
    
    const newBlockedTime = {
      id: `blocked_${Date.now()}`,
      date: blockedDate,
      startTime,
      endTime,
      reason: reason.trim() || 'Unavailable',
    };
    
    setBlockedTimes([...blockedTimes, newBlockedTime]);
    setReason('');
    toast.success(`Blocked time added for ${teamMember.name}`);
  };
  
  const removeBlockedTime = (id: string) => {
    setBlockedTimes(blockedTimes.filter(time => time.id !== id));
    toast.success(`Blocked time removed for ${teamMember.name}`);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Manage {teamMember.name}'s Blocked Times</h3>
        <p className="text-gray-500 text-sm">
          Block off specific times when {teamMember.name} is not available for meetings.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <Label htmlFor="blocked-date">Select Date</Label>
            <div className="mt-1">
              <Calendar
                mode="single"
                selected={blockedDate}
                onSelect={setBlockedDate}
                className="rounded-md border pointer-events-auto"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input 
              id="reason" 
              type="text" 
              placeholder="Why this time is being blocked" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
            />
          </div>
          
          <Button onClick={addBlockedTime} className="w-full mt-2">
            Block This Time
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="font-medium mb-4">{teamMember.name}'s Blocked Times</h4>
        
        {blockedTimes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedTimes.map((blockedTime) => (
                <TableRow key={blockedTime.id}>
                  <TableCell>{format(blockedTime.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {blockedTime.startTime} - {blockedTime.endTime}
                  </TableCell>
                  <TableCell>{blockedTime.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBlockedTime(blockedTime.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            No blocked times added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedTimeManager;
