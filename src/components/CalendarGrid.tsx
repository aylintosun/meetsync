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

  function createStripeLayout() {
  const layout: Record<string, (string | null)[]> = {};

  let previousSlots: (string | null)[] = [null, null, null, null];

  days.forEach((day, index) => {
    if (index % 7 === 0) {
      previousSlots = [null, null, null, null];
    }

    if (day === null) {
      return;
    }

    const dateKey = getDateKey(day);
    const dayColors = markedDays[dateKey] || [];

    const currentSlots: (string | null)[] = [null, null, null, null];

    // Önce bir önceki günden devam eden renkleri aynı satırda tut.
    previousSlots.forEach((color, slotIndex) => {
      if (color && dayColors.includes(color)) {
        currentSlots[slotIndex] = color;
      }
    });

    // Yeni başlayan renkleri boş satırlara yerleştir.
    dayColors.forEach((color) => {
      if (currentSlots.includes(color)) {
        return;
      }

      const emptySlotIndex = currentSlots.findIndex(
        (slotColor) => slotColor === null,
      );

      if (emptySlotIndex !== -1) {
        currentSlots[emptySlotIndex] = color;
      }
    });

    layout[dateKey] = currentSlots;
    previousSlots = currentSlots;
  });

  return layout;
}

const stripeLayout = createStripeLayout();

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
        const colorsForDay = stripeLayout[dateKey] || [
            null,
            null,
            null,
            null,
            ];

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
                  stripeLayout[previousDateKey]?.[stripeIndex] === color;

                const connectsToNext =
                  Boolean(color) &&
                  nextDay !== null &&
                  stripeLayout[nextDateKey]?.[stripeIndex] === color;

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