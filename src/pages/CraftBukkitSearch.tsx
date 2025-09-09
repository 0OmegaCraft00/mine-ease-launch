import { useState } from 'react';
import { ArrowLeft, Search, Download, ExternalLink, Shield, Zap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demonstration
const MOCK_PLUGINS = [
  {
    id: 1,
    name: 'WorldEdit',
    description: 'Fast asymmetric multi-world editing tool for Minecraft',
    author: 'sk89q',
    downloads: '25M+',
    version: '7.2.15',
    categories: ['World Editing', 'Admin Tools'],
    compatibility: ['Bukkit', 'Spigot', 'Paper'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Essentials',
    description: 'Essential commands and features for any Minecraft server',
    author: 'EssentialsX Team',
    downloads: '30M+',
    version: '2.20.1',
    categories: ['Administration', 'Economy'],
    compatibility: ['Bukkit', 'Spigot', 'Paper'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'WorldGuard',
    description: 'Protect areas, set flags, and create custom game rules',
    author: 'sk89q',
    downloads: '20M+',
    version: '7.0.9',
    categories: ['Protection', 'Admin Tools'],
    compatibility: ['Bukkit', 'Spigot', 'Paper'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'LuckPerms',
    description: 'Advanced permissions plugin with web editor',
    author: 'Luck',
    downloads: '15M+',
    version: '5.4.118',
    categories: ['Permissions', 'Administration'],
    compatibility: ['Bukkit', 'Spigot', 'Paper', 'Waterfall', 'BungeeCord'],
    imageUrl: '/placeholder.svg'
  }
];

export const CraftBukkitSearch = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState('all');

  const filteredPlugins = MOCK_PLUGINS.filter(plugin => 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (categories: string[]) => {
    if (categories.includes('Protection') || categories.includes('Admin Tools')) {
      return <Shield className="w-4 h-4" />;
    }
    if (categories.includes('Permissions') || categories.includes('Administration')) {
      return <Database className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="gaming-outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.backToLauncher}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{t.pluginSearch}</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.searchPlugins}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gaming-surface-elevated border-border"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gaming-surface-elevated border-border">
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              <SelectItem value="all">{t.allCategories}</SelectItem>
              <SelectItem value="admin">{t.administration}</SelectItem>
              <SelectItem value="protection">{t.protection}</SelectItem>
              <SelectItem value="economy">{t.economy}</SelectItem>
              <SelectItem value="permissions">{t.permissions}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCompatibility} onValueChange={setSelectedCompatibility}>
            <SelectTrigger className="bg-gaming-surface-elevated border-border">
              <SelectValue placeholder={t.compatibility} />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              <SelectItem value="all">{t.allPlatforms}</SelectItem>
              <SelectItem value="bukkit">Bukkit</SelectItem>
              <SelectItem value="spigot">Spigot</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="bungeecord">BungeeCord</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlugins.map((plugin) => (
            <Card key={plugin.id} className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gaming-surface-elevated flex items-center justify-center">
                    {getCategoryIcon(plugin.categories)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-foreground text-lg">{plugin.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{t.by} {plugin.author}</p>
                    <p className="text-muted-foreground text-xs">{t.version} {plugin.version}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground text-sm">{plugin.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {plugin.categories.map((category) => (
                      <Badge key={category} variant="outline" className="bg-gaming-surface-elevated border-border text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">{t.compatibleWith}:</span>
                    {plugin.compatibility.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{plugin.downloads} {t.downloads}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="gaming-primary" size="sm" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    {t.install}
                  </Button>
                  <Button variant="gaming-outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};