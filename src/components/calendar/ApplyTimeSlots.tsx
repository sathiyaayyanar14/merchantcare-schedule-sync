
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/context/AppContext';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { applyTimeSlotTemplateToMultipleDays } from '@/utils/dateUtils';
import { Calendar } from 'lucide-react';

const ApplyTimeSlots = () => {
  const { selectedDate, timeSlots, teamMembers, setTimeSlots } = useApp();
  const [selectedDays, setSelectedDays] = useState<{ [key: number]: boolean }>({
    0: false, // Sunday
    1: false, // Monday
    2: false, // Tuesday
    3: false, // Wednesday
    4: false, // Thursday
    5: false, // Friday
    6: false, // Saturday
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const handleCheckboxChange = (dayIndex: number) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };
  
  const handleApplyToSelectedDays = () => {
    const selectedDayIndices = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day, _]) => parseInt(day));
    
    if (selectedDayIndices.length === 0) {
      toast.error('Please select at least one day to apply time slots to');
      return;
    }
    
    // Create dates for the selected days in the current week
    const currentDayOfWeek = selectedDate.getDay();
    const targetDates = selectedDayIndices.map(dayIndex => {
      const diff = dayIndex - currentDayOfWeek;
      return addDays(selectedDate, diff);
    });
    
    // Apply the time slots template
    const newTimeSlots = applyTimeSlotTemplateToMultipleDays(selectedDate, targetDates, timeSlots, teamMembers);
    
    // Update the time slots
    if (newTimeSlots.length > 0) {
      setTimeSlots(prev => {
        // Remove existing slots for target dates
        const filteredSlots = prev.filter(slot => {
          const slotDate = new Date(slot.date);
          return !targetDates.some(targetDate => 
            format(targetDate, 'yyyy-MM-dd') === slot.date && 
            format(selectedDate, 'yyyy-MM-dd') !== slot.date
          );
        });
        
        // Add new slots
        return [...filteredSlots, ...newTimeSlots];
      });
      
      toast.success(`Applied time slots to ${selectedDayIndices.length} day(s)`);
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Apply Time Slots to Multiple Days
        </CardTitle>
        <CardDescription>
          Use the current day's availability as a template for other days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Apply Today's Schedule to Other Days</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Days to Apply Schedule</DialogTitle>
              <DialogDescription>
                Choose which days should use today's time slot availability
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {dayNames.map((day, index) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${index}`}
                    checked={selectedDays[index]}
                    onCheckedChange={() => handleCheckboxChange(index)}
                  />
                  <label 
                    htmlFor={`day-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day}
                    {index === selectedDate.getDay() && " (Today)"}
                  </label>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyToSelectedDays}>
                Apply to Selected Days
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ApplyTimeSlots;
