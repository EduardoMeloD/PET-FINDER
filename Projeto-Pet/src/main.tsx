import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "swiper/element/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";



createRoot(document.getElementById("root")!).render(<App />);
