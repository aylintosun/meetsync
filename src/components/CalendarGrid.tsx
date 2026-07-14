type CalendarGridProps = {
  days: (number | null)[];
  markedDays: Record<string, string[]>;
  currentYear: number;
  currentMonth: number;
  onDayClick: (day: number) => void;
};

function CalendarGrid({
  days,
  markedDays,
  currentYear,
  currentMonth,
  onDayClick,
}: CalendarGridProps) {
  function getDateKey(day: number) {
    return `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="days-grid">
      {days.map((day, index) => {
        if (day === null) {
          return (
            <div
              key={`empty-${index}`}
              className="day-card empty-day"
            />
          );
        }

        const dateKey = getDateKey(day);
        const colorsForDay = markedDays[dateKey] || [];

        return (
          <button
            key={dateKey}
            className="day-card"
            onClick={() => onDayClick(day)}
          >
            <span className="day-number">{day}</span>

            <div className="event-stripes">
              {[0, 1, 2, 3].map((stripeIndex) => {
                const color = colorsForDay[stripeIndex];

                const previousDay =
                  index % 7 !== 0 ? days[index - 1] : null;

                const nextDay =
                  index % 7 !== 6 ? days[index + 1] : null;

                const previousDateKey =
                  previousDay !== null
                    ? getDateKey(previousDay)
                    : "";

                const nextDateKey =
                  nextDay !== null
                    ? getDateKey(nextDay)
                    : "";

                const connectsToPrevious =
                  Boolean(color) &&
                  previousDay !== null &&
                  markedDays[previousDateKey]?.[stripeIndex] === color;

                const connectsToNext =
                  Boolean(color) &&
                  nextDay !== null &&
                  markedDays[nextDateKey]?.[stripeIndex] === color;

                const connectionClasses = [
                  color ? "filled-stripe" : "",
                  connectsToPrevious ? "connected-left" : "",
                  connectsToNext ? "connected-right" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={stripeIndex}
                    className={`empty-stripe ${connectionClasses}`}
                    style={{
                      backgroundColor: color || "#f0f0f3",
                    }}
                  />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CalendarGrid;