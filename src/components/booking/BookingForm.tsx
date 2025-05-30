
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';
import { BookingFormData } from '@/types';
import { toast } from 'sonner';

type BookingFormProps = {
  onComplete?: () => void;
};

const BookingForm = ({ onComplete }: BookingFormProps) => {
  const { selectedDate, selectedTimeSlotId, timeSlots, createBooking } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BookingFormData>({
    brandName: '',
    ticketId: '',
    description: '',
    additionalGuests: '',
    timeSlotId: selectedTimeSlotId || '',
    date: formatDate(selectedDate, 'yyyy-MM-dd'),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedTimeSlotId);

  // Update form data when selectedTimeSlotId changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      timeSlotId: selectedTimeSlotId || '',
      date: formatDate(selectedDate, 'yyyy-MM-dd'),
    }));
  }, [selectedTimeSlotId, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for ticketId to only allow numbers
    if (name === 'ticketId') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Brand name is required';
    }
    
    if (!formData.ticketId.trim()) {
      newErrors.ticketId = 'Ticket ID is required';
    }
    
    // Validate additional guests email format if provided
    if (formData.additionalGuests.trim()) {
      const emails = formData.additionalGuests.split(',').map(email => email.trim()).filter(Boolean);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter(email => !emailRegex.test(email));
      
      if (invalidEmails.length > 0) {
        newErrors.additionalGuests = `Invalid email addresses: ${invalidEmails.join(', ')}`;
      }
    }
    
    if (!selectedTimeSlotId) {
      newErrors.timeSlot = 'Please select a time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const booking = await createBooking({
        ...formData,
        timeSlotId: selectedTimeSlotId,
      });
      
      toast.success('Booking created successfully!');
      
      // Navigate to the confirmation page with the booking ID
      navigate(`/confirmation/${booking.id}`);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedTimeSlotId || !selectedTimeSlot) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Time Selected</h3>
            <p className="text-gray-500">Please select a time slot from the calendar to proceed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Count additional guests
  const guestCount = formData.additionalGuests.trim() 
    ? formData.additionalGuests.split(',').map(email => email.trim()).filter(Boolean).length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>
          Scheduling a call on {formatDate(selectedDate)} at {formatTime(selectedTimeSlot.startTime)}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name <span className="text-red-500">*</span></Label>
            <Input
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Enter your brand name"
              className={errors.brandName ? 'border-red-500' : ''}
            />
            {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ticketId">Ticket ID <span className="text-red-500">*</span></Label>
            <Input
              id="ticketId"
              name="ticketId"
              value={formData.ticketId}
              onChange={handleChange}
              placeholder="Enter the ticket ID (numbers only)"
              className={errors.ticketId ? 'border-red-500' : ''}
              inputMode="numeric"
            />
            {errors.ticketId && <p className="text-red-500 text-sm">{errors.ticketId}</p>}
            <p className="text-xs text-gray-500">Only numerical values are accepted</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe what you'd like to discuss"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalGuests">Additional Guests</Label>
            <Input
              id="additionalGuests"
              name="additionalGuests"
              value={formData.additionalGuests}
              onChange={handleChange}
              placeholder="Enter email addresses separated by commas"
              className={errors.additionalGuests ? 'border-red-500' : ''}
            />
            {errors.additionalGuests && <p className="text-red-500 text-sm">{errors.additionalGuests}</p>}
            <p className="text-xs text-gray-500">
              Optional: Add colleagues who should join this call. Separate multiple emails with commas.
              {guestCount > 0 && ` (${guestCount} guest${guestCount > 1 ? 's' : ''} added)`}
            </p>
          </div>
          
          <div className="p-4 bg-merchantcare-50 rounded-md">
            <h4 className="font-medium mb-1">Selected Time</h4>
            <p>{formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            <p>{formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}</p>
            {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-merchantcare-600 hover:bg-merchantcare-700"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
