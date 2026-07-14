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

    function handleOpenNotesPanel() {
      if (selectedDay === null) return;

      const dateKey = getDateKey(selectedDay);
      const colorsForDay = markedDays[dateKey] || [];
      const firstColor = colorsForDay[0] || "";

      setSelectedNoteColor(firstColor);
      setNote(firstColor ? notes[dateKey]?.[firstColor] || "" : "");
      setIsEditingNote(false);
      setIsDetailsPanelOpen(true);
    }

type PaintAction = "add" | "remove";

function handlePaintDay(day: number, action: PaintAction) {
  if (!selectedColor) return;

  const dateKey = getDateKey(day);

  setMarkedDays((prev) => {
    const currentColors = prev[dateKey] || [];

    if (action === "remove") {
      if (!currentColors.includes(selectedColor)) {
        return prev;
      }

      const updatedColors = currentColors.filter(
        (color) => color !== selectedColor,
      );

      if (updatedColors.length === 0) {
        const updatedDays = { ...prev };
        delete updatedDays[dateKey];
        return updatedDays;
      }

      return {
        ...prev,
        [dateKey]: updatedColors,
      };
    }

    if (currentColors.includes(selectedColor)) {
      return prev;
    }

    if (currentColors.length >= 4) {
      return prev;
    }

    return {
      ...prev,
      [dateKey]: [...currentColors, selectedColor],
    };
  });
}

    function handleNoteColorSelect(color: string) {
      if (selectedDay === null) return;

      const dateKey = getDateKey(selectedDay);
      setSelectedNoteColor(color);
      setNote(notes[dateKey]?.[color] || "");
    }

    function handleSaveNote() {
      if (selectedDay === null || !selectedNoteColor) return;

      const dateKey = getDateKey(selectedDay);

      setNotes((prev) => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [selectedNoteColor]: note,
        },
      }));

      setIsDetailsPanelOpen(false);
      setNote("");
      setSelectedNoteColor("");
    }

    function handleStartEditing() {
  if (!selectedNoteColor && selectedDay !== null) {
    const dateKey = getDateKey(selectedDay);
    const firstColor = (markedDays[dateKey] || [])[0] || "";
    setSelectedNoteColor(firstColor);
    setNote(firstColor ? notes[dateKey]?.[firstColor] || "" : "");
  }

  setIsEditingNote(true);
}

function handleCancelEditing() {
  if (selectedDay === null) return;

  const dateKey = getDateKey(selectedDay);
  setNote(selectedNoteColor ? notes[dateKey]?.[selectedNoteColor] || "" : "");
  setIsEditingNote(false);
}

function handleDeleteNote() {
  if (selectedDay === null || !selectedNoteColor) return;

  const dateKey = getDateKey(selectedDay);

  setNotes((prev) => {
    const dayNotes = { ...(prev[dateKey] || {}) };
    delete dayNotes[selectedNoteColor];

    if (Object.keys(dayNotes).length === 0) {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    }

    return {
      ...prev,
      [dateKey]: dayNotes,
    };
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
              {selectedDay === null ? "Select a day" : "✎ Add note"}
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
