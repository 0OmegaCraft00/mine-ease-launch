import { useState } from 'react';
import { ArrowLeft, Search, Download, ExternalLink, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demonstration
const MOCK_MODS = [
  {
    id: 1,
    name: 'Applied Energistics 2',
    description: 'A Mod about Matter, Energy and using them to conquer the world',
    author: 'AlgorithmX2',
    downloads: '180M+',
    updated: '2024-01-15',
    versions: ['1.21.4', '1.20.6', '1.19.4'],
    categories: ['Technology', 'Storage'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Thermal Expansion',
    description: 'Expanding Minecraft with machines, energy, and logistics',
    author: 'TeamCoFH',
    downloads: '165M+',
    updated: '2024-01-10',
    versions: ['1.21.4', '1.20.4', '1.19.2'],
    categories: ['Technology', 'Magic'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Tinkers\' Construct',
    description: 'Modify your tools and weapons in a variety of ways',
    author: 'mDiyo',
    downloads: '220M+',
    updated: '2024-01-12',
    versions: ['1.21.4', '1.20.6'],
    categories: ['Equipment', 'Tools'],
    imageUrl: '/placeholder.svg'
  }
];

export const CurseForgeSearch = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');

  const filteredMods = MOCK_MODS.filter(mod => 
    mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-foreground">{t.curseforgeSearch}</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.searchMods}
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
              <SelectItem value="technology">{t.technology}</SelectItem>
              <SelectItem value="magic">{t.magic}</SelectItem>
              <SelectItem value="equipment">{t.equipment}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className="bg-gaming-surface-elevated border-border">
              <SelectValue placeholder={t.mcVersion} />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              <SelectItem value="all">{t.allVersions}</SelectItem>
              <SelectItem value="1.21.4">1.21.4</SelectItem>
              <SelectItem value="1.20.6">1.20.6</SelectItem>
              <SelectItem value="1.19.4">1.19.4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gaming-surface-elevated border-border">
              <SelectValue placeholder={t.sortBy} />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              <SelectItem value="downloads">{t.downloads}</SelectItem>
              <SelectItem value="updated">{t.lastUpdated}</SelectItem>
              <SelectItem value="name">{t.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredMods.map((mod) => (
            <Card key={mod.id} className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img 
                    src={mod.imageUrl} 
                    alt={mod.name}
                    className="w-16 h-16 rounded-lg bg-gaming-surface-elevated flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{mod.name}</h3>
                        <p className="text-muted-foreground text-sm">{t.by} {mod.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="gaming-primary" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          {t.install}
                        </Button>
                        <Button variant="gaming-outline" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-foreground text-sm">{mod.description}</p>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        {mod.categories.map((category) => (
                          <Badge key={category} variant="outline" className="bg-gaming-surface-elevated border-border text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{mod.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{mod.updated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};