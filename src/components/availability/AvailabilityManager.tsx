
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import WorkingHoursSettings from './WorkingHoursSettings';
import BlockedTimeManager from './BlockedTimeManager';

interface AvailabilityManagerProps {
  teamMemberId?: string;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ teamMemberId }) => {
  const { teamMembers } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('working-hours');
  
  // Find the correct team member based on id or default to the first one
  const targetTeamMember = teamMemberId 
    ? teamMembers.find(tm => tm.id === teamMemberId) 
    : teamMembers[0]; // For demo, we're using the first team member as default
  
  const saveChanges = () => {
    const memberName = targetTeamMember?.name || 'Team member';
    toast.success(`${memberName}'s availability settings saved successfully`);
  };
  
  if (!targetTeamMember) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium mb-2">Team member not found</h3>
        <p className="text-red-600">
          The team member you're trying to manage does not exist.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md border mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={targetTeamMember.avatar}
            alt={targetTeamMember.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{targetTeamMember.name}</h3>
            <p className="text-sm text-gray-500">{targetTeamMember.email}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="working-hours" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
          <TabsTrigger value="blocked-times">Blocked Times</TabsTrigger>
        </TabsList>
        
        <TabsContent value="working-hours">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <WorkingHoursSettings teamMember={targetTeamMember} />
                
                <div className="flex justify-end mt-6">
                  <Button onClick={saveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocked-times">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <BlockedTimeManager teamMember={targetTeamMember} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManager;
