type CalendarGridProps = {
  days: (number | null)[];
  markedDays: Record<string, string[]>;
  currentYear: number;
  currentMonth: number;
  onDayClick: (day: number) => void;
};

function CalendarGrid({ days, markedDays, currentYear, currentMonth, onDayClick }: CalendarGridProps) {
  return (
    <div className="days-grid">
        {days.map((day, index) => {
        if (day === null) {
            return <div key={`empty-${index}`} className="day-card empty-day"></div>;
        }

        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;

        return (
            <button
            key={dateKey}
            className="day-card"
            onClick={() => onDayClick(day)}
            >
            <span className="day-number">{day}</span>

            <div className="event-stripes">
                {[0, 1, 2, 3].map((stripeIndex) => (
                <div
                    key={stripeIndex}
                    className="empty-stripe"
                    style={{
                    backgroundColor:
                        markedDays[dateKey]?.[stripeIndex] || "#f0f0f3",
                    }}
                />
                ))}
            </div>
            </button>
        );
        })}
    </div>
  );
}

export default CalendarGrid;