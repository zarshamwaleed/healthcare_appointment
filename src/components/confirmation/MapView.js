import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Footprints,  
  Clock, 
  Phone, 
  ExternalLink,
  Maximize2,
  Minimize2,
  Layers,
  Filter,
  Star,
  ParkingCircle,
  Accessibility as WheelchairIcon,   // ✔ FIXED HERE
  Wifi,
  Coffee,
  Building,
  Compass
} from 'lucide-react';

import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import Loader from '../common/Loader';

const MapView = ({ 
  location, 
  userLocation = null,
  height = '400px',
  showControls = true,
  interactive = true,
  variant = 'detailed'
}) => {
  const { settings } = useAccessibility();
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [estimatedTime, setEstimatedTime] = useState('15-20 mins');
  const [estimatedDistance, setEstimatedDistance] = useState('3.2 km');
  const [selectedFloor, setSelectedFloor] = useState('ground');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [showSatellite, setShowSatellite] = useState(false);

  // Default location if none provided
  const defaultLocation = {
    name: 'City General Hospital',
    address: '123 Medical Center Drive, Healthcare City',
    coordinates: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
    contact: '+1 (555) 123-4567',
    hours: '24/7 Emergency, OPD: 8 AM - 8 PM',
    facilities: ['Parking', 'Wheelchair Access', 'Pharmacy', 'Cafeteria'],
    floors: [
      { id: 'ground', name: 'Ground Floor', departments: ['Reception', 'Emergency', 'Pharmacy'] },
      { id: 'first', name: 'First Floor', departments: ['OPD', 'Cardiology', 'General Medicine'] },
      { id: 'second', name: 'Second Floor', departments: ['Pediatrics', 'Gynecology', 'Dental'] },
      { id: 'third', name: 'Third Floor', departments: ['Orthopedics', 'Neurology', 'ENT'] }
    ]
  };

  const currentLocation = location || defaultLocation;

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      initializeMockMap();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const initializeMockMap = () => {
    // In a real app, this would initialize Google Maps or similar
    console.log('Map initialized for:', currentLocation.name);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen && mapRef.current) {
      mapRef.current.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };

  const calculateRoute = (mode) => {
    const times = {
      driving: '15-20 mins',
      walking: '45-50 mins',
      transit: '25-30 mins'
    };
    
    const distances = {
      driving: '3.2 km',
      walking: '2.8 km',
      transit: '3.5 km'
    };
    
    setTransportMode(mode);
    setEstimatedTime(times[mode]);
    setEstimatedDistance(distances[mode]);
  };

  const getDirectionsUrl = () => {
    const { lat, lng } = currentLocation.coordinates;
    const destination = `${lat},${lng}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${transportMode}`;
  };

  const renderTransportOptions = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => calculateRoute('driving')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          transportMode === 'driving'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Car size={18} />
        <span>Drive</span>
      </button>
    <button
  onClick={() => calculateRoute('walking')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
    transportMode === 'walking'
      ? 'bg-green-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  <Footprints size={18} />  {/* Changed from Walk */}
  <span>Walk</span>
</button>
      <button
        onClick={() => calculateRoute('transit')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          transportMode === 'transit'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Navigation size={18} />
        <span>Transit</span>
      </button>
    </div>
  );

  const renderMapControls = () => (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={handleFullscreenToggle}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
      <button
        onClick={() => setShowSatellite(!showSatellite)}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        aria-label={showSatellite ? 'Switch to map view' : 'Switch to satellite view'}
      >
        <Layers size={20} />
      </button>
      <button
        onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 20))}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        aria-label="Zoom in"
      >
        <span className="font-bold">+</span>
      </button>
      <button
        onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        aria-label="Zoom out"
      >
        <span className="font-bold">-</span>
      </button>
    </div>
  );

  const renderCompactView = () => (
    <Card className="overflow-hidden">
      <div className="relative" style={{ height: '250px' }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader type="dots" size="small" />
          </div>
        ) : (
          <>
            {/* Mock Map */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
              {/* Simple map representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Roads */}
                  <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-400 transform -translate-x-1/2"></div>
                  
                  {/* User location */}
                  {userLocation && (
                    <div className="absolute left-1/4 top-1/3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                        <div className="absolute -top-2 -right-2 text-xs bg-white px-1 rounded">
                          You
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Destination */}
                  <div className="absolute left-3/4 top-2/3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs bg-white px-1 rounded whitespace-nowrap">
                        Hospital
                      </div>
                    </div>
                  </div>
                  
                  {/* Route line */}
                  <div className="absolute left-1/4 top-1/3 w-1/2 h-1 bg-blue-500 transform -translate-y-1/2" 
                       style={{ transform: 'rotate(30deg)', transformOrigin: 'left center' }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 border-t-2 border-r-2 border-blue-500 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-red-500" />
                    <span className="font-semibold">{currentLocation.name}</span>
                  </div>
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800"
                    aria-label="Open in Google Maps"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-sm text-gray-600 truncate">{currentLocation.address}</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Quick Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-500" />
              <span className="font-medium">{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation size={16} className="text-gray-500" />
              <span className="font-medium">{estimatedDistance}</span>
            </div>
          </div>
         <button
  onClick={() => calculateRoute(transportMode === 'driving' ? 'walking' : 'driving')}
  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
>
  Switch to {transportMode === 'driving' ? 'Walking' : 'Driving'}
</button>
        </div>
      </div>
    </Card>
  );

  const renderDetailedView = () => (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-bold mb-2 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
            Location & Directions
          </h1>
          <p className="text-gray-600">
            Find your way to {currentLocation.name}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href={`tel:${currentLocation.contact}`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Phone size={18} />
            Call Now
          </a>
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Navigation size={18} />
            Get Directions
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <div 
          ref={mapRef}
          style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}
          className="relative bg-gradient-to-br from-blue-50 to-gray-100"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader type="dots" text="Loading map..." />
            </div>
          ) : (
            <>
              {/* Enhanced Mock Map */}
              <div className="absolute inset-0">
                {/* Map background */}
                <div className={`absolute inset-0 ${showSatellite ? 'bg-gradient-to-br from-green-200 to-blue-200' : 'bg-gradient-to-br from-blue-100 to-gray-100'}`}>
                  {/* Grid lines for map look */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="absolute h-px bg-gray-400 w-full" style={{ top: `${i * 5}%` }}></div>
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="absolute w-px bg-gray-400 h-full" style={{ left: `${i * 5}%` }}></div>
                    ))}
                  </div>
                  
                  {/* Major roads */}
                  <div className="absolute top-1/3 left-0 right-0 h-6 bg-gray-500 transform -translate-y-1/2"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 w-6 bg-gray-500 transform -translate-x-1/2"></div>
                  <div className="absolute top-2/3 left-0 right-0 h-4 bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-4 bg-gray-400 transform -translate-x-1/2"></div>
                  
                  {/* Landmarks */}
                  <div className="absolute left-1/4 top-1/4 w-16 h-16 bg-green-300 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">Park</span>
                    </div>
                  </div>
                  
                  <div className="absolute left-3/4 top-1/4 w-20 h-20 bg-gray-300 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">Mall</span>
                    </div>
                  </div>
                  
                  {/* User location */}
                  {userLocation && (
                    <div className="absolute left-1/4 top-3/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative animate-pulse">
                        <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                          <Compass size={24} className="text-white" />
                        </div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow text-xs font-bold whitespace-nowrap">
                          Your Location
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white px-1 rounded">
                          {userLocation.address || 'Current position'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Hospital location */}
                  <div className="absolute left-3/4 top-3/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-16 h-16 bg-red-500 rounded-lg border-4 border-white shadow-xl flex items-center justify-center">
                        <Building size={32} className="text-white" />
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow text-sm font-bold whitespace-nowrap">
                        {currentLocation.name}
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs max-w-xs truncate">
                        {currentLocation.address}
                      </div>
                    </div>
                  </div>
                  
                  {/* Route with animation */}
                  <div className="absolute left-1/4 top-3/4 w-1/2 h-2 bg-gradient-to-r from-blue-500 to-red-500 transform -translate-y-1/2" 
                       style={{ transform: 'rotate(30deg) translateY(-50%)', transformOrigin: 'left center' }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 bg-white rounded-full border-4 border-blue-500 animate-ping"></div>
                    </div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-blue-500 flex items-center justify-center">
                      <Car size={12} className="text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {showControls && renderMapControls()}
              
              {/* Zoom level indicator */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow">
                <span className="text-sm font-medium">Zoom: {zoomLevel}x</span>
              </div>
              
              {/* Coordinates display */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                <div>Lat: {currentLocation.coordinates.lat.toFixed(4)}</div>
                <div>Lng: {currentLocation.coordinates.lng.toFixed(4)}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transport Options */}
      <Card>
        <h3 className="font-bold mb-4">Get Directions</h3>
        {renderTransportOptions()}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Clock size={24} className="text-primary-600" />
              <div>
                <h4 className="font-semibold">Estimated Time</h4>
                <p className="text-2xl font-bold">{estimatedTime}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Based on current traffic conditions via {transportMode}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Navigation size={24} className="text-primary-600" />
              <div>
                <h4 className="font-semibold">Distance</h4>
                <p className="text-2xl font-bold">{estimatedDistance}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {transportMode === 'driving' ? 'Driving distance' : 
               transportMode === 'walking' ? 'Walking distance' : 'Transit distance'}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <MapPin size={24} className="text-primary-600" />
              <div>
                <h4 className="font-semibold">Best Route</h4>
                <p className="font-medium">Via Main Road</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Less traffic • Better parking • Easy access
            </p>
          </div>
        </div>
      </Card>

      {/* Location Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Facilities */}
        <Card>
          <h3 className="font-bold mb-4">🏥 Hospital Facilities</h3>
          <div className="space-y-3">
            {currentLocation.facilities.map((facility, index) => (
              <div key={index} className="flex items-center gap-3">
                {facility === 'Parking' && <ParkingCircle size={20} className="text-green-600" />}
                {facility === 'Wheelchair Access' && <WheelchairIcon size={20} className="text-blue-600" />}
                {facility === 'Pharmacy' && <Star size={20} className="text-amber-600" />}
                {facility === 'Cafeteria' && <Coffee size={20} className="text-red-600" />}
                {facility === 'Wifi' && <Wifi size={20} className="text-purple-600" />}
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Floor Plan */}
        <Card>
          <h3 className="font-bold mb-4">🏢 Floor Plan</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {currentLocation.floors.map(floor => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor.id)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    selectedFloor === floor.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {floor.name}
                </button>
              ))}
            </div>
            
            {currentLocation.floors.find(f => f.id === selectedFloor) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {currentLocation.floors.find(f => f.id === selectedFloor)?.name}
                </h4>
                <ul className="space-y-2">
                  {currentLocation.floors.find(f => f.id === selectedFloor)?.departments.map((dept, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-sm">{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Contact & Hours */}
        <Card>
          <h3 className="font-bold mb-4">📞 Contact Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-gray-700">{currentLocation.address}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <a href={`tel:${currentLocation.contact}`} className="text-primary-600 hover:text-primary-800">
                    {currentLocation.contact}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>{currentLocation.hours}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-1 text-blue-800">Emergency</h4>
              <p className="text-sm text-blue-700">
                24/7 Emergency services available. Ambulance entrance at the back of the building.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Accessibility Information */}
      {settings.mode === 'elderly' && (
        <Card variant="elderly">
          <div className="flex items-start gap-4">
            <WheelchairIcon size={32} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-3">👵 Accessibility Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Parking & Entrance</h4>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <ParkingCircle size={16} className="flex-shrink-0" />
                      <span>Designated elderly parking near entrance</span>
                    </li>
                   <li className="flex items-center gap-2">
  <WheelchairIcon size={16} className="flex-shrink-0" />
  <span>Ramp access at all entrances</span>
</li>

                    <li className="flex items-center gap-2">
                      <Navigation size={16} className="flex-shrink-0" />
                      <span>Wheelchair assistance available</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inside Facilities</h4>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Coffee size={16} className="flex-shrink-0" />
                      <span>Seating areas every 50 meters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="flex-shrink-0" />
                      <span>Priority seating in waiting areas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone size={16} className="flex-shrink-0" />
                      <span>Emergency call buttons in restrooms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tips for First-Time Visitors */}
      <Card>
        <h3 className="font-bold mb-4">💡 Tips for Your Visit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-1">Arrival Time</h4>
            <p className="text-sm text-gray-600">Arrive 15-30 minutes early for parking and check-in</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-1">Parking</h4>
            <p className="text-sm text-gray-600">Use the visitor parking on the east side for easiest access</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-1">Check-In</h4>
            <p className="text-sm text-gray-600">Ground floor reception for all appointments</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-1">Navigation</h4>
            <p className="text-sm text-gray-600">Follow the colored lines on the floor to different departments</p>
          </div>
        </div>
      </Card>

      {/* Fullscreen Notice */}
      {isFullscreen && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-black/80 text-white p-4 rounded-lg text-center">
            <p>Press ESC or click the minimize button to exit fullscreen mode</p>
          </div>
        </div>
      )}
    </div>
  );

  return variant === 'compact' ? renderCompactView() : renderDetailedView();
};

export default MapView;