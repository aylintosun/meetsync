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
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>

      <div className="selected-color-box">
        <p>Bu gündeki renkler</p>

        {availableColors.length === 0 ? (
          <p className="empty-message">Önce takvimden bu güne bir renk ekle.</p>
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
                aria-label="Not rengi seç"
              />
            ))}
          </div>
        )}
      </div>

      <label className="note-label">Not</label>
      <textarea
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Not yaz..."
        maxLength={200}
        disabled={!selectedNoteColor}
      />

      <div className="note-count">{note.length} / 200</div>

      {Object.entries(notesForDay).length > 0 && (
        <div className="saved-notes">
          <p>Kayıtlı notlar</p>
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
        Kaydet
      </button>
    </aside>
  );
}

export default DayDetailsPanel;