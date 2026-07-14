type DayDetailsPanelProps = {
  selectedDay: number;
  monthName: string;
  availableColors: string[];
  selectedNoteColor: string;
  note: string;
  notesForDay: Record<string, string>;
  onNoteColorSelect: (color: string) => void;
  onNoteChange: (note: string) => void;
  onSave: () => void;
  onClose: () => void;
};

function DayDetailsPanel({
  selectedDay,
  monthName,
  availableColors,
  selectedNoteColor,
  note,
  notesForDay,
  onNoteColorSelect,
  onNoteChange,
  onSave,
  onClose,
}: DayDetailsPanelProps) {
  return (
    <aside className="details-panel">
      <div className="details-header">
        <h2>
          {selectedDay} {monthName}
        </h2>
        <button   
        onClick={onClose}
  className="close-button"
  aria-label="Close panel"
>
          ×
        </button>
      </div>

      <div className="selected-color-box">
        <p>Colors assigned to this day</p>

        {availableColors.length === 0 ? (
          <p className="empty-message">Add a color to this day from the calendar first.</p>
        ) : (
          <div className="panel-color-options">
            {availableColors.map((color) => (
              <button
                key={color}
                className={`panel-color-button ${
                  selectedNoteColor === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onNoteColorSelect(color)}
                aria-label="Select note color"
              />
            ))}
          </div>
        )}
      </div>

      <label className="note-label">Note</label>
      <textarea
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Write a note..."
        maxLength={200}
        disabled={!selectedNoteColor}
      />

      <div className="note-count">{note.length} / 200</div>

      {Object.entries(notesForDay).length > 0 && (
        <div className="saved-notes">
          <p>Saved notes</p>
          {Object.entries(notesForDay).map(([color, savedNote]) => (
            <div key={color} className="saved-note">
              <span
                className="saved-note-dot"
                style={{ backgroundColor: color }}
              />
              <span>{savedNote}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="save-button"
        onClick={onSave}
        disabled={!selectedNoteColor}
      >
        Save
      </button>
    </aside>
  );
}

export default DayDetailsPanel;