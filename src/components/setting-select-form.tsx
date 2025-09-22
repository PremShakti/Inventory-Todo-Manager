import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SettingSelectFormProps {
  label: string;
  apiKey: "inventoryTypes" | "locations" | "descriptions";
  values: string[];
  onChange: (newValues: string[]) => void;
  email: string; // Add email prop
}

export function SettingSelectForm({ label, apiKey, values, onChange, email }: SettingSelectFormProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    console.log("handleAdd called");
    const value = input.trim();
    const safeValues = Array.isArray(values) ? values : [];
    if (!value || safeValues.includes(value)) return;
    setLoading(true);
    toast.loading("Saving setting...");
    try {
      await axios.post("/api/settings", { email, [apiKey]: [...safeValues, value] });
      onChange([...safeValues, value]);
      setInput("");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const handleDelete = async (value: string) => {
    setLoading(true);
    toast.loading("Deleting setting...");
    try {
      await axios.delete("/api/settings", { data: { key: apiKey, value, email } }); // include email
      onChange(values.filter((v) => v !== value));
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="mb-6">
        <span className="font-semibold">{label}</span>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          className="border rounded px-2 py-1 text-sm flex-1"
          placeholder={`Add new ${label.toLowerCase()}`}
          maxLength={32}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleAdd();
          }}
          disabled={loading}
        />
        <Button
          size="sm"
          type="button" // <-- Add this line
          onClick={handleAdd}
          disabled={loading || !input.trim()}
        >
          Add
        </Button>
      </div>
      {Array.isArray(values) && values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
              {item}
              <button
                type="button"
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item)}
                disabled={loading}
                title="Delete"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
