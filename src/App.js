import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { UserProvider } from "./context/UserContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { UIProvider } from "./context/UIContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ModeSelectionPage from "./pages/ModeSelectionPage";
import SymptomInputPage from "./pages/SymptomInputPage";
import DoctorSelectionPage from "./pages/DoctorSelectionPage";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
function App() {
  return (
    <Router>
      <AccessibilityProvider>
        <UserProvider>
          <AppointmentProvider>
            <UIProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/mode-selection"
                    element={<ModeSelectionPage />}
                  />
                  <Route path="/symptoms" element={<SymptomInputPage />} />
                  <Route path="/doctors" element={<DoctorSelectionPage />} />
                  <Route path="/booking" element={<AppointmentBookingPage />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                  <Route
                    path="/accessibility"
                    element={<AccessibilityPage />}
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </Routes>
              </MainLayout>
            </UIProvider>
          </AppointmentProvider>
        </UserProvider>
      </AccessibilityProvider>
    </Router>
  );
}

export default App;
