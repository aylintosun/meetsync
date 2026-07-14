import { useEffect, useState } from "react"; 
import "./App.css";
import ColorPicker from "./components/ColorPicker";
import CalendarGrid from "./components/CalendarGrid";
import DayDetailsPanel from "./components/DayDetailsPanel";

const colors = [
  "#F3DFCD",
  "#C1C39D",
  "#FAAF6F",
  "#F3B2A6",
  "#BEC8D3",
  "#ACA0BD",
  "#E5A082",
  "#EDC483",
  "#B5BFB6",
  "#E1B9A1",
];

function App() {
  const [selectedColor, setSelectedColor] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const [note, setNote] = useState("");
  const [selectedNoteColor, setSelectedNoteColor] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  const [notes, setNotes] = useState<Record<string, Record<string, string>>>(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      return JSON.parse(savedNotes);
    }

    return {};
  });

  const [markedDays, setMarkedDays] = useState<Record<string, string[]>>(() => {
    const savedMarkedDays = localStorage.getItem("markedDays");

    if (savedMarkedDays) {
      return JSON.parse(savedMarkedDays);
    }

    return {};
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();

  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const calendarDays = [
    ...Array(startingDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

    useEffect(() => {
      localStorage.setItem("markedDays", JSON.stringify(markedDays));
    }, [markedDays]);

    useEffect(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    function goToPreviousMonth() {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    }

    function goToNextMonth() {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    }

    function getDateKey(day: number) {
      return `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }

    function formatDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function getConnectedDateKeys(day: number, color: string) {
    const connectedKeys = [getDateKey(day)];

    let previousDate = new Date(currentYear, currentMonth, day - 1);

    while (
      previousDate.getFullYear() === currentYear &&
      previousDate.getMonth() === currentMonth
    ) {
      const previousKey = formatDateKey(previousDate);
      const previousColors = markedDays[previousKey] || [];

      if (!previousColors.includes(color)) {
        break;
      }

      connectedKeys.unshift(previousKey);

      previousDate = new Date(
        previousDate.getFullYear(),
        previousDate.getMonth(),
        previousDate.getDate() - 1,
      );
    }

    let nextDate = new Date(currentYear, currentMonth, day + 1);

    while (
      nextDate.getFullYear() === currentYear &&
      nextDate.getMonth() === currentMonth
    ) {
      const nextKey = formatDateKey(nextDate);
      const nextColors = markedDays[nextKey] || [];

      if (!nextColors.includes(color)) {
        break;
      }

      connectedKeys.push(nextKey);

      nextDate = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate() + 1,
      );
    }

    return connectedKeys;
  }

  function getConnectedNote(day: number, color: string) {
    const connectedDateKeys = getConnectedDateKeys(day, color);

    for (const dateKey of connectedDateKeys) {
      const connectedNote = notes[dateKey]?.[color];

      if (connectedNote !== undefined) {
        return connectedNote;
      }
    }

    return "";
  }

    function handleOpenNotesPanel() {
      if (selectedDay === null) return;

      const dateKey = getDateKey(selectedDay);
      const colorsForDay = markedDays[dateKey] || [];
      const firstColor = colorsForDay[0] || "";

      setSelectedNoteColor(firstColor);
      setNote(firstColor ? getConnectedNote(selectedDay, firstColor) : "");
      setIsEditingNote(false);
      setIsDetailsPanelOpen(true);
    }

type PaintAction = "add" | "remove";

function handlePaintDay(day: number, action: PaintAction) {
  if (!selectedColor) return;

  const dateKey = getDateKey(day);

  if (action === "remove") {
    setNotes((previousNotes) => {
      const updatedNotes = { ...previousNotes };
      const dayNotes = { ...(updatedNotes[dateKey] || {}) };

      delete dayNotes[selectedColor];

      if (Object.keys(dayNotes).length === 0) {
        delete updatedNotes[dateKey];
      } else {
        updatedNotes[dateKey] = dayNotes;
      }

      return updatedNotes;
    });
  }

  setMarkedDays((previousMarkedDays) => {
    const currentColors = previousMarkedDays[dateKey] || [];

    if (action === "remove") {
      if (!currentColors.includes(selectedColor)) {
        return previousMarkedDays;
      }

      const updatedColors = currentColors.filter(
        (color) => color !== selectedColor,
      );

      if (updatedColors.length === 0) {
        const updatedDays = { ...previousMarkedDays };
        delete updatedDays[dateKey];
        return updatedDays;
      }

      return {
        ...previousMarkedDays,
        [dateKey]: updatedColors,
      };
    }

    if (currentColors.includes(selectedColor)) {
      return previousMarkedDays;
    }

    if (currentColors.length >= 4) {
      return previousMarkedDays;
    }

    return {
      ...previousMarkedDays,
      [dateKey]: [...currentColors, selectedColor],
    };
  });
}

function handleNoteColorSelect(color: string) {
  if (selectedDay === null) return;

  setSelectedNoteColor(color);
  setNote(getConnectedNote(selectedDay, color));
  setIsEditingNote(false);
}

function handleSaveNote() {
  if (selectedDay === null || !selectedNoteColor) return;

  const connectedDateKeys = getConnectedDateKeys(
    selectedDay,
    selectedNoteColor,
  );

  setNotes((previousNotes) => {
    const updatedNotes = { ...previousNotes };

    connectedDateKeys.forEach((dateKey) => {
      updatedNotes[dateKey] = {
        ...(updatedNotes[dateKey] || {}),
        [selectedNoteColor]: note,
      };
    });

    return updatedNotes;
  });

  setIsEditingNote(false);
  setIsDetailsPanelOpen(false);
  setNote("");
  setSelectedNoteColor("");
}

function handleStartEditing() {
  if (!selectedNoteColor && selectedDay !== null) {
    const dateKey = getDateKey(selectedDay);
    const firstColor = (markedDays[dateKey] || [])[0] || "";

    setSelectedNoteColor(firstColor);
    setNote(
      firstColor ? getConnectedNote(selectedDay, firstColor) : "",
    );
  }

  setIsEditingNote(true);
}

function handleCancelEditing() {
  if (selectedDay === null) return;

  setNote(
    selectedNoteColor
      ? getConnectedNote(selectedDay, selectedNoteColor)
      : "",
  );

  setIsEditingNote(false);
}

function handleDeleteNote() {
  if (selectedDay === null || !selectedNoteColor) return;

  const connectedDateKeys = getConnectedDateKeys(
    selectedDay,
    selectedNoteColor,
  );

  setNotes((previousNotes) => {
    const updatedNotes = { ...previousNotes };

    connectedDateKeys.forEach((dateKey) => {
      const dayNotes = { ...(updatedNotes[dateKey] || {}) };

      delete dayNotes[selectedNoteColor];

      if (Object.keys(dayNotes).length === 0) {
        delete updatedNotes[dateKey];
      } else {
        updatedNotes[dateKey] = dayNotes;
      }
    });

    return updatedNotes;
  });

  setNote("");
  setIsEditingNote(false);
}

return (
  <main className="app">
    <div className="app-layout"> 
      <section className="calendar-card">
        <header className="calendar-top">
          <div>
            <p className="app-label">📅 Calendar</p>
            <h1>MeetSync</h1>
          </div>
          <button
              type="button"
              className="add-note-button"
              onClick={handleOpenNotesPanel}
              disabled={selectedDay === null}
            >
              {selectedDay === null ? "Select a day" : "✎ View or add note"}
            </button>

        </header>

        <section className="setup-row">
          <ColorPicker
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </section>

        <section className="month-title">
          <button onClick={goToPreviousMonth}>←</button>
          <h2>{monthName}</h2>
          <button onClick={goToNextMonth}>→</button>
        </section>

        <div className="weekdays">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        <CalendarGrid
          days={calendarDays}
          markedDays={markedDays}
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedColor={selectedColor}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPaintDay={handlePaintDay}
        />
      </section>

      {selectedDay !== null && isDetailsPanelOpen && (
        <DayDetailsPanel
          selectedDay={selectedDay}
          monthName={monthName}
          availableColors={markedDays[getDateKey(selectedDay)] || []}
          selectedNoteColor={selectedNoteColor}
          note={note}
          notesForDay={notes[getDateKey(selectedDay)] || {}}
          isEditingNote={isEditingNote}
          onNoteColorSelect={handleNoteColorSelect}
          onNoteChange={setNote}
          onStartEditing={handleStartEditing}
          onCancelEditing={handleCancelEditing}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onClose={() => {
            setIsDetailsPanelOpen(false);
            setNote("");
            setSelectedNoteColor("");
            setIsEditingNote(false);
          }}
        />
      )}
    </div>
  </main>
);
}

export default App;
