import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export type ServerLoader = 
  | 'vanilla'
  | 'neoforge'
  | 'forge'
  | 'fabric'
  | 'quilt'
  | 'bukkit'
  | 'spigot'
  | 'paper'
  | 'waterfall'
  | 'bungeecord'
  | 'mohist'
  | 'arclight'
  | 'bedrock';

const SERVER_LOADERS: { value: ServerLoader; label: string; description: string }[] = [
  { value: 'vanilla', label: 'Vanilla', description: 'Official Minecraft server' },
  { value: 'neoforge', label: 'NeoForge', description: 'Modern modding platform' },
  { value: 'forge', label: 'Forge', description: 'Popular modding platform' },
  { value: 'fabric', label: 'Fabric', description: 'Lightweight modding platform' },
  { value: 'quilt', label: 'Quilt', description: 'Fork of Fabric with improvements' },
  { value: 'bukkit', label: 'Bukkit', description: 'Plugin-based server' },
  { value: 'spigot', label: 'Spigot', description: 'High performance Bukkit fork' },
  { value: 'paper', label: 'Paper', description: 'High performance Spigot fork' },
  { value: 'waterfall', label: 'Waterfall', description: 'BungeeCord fork for proxy servers' },
  { value: 'bungeecord', label: 'BungeeCord', description: 'Proxy server for multiple servers' },
  { value: 'mohist', label: 'Mohist', description: 'Bukkit + Forge hybrid server' },
  { value: 'arclight', label: 'Arclight', description: 'Bukkit + Forge server' },
  { value: 'bedrock', label: 'Bedrock', description: 'Bedrock Edition server' },
];

interface LoaderSelectorProps {
  value: ServerLoader;
  onChange: (value: ServerLoader) => void;
  className?: string;
}

export const LoaderSelector = ({ value, onChange, className }: LoaderSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className={className}>
      <label className="text-sm font-medium text-foreground mb-2 block">{t.loader}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-gaming-surface-elevated border-border hover:bg-gaming-surface transition-colors">
          <SelectValue placeholder={t.selectLoader} />
        </SelectTrigger>
        <SelectContent className="bg-gaming-surface-elevated border-border">
          {SERVER_LOADERS.map((loader) => (
            <SelectItem 
              key={loader.value} 
              value={loader.value} 
              className="text-foreground hover:bg-gaming-surface focus:bg-gaming-surface"
            >
              <div className="flex flex-col">
                <span className="font-medium">{loader.label}</span>
                <span className="text-xs text-muted-foreground">{loader.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};