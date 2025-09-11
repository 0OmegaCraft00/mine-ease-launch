import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FolderOpen, Upload, AlertCircle } from 'lucide-react';
import { useServerManager } from '@/hooks/useServerManager';
import { ServerConfig } from '@/types/server';

interface ServerImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (config: ServerConfig) => void;
}

export const ServerImportDialog = ({ open, onClose, onImport }: ServerImportDialogProps) => {
  const { selectDirectory, getServerJars } = useServerManager();
  const [serverPath, setServerPath] = useState('');
  const [serverName, setServerName] = useState('');
  const [availableJars, setAvailableJars] = useState<string[]>([]);
  const [selectedJar, setSelectedJar] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleDirectorySelect = async () => {
    try {
      setError('');
      setIsAnalyzing(true);
      
      const path = await selectDirectory();
      if (path) {
        setServerPath(path);
        const jars = await getServerJars(path);
        setAvailableJars(jars);
        
        if (jars.length === 0) {
          setError('No server JAR files found in the selected directory');
        } else {
          setSelectedJar(jars[0]);
          // Auto-generate name from directory
          const dirName = path.split('/').pop() || path.split('\\').pop() || 'Imported Server';
          setServerName(dirName);
        }
      }
    } catch (error) {
      setError('Failed to access directory. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectServerType = (jarName: string) => {
    const name = jarName.toLowerCase();
    if (name.includes('forge')) return 'forge';
    if (name.includes('fabric')) return 'fabric';
    if (name.includes('neoforge')) return 'neoforge';
    if (name.includes('quilt')) return 'quilt';
    if (name.includes('bukkit') || name.includes('spigot') || name.includes('paper')) return 'bukkit';
    return 'vanilla';
  };

  const detectVersion = (jarName: string) => {
    const versionMatch = jarName.match(/(\d+\.\d+(?:\.\d+)?)/);
    return versionMatch ? versionMatch[1] : '1.21.4';
  };

  const handleImport = async () => {
    if (!serverPath || !selectedJar || !serverName.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const detectedLoader = detectServerType(selectedJar);
      const detectedVersion = detectVersion(selectedJar);
      
      const serverConfig: ServerConfig = {
        serverPath,
        serverJar: selectedJar,
        loader: detectedLoader as any,
        version: detectedVersion,
        javaVersion: '21',
        ramAllocation: 4,
        cpuCores: 4,
        serverPort: 25565,
        maxPlayers: 20,
        difficulty: 'normal',
        gamemode: 'survival',
        onlineMode: true,
        whitelist: false,
        motd: `${serverName} - Imported to MinesOS`
      };

      // Generate a random IP for the imported server
      const adjectives = ['imported', 'legacy', 'restored', 'classic', 'vintage'];
      const nouns = ['server', 'world', 'realm', 'domain', 'network'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const generatedIP = `${adj}-${noun}.minecraft.com`;

      // Save server to localStorage
      const servers = JSON.parse(localStorage.getItem('minesos-servers') || '[]');
      const newServer = {
        id: Date.now().toString(),
        name: serverName,
        ip: generatedIP,
        status: 'offline' as const,
        config: serverConfig,
        lastPlayed: new Date()
      };
      servers.push(newServer);
      localStorage.setItem('minesos-servers', JSON.stringify(servers));

      onImport(serverConfig);
      onClose();
      
      // Reset form
      setServerPath('');
      setServerName('');
      setAvailableJars([]);
      setSelectedJar('');
      setError('');
    } catch (error) {
      setError('Failed to import server. Please try again.');
    }
  };

  const reset = () => {
    setServerPath('');
    setServerName('');
    setAvailableJars([]);
    setSelectedJar('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) { onClose(); reset(); } }}>
      <DialogContent className="bg-gaming-surface border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-accent" />
            Import Existing Server
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Directory Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Server Directory *
            </label>
            <div className="flex gap-2">
              <Input 
                value={serverPath}
                onChange={(e) => setServerPath(e.target.value)}
                placeholder="Select your server directory..."
                className="bg-gaming-surface-elevated border-border text-foreground flex-1"
                readOnly
              />
              <Button 
                variant="gaming-outline" 
                onClick={handleDirectorySelect}
                disabled={isAnalyzing}
                className="gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Browse'}
              </Button>
            </div>
          </div>

          {/* Server Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Server Name *
            </label>
            <Input 
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Enter a name for your server"
              className="bg-gaming-surface-elevated border-border text-foreground"
            />
          </div>

          {/* JAR Selection */}
          {availableJars.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Server JAR File *
              </label>
              <select 
                value={selectedJar}
                onChange={(e) => setSelectedJar(e.target.value)}
                className="w-full bg-gaming-surface-elevated border border-border rounded-md px-3 py-2 text-foreground"
              >
                {availableJars.map((jar) => (
                  <option key={jar} value={jar}>
                    {jar} ({detectServerType(jar)} - {detectVersion(jar)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Server Analysis */}
          {selectedJar && (
            <Card className="bg-gaming-surface-elevated border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Detected Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Server Type</p>
                    <p className="text-foreground font-medium capitalize">{detectServerType(selectedJar)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="text-foreground font-medium">{detectVersion(selectedJar)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Configuration can be adjusted after import
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="gaming-outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="gaming-primary" 
              onClick={handleImport}
              disabled={!serverPath || !selectedJar || !serverName.trim() || isAnalyzing}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Server
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};