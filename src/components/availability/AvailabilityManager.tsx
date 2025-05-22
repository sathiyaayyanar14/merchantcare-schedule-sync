
import React, { useState } from 'react';
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

const AvailabilityManager = () => {
  const { teamMembers } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('working-hours');
  
  const loggedInTeamMember = teamMembers[0]; // For demo, we're using the first team member
  
  const saveChanges = () => {
    toast.success('Availability settings saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="working-hours" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
          <TabsTrigger value="blocked-times">Blocked Times</TabsTrigger>
        </TabsList>
        
        <TabsContent value="working-hours">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <WorkingHoursSettings />
                
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
                <BlockedTimeManager />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManager;
