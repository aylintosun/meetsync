type DayDetailsPanelProps = {
  selectedDay: number;
  monthName: string;
  availableColors: string[];
  selectedNoteColor: string;
  note: string;
  notesForDay: Record<string, string>;
  isEditingNote: boolean;
  onNoteColorSelect: (color: string) => void;
  onNoteChange: (note: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
};

function DayDetailsPanel({
  selectedDay,
  monthName,
  availableColors,
  selectedNoteColor,
  note,
  notesForDay,
  isEditingNote,
  onNoteColorSelect,
  onNoteChange,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
  onClose,
}: DayDetailsPanelProps) {
  const savedNotes = Object.entries(notesForDay);

  return (
    <aside className="details-panel">
      <div className="details-header">
        <h2>
          {selectedDay} {monthName}
        </h2>
        <button onClick={onClose} className="close-button" aria-label="Close panel">
          ×
        </button>
      </div>

      <div className="selected-color-box">
        <div className="selected-color-top">
          <p>Colors assigned to this day</p>

          <button
            type="button"
            className="edit-note-button"
            onClick={onStartEditing}
            disabled={availableColors.length === 0}
            aria-label="Edit note"
            title="Edit note"
          >
            ✎
          </button>
        </div>

        {availableColors.length === 0 ? (
          <p className="empty-message">
            Add a color to this day from the calendar first.
          </p>
        ) : (
          <div className="panel-color-options">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
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

      {!isEditingNote ? (
        <div className="saved-notes-list">
          {savedNotes.length === 0 ? (
            <p className="empty-message">No saved notes for this day yet.</p>
          ) : (
            savedNotes.map(([color, savedNote]) => (
              <button
                key={color}
                type="button"
                className={`saved-note-card ${
                  selectedNoteColor === color ? "selected" : ""
                }`}
                style={{
                  backgroundColor: `${color}55`,
                  borderColor: color,
                }}
                onClick={() => onNoteColorSelect(color)}
              >
                <span className="saved-note-card-text">{savedNote}</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Write a note..."
            maxLength={200}
            disabled={!selectedNoteColor}
          />

          <div className="note-count">{note.length} / 200</div>

          <div className="panel-action-row">
            <button
              type="button"
              className="save-button"
              onClick={onSave}
              disabled={!selectedNoteColor}
            >
              Save
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={onDelete}
              disabled={!selectedNoteColor}
            >
              Delete
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={onCancelEditing}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default DayDetailsPanel;