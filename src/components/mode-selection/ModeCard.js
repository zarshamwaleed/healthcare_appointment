import React from 'react';
import { Check } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const ModeCard = ({ mode, onSelect }) => {
  const { settings } = useAccessibility();
  const isVis = settings.visuallyImpaired;

  return (
    <div className={`rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ${isVis ? 'bg-black border-2 border-yellow-400' : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700'}`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${mode.color} text-white`}>
          {mode.icon}
        </div>
        <span className={`px-3 py-1 rounded-full bg-transparent text-sm font-semibold ${isVis ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
          Recommended
        </span>
      </div>

      <h3 className={`text-2xl font-bold mb-3 ${isVis ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{mode.title}</h3>
      <p className={`${isVis ? 'text-white' : 'text-gray-600 dark:text-gray-300'} mb-6`}>{mode.description}</p>

      <ul className="space-y-3 mb-8">
        {mode.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check size={18} className={`mr-3 ${isVis ? 'text-yellow-400' : 'text-primary-600 dark:text-primary-400'}`} />
            <span className={`${isVis ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-4 rounded-xl font-bold transition-opacity ${isVis ? 'bg-white text-black border-4 border-yellow-400 hover:opacity-95' : `text-white bg-gradient-to-r ${mode.color} hover:opacity-90`}`}
      >
        Select {mode.title}
      </button>
    </div>
  );
};

export default ModeCard;