import { useState } from 'react';
import { ArrowLeft, Search, Download, ExternalLink, Filter, Star } from 'lucide-react';
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
    name: 'JEI (Just Enough Items)',
    description: 'Item and Recipe viewing mod for Minecraft',
    author: 'mezz',
    downloads: '450M+',
    rating: 4.9,
    versions: ['1.21.4', '1.21.3', '1.20.6'],
    categories: ['Utility', 'Technology'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Optifine',
    description: 'Minecraft optimization and graphics enhancement mod',
    author: 'sp614x',
    downloads: '300M+',
    rating: 4.7,
    versions: ['1.21.4', '1.21.1', '1.20.4'],
    categories: ['Optimization', 'Graphics'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Biomes O\' Plenty',
    description: 'Adds over 90 new biomes to enhance your world',
    author: 'Forstride',
    downloads: '200M+',
    rating: 4.8,
    versions: ['1.21.4', '1.20.6', '1.19.4'],
    categories: ['World Generation', 'Biomes'],
    imageUrl: '/placeholder.svg'
  }
];

export const ModrinthSearch = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('all');

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
            <h1 className="text-3xl font-bold text-foreground">{t.modrinthSearch}</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
              <SelectItem value="utility">{t.utility}</SelectItem>
              <SelectItem value="technology">{t.technology}</SelectItem>
              <SelectItem value="world-gen">{t.worldGeneration}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className="bg-gaming-surface-elevated border-border">
              <SelectValue placeholder={t.mcVersion} />
            </SelectTrigger>
            <SelectContent className="bg-gaming-surface-elevated border-border">
              <SelectItem value="all">{t.allVersions}</SelectItem>
              <SelectItem value="1.21.4">1.21.4</SelectItem>
              <SelectItem value="1.21.3">1.21.3</SelectItem>
              <SelectItem value="1.20.6">1.20.6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMods.map((mod) => (
            <Card key={mod.id} className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={mod.imageUrl} 
                    alt={mod.name}
                    className="w-12 h-12 rounded-lg bg-gaming-surface-elevated"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-foreground text-lg truncate">{mod.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{t.by} {mod.author}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground text-sm line-clamp-2">{mod.description}</p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {mod.categories.map((category) => (
                    <Badge key={category} variant="outline" className="bg-gaming-surface-elevated border-border text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-foreground">{mod.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{mod.downloads} {t.downloads}</span>
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

        {filteredMods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};