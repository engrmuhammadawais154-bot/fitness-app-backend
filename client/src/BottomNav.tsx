import './BottomNav.css';
import type { NavTab } from './types';

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: '🏠', aria: 'Home' },
  { key: 'exercise', label: 'Exercise Finder', icon: '💪', aria: 'Exercise Finder' },
  { key: 'diet', label: 'Diet Plan', icon: '🥗', aria: 'Diet Plan' },
  { key: 'account', label: 'Account', icon: '👤', aria: 'Account' },
];

interface BottomNavProps {
  active: NavTab;
  onTab: (tab: NavTab) => void;
}

export default function BottomNav({ active, onTab }: BottomNavProps) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main Navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          className={active === item.key ? 'nav-btn active' : 'nav-btn'}
          aria-label={item.aria}
          aria-current={active === item.key ? 'page' : undefined}
          tabIndex={0}
          onClick={() => onTab(item.key as NavTab)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
