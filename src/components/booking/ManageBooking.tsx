
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';
import CalendarView from '../calendar/CalendarView';
import { toast } from 'sonner';

const ManageBooking = () => {
  const { bookingId } = useParams();
  const { bookings, cancelBooking, rescheduleBooking, selectedTimeSlotId } = useApp();
  const navigate = useNavigate();
  
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('ManageBooking - Looking for booking with ID:', bookingId);
  console.log('ManageBooking - Available bookings:', bookings.map(b => ({ id: b.id, brandName: b.brandName })));
  
  // Find booking by ID - ensure exact match
  const booking = bookings.find(b => b.id === bookingId);
  
  console.log('ManageBooking - Found booking:', booking);
  
  if (!booking) {
    console.error('ManageBooking - Booking not found for ID:', bookingId);
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Booking Not Found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find the booking with ID: {bookingId}
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/')}>
                  Return to Scheduling Page
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  Go to Admin Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReschedule = async () => {
    if (!selectedTimeSlotId) {
      toast.error('Please select a new time slot');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await rescheduleBooking(booking.id, selectedTimeSlotId);
      if (success) {
        setIsRescheduleDialogOpen(false);
        toast.success('Your meeting has been rescheduled successfully');
        navigate(`/confirmation/${booking.id}`);
      } else {
        toast.error('Failed to reschedule your meeting. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      const success = await cancelBooking(booking.id);
      if (success) {
        setIsCancelDialogOpen(false);
        toast.success('Your meeting has been cancelled successfully');
        navigate('/');
      } else {
        toast.error('Failed to cancel your meeting. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Booking</CardTitle>
          <CardDescription>
            You can reschedule or cancel your meeting with MerchantCare team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Current Meeting Details</h3>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {formatDate(new Date(booking.timeSlot.date), 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time:</span> {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{' '}
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                booking.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
                booking.status === 'rescheduled' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Booking Information</h3>
            <p className="text-gray-700">
              <span className="font-medium">Brand Name:</span> {booking.brandName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Ticket ID:</span> {booking.ticketId}
            </p>
            {booking.description && (
              <div className="mt-2">
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{booking.description}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => setIsCancelDialogOpen(true)}
            className="w-full sm:w-auto"
            disabled={booking.status === 'cancelled'}
          >
            Cancel Meeting
          </Button>
          <Button 
            onClick={() => setIsRescheduleDialogOpen(true)} 
            className="w-full sm:w-auto bg-merchantcare-600 hover:bg-merchantcare-700"
            disabled={booking.status === 'cancelled'}
          >
            Reschedule Meeting
          </Button>
        </CardFooter>
      </Card>
      
      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Reschedule Your Meeting</DialogTitle>
            <DialogDescription>
              Please select a new date and time for your meeting with the MerchantCare team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CalendarView />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReschedule}
              disabled={!selectedTimeSlotId || isSubmitting}
              className="bg-merchantcare-600 hover:bg-merchantcare-700"
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Your Meeting</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your scheduled meeting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Meeting
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Meeting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooking;
