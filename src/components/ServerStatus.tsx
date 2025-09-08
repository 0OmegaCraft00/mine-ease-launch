import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export type ServerStatusType = 'offline' | 'starting' | 'running' | 'stopping';

interface ServerStatusProps {
  status: ServerStatusType;
  className?: string;
}

const statusConfig = {
  offline: {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    dotColor: 'bg-muted-foreground',
  },
  starting: {
    color: 'text-gaming-warning',
    bgColor: 'bg-gaming-warning/10',
    dotColor: 'bg-gaming-warning',
  },
  running: {
    color: 'text-gaming-success',
    bgColor: 'bg-gaming-success/10',
    dotColor: 'bg-gaming-success',
  },
  stopping: {
    color: 'text-gaming-danger',
    bgColor: 'bg-gaming-danger/10',
    dotColor: 'bg-gaming-danger',
  },
};

export const ServerStatus = ({ status, className }: ServerStatusProps) => {
  const { t } = useLanguage();
  const config = statusConfig[status];

  const statusText = {
    offline: t.serverOffline,
    starting: t.serverStarting,
    running: t.serverRunning,
    stopping: t.serverStopping,
  };

  return (
    <div className={cn('flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300', config.bgColor, className)}>
      <div className={cn('h-3 w-3 rounded-full animate-pulse', config.dotColor)} />
      <span className={cn('font-medium', config.color)}>
        {statusText[status]}
      </span>
    </div>
  );
};