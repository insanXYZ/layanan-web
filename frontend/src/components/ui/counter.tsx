import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface CounterProps {
  defaultValue: number;
  onChange: (v: number) => void;
}

export const Counter = ({ defaultValue = 0, onChange }: CounterProps) => {
  const [val, setVal] = useState<number>(defaultValue);

  return (
    <div className="flex gap-0.5">
      <Button type="button" onClick={() => setVal(val - 1)}>
        -
      </Button>
      <Input
        type="number"
        defaultValue={val}
        onChange={(v) => onChange(Number(v.target.value))}
      />
      <Button type="button" onClick={() => setVal(val + 1)}>
        +
      </Button>
    </div>
  );
};
