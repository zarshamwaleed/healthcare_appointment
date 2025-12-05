import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Phone, Mail, MapPin, Accessibility } from 'lucide-react';

const Footer = () => {
  const { settings } = useAccessibility();

  return (
    <footer className={`mt-12 ${settings.highContrast ? 'bg-black text-white border-t-2 border-white' : 'bg-gray-900 text-white'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`font-bold mb-4 ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
              SmartHealth Care
            </h3>
            <p className="text-gray-300">
              Making healthcare appointments accessible for everyone, regardless of age or digital literacy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mode-selection" className="text-gray-300 hover:text-white transition-colors">
                  Choose Your Mode
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility Features
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">
                  User Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">Emergency: 102</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray-300">help@smarthealth.care</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span className="text-gray-300">24/7 Helpline</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Accessibility</h4>
            <div className="flex items-center space-x-4 mb-4">
              <Accessibility size={24} />
              <span className="text-gray-300">WCAG 2.1 AA Compliant</span>
            </div>
            <p className="text-sm text-gray-400">
              Designed with inclusivity in mind. Supports voice, touch, and adaptive interfaces.
            </p>
          </div>
        </div>

        <div className={`border-t ${settings.highContrast ? 'border-white' : 'border-gray-800'} mt-8 pt-6 text-center`}>
          <p className="text-gray-400">
            © {new Date().getFullYear()} SmartHealth Care. Part of HCI Research Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;