import {
  // 1. Standard Valid Icons (Added Focus, Minimize, Book)
  FolderTree, Hash, Paperclip, Layout, Edit, Target, Shield, ListChecks, Type, 
  BookOpen, Book, Focus, Minimize, FileText, Scissors, Archive, Database, User, 
  Calendar, CheckCircle, Send, ShieldCheck, Bell, RefreshCw, File, Folder, 
  Clipboard, Mail, Lock, Eye, AlertCircle, Trash2, Cloud, Server, HardDrive, 
  Disc, Box, Home, Warehouse, Zap, MapPin, DollarSign, Sun, FireExtinguisher, 
  Bug, Users, Phone, MessageSquare, Headphones, Award, Briefcase, Clock, 
  Coffee, ThumbsUp, HelpCircle, AlertTriangle, Mic, Video, Camera, Share2, 
  Smile, Frown, Meh, TrendingUp, BarChart, PieChart, Inbox, SendToBack, 
  Package, Stamp, Truck, Bookmark, FileCheck, FileSearch, FileWarning, 
  FileX, UserCheck, UserPlus, UserMinus, UserX, Handshake, Heart, Star, 
  Gem, Crown, Building, DoorOpen, Sofa, Paintbrush, Sparkles, Sparkle, 
  Utensils, CupSoda, Cookie, Apple, Wine, PhoneForwarded, PhoneOff, 
  Voicemail, Headset, BadgeCheck, Trophy, Medal, Microscope, FlaskRound, 
  Beaker, TestTube, Thermometer, Droplet, Lightbulb, Fan, Wrench, Hammer, 
  Drill, Recycle, Leaf, Flower, BookMarked, Library, PanelTop, Scan, 
  Fingerprint, KeyRound, Siren, Flame, Waves,ThumbsDown, Palette,

  // 2. Fixes for names used in your JSX (Suffix Aliases)
  Search as SearchIcon,
  Clock as ClockIcon,
  HardDrive as HardDriveIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Circle as CircleIcon,
  Scissors as ScissorsIcon,
  Award as AwardIcon,

  // 3. Replacements for Brand Icons (Removed from Lucide)
  Globe as Twitter,
  Camera as Instagram,
  Briefcase as Linkedin,
  Share2 as Facebook,
  Video as Youtube,

  // 4. Replacements for Missing Object Icons
  Scissors as Comb,
  User as Shirt,
  MapPin as Shoe,
  Wrench as Saw,
  Leaf as Tree
} from 'lucide-react';

import React from 'react';

