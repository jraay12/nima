import "./App.css";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import PublicLayout from "./layouts/PublicLayout";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactPage from "./pages/ContactPage";
import EventPage from "./pages/EventPage";
import CommunityPage from "./pages/CommunityPage";
import EventDetailsPage from "./pages/EventDetailsPage";

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
    </Routes>
  );
}

export default App;
