import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import './assets/styles.css';

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
