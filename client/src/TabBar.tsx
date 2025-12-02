import './TabBar.css';


type TabType = 'home' | 'exercise' | 'diet' | 'account';
interface TabBarProps {
  active: TabType;
  onTab: (tab: TabType) => void;
}
export default function TabBar({ active, onTab }: TabBarProps) {
  return (
    <nav className="nav-container">
      <button
        className={active === 'home' ? 'nav-item active' : 'nav-item'}
        onClick={() => onTab('home')}
      >
        <span role="img" aria-label="Home">🏠</span>
        <span className="nav-label">Home</span>
      </button>
      <button
        className={active === 'exercise' ? 'nav-item active' : 'nav-item'}
        onClick={() => onTab('exercise')}
      >
        <span role="img" aria-label="Exercise">💪</span>
        <span className="nav-label">Exercise Finder</span>
      </button>
      <button
        className={active === 'diet' ? 'nav-item active' : 'nav-item'}
        onClick={() => onTab('diet')}
      >
        <span role="img" aria-label="Diet">🥗</span>
        <span className="nav-label">Diet Plan</span>
      </button>
      <button
        className={active === 'account' ? 'nav-item active' : 'nav-item'}
        onClick={() => onTab('account')}
      >
        <span role="img" aria-label="Account">👤</span>
        <span className="nav-label">Account</span>
      </button>
    </nav>
  );
}
