# Dark Mode Quick Reference Guide

## Theme Toggle Location
The theme toggle button is located in the **top navigation bar** on the right side:
- **Light Mode**: Moon icon (🌙) - Click to switch to dark mode
- **Dark Mode**: Sun icon (☀️) - Click to switch to light mode

## Color Palette

### Light Mode
```
Primary Color (Blue):     #0284c7 (blue-600)
Secondary Color (Gray):   #6b7280 (gray-500)
Background (Primary):     #ffffff (white)
Background (Secondary):   #f9fafb (gray-50)
Text (Primary):          #1f2937 (gray-900)
Text (Secondary):        #6b7280 (gray-500)
Border Color:            #e5e7eb (gray-200)
```

### Dark Mode
```
Primary Color (Blue):     #2563eb (blue-500)
Secondary Color (Gray):   #9ca3af (gray-400)
Background (Primary):     #0f172a (slate-900)
Background (Secondary):   #1e293b (slate-800)
Text (Primary):          #f1f5f9 (slate-100)
Text (Secondary):        #cbd5e1 (slate-200)
Border Color:            #475569 (slate-600)
```

## Component Examples

### Button in Dark Mode
```jsx
<button className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white">
  Click me
</button>
```

### Card in Dark Mode
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100">
  Card content
</div>
```

### Text in Dark Mode
```jsx
<p className="text-gray-700 dark:text-gray-300">
  Regular text
</p>
```

## System Preferences
- **First Visit**: System automatically detects your color scheme preference
- **Subsequent Visits**: Your last selected preference is restored
- **Manual Override**: Click the toggle button to override system preference

## Accessibility Notes
- ✅ Color contrast meets WCAG 2.1 AA standards
- ✅ Works with screen readers
- ✅ Compatible with elderly mode and other accessibility features
- ✅ Smooth transitions between themes

## Mobile Experience
- Toggle button is accessible on all screen sizes
- Mobile menu includes theme toggle option
- Responsive design adapts to both light and dark modes

## Developer Notes
- All colors use CSS classes (no inline styles)
- Use Tailwind's `dark:` prefix for dark mode styles
- Theme is managed via React Context (useTheme hook)
- Preference is stored in localStorage
