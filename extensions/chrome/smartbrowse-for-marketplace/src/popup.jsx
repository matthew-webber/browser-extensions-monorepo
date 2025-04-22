import Popup from './PopupComponent.jsx';
import { createRoot } from 'react-dom/client';

// Use React 18+ rendering API
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);
