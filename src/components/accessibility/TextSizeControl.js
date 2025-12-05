import React, { useState, useEffect } from 'react';
import { Type, ZoomIn, ZoomOut, Check, Eye, User } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const TextSizeControl = () => {
  const { settings, updateSettings } = useAccessibility();
  const [isMounted, setIsMounted] = useState(false);
  const [presetApplied, setPresetApplied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const textSizes = [
    { id: 'small', name: 'Small', size: 'text-sm', description: 'Compact view for large screens', icon: <ZoomOut size={16} /> },
    { id: 'medium', name: 'Medium', size: 'text-base', description: 'Standard size for most users', icon: <Type size={16} /> },
    { id: 'large', name: 'Large', size: 'text-lg', description: 'Improved readability', icon: <ZoomIn size={16} /> },
    { id: 'xlarge', name: 'Extra Large', size: 'text-xl', description: 'Best for low vision users', icon: <Type size={18} /> },
    { id: 'xxlarge', name: 'Extra Extra Large', size: 'text-2xl', description: 'Maximum accessibility', icon: <ZoomIn size={18} /> },
  ];

  const userPresets = [
    {
      id: 'elderly',
      name: 'Elderly Friendly',
      fontSize: 'xlarge',
      description: 'Optimized for users above 60',
      icon: <User size={16} />
    },
    {
      id: 'low-vision',
      name: 'Low Vision',
      fontSize: 'xxlarge',
      description: 'Maximum text size',
      icon: <Eye size={16} />
    },
    {
      id: 'standard',
      name: 'Standard User',
      fontSize: 'medium',
      description: 'Default settings',
      icon: <Type size={16} />
    }
  ];

  const handleSizeChange = (sizeId) => {
    updateSettings({ fontSize: sizeId });
    setPresetApplied(false);
  };

  const applyPreset = (preset) => {
    updateSettings({ fontSize: preset.fontSize });
    setPresetApplied(true);
    setTimeout(() => setPresetApplied(false), 3000);
  };

  const increaseSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      updateSettings({ fontSize: sizes[currentIndex + 1] });
      setPresetApplied(false);
    }
  };

  const decreaseSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      updateSettings({ fontSize: sizes[currentIndex - 1] });
      setPresetApplied(false);
    }
  };

  const getCurrentSizeName = () => {
    const size = textSizes.find(s => s.id === settings.fontSize);
    return size ? size.name : 'Medium';
  };

  const getPreviewText = () => {
    const sizeClass = textSizes.find(s => s.id === settings.fontSize)?.size || 'text-base';
    
    return `
      <div class="${sizeClass}">
        <h3 class="font-bold mb-2">Sample Text Preview</h3>
        <p class="mb-2">This is how the text will appear at ${getCurrentSizeName()} size.</p>
        <p class="text-gray-600">All interface text, buttons, and labels will use this size.</p>
        <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Sample Button</button>
      </div>
    `;
  };

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Size Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Type size={24} className="text-blue-600" />
              Text Size Settings
            </h3>
            <p className="text-gray-600">Current size: <span className="font-semibold">{getCurrentSizeName()}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseSize}
              disabled={settings.fontSize === 'small'}
              className={`p-2 rounded-lg ${settings.fontSize === 'small' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Decrease text size"
            >
              <ZoomOut size={20} />
            </button>
            <div className="px-4 py-2 bg-white rounded-lg font-bold">
              {getCurrentSizeName()}
            </div>
            <button
              onClick={increaseSize}
              disabled={settings.fontSize === 'xxlarge'}
              className={`p-2 rounded-lg ${settings.fontSize === 'xxlarge' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Increase text size"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>

        {/* Size Indicator */}
        <div className="relative pt-2 pb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>A</span>
            <span>A</span>
            <span className="text-lg">A</span>
            <span className="text-xl">A</span>
            <span className="text-2xl">A</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${(['small', 'medium', 'large', 'xlarge', 'xxlarge'].indexOf(settings.fontSize) / 4) * 100}%` }}
            ></div>
          </div>
          <div 
            className="absolute top-0 transform -translate-x-1/2 transition-all duration-300"
            style={{ left: `${(['small', 'medium', 'large', 'xlarge', 'xxlarge'].indexOf(settings.fontSize) / 4) * 100}%` }}
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <User size={18} />
          Quick Presets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userPresets.map(preset => {
            const isActive = settings.fontSize === preset.fontSize;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${isActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {preset.icon}
                  </div>
                  <div>
                    <h5 className="font-bold">{preset.name}</h5>
                    <p className="text-sm text-gray-600">{preset.description}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Check size={14} />
                    <span>Applied</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {presetApplied && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <Check size={16} />
              Preset applied successfully!
            </p>
          </div>
        )}
      </div>

      {/* Size Selection Grid */}
      <div>
        <h4 className="font-semibold mb-3">All Text Sizes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {textSizes.map(size => {
            const isActive = settings.fontSize === size.id;
            return (
              <button
                key={size.id}
                onClick={() => handleSizeChange(size.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${isActive ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {size.icon}
                  </div>
                  <div>
                    <h5 className="font-bold">{size.name}</h5>
                    <p className={`${size.size} text-gray-600`}>Aa</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{size.description}</p>
                {isActive && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-blue-600">
                    <Check size={12} />
                    <span>Active</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <h4 className="font-semibold mb-4">Live Preview</h4>
        <div className="p-6 bg-gray-50 rounded-lg min-h-[120px]">
          <div className={textSizes.find(s => s.id === settings.fontSize)?.size || 'text-base'}>
            <h3 className="font-bold mb-3">Healthcare Appointment System</h3>
            <p className="mb-2">Welcome to our accessible healthcare booking interface.</p>
            <p className="mb-4 text-gray-600">This preview shows how text will appear throughout the application.</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View Doctors
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WCAG Compliance Info */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Accessibility Compliance</h4>
        <ul className="text-sm text-green-700 space-y-2">
          <li className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span><strong>WCAG 2.1 AA Compliant:</strong> All text sizes maintain minimum contrast ratios</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span><strong>Responsive Design:</strong> Text scales properly on all device sizes</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="mt.0.5 flex-shrink-0" />
            <span><strong>User Control:</strong> Users can adjust text size up to 200% without loss of content</span>
          </li>
        </ul>
        <div className="mt-3 p-2 bg-white rounded border border-green-300">
          <p className="text-xs text-green-600">
            ℹ️ For users with visual impairments, we recommend using "Large" or "Extra Large" text sizes combined with High Contrast mode.
          </p>
        </div>
      </div>

      {/* Recommended Settings */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">💡 Recommended Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-amber-700 mb-1">For Elderly Users</h5>
            <p className="text-amber-600">Use <strong>Extra Large</strong> text with <strong>High Contrast</strong> mode for optimal readability.</p>
          </div>
          <div>
            <h5 className="font-medium text-amber-700 mb-1">For Low Vision</h5>
            <p className="text-amber-600">Combine <strong>Extra Extra Large</strong> text with screen reader support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSizeControl;