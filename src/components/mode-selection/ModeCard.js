import React from 'react';
import { Check } from 'lucide-react';

const ModeCard = ({ mode, onSelect }) => {
  return (
    <div className={`${mode.bgColor} rounded-2xl p-8 border-2 border-transparent hover:border-${mode.textColor.split('-')[1]}-300 transition-all duration-300 hover:shadow-2xl`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${mode.color} text-white`}>
          {mode.icon}
        </div>
        <span className={`px-3 py-1 rounded-full ${mode.textColor} ${mode.bgColor} text-sm font-semibold`}>
          Recommended
        </span>
      </div>

      <h3 className="text-2xl font-bold mb-3">{mode.title}</h3>
      <p className="text-gray-600 mb-6">{mode.description}</p>

      <ul className="space-y-3 mb-8">
        {mode.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check size={18} className={`mr-3 ${mode.textColor}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${mode.color} hover:opacity-90 transition-opacity`}
      >
        Select {mode.title}
      </button>
    </div>
  );
};

export default ModeCard;