# How to Add Dark Mode to Your Components

## Overview
The dark mode system is now fully integrated into the application. This guide shows you how to add dark mode support to any new or existing components.

## Quick Start

### 1. Import the useTheme Hook
```javascript
import { useTheme } from '../../context/ThemeContext';
```

### 2. Use the Hook in Your Component
```javascript
const MyComponent = () => {
  const { theme, toggleTheme, setThemeMode } = useTheme();
  
  // theme is either 'light' or 'dark'
  // toggleTheme() switches between light and dark
  // setThemeMode('light' or 'dark') sets specific theme
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## Adding Dark Mode Styles

### Method 1: Using Tailwind's dark: Prefix (Recommended)
```jsx
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
  This content adapts to light and dark modes
</div>
```

### Method 2: Using CSS Variables
In your CSS file:
```css
.my-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

Available CSS variables:
- `--bg-primary` - Main background color
- `--bg-secondary` - Secondary background (cards, panels)
- `--bg-tertiary` - Tertiary background (inputs, etc)
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text (labels, hints)
- `--border-color` - Border colors
- `--shadow-color` - Shadow colors
- `--navbar-bg` - Navigation bar background
- `--card-bg` - Card background color

### Method 3: Conditional Rendering Based on Theme
```jsx
const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark-styles' : 'light-styles'}>
      Content here
    </div>
  );
};
```

## Common Component Patterns

### Text with Dark Mode
```jsx
<p className="text-gray-700 dark:text-gray-300">
  Regular paragraph text
</p>
```

### Buttons with Dark Mode
```jsx
<button className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500">
  Click me
</button>
```

### Cards with Dark Mode
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
  <h3 className="text-gray-900 dark:text-white">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Card content</p>
</div>
```

### Input Fields with Dark Mode
```jsx
<input 
  className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2"
  placeholder="Enter text..."
/>
```

### Icons with Dark Mode
```jsx
import { Heart } from 'lucide-react';

<Heart size={20} className="text-gray-600 dark:text-gray-400" />
```

### Gradients with Dark Mode
```jsx
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
  Gradient content
</div>
```

## Color Palette by Theme

### Light Mode Colors
```javascript
{
  primary: '#0284c7',      // blue-600
  secondary: '#6b7280',    // gray-500
  background: '#ffffff',   // white
  surface: '#f9fafb',      // gray-50
  text: '#1f2937',         // gray-900
  textSecondary: '#6b7280' // gray-500
}
```

### Dark Mode Colors
```javascript
{
  primary: '#2563eb',      // blue-500
  secondary: '#9ca3af',    // gray-400
  background: '#0f172a',   // slate-900
  surface: '#1e293b',      // slate-800
  text: '#f1f5f9',         // slate-100
  textSecondary: '#cbd5e1' // slate-200
}
```

## Real-World Examples

### Example 1: Simple Hero Section
```jsx
import { useTheme } from '../context/ThemeContext';

const HeroSection = () => {
  const { theme } = useTheme();
  
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen py-20">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
        Welcome to SmartHealth
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center mt-4">
        Your healthcare, simplified
      </p>
    </section>
  );
};
```

### Example 2: Info Alert
```jsx
const AlertBox = ({ message, type = 'info' }) => {
  const typeStyles = {
    info: 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700',
    success: 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700',
    warning: 'bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-100 border-amber-200 dark:border-amber-700',
    error: 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700'
  };
  
  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]}`}>
      {message}
    </div>
  );
};
```

### Example 3: Data Table
```jsx
const DataTable = ({ data }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-slate-700">
          <th className="border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white p-2">
            Column 1
          </th>
          <th className="border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white p-2">
            Column 2
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
            <td className="border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 p-2">
              {row.col1}
            </td>
            <td className="border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 p-2">
              {row.col2}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Testing Dark Mode

### In Development
1. Start your app: `npm start`
2. Click the Moon icon in the navbar to toggle between themes
3. Refresh the page - your preference should persist
4. Open DevTools and check the `<html>` element - it should have the `dark` class when in dark mode

### In Browser DevTools
```javascript
// Toggle dark mode programmatically in console
document.documentElement.classList.toggle('dark');
```

## Best Practices

1. **Always test both themes**: Ensure text is readable and colors have sufficient contrast
2. **Use semantic colors**: Use blue for primary, green for success, red for error, etc.
3. **Maintain contrast**: WCAG AA standards require 4.5:1 for normal text
4. **Use CSS variables**: Centralizes color management
5. **Avoid hardcoded colors**: Use Tailwind classes or CSS variables instead
6. **Test with accessibility tools**: Verify color contrast ratios
7. **Consider eye comfort**: Dark mode should use softer colors, not pure white on pure black

## Troubleshooting

### Dark mode styles not applying?
- Check that the `<html>` element has the `dark` class
- Ensure you're using `dark:` prefix correctly
- Verify component is wrapped with `ThemeProvider`
- Clear browser cache and reload

### Colors look wrong in dark mode?
- Check your color choices don't have poor contrast
- Use the color palette provided above
- Test with WebAIM Contrast Checker
- Consider accessibility for colorblind users

### Theme not persisting?
- Check that localStorage is enabled
- Look for browser restrictions on localStorage
- Check browser console for errors
- Verify ThemeProvider is at the root of the app

## Questions?
Refer to:
- `DARK_MODE_IMPLEMENTATION.md` - Full implementation details
- `DARK_MODE_QUICK_REFERENCE.md` - Quick lookup guide
- Theme context file: `src/context/ThemeContext.js`
