import './MuscleGroups.css';

const muscleGroups = [
  { key: 'chest', label: 'Chest', icon: '🏋️‍♂️' },
  { key: 'back', label: 'Back', icon: '💪' },
  { key: 'legs', label: 'Legs', icon: '🦵' },
  { key: 'shoulders', label: 'Shoulders', icon: '🤸‍♂️' },
  { key: 'arms', label: 'Arms', icon: '💪' },
  { key: 'abs', label: 'Abs', icon: '🧘‍♂️' },
  { key: 'forearms', label: 'Forearms', icon: '🤲' },
  { key: 'glutes', label: 'Glutes', icon: '🍑' },
];

interface MuscleGroupsProps {
  onSelect: (group: string) => void;
}

export default function MuscleGroups({ onSelect }: MuscleGroupsProps) {
  return (
    <div className="muscle-groups">
      {muscleGroups.map(mg => (
        <div className="muscle-card" key={mg.key} onClick={() => onSelect(mg.key)}>
          <span className="muscle-icon">{mg.icon}</span>
          <span className="muscle-label">{mg.label}</span>
        </div>
      ))}
    </div>
  );
}
