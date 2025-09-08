import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const MINECRAFT_VERSIONS = [
  '1.21.4',
  '1.21.3',
  '1.21.1',
  '1.21.0',
  '1.20.6',
  '1.20.4',
  '1.20.2',
  '1.20.1',
  '1.19.4',
  '1.19.2',
  '1.18.2',
  '1.17.1',
  '1.16.5',
];

interface VersionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const VersionSelector = ({ value, onChange, className }: VersionSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className={className}>
      <label className="text-sm font-medium text-foreground mb-2 block">{t.version}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-gaming-surface-elevated border-border hover:bg-gaming-surface transition-colors">
          <SelectValue placeholder={t.selectVersion} />
        </SelectTrigger>
        <SelectContent className="bg-gaming-surface-elevated border-border">
          {MINECRAFT_VERSIONS.map((version) => (
            <SelectItem 
              key={version} 
              value={version} 
              className="text-foreground hover:bg-gaming-surface focus:bg-gaming-surface"
            >
              Minecraft {version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};