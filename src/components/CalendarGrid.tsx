import { useRef } from "react";

type CalendarGridProps = {
  days: (number | null)[];
  markedDays: Record<string, string[]>;
  currentYear: number;
  currentMonth: number;
  selectedColor: string;
  onPaintDay: (day: number, action: PaintAction) => void;
};

function CalendarGrid({
  days,
  markedDays,
  currentYear,
  currentMonth,
  selectedColor,
  onPaintDay,
}: CalendarGridProps) {

    const isPaintingRef = useRef(false);
    const paintActionRef = useRef<PaintAction>("add");
    const lastPaintedDayRef = useRef<number | null>(null);

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

function startPainting(day: number) {
  if (!selectedColor) return;

  const dateKey = getDateKey(day);
  const currentColors = markedDays[dateKey] || [];

  const action: PaintAction = currentColors.includes(selectedColor)
    ? "remove"
    : "add";

  isPaintingRef.current = true;
  paintActionRef.current = action;
  lastPaintedDayRef.current = day;

  onPaintDay(day, action);
}

function paintDay(day: number) {
  if (!isPaintingRef.current || !selectedColor) return;

  if (lastPaintedDayRef.current === day) {
    return;
  }

  lastPaintedDayRef.current = day;
  onPaintDay(day, paintActionRef.current);
}

function stopPainting() {
  isPaintingRef.current = false;
  lastPaintedDayRef.current = null;
}

function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
  if (!isPaintingRef.current) return;

  const element = document.elementFromPoint(
    event.clientX,
    event.clientY,
  );

  const dayElement = element?.closest<HTMLElement>("[data-calendar-day]");

  if (!dayElement) return;

  const day = Number(dayElement.dataset.calendarDay);

  if (!Number.isNaN(day)) {
    paintDay(day);
  }
}

  return (
    <div   className={`days-grid ${isPaintingRef.current ? "is-painting" : ""}`}
  onPointerMove={handlePointerMove}
  onPointerUp={stopPainting}
  onPointerCancel={stopPainting}
  onPointerLeave={(event) => {
    if (event.pointerType === "mouse") {
      stopPainting();
    }
  }}
>
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
            type="button"
            className="day-card"
            data-calendar-day={day}
              onPointerDown={(event) => {
    if (!selectedColor) return;

    event.preventDefault();
    startPainting(day);
  }}
  onDragStart={(event) => event.preventDefault()}
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