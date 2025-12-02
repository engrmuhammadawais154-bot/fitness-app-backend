
import './SuggestionsPage.css';
import type { ExerciseGroup } from './types';

interface SuggestionsPageProps {
  groups: ExerciseGroup[];
  onBack: () => void;
}

export default function SuggestionsPage({ groups, onBack }: SuggestionsPageProps) {
  return (
    <div className="suggestions-page">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>
      <h2>Suggested Exercises</h2>
      <div className="exercise-groups">
        {groups.map((group, idx) => (
          <div className="exercise-group" key={idx}>
            <h3>{group.name}</h3>
            <ul>
              {group.variations.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
