"use client";

const PALETTE = [
  "#0B0D0E", "#151718", "#F7F7F7", "#FFFFFF",
  "#F0F0F0", "#E0E0E0", "#CCCCCC", "#A3A3A3",
  "#737373", "#525252", "#262626", "#16A34A",
  "#D97706", "#DC2626",
];

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {/* Paleta pré-definida */}
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-7 w-7 rounded-full border-2 transition ${
              value.toLowerCase() === color.toLowerCase()
                ? "border-blue-500 scale-110"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Roda de cor nativa + campo hex */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 rounded border cursor-pointer bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB"
          maxLength={7}
          className="h-9 w-28 rounded-md border px-2 text-sm font-mono bg-background"
        />
      </div>
    </div>
  );
}