import { LINES, type Line } from '../data/stations';

interface Props {
  selected: string;
  onChange: (lineId: string) => void;
  filter?: 'mrt' | 'lrt' | 'all';
}

export default function LineSelector({ selected, onChange, filter = 'all' }: Props) {
  const filtered = LINES.filter(l => filter === 'all' || l.type === filter);

  return (
    <div className="flex flex-wrap gap-2">
      {filtered.map((line: Line) => {
        const isActive = selected === line.id;
        return (
          <button
            key={line.id}
            onClick={() => onChange(line.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border-2"
            style={{
              backgroundColor: isActive ? line.color : 'transparent',
              borderColor: line.color,
              color: isActive ? line.textColor : line.color,
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? `0 4px 14px ${line.color}55` : 'none',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isActive ? line.textColor : line.color }}
            />
            {line.id}
            <span className="hidden sm:inline font-normal opacity-80 text-xs">
              {line.name.replace(' Line', '').replace(' LRT', '')}
            </span>
          </button>
        );
      })}
    </div>
  );
}
