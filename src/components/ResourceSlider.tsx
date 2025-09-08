import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ResourceSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  className?: string;
}

export const ResourceSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit, 
  className 
}: ResourceSliderProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-semibold text-primary">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};