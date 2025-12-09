import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Phone, Mail, MapPin, Accessibility } from 'lucide-react';

const Footer = () => {
  const { settings } = useAccessibility();

  return (
    <footer className="mt-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`font-bold mb-4 text-white ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
              SmartHealth Care
            </h3>
            <p className="text-white text-base">
              Making healthcare appointments accessible for everyone, regardless of age or digital literacy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mode-selection" className="text-white text-base">
                  Choose Your Mode
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-white text-base">
                  Accessibility Features
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-white text-base">
                  User Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span className="text-white text-base">Emergency: 102</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span className="text-white text-base">help@smarthealth.care</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} />
                <span className="text-white text-base">24/7 Helpline</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">Accessibility</h4>
            <div className="flex items-center space-x-4 mb-4">
              <Accessibility size={26} />
              <span className="text-white text-base">WCAG 2.1 AA Compliant</span>
            </div>
            <p className="text-base text-white">
              Designed with inclusivity in mind. Supports voice, touch, and adaptive interfaces.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-white text-base">
            © {new Date().getFullYear()} SmartHealth Care. Part of HCI Research Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;