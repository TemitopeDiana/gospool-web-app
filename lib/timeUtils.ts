export const parseTimeStr = (timeStr?: string): number | null => {
  if (!timeStr) return null;

  // Matches "08:30", "15:30", "08:30am", "12:15 PM"
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3]?.toLowerCase();

  if (modifier) {
    if (hours === 12) {
      hours = modifier === 'am' ? 0 : 12;
    } else if (modifier === 'pm') {
      hours += 12;
    }
  }

  return hours * 60 + minutes;
};
