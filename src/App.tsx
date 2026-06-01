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

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/event-details/:id" element={<EventDetailsPage />} />
      </Route>
      <Route path="/administrator/login" element={<LoginPage />} />

      <Route element={<AdministratorLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/event" element={<EventsPage />} />
        <Route path="/member" element={<MembersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
