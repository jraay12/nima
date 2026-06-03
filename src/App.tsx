import "./App.css";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import PublicLayout from "./layouts/PublicLayout";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactPage from "./pages/ContactPage";
import EventPage from "./pages/EventPage";
import CommunityPage from "./pages/CommunityPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import LoginPage from "./pages/private/LoginPage";
import AdministratorLayout from "./layouts/AdministratorLayout";
import DashboardPage from "./pages/private/DashboardPage";
import EventsPage from "./pages/private/EventsPage";
import MembersPage from "./pages/private/MembersPage";
import CreateEventPage from "./pages/private/CreateEventPage";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PrivateRoutes } from "./routes/PrivateRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";
import PrivateEventDetailPage from "./pages/private/PrivateEventDetailsPage";
import CreateMemberPage from "./pages/private/CreateMemberPage";
import MemberPagePublic from "./pages/MemberPage";
import MemberDetails from "./pages/MemberDetails";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/event-details/:id" element={<EventDetailsPage />} />
          <Route path="/members" element={<MemberPagePublic />} />
          <Route path="/members/:id" element={<MemberDetails />} />
        </Route>
        <Route
          path="/administrator/login"
          element={
            <PublicRoutes>
              <LoginPage />
            </PublicRoutes>
          }
        />

        <Route
          element={
            <PrivateRoutes>
              <AdministratorLayout />
            </PrivateRoutes>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/event" element={<EventsPage />} />
          <Route path="/member" element={<MembersPage />} />
          <Route path="/member/create" element={<CreateMemberPage />} />
          <Route
            path="/event/details/:id"
            element={<PrivateEventDetailPage />}
          />
          <Route path="/event/create" element={<CreateEventPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
