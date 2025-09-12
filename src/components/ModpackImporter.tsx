import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Package, CheckCircle, AlertCircle, FolderOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ModpackInfo {
  name: string;
  version: string;
  author: string;
  description: string;
  minecraftVersion: string;
  loader: 'forge' | 'neoforge' | 'fabric' | 'quilt';
  mods: Array<{
    name: string;
    version: string;
    source: 'curseforge' | 'modrinth';
    downloadUrl?: string;
  }>;
  serverFiles?: string[];
}

interface ModpackImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (modpackInfo: ModpackInfo, installPath: string) => Promise<void>;
}

export const ModpackImporter = ({ isOpen, onClose, onImport }: ModpackImporterProps) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [installPath, setInstallPath] = useState('');
  const [modpackInfo, setModpackInfo] = useState<ModpackInfo | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'analyzing' | 'importing' | 'complete' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      setImportStatus('idle');
      setErrorMessage('');
      analyzeModpack(file);
    } else {
      setErrorMessage('Please select a valid .zip modpack file');
    }
  }, []);

  const analyzeModpack = async (file: File) => {
    setImportStatus('analyzing');
    setImportProgress(20);

    try {
      // Simulate modpack analysis - in real implementation, would use JSZip to extract and parse
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock modpack info based on file name
      const mockModpackInfo: ModpackInfo = {
        name: file.name.replace('.zip', '').replace(/[-_]/g, ' '),
        version: '1.0.0',
        author: 'Modpack Author',
        description: 'A curated collection of mods for enhanced gameplay',
        minecraftVersion: '1.21.1',
        loader: 'neoforge',
        mods: [
          { name: 'JEI', version: '15.3.0', source: 'curseforge' },
          { name: 'Applied Energistics 2', version: '15.0.16', source: 'curseforge' },
          { name: 'Thermal Expansion', version: '11.0.1', source: 'curseforge' },
          { name: 'Iron Chests', version: '15.0.6', source: 'modrinth' },
          { name: 'JourneyMap', version: '5.9.18', source: 'curseforge' }
        ],
        serverFiles: ['server.properties', 'eula.txt', 'ops.json']
      };

      setModpackInfo(mockModpackInfo);
      setImportProgress(100);
      setImportStatus('idle');
    } catch (error) {
      setErrorMessage('Failed to analyze modpack. Please ensure it\'s a valid modpack file.');
      setImportStatus('error');
    }
  };

  const handleInstallPathSelect = async () => {
    try {
      // Create a file input to simulate directory selection
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      
      input.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const path = files[0].webkitRelativePath.split('/')[0];
          setInstallPath(path);
        }
      });
      
      input.click();
    } catch (error) {
      console.error('Failed to select install path:', error);
    }
  };

  const handleImport = async () => {
    if (!modpackInfo || !installPath) return;

    setIsImporting(true);
    setImportStatus('importing');
    setImportProgress(0);

    try {
      // Simulate import process with progress updates
      const steps = [
        'Creating server directory...',
        'Extracting modpack files...',
        'Downloading server JAR...',
        'Installing mods...',
        'Configuring server settings...',
        'Finalizing installation...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setImportProgress((i + 1) / steps.length * 100);
      }

      await onImport(modpackInfo, installPath);
      setImportStatus('complete');
    } catch (error) {
      setErrorMessage('Failed to import modpack. Please try again.');
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const resetImporter = () => {
    setSelectedFile(null);
    setInstallPath('');
    setModpackInfo(null);
    setImportProgress(0);
    setImportStatus('idle');
    setErrorMessage('');
    setIsImporting(false);
  };

  const handleClose = () => {
    resetImporter();
    onClose();
  };

  const getStatusIcon = () => {
    switch (importStatus) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-gaming-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-gaming-danger" />;
      default:
        return <Package className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gaming-surface border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {getStatusIcon()}
            Modpack Importer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 animate-fade-in">
          {/* File Selection */}
          <Card className="bg-gaming-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Select Modpack File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div>
                  <label htmlFor="modpack-file" className="cursor-pointer">
                    <Button variant="gaming-outline" className="mb-2">
                      Choose Modpack File
                    </Button>
                    <Input
                      id="modpack-file"
                      type="file"
                      accept=".zip"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Upload a .zip modpack from CurseForge or Modrinth
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg animate-scale-bounce">
                  <Package className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Progress */}
          {importStatus === 'analyzing' && (
            <Card className="bg-gaming-surface-elevated border-border animate-slide-in-right">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-foreground">Analyzing modpack structure...</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modpack Information */}
          {modpackInfo && importStatus !== 'analyzing' && (
            <Card className="bg-gaming-surface-elevated border-border animate-fade-in">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Modpack Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground font-medium">{modpackInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <p className="text-foreground">{modpackInfo.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Minecraft Version</label>
                    <Badge variant="outline" className="bg-gaming-surface border-border">
                      {modpackInfo.minecraftVersion}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Loader</label>
                    <Badge variant="outline" className="bg-gaming-surface border-border">
                      {modpackInfo.loader}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground text-sm">{modpackInfo.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Included Mods ({modpackInfo.mods.length})
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {modpackInfo.mods.map((mod, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 bg-gaming-surface rounded">
                        <span className="text-foreground">{mod.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {mod.version}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {mod.source}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Installation Path */}
          {modpackInfo && (
            <Card className="bg-gaming-surface-elevated border-border animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-accent" />
                  Installation Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={installPath}
                    onChange={(e) => setInstallPath(e.target.value)}
                    placeholder="/path/to/server/directory"
                    className="bg-gaming-surface border-border text-foreground flex-1"
                  />
                  <Button variant="gaming-outline" onClick={handleInstallPathSelect}>
                    Browse
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Progress */}
          {isImporting && (
            <Card className="bg-gaming-surface-elevated border-border animate-pulse-glow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary animate-bounce" />
                    <span className="text-sm text-foreground">Installing modpack server...</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {importProgress.toFixed(0)}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Messages */}
          {importStatus === 'complete' && (
            <Card className="bg-gaming-success/10 border-gaming-success animate-scale-bounce">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-gaming-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Modpack imported successfully!</span>
                </div>
              </CardContent>
            </Card>
          )}

          {errorMessage && (
            <Card className="bg-gaming-danger/10 border-gaming-danger animate-scale-bounce">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-gaming-danger">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="gaming-outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="gaming-success"
              onClick={handleImport}
              disabled={!modpackInfo || !installPath || isImporting || importStatus === 'complete'}
              className="gap-2"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Installing...
                </>
              ) : importStatus === 'complete' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Imported
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Import Modpack
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};