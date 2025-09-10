import { ServerConfig, ServerStatus, JavaVersion } from '@/types/server';
import { FileSystemService } from './FileSystemService';
import { JavaService } from './JavaService';
import { ProcessService } from './ProcessService';

export class ServerManager {
  private config: ServerConfig | null = null;
  private status: ServerStatus = 'offline';
  private processId: number | null = null;

  constructor(
    public fileSystem: FileSystemService,
    public java: JavaService,
    private process: ProcessService
  ) {}

  async validateServerDirectory(path: string): Promise<boolean> {
    try {
      const files = await this.fileSystem.listFiles(path);
      return files.some(file => file.endsWith('.jar'));
    } catch {
      return false;
    }
  }

  async detectServerJars(path: string): Promise<string[]> {
    const files = await this.fileSystem.listFiles(path);
    return files.filter(file => 
      file.endsWith('.jar') && 
      (file.includes('server') || file.includes('forge') || file.includes('fabric'))
    );
  }

  async configureServer(config: ServerConfig): Promise<void> {
    // Validate configuration
    await this.validateConfiguration(config);
    
    // Install required Java version if needed
    await this.java.ensureJavaVersion(config.javaVersion);
    
    // Create server properties if not exists
    await this.createServerProperties(config);
    
    // Accept EULA if needed
    await this.acceptEula(config.serverPath);
    
    this.config = config;
  }

  async startServer(): Promise<void> {
    if (!this.config) throw new Error('Server not configured');
    if (this.status === 'running') throw new Error('Server already running');

    this.status = 'starting';
    
    try {
      const javaPath = await this.java.getJavaPath(this.config.javaVersion);
      const command = this.buildStartCommand(javaPath);
      
      this.processId = await this.process.start(command, {
        cwd: this.config.serverPath,
        onOutput: this.handleServerOutput.bind(this),
        onError: this.handleServerError.bind(this),
        onExit: this.handleServerExit.bind(this)
      });
      
      this.status = 'running';
    } catch (error) {
      this.status = 'offline';
      throw error;
    }
  }

  async stopServer(): Promise<void> {
    if (!this.processId || this.status !== 'running') return;
    
    this.status = 'stopping';
    
    // Send graceful stop command
    await this.process.sendInput(this.processId, 'stop\n');
    
    // Wait for graceful shutdown or force kill after timeout
    setTimeout(() => {
      if (this.status === 'stopping') {
        this.process.kill(this.processId!);
      }
    }, 30000);
  }

  private buildStartCommand(javaPath: string): string {
    const { ramAllocation, cpuCores, serverJar } = this.config!;
    
    return [
      `"${javaPath}"`,
      `-Xmx${ramAllocation}G`,
      `-Xms${Math.min(ramAllocation, 2)}G`,
      `-XX:+UseG1GC`,
      `-XX:ParallelGCThreads=${cpuCores}`,
      '-Dfile.encoding=UTF-8',
      '-jar',
      `"${serverJar}"`,
      'nogui'
    ].join(' ');
  }

  private async validateConfiguration(config: ServerConfig): Promise<void> {
    const isValidDir = await this.validateServerDirectory(config.serverPath);
    if (!isValidDir) {
      throw new Error('Invalid server directory - no server JAR found');
    }

    const hasJava = await this.java.isVersionAvailable(config.javaVersion);
    if (!hasJava) {
      throw new Error(`Java ${config.javaVersion} is not available`);
    }
  }

  private async createServerProperties(config: ServerConfig): Promise<void> {
    const propertiesPath = await this.fileSystem.joinPath(config.serverPath, 'server.properties');
    const exists = await this.fileSystem.exists(propertiesPath);
    
    if (!exists) {
      const defaultProperties = this.getDefaultServerProperties(config);
      await this.fileSystem.writeFile(propertiesPath, defaultProperties);
    }
  }

  private async acceptEula(serverPath: string): Promise<void> {
    const eulaPath = await this.fileSystem.joinPath(serverPath, 'eula.txt');
    const eulaContent = 'eula=true\n';
    await this.fileSystem.writeFile(eulaPath, eulaContent);
  }

  private getDefaultServerProperties(config: ServerConfig): string {
    return `
server-port=25565
gamemode=survival
difficulty=normal
spawn-protection=16
max-players=20
online-mode=true
white-list=false
motd=A Minecraft Server powered by MinesOS
`.trim();
  }

  private handleServerOutput(output: string): void {
    // Parse server output for status updates
    if (output.includes('Done') && output.includes('For help, type')) {
      this.status = 'running';
    }
    
    // Emit events for UI updates
    this.emit('output', output);
  }

  private handleServerError(error: string): void {
    this.emit('error', error);
  }

  private handleServerExit(code: number): void {
    this.status = 'offline';
    this.processId = null;
    this.emit('exit', code);
  }

  private emit(event: string, data: any): void {
    // Event system for UI updates
    window.dispatchEvent(new CustomEvent(`server:${event}`, { detail: data }));
  }

  getStatus(): ServerStatus {
    return this.status;
  }

  getConfig(): ServerConfig | null {
    return this.config;
  }
}