export const LearningOutcome5: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerClasses = isDarkMode
    ? 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-12';

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: '',
      green: '',
      purple: '',
      amber: '',
      red: '',
      indigo: '',
    };
    const borderColor = colorMap[color] || colorMap.blue;
    return `py-4 mb-4 ${borderColor}`;
  };

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Records & Information Management: Module LO5
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Photography & <span className="text-rose-300 font-bold italic">Image Capture</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to photography concepts, advantages, drawbacks, light principles, camera types, and film development.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">photography.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CAPTURE</span><span className="text-white">Light;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">DEVELOP</span><span className="text-white">Film;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MASTER</span><span className="text-white">Camera;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Camera className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Lightbulb className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: THE CONCEPT OF PHOTOGRAPHY ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Concept of Photography</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Photography, at its core, is the art and science of capturing light and recording images. It's a process that transforms a fleeting moment into a lasting visual representation. This is achieved by using a camera, which acts as a light-tight box, to focus light onto a light-sensitive surface, either a digital sensor or traditional film. The light interacts with this surface, creating a latent image that is then processed to produce a visible photograph.</p>
            <p>The fundamental principles of photography involve controlling light, time, and composition. Light, the essential ingredient, is manipulated through aperture, shutter speed, and ISO settings. Aperture controls the amount of light entering the camera, shutter speed determines the duration of light exposure, and ISO adjusts the sensor's sensitivity to light. Time, or exposure, dictates how long the light-sensitive surface is exposed to light, affecting the brightness and motion blur in the image. Composition involves arranging the elements within the frame to create a visually appealing and meaningful image. Photography is not merely about replicating reality; it's about interpreting and expressing it through visual storytelling.</p>
          </div>
        </section>

        {/* ========== SECTION 2: 5 ADVANTAGES AND DRAWBACKS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>5 Advantages and Drawbacks of Photography</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Photography offers a powerful means of capturing and sharing moments, but it also has limitations. Understanding both sides is essential for appreciating its capabilities and drawbacks.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsUp size={20} /> Advantages of Photography</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Visual Documentation and Memory Preservation:</strong> Photography provides an unparalleled ability to document events, people, and places. It preserves memories and historical moments, creating a visual record of the past. This is invaluable for personal use, such as capturing family milestones, and for professional applications, such as documenting historical events or scientific discoveries. Photographs serve as tangible reminders, allowing us to revisit and relive past experiences.</li>
              <li><strong>Communication and Expression:</strong> Photography is a powerful form of visual communication, transcending language barriers and conveying emotions and ideas through images. Photographers use composition, lighting, and other techniques to express their artistic vision and tell stories. Photojournalism, for instance, uses photographs to document current events and raise awareness about social issues.</li>
              <li><strong>Accessibility and Affordability:</strong> With the advent of digital photography and smartphones, capturing images has become more accessible and affordable than ever before. Digital cameras and smartphones offer user-friendly interfaces and automatic settings, making photography accessible to a wide range of individuals. The ability to instantly view and share digital images has also democratized photography, allowing anyone to capture and share their perspectives.</li>
              <li><strong>Scientific and Technical Applications:</strong> Photography plays a crucial role in various scientific and technical fields. It is used in astronomy to capture images of celestial objects, in medicine to document medical conditions, and in forensics to capture evidence at crime scenes. Photography is also used in industrial applications, such as quality control and product documentation.</li>
              <li><strong>Creative Outlet and Artistic Expression:</strong> Photography provides a creative outlet for individuals to express their artistic vision. Through composition, lighting, and post-processing, photographers can manipulate images to create unique and compelling works of art. Photography allows for a wide range of artistic styles and techniques, from realistic to abstract.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsDown size={20} /> Drawbacks of Photography</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Subjectivity and Interpretation:</strong> Photography, while often perceived as a faithful representation of reality, is inherently subjective. The photographer's choices, such as composition, framing, and editing, influence how the image is perceived. This can lead to different interpretations of the same photograph, depending on the viewer's perspective.</li>
              <li><strong>Technological Dependence and Obsolescence:</strong> Digital photography relies heavily on technology, which is constantly evolving. This can lead to technological obsolescence, where older cameras and file formats become outdated. Digital files can also be lost or corrupted due to hardware failures or software issues.</li>
              <li><strong>Privacy and Ethical Concerns:</strong> Photography can raise privacy and ethical concerns, particularly in public spaces. The ability to capture and share images instantly can lead to unauthorized surveillance and the dissemination of private information. Photographers must be mindful of privacy rights and ethical considerations when capturing and sharing images.</li>
              <li><strong>Environmental Impact:</strong> The production and disposal of photographic equipment and materials can have environmental impacts. The manufacturing of cameras and lenses requires resources and energy, and the disposal of electronic waste can contribute to pollution.</li>
              <li><strong>The "Perfect Image" Illusion:</strong> Digital photography and editing software can create an illusion of perfection, leading to unrealistic expectations. This can contribute to body image issues and a distorted view of reality. The ease of digital manipulation can also make it difficult to discern between authentic and manipulated images.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: LIGHT AND PHOTOGRAPHY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Light and Photography: The Essential Relationship</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Light is the very essence of photography, acting as both the medium and the subject. Without light, there would be no image, no captured moment. Photography, in its most fundamental sense, is the art of recording and manipulating light to create visual representations of the world around us. Understanding the properties and behavior of light is crucial for any photographer seeking to master their craft.</p>
            <p>Light, in its simplest form, is electromagnetic radiation that travels in waves. These waves have varying wavelengths and frequencies, which determine the color and intensity of light. In photography, we primarily deal with visible light, the portion of the electromagnetic spectrum that our eyes can perceive. The interplay between light and the objects it encounters is what allows us to capture images. When light strikes an object, it can be absorbed, reflected, or transmitted. The reflected light, carrying information about the object's color, texture, and form, enters the camera lens and is focused onto the light-sensitive surface, creating the image.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Sun size={20} /> The Role of Light Intensity and Quality</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Light Intensity:</strong> Light intensity, or brightness, is a critical factor in photography. It determines the exposure of the image, which affects its overall brightness and contrast. Photographers control light intensity using aperture, shutter speed, and ISO settings. Aperture adjusts the size of the lens opening, controlling the amount of light entering the camera. Shutter speed determines the duration of light exposure, and ISO adjusts the sensor's sensitivity to light.</li>
              <li><strong>Light Quality:</strong> Light quality refers to the characteristics of light, such as its softness or hardness, color temperature, and direction. Soft light, produced by a large light source or diffused light, creates gentle shadows and even illumination. Hard light, produced by a small, direct light source, creates harsh shadows and high contrast. Color temperature refers to the warmth or coolness of light, measured in Kelvin. Direction of light influences the shape and form of objects, creating highlights and shadows that define their three-dimensionality.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Paintbrush size={20} /> Light as a Creative Tool</h3>
            <p>Photographers use light as a creative tool to shape their images and convey their artistic vision. They manipulate light to create mood, atmosphere, and visual impact. For example, backlighting can create silhouettes or rim light effects, while side lighting can emphasize texture and depth. Photographers also use artificial light sources, such as flashes and studio lights, to control the lighting conditions and create specific effects.</p>
            <p>Understanding the relationship between light and shadow is fundamental to photographic composition. Shadows can create depth, add drama, and define the shape and form of objects. Photographers use shadows to guide the viewer's eye and create a sense of three-dimensionality. The interplay between light and shadow is a powerful tool for visual storytelling.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Palette size={20} /> Light and Color</h3>
            <p>Light is intrinsically linked to color. The color of an object is determined by the wavelengths of light that it reflects. White light contains all the colors of the visible spectrum, while colored light is composed of specific wavelengths. Photographers use color to create mood, evoke emotions, and enhance the visual appeal of their images.</p>
            <p>Color temperature also plays a role in color reproduction. Different light sources have different color temperatures, which can affect the color balance of the image. Photographers use white balance settings to compensate for these differences and ensure accurate color reproduction.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Zap size={20} /> Light and Exposure</h3>
            <p>Exposure is the amount of light that reaches the camera sensor or film, and it is a fundamental concept in photography. Proper exposure is essential for creating well-balanced images with adequate brightness and contrast. Photographers use the exposure triangle (aperture, shutter speed, and ISO) to control exposure.</p>
            <p>Overexposure occurs when too much light reaches the sensor, resulting in a bright, washed-out image. Underexposure occurs when too little light reaches the sensor, resulting in a dark, shadowy image. Photographers strive to achieve a balanced exposure that captures the full range of tones in the scene.</p>
          </div>
        </section>

        {/* ========== SECTION 4: CAMERAS USED IN PHOTOGRAPHY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Cameras Used in Photography: A Comprehensive Overview</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Cameras, the tools that enable us to capture and record images, come in a diverse range of types, each designed for specific purposes and user needs. From simple point-and-shoot models to sophisticated professional systems, cameras have evolved significantly over time, offering a wide array of features and capabilities.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Point-and-Shoot Cameras</h3>
            <p>Point-and-shoot cameras are designed for simplicity and ease of use, making them ideal for casual photographers and everyday snapshots. These cameras typically feature automatic settings, allowing users to simply point the camera and press the shutter button to capture an image. They are compact and lightweight, making them portable and convenient for travel or social events. While they may lack advanced features like manual controls or interchangeable lenses, point-and-shoot cameras offer a straightforward and accessible way to capture memories.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Digital Single-Lens Reflex (DSLR) Cameras</h3>
            <p>DSLR cameras are professional-grade cameras that offer a high level of control and versatility. They use a mirror and prism system to reflect the image from the lens to the optical viewfinder, allowing photographers to see exactly what the lens sees. DSLRs feature interchangeable lenses, allowing photographers to choose the appropriate lens for different shooting situations. They also offer manual controls, allowing photographers to adjust settings such as aperture, shutter speed, and ISO to achieve their desired creative effects. DSLR cameras are widely used by professional photographers and serious enthusiasts due to their image quality, performance, and flexibility.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Mirrorless Cameras</h3>
            <p>Mirrorless cameras are a relatively new type of camera that offers many of the same features and capabilities as DSLRs, but without the mirror and prism system. Instead, they use an electronic viewfinder (EVF) to display the image from the sensor. Mirrorless cameras are typically smaller and lighter than DSLRs, making them more portable. They also offer fast autofocus and continuous shooting speeds, making them suitable for action and sports photography. Mirrorless cameras are gaining popularity among both professionals and enthusiasts due to their compact size, advanced features, and image quality.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Medium Format Cameras</h3>
            <p>Medium format cameras are professional-grade cameras that use larger image sensors than full-frame cameras. This allows them to capture images with exceptional detail and dynamic range, making them ideal for high-resolution photography, such as portraiture, landscape, and commercial work. Medium format cameras are typically more expensive and larger than other types of cameras, but they offer unparalleled image quality. They are often used by professional photographers who require the highest level of image quality for their work.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Action Cameras</h3>
            <p>Action cameras are rugged and compact cameras designed for capturing high-quality video and photos in extreme conditions. They are often used for sports, adventure, and outdoor activities. Action cameras are typically waterproof, shockproof, and dustproof, making them durable and reliable in challenging environments. They offer wide-angle lenses and high frame rates, allowing users to capture immersive and dynamic footage.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Phone size={20} /> Smartphone Cameras</h3>
            <p>Smartphone cameras have become increasingly sophisticated, offering high-resolution sensors, advanced image processing, and a range of shooting modes. They are convenient and readily available, making them a popular choice for everyday photography. Smartphone cameras have democratized photography, allowing anyone to capture and share images instantly. While they may not match the image quality of dedicated cameras, they offer a convenient and accessible way to capture memories.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Camera size={20} /> Specialty Cameras</h3>
            <p>Beyond the more common types, there are specialty cameras designed for unique purposes. This includes underwater cameras, aerial photography cameras, and infrared cameras. Each is built to handle specific environments or capture light outside the normal visible spectrum.</p>
          </div>
        </section>

        {/* ========== SECTION 5: STEPS IN DEVELOPING FILM ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps in Developing Film: The Chemical Transformation</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Developing film, a process that transforms a latent image captured on film into a visible photograph, involves a series of precise chemical steps. This process, while often automated in modern labs, relies on the fundamental principles of chemical reactions and light sensitivity.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Package size={20} /> Preparation and Loading</h3>
            <p>The process begins in a completely dark environment, either a darkroom or a light-tight developing tank. The exposed film is carefully removed from its canister or holder and loaded onto a developing reel. This reel is designed to keep the film separated, allowing the chemicals to access the emulsion evenly. Ensuring the film is loaded correctly is critical, as any overlapping or touching areas will result in uneven development. Once the film is loaded onto the reel, it is placed inside the developing tank, and the tank is sealed, making it light-tight. From this point forward, the process can be carried out in normal lighting.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FlaskRound size={20} /> Developing (First Chemical Bath)</h3>
            <p>The first chemical bath, the developer, is poured into the developing tank. The developer is a reducing agent that converts the exposed silver halide crystals in the film emulsion into metallic silver. The more light that hit a crystal, the more silver that is created. This is what creates the dark areas of the image. The developer is allowed to act for a specific time, depending on the type of film and developer used, and the desired contrast. Agitation, or gentle movement of the tank, is crucial during this stage to ensure even development. Agitation brings fresh developer into contact with the film, preventing uneven development and streaking.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CircleIcon size={20} /> Stop Bath (Second Chemical Bath)</h3>
            <p>After the developing time is complete, the developer is drained, and the stop bath is poured into the tank. The stop bath, typically a weak acid solution, halts the development process by neutralizing the developer. This is important because the developer continues to work even after the prescribed time, which could result in overdevelopment. The stop bath quickly stops the chemical reaction, ensuring that the development process is precisely controlled. Agitation is also used during the stop bath stage.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Beaker size={20} /> Fixing (Third Chemical Bath)</h3>
            <p>Following the stop bath, the fixer, or fixing bath, is poured into the tank. The fixer dissolves the unexposed silver halide crystals, making the image permanent. Without fixing, the remaining silver halide crystals would continue to darken when exposed to light, eventually turning the entire film black. The fixing process typically takes several minutes, and agitation is again essential to ensure even fixing. Once the fixing is complete, the film is no longer light-sensitive, and the tank can be opened in normal lighting.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Droplet size={20} /> Washing (Fourth Step)</h3>
            <p>After fixing, the film is thoroughly washed with running water to remove any residual chemicals. This is a crucial step, as any remaining fixer or other chemicals can cause the film to deteriorate over time. The washing process usually involves a series of water changes or a continuous flow of water for a specified period. Proper washing is essential for ensuring the longevity of the developed film.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Sun size={20} /> Drying (Final Step)</h3>
            <p>The final step involves drying the film. This can be done by hanging the film in a dust-free environment or using a film dryer. A wetting agent can be used before drying to prevent water spots and ensure even drying. Once the film is completely dry, it can be cut into individual frames or strips and stored in archival-quality sleeves or binders. This finished negative is then used to create positive prints.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 5 — Photography & Image Capture</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Photography</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Light</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cameras</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Film Development</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Advantages & Drawbacks</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Capture. Develop. Create. Preserve. 📷🎞️</p>
        </footer>

      </div>
    </div>
  );
};