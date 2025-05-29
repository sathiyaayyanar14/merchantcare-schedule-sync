
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import Confirmation from "./pages/Confirmation";
import ManageBookingPage from "./pages/ManageBookingPage";
import Admin from "./pages/Admin";
import TeamAvailability from "./pages/TeamAvailability";
import NotFound from "./pages/NotFound";
import TeamMemberBookings from "./pages/TeamMemberBookings";
import BookingDetails from "./pages/BookingDetails";
import BookingsListPage from "./pages/BookingsListPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/manage/:bookingId" element={<ManageBookingPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/bookings" element={<BookingsListPage />} />
            <Route path="/admin/booking/:bookingId" element={<BookingDetails />} />
            <Route path="/team/availability" element={<TeamAvailability />} />
            <Route path="/team/availability/:memberId" element={<TeamAvailability />} />
            <Route path="/admin/team/:memberId" element={<TeamMemberBookings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
