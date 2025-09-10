export type ServerStatus = 'offline' | 'starting' | 'running' | 'stopping';
export type JavaVersion = '8' | '16' | '17' | '21';
export type ServerLoader = 
  | 'vanilla' 
  | 'forge' 
  | 'neoforge' 
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

export interface ServerConfig {
  serverPath: string;
  serverJar: string;
  loader: ServerLoader;
  version: string;
  javaVersion: JavaVersion;
  ramAllocation: number;
  cpuCores: number;
  serverPort: number;
  maxPlayers: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  onlineMode: boolean;
  whitelist: boolean;
  motd: string;
}

export interface ServerLog {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

export interface SystemResources {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    available: number;
  };
  gpu?: {
    name: string;
    memory: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
  };
}

export interface ModInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  source: 'modrinth' | 'curseforge' | 'local';
  dependencies?: string[];
  conflicts?: string[];
  size: number;
  downloadUrl?: string;
}

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  website?: string;
  dependencies?: string[];
  softDependencies?: string[];
  size: number;
  downloadUrl?: string;
}

export interface ServerPerformance {
  tps: number;
  mspt: number;
  playerCount: number;
  chunkCount: number;
  entityCount: number;
  memoryUsage: {
    heap: number;
    nonHeap: number;
    total: number;
  };
}

export interface BackupInfo {
  id: string;
  name: string;
  timestamp: Date;
  size: number;
  type: 'manual' | 'automatic';
  description?: string;
}