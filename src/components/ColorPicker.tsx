type ColorPickerProps = {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
};

function ColorPicker({
  colors,
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  return (
    <div className="color-options">
      {colors.map((color) => (
        <button
          key={color}
          className={`color-button ${
            selectedColor === color ? "selected" : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
}

export default ColorPicker;