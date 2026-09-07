
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Video, Users, GraduationCap, Trophy } from 'lucide-react';

interface ResourcesDropdownProps {
  onNavigate: (page: string) => void;
  onToggle: (isOpen: boolean) => void;
}

export const ResourcesDropdown: React.FC<ResourcesDropdownProps> = ({ onNavigate, onToggle }) => {
  const [active, setActive] = useState(false);

  const toggle = () => {
    const newState = !active;
    setActive(newState);
    onToggle(newState);
  };

  const handleItemClick = (page: string) => {
    // Navigate logic
    if (page === 'Syllabus') onNavigate('syllabi');
    else if (page === 'Past Exam Papers') onNavigate('past-papers');
    else onNavigate(page); // Fallback for items without specific routes yet

    // Close menu
    setActive(false);
    onToggle(false);
  };

  // Close on click outside (optional safety)
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (active && !(e.target as Element).closest('.rd-wrapper')) {
        setActive(false);
        onToggle(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [active, onToggle]);

  return (
    <div className="rd-wrapper relative z-50">
      <style>{`
        .rd-dots {
          display: flex;
          padding: 10px;
          cursor: pointer;
          position: relative;
          z-index: 50;
        }
        
        /* The morphing shapes */
        .rd-cut {
          clip-path: polygon(49.94543% 0%, 49.146605% 0.56499168%, 47.908524% 1.8619327%, 46.53612% 3.2937721%, 45.334324% 4.2634587%, 44.449473% 4.6785326%, 43.75% 4.8902239%, 43.123985% 4.967017%, 42.459505% 4.9773959%, 32.434877% 4.9773959%, 22.41025% 4.9773959%, 12.385622% 4.9773959%, 2.3609941% 4.9773959%, 1.7494639% 5.0755373%, 0.9648305% 5.3952797%, 0.28803037% 5.9746007%, 0% 6.8514776%, 0% 29.608196%, 0% 52.364914%, 0% 75.121632%, 0% 97.87835%, 0.17916238% 98.658483%, 0.67451585% 99.313006%, 1.4228599% 99.763343%, 2.3609941% 99.930917%, 25.989505% 99.930917%, 49.618015% 99.930917%, 73.246526% 99.930917%, 96.875036% 99.930917%, 97.979739% 99.839309%, 98.960507% 99.515581%, 99.662509% 98.886379%, 99.930917% 97.87835%, 99.930917% 75.233185%, 99.930917% 52.588019%, 99.930917% 29.942854%, 99.930917% 7.2976888%, 99.75287% 6.3432143%, 99.283323% 5.6113835%, 98.619164% 5.1426321%, 97.857283% 4.9773959%, 87.768866% 4.9773959%, 77.680448% 4.9773959%, 67.592031% 4.9773959%, 57.503614% 4.9773959%, 56.936197% 4.9640164%, 56.17412% 4.8766449%, 55.305914% 4.6444314%, 54.420113% 4.1965263%, 53.323874% 3.214925%, 51.989005% 1.8085795%, 50.75102% 0.54707587%);
        }
        .rd-cut2 {
          clip-path: polygon(49.94543% 0%, 49.631999% 0.12564846%, 49.187804% 0.4688613%, 48.640661% 0.97903993%, 48.018387% 1.605585%, 47.3488% 2.2978983%, 46.659716% 3.0053809%, 45.978952% 3.6774339%, 45.334324% 4.2634587%, 42.618384% 6.7500473%, 39.935164% 8.743094%, 37.227225% 10.296864%, 34.437125% 11.465622%, 31.507425% 12.303633%, 28.380682% 12.865161%, 24.999456% 13.204473%, 21.306307% 13.375833%, 18.127097% 13.266869%, 14.650937% 13.191619%, 11.100005% 13.527542%, 7.6964784% 14.652097%, 4.6625364% 16.942746%, 2.2203573% 20.776948%, 0.5921189% 26.532164%, 0% 34.585852%, 0% 39.201516%, 0% 43.81718%, 0% 48.432844%, 0% 53.048507%, 0% 57.664171%, 0% 62.279835%, 0% 66.895499%, 0% 71.511163%, 0.37122067% 75.655781%, 1.506588% 80.247442%, 3.4386599% 84.97803%, 6.1999946% 89.539433%, 9.8231496% 93.623537%, 14.340684% 96.922228%, 19.785154% 99.127392%, 26.189119% 99.930917%, 33.206023% 99.598265%, 38.745175% 98.670068%, 43.261202% 97.250968%, 47.208726% 95.445606%, 51.042372% 93.358623%, 55.216765% 91.094659%, 60.186528% 88.758356%, 66.406286% 86.454354%, 72.757944% 85.114156%, 78.860888% 84.911615%, 84.53075% 85.376904%, 89.58316% 86.040195%, 93.833751% 86.431657%, 97.098153% 86.081462%, 99.191998% 84.519782%, 99.930917% 81.276787%, 99.930917% 74.373149%, 99.930917% 67.469512%, 99.930917% 60.565874%, 99.930917% 53.662237%, 99.930917% 46.7586%, 99.930917% 39.854963%, 99.930917% 32.951325%, 99.930917% 26.047688%, 99.483948% 23.602291%, 98.249148% 21.274547%, 96.385677% 19.128688%, 94.052694% 17.228949%, 91.409359% 15.639561%, 88.614834% 14.424756%, 85.828276% 13.648769%, 83.208846% 13.375833%, 79.780489% 13.234012%, 76.02116% 12.843221%, 72.072026% 12.184289%, 68.074254% 11.238045%, 64.16901% 9.9853175%, 60.497461% 8.4069355%, 57.200773% 6.4837289%, 54.420113% 4.1965263%, 53.612432% 3.3746811%, 52.867835% 2.5981691%, 52.190258% 1.8867921%, 51.583637% 1.260352%, 51.051908% 0.73865107%, 50.599007% 0.34149057%, 50.228869% 0%);
        }
        
        .rd-container {
          display: flex;
          height: 440px;
          justify-content: center;
          left: 50%;
          overflow: hidden;
          position: absolute;
          transform: translateX(-50%);
          transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
          width: 325px;
          top: 30px;
          pointer-events: none; /* Let clicks pass through when hidden */
        }
        
        .rd-dot {
          background: #7C3AED; /* Replaced white with app theme color (purple) for unactive state visibility */
          border-radius: 50%;
          height: 10px;
          margin-right: 5px;
          width: 10px;
          transition: all 0.3s ease;
        }
        .dark .rd-dot {
           background: #fff;
        }
        
        .rd-dot:last-child {
          margin-right: 0;
        }
        
        /* The white drop background */
        .rd-drop {
          background: #fff;
          border-radius: 1.2px;
          height: 5px;
          transform: translateY(5px);
          transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
          width: 5px;
        }
        
        /* List positioning */
        .rd-list {
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          top: 70px;
          width: 300px;
          z-index: 60;
          pointer-events: none;
        }
        
        .rd-list ul {
          margin: 0;
          padding: 0;
        }
        
        .rd-list li {
          align-items: center;
          border-bottom: 1px solid #eee;
          display: flex;
          font-size: 16px;
          height: 50px;
          margin-left: 20px;
          opacity: 0;
          list-style: none;
          transition: opacity 100ms cubic-bezier(0.4, 0.0, 0.2, 1);
          user-select: none;
          color: #333;
          gap: 12px;
          font-weight: 600;
        }
        
        .rd-list li:hover {
          background: #f9f9f9;
          color: #7C3AED;
        }
        
        /* ACTIVE STATES */
        .rd-dots.active .rd-container {
          transform: translateX(-50%) translateY(20px);
          pointer-events: auto;
        }
        
        .rd-dots.active .rd-drop {
          transform: translateY(212px) scale(108);
        }
        
        .rd-dots.active .rd-list {
           pointer-events: auto;
        }

        .rd-dots.active .rd-list li {
          cursor: pointer;
          opacity: 1;
          transition: opacity 200ms 100ms cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        /* Staggered animation */
        .rd-dots.active .rd-list li:nth-child(2) { transition-delay: 130ms; }
        .rd-dots.active .rd-list li:nth-child(3) { transition-delay: 160ms; }
        .rd-dots.active .rd-list li:nth-child(4) { transition-delay: 190ms; }
        .rd-dots.active .rd-list li:nth-child(5) { transition-delay: 220ms; }
        .rd-dots.active .rd-list li:nth-child(6) { transition-delay: 250ms; }
        
        .rd-shadow {
            /* Fallback shadow image provided in prompt */
            background-image: url(data:image/png;base64,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);
            height: 440px;
            justify-content: center;
            left: 50%;
            opacity: 0;
            position: absolute;
            transform: translateX(-50%) translateY(4px);
            transition: opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
            width: 365px;
            z-index: 55;
            pointer-events: none;
        }
        
        .rd-dots.active .rd-shadow {
          opacity: 1;
          transition: opacity 150ms 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .rd-cursor {
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
          height: 40px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 70;
        }
      `}</style>

      {/* The DOM Structure specific to the animation */}
      <div className={`rd-dots ${active ? 'active' : ''}`}>
        
        <div className="rd-dot"></div>
        <div className="rd-dot"></div>
        <div className="rd-dot"></div>
        
        {/* Invisible Click Area */}
        <div className="rd-cursor" onClick={toggle}></div>

        <div className="rd-shadow rd-cut"></div>
        
        <div className="rd-container rd-cut">
          <div className="rd-drop rd-cut2"></div>
        </div>
        
        <div className="rd-list">
          <ul>
            <li onClick={() => handleItemClick('Syllabus')}>
              <BookOpen size={20} className="text-purple-600" /> Syllabus
            </li>
            <li onClick={() => handleItemClick('Past Exam Papers')}>
              <FileText size={20} className="text-blue-600" /> Past Exam Papers
            </li>
            <li onClick={() => handleItemClick('Video Tutorials')}>
              <Video size={20} className="text-[#ff7400]" /> Video Tutorials
            </li>
            <li onClick={() => handleItemClick('Class Rooms')}>
              <Users size={20} className="text-green-600" /> Class Rooms
            </li>
            <li onClick={() => handleItemClick('Extra Lessons')}>
              <GraduationCap size={20} className="text-orange-600" /> Extra Lessons
            </li>
            <li onClick={() => handleItemClick('Quiz Competitions')}>
              <Trophy size={20} className="text-yellow-600" /> Quiz Competitions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
