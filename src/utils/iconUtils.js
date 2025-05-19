import * as LucideIcons from 'lucide-react';

/**
 * Utility function to get a Lucide React icon component by name
 * @param {string} iconName - The name of the icon
 * @returns {React.ComponentType} - The icon component
 */
export const getIcon = (iconName) => {
  // If the icon name is found in Lucide Icons, return it
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  
  // Map of custom icon names that don't match exactly with Lucide names
  const iconMap = {
    // Add any custom mappings here if needed
    Menu: LucideIcons.Menu,
    X: LucideIcons.X,
    CheckSquare: LucideIcons.CheckSquare,
    ListTodo: LucideIcons.ListTodo,
    Search: LucideIcons.Search,
    Filter: LucideIcons.Filter,
    Plus: LucideIcons.Plus,
    ClipboardList: LucideIcons.ClipboardList,
    LayoutGrid: LucideIcons.LayoutGrid,
    Calendar: LucideIcons.Calendar
  };
  
  // Return the mapped icon or a default icon if not found
  return iconMap[iconName] || LucideIcons.HelpCircle;
};