import { useState, useEffect } from 'react';

// Isolated so its 30s tick only re-renders these two digits, not the whole app.
export default function HeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
      {now.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
    </p>
  );
}
