import { ModInfo, PluginInfo } from '@/types/server';
import { FileSystemService } from './FileSystemService';

export class ModManager {
  constructor(private fileSystem: FileSystemService) {}

  async searchModrinth(
    query: string, 
    version?: string, 
    categories?: string[]
  ): Promise<ModInfo[]> {
    const baseUrl = 'https://api.modrinth.com/v2/search';
    const params = new URLSearchParams({
      query,
      limit: '20'
    });
    
    if (version) {
      params.append('versions', `["${version}"]`);
    }
    
    if (categories && categories.length > 0) {
      params.append('categories', JSON.stringify(categories));
    }
    
    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      return data.hits.map((hit: any): ModInfo => ({
        id: hit.project_id,
        name: hit.title,
        description: hit.description,
        version: hit.latest_version,
        author: hit.author,
        source: 'modrinth',
        size: 0, // Would need to fetch from version info
        downloadUrl: hit.versions?.[0] || undefined
      }));
    } catch (error) {
      console.error('Failed to search Modrinth:', error);
      return [];
    }
  }

  async searchCurseForge(
    query: string,
    gameVersion?: string,
    categoryId?: number
  ): Promise<ModInfo[]> {
    // Note: CurseForge API requires API key
    const baseUrl = 'https://api.curseforge.com/v1/mods/search';
    const params = new URLSearchParams({
      gameId: '432', // Minecraft
      searchFilter: query,
      pageSize: '20'
    });
    
    if (gameVersion) {
      params.append('gameVersion', gameVersion);
    }
    
    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }
    
    try {
      // This would require proper CurseForge API key
      // For now, return mock data
      return this.getMockCurseForgeResults(query);
    } catch (error) {
      console.error('Failed to search CurseForge:', error);
      return [];
    }
  }

  async searchSpigotPlugins(query: string): Promise<PluginInfo[]> {
    // Spigot doesn't have an official API, would need web scraping or alternative
    return this.getMockSpigotResults(query);
  }

  async installMod(mod: ModInfo, serverPath: string): Promise<void> {
    if (!mod.downloadUrl) {
      throw new Error('No download URL available for this mod');
    }
    
    const modsDir = await this.fileSystem.joinPath(serverPath, 'mods');
    const modFileName = `${mod.name}-${mod.version}.jar`;
    const modPath = await this.fileSystem.joinPath(modsDir, modFileName);
    
    // Create mods directory if it doesn't exist
    const modsDirExists = await this.fileSystem.exists(modsDir);
    if (!modsDirExists) {
      await this.fileSystem.createDirectory(modsDir);
    }
    
    // Download mod
    const response = await fetch(mod.downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download mod: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    await this.fileSystem.writeFile(modPath, arrayBuffer);
  }

  async installPlugin(plugin: PluginInfo, serverPath: string): Promise<void> {
    if (!plugin.downloadUrl) {
      throw new Error('No download URL available for this plugin');
    }
    
    const pluginsDir = await this.fileSystem.joinPath(serverPath, 'plugins');
    const pluginFileName = `${plugin.name}-${plugin.version}.jar`;
    const pluginPath = await this.fileSystem.joinPath(pluginsDir, pluginFileName);
    
    // Create plugins directory if it doesn't exist
    const pluginsDirExists = await this.fileSystem.exists(pluginsDir);
    if (!pluginsDirExists) {
      await this.fileSystem.createDirectory(pluginsDir);
    }
    
    // Download plugin
    const response = await fetch(plugin.downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download plugin: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    await this.fileSystem.writeFile(pluginPath, arrayBuffer);
  }

  async getInstalledMods(serverPath: string): Promise<ModInfo[]> {
    const modsDir = await this.fileSystem.joinPath(serverPath, 'mods');
    const modsDirExists = await this.fileSystem.exists(modsDir);
    
    if (!modsDirExists) return [];
    
    const files = await this.fileSystem.listFiles(modsDir);
    const modFiles = files.filter(file => file.endsWith('.jar'));
    
    const mods: ModInfo[] = [];
    for (const file of modFiles) {
      const modPath = await this.fileSystem.joinPath(modsDir, file);
      const size = await this.fileSystem.getFileSize(modPath);
      
      mods.push({
        id: file,
        name: file.replace('.jar', ''),
        description: 'Installed mod',
        version: 'unknown',
        author: 'unknown',
        source: 'local',
        size
      });
    }
    
    return mods;
  }

  async getInstalledPlugins(serverPath: string): Promise<PluginInfo[]> {
    const pluginsDir = await this.fileSystem.joinPath(serverPath, 'plugins');
    const pluginsDirExists = await this.fileSystem.exists(pluginsDir);
    
    if (!pluginsDirExists) return [];
    
    const files = await this.fileSystem.listFiles(pluginsDir);
    const pluginFiles = files.filter(file => file.endsWith('.jar'));
    
    const plugins: PluginInfo[] = [];
    for (const file of pluginFiles) {
      const pluginPath = await this.fileSystem.joinPath(pluginsDir, file);
      const size = await this.fileSystem.getFileSize(pluginPath);
      
      plugins.push({
        name: file.replace('.jar', ''),
        version: 'unknown',
        description: 'Installed plugin',
        author: 'unknown',
        size
      });
    }
    
    return plugins;
  }

  async uninstallMod(modId: string, serverPath: string): Promise<void> {
    const modsDir = await this.fileSystem.joinPath(serverPath, 'mods');
    const modPath = await this.fileSystem.joinPath(modsDir, modId);
    
    const exists = await this.fileSystem.exists(modPath);
    if (exists) {
      await this.fileSystem.deleteFile(modPath);
    }
  }

  async uninstallPlugin(pluginName: string, serverPath: string): Promise<void> {
    const pluginsDir = await this.fileSystem.joinPath(serverPath, 'plugins');
    const pluginPath = await this.fileSystem.joinPath(pluginsDir, pluginName);
    
    const exists = await this.fileSystem.exists(pluginPath);
    if (exists) {
      await this.fileSystem.deleteFile(pluginPath);
    }
  }

  private getMockCurseForgeResults(query: string): ModInfo[] {
    return [
      {
        id: 'ae2',
        name: 'Applied Energistics 2',
        description: 'A Mod about Matter, Energy and using them to conquer the world',
        version: '15.0.15',
        author: 'AlgorithmX2',
        source: 'curseforge',
        size: 5242880,
        downloadUrl: 'https://example.com/ae2.jar'
      }
    ];
  }

  private getMockSpigotResults(query: string): PluginInfo[] {
    return [
      {
        name: 'WorldEdit',
        version: '7.2.15',
        description: 'Fast and easy in-game world editor',
        author: 'sk89q',
        size: 3145728,
        downloadUrl: 'https://example.com/worldedit.jar'
      }
    ];
  }
}