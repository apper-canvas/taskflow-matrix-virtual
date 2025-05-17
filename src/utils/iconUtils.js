import {
  Menu,
  X,
  Sun,
  Moon,
  CheckSquare,
  ListTodo,
  Calendar,
  Tag,
  Folder,
  BarChart,
  Settings,
  Plus,
  Check,
  Edit,
  Trash,
  Search,
  ClipboardList,
  LayoutGrid,
  Filter,
  Star,
  Clock
} from 'lucide-react';

const icons = {
  Menu,
  X,
  Sun,
  Moon,
  CheckSquare,
  ListTodo,
  Calendar,
  Tag,
  Folder,
  BarChart,
  Settings,
  Plus,
  Check,
  Edit,
  Trash,
  Search,
  ClipboardList,
  LayoutGrid,
  Filter,
  Star,
  Clock
};

export function getIcon(name) {
  return icons[name] || null;
}