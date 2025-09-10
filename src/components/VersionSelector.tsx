import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { JavaVersion } from '@/types/server';

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
  javaVersion?: JavaVersion;
  onJavaChange?: (value: JavaVersion) => void;
  availableJavaVersions?: JavaVersion[];
  className?: string;
}

export const VersionSelector = ({ 
  value, 
  onChange, 
  javaVersion,
  onJavaChange,
  availableJavaVersions = [],
  className 
}: VersionSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div>
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
      
      {onJavaChange && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Java Version</label>
          <Select value={javaVersion} onValueChange={onJavaChange}>
            <SelectTrigger className="w-full bg-gaming-surface-elevated border-border hover:bg-gaming-surface transition-colors">
              <SelectValue placeholder="Select Java Version" />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              {['8', '16', '17', '21'].map((java) => (
                <SelectItem 
                  key={java} 
                  value={java} 
                  className="text-foreground hover:bg-gaming-surface focus:bg-gaming-surface"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Java {java}</span>
                    {availableJavaVersions.includes(java as JavaVersion) && (
                      <span className="text-xs text-gaming-success ml-2">✓ Installed</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};