import { useParams, useNavigate } from 'react-router-dom';
import { MinesOSLauncher } from '@/components/MinesOSLauncher';

const ServerManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // For now, just show the existing launcher
  // In a full implementation, you'd load the specific server by ID
  return <MinesOSLauncher />;
};

export default ServerManagement;