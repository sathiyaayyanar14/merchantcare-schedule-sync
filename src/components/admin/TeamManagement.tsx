
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamMember } from '@/types';
import { useApp } from '@/context/AppContext';
import { UserPlus, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const TeamManagement = () => {
  const { teamMembers } = useApp();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'member' as 'admin' | 'member'
  });

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Simulate sending invitation email
    try {
      // In a real app, this would call an API to send the invitation
      console.log('Sending invitation to:', inviteForm);
      
      // Show success message
      toast.success(`Invitation sent to ${inviteForm.email}! They will receive an email with setup instructions.`);
      
      // Reset form and close dialog
      setInviteForm({ name: '', email: '', role: 'member' });
      setIsInviteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to send invitation. Please try again.');
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    // In a real app, this would call an API to remove the member
    toast.success(`${memberName} has been removed from the team`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage your team members and send invitations</CardDescription>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-merchantcare-600 hover:bg-merchantcare-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite New Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation email with account setup instructions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(value: 'admin' | 'member') => 
                        setInviteForm(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Team Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-merchantcare-600 hover:bg-merchantcare-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                    member.role === 'admin' ? 'bg-merchantcare-100 text-merchantcare-800' : 'bg-gray-100'
                  }`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right mr-4">
                  <div className={`text-xs px-2 py-1 rounded ${
                    member.calendarConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.calendarConnected ? 'Calendar Connected' : 'Setup Pending'}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">Invitation Process</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• New team members will receive an email invitation</p>
            <p>• They'll be guided to connect their Google Calendar</p>
            <p>• They can set up their availability slots</p>
            <p>• Account activation is required before they can receive bookings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamManagement;
