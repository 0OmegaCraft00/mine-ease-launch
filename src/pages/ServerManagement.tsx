import { useParams, useNavigate } from 'react-router-dom';
import { MinesOSLauncher } from '@/components/MinesOSLauncher';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ServerManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <MinesOSLauncher />
      </div>
    </div>
  );
};

export default ServerManagement;