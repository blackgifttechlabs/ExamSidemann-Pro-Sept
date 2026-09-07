import React, { useState, useRef } from 'react';
import ConceptExplainer from './ConceptExplainer';
import ProsConsComparison from './ProsConsComparison';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Transmission modes (simplex, half-duplex, full-duplex)
const transmissionModesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-labelledby="modes-title modes-desc">
  <title id="modes-title">Data transmission modes</title>
  <desc id="modes-desc">Simplex sends one way, half-duplex sends both ways at different times, and full-duplex sends both ways simultaneously.</desc>
  <defs>
    <linearGradient id="modes-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <filter id="modes-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="mode-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker>
  </defs>
  <rect width="900" height="540" rx="28" fill="url(#modes-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Direction of Data Transmission</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">The mode states whether each device can send, receive, or do both</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#modes-shadow)">
    <g><rect x="40" y="115" width="260" height="240" rx="22" fill="#fff"/><text x="170" y="153" text-anchor="middle" font-size="22" font-weight="800" fill="#1d4ed8">SIMPLEX</text><rect x="70" y="190" width="58" height="45" rx="10" fill="#172554"/><text x="99" y="218" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">SEND</text><rect x="212" y="190" width="58" height="45" rx="10" fill="#64748b"/><text x="241" y="218" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">RECV</text><path d="M128 212h84" stroke="#2563eb" stroke-width="6" marker-end="url(#mode-arrow)"/><text x="170" y="274" text-anchor="middle" font-size="14" fill="#334155">One direction only</text><text x="170" y="305" text-anchor="middle" font-size="12" fill="#64748b">Example: keyboard → computer</text><text x="170" y="326" text-anchor="middle" font-size="12" fill="#64748b">or a broadcast signal</text></g>
    <g><rect x="320" y="115" width="260" height="240" rx="22" fill="#fff"/><text x="450" y="153" text-anchor="middle" font-size="22" font-weight="800" fill="#6d28d9">HALF-DUPLEX</text><rect x="350" y="190" width="58" height="45" rx="10" fill="#172554"/><text x="379" y="218" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">A</text><rect x="492" y="190" width="58" height="45" rx="10" fill="#64748b"/><text x="521" y="218" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">B</text><path d="M408 204h84M492 226h-84" stroke="#7c3aed" stroke-width="5" marker-end="url(#mode-arrow)"/><text x="450" y="274" text-anchor="middle" font-size="14" fill="#334155">Both directions, one at a time</text><text x="450" y="305" text-anchor="middle" font-size="12" fill="#64748b">Example: walkie-talkies</text><text x="450" y="326" text-anchor="middle" font-size="12" fill="#64748b">one person speaks while the other listens</text></g>
    <g><rect x="600" y="115" width="260" height="240" rx="22" fill="#fff"/><text x="730" y="153" text-anchor="middle" font-size="22" font-weight="800" fill="#047857">FULL-DUPLEX</text><rect x="630" y="190" width="58" height="45" rx="10" fill="#172554"/><text x="659" y="218" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">A</text><rect x="772" y="190" width="58" height="45" rx="10" fill="#64748b"/><text x="801" y="218" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">B</text><path d="M688 202h84M772 228h-84" stroke="#059669" stroke-width="5" marker-end="url(#mode-arrow)"/><text x="730" y="274" text-anchor="middle" font-size="14" fill="#334155">Both directions simultaneously</text><text x="730" y="305" text-anchor="middle" font-size="12" fill="#64748b">Example: telephone call</text><text x="730" y="326" text-anchor="middle" font-size="12" fill="#64748b">both users can speak and hear at once</text></g>
  </g>
  <text x="450" y="405" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800" fill="#0f172a">Transmission Media</text>
  <g font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" text-anchor="middle"><rect x="90" y="432" width="165" height="54" rx="17" fill="#dbeafe"/><text x="173" y="465" fill="#1d4ed8">Twisted pair</text><rect x="275" y="432" width="165" height="54" rx="17" fill="#ede9fe"/><text x="358" y="465" fill="#6d28d9">Coaxial cable</text><rect x="460" y="432" width="165" height="54" rx="17" fill="#cffafe"/><text x="543" y="465" fill="#0e7490">Fibre optic</text><rect x="645" y="432" width="165" height="54" rx="17" fill="#d1fae5"/><text x="728" y="465" fill="#047857">Wireless</text></g>
</svg>
`;

// Interface types (GUI, command, menu, direct manipulation)
const interfaceTypesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="hci-title hci-desc">
  <title id="hci-title">Human computer interface types</title>
  <desc id="hci-desc">Four cards compare graphical, command-line, menu-driven and direct-manipulation interfaces.</desc>
  <defs>
    <linearGradient id="hci-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <filter id="hci-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#hci-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Human–Computer Interfaces</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">The interface determines how a user gives commands and receives feedback</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#hci-shadow)">
    <g><rect x="35" y="115" width="195" height="310" rx="22" fill="#fff"/><rect x="59" y="145" width="147" height="100" rx="12" fill="#dbeafe"/><rect x="70" y="158" width="125" height="16" rx="5" fill="#2563eb"/><rect x="70" y="184" width="36" height="45" rx="6" fill="#fff"/><rect x="114" y="184" width="36" height="45" rx="6" fill="#fff"/><rect x="158" y="184" width="36" height="45" rx="6" fill="#fff"/><text x="133" y="284" text-anchor="middle" font-size="21" font-weight="800" fill="#1d4ed8">GUI</text><text x="133" y="311" text-anchor="middle" font-size="12" fill="#64748b">Windows • icons • menus</text><text x="133" y="332" text-anchor="middle" font-size="12" fill="#64748b">pointer • visual feedback</text><rect x="65" y="360" width="136" height="38" rx="19" fill="#dbeafe"/><text x="133" y="384" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">Easy to discover</text></g>
    <g><rect x="247" y="115" width="195" height="310" rx="22" fill="#fff"/><rect x="271" y="145" width="147" height="100" rx="12" fill="#172554"/><text x="287" y="173" font-size="12" font-family="monospace" fill="#93c5fd">&gt; list files</text><text x="287" y="197" font-size="12" font-family="monospace" fill="#dbeafe">report.txt</text><text x="287" y="221" font-size="12" font-family="monospace" fill="#93c5fd">&gt; _</text><text x="345" y="284" text-anchor="middle" font-size="21" font-weight="800" fill="#6d28d9">Command line</text><text x="345" y="311" text-anchor="middle" font-size="12" fill="#64748b">Commands entered as text</text><text x="345" y="332" text-anchor="middle" font-size="12" fill="#64748b">precise and scriptable</text><rect x="277" y="360" width="136" height="38" rx="19" fill="#ede9fe"/><text x="345" y="384" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">Needs command knowledge</text></g>
    <g><rect x="459" y="115" width="195" height="310" rx="22" fill="#fff"/><rect x="483" y="145" width="147" height="100" rx="12" fill="#ecfeff"/><rect x="499" y="160" width="115" height="20" rx="6" fill="#0891b2"/><rect x="499" y="188" width="115" height="16" rx="6" fill="#bae6fd"/><rect x="499" y="212" width="115" height="16" rx="6" fill="#bae6fd"/><text x="557" y="284" text-anchor="middle" font-size="21" font-weight="800" fill="#0e7490">Menu-driven</text><text x="557" y="311" text-anchor="middle" font-size="12" fill="#64748b">Choose from listed options</text><text x="557" y="332" text-anchor="middle" font-size="12" fill="#64748b">used by ATMs and kiosks</text><rect x="489" y="360" width="136" height="38" rx="19" fill="#cffafe"/><text x="557" y="384" text-anchor="middle" font-size="12" font-weight="700" fill="#0e7490">Guided but limited</text></g>
    <g><rect x="671" y="115" width="195" height="310" rx="22" fill="#fff"/><rect x="695" y="145" width="147" height="100" rx="12" fill="#ecfdf5"/><rect x="711" y="162" width="45" height="48" rx="8" fill="#34d399"/><rect x="781" y="180" width="45" height="48" rx="8" fill="#a7f3d0"/><path d="M757 186h21" stroke="#047857" stroke-width="4" stroke-linecap="round"/><path d="M772 179l8 7-8 7" fill="none" stroke="#047857" stroke-width="3"/><text x="769" y="284" text-anchor="middle" font-size="21" font-weight="800" fill="#047857">Direct manipulation</text><text x="769" y="311" text-anchor="middle" font-size="12" fill="#64748b">Act on visible objects</text><text x="769" y="332" text-anchor="middle" font-size="12" fill="#64748b">drag • drop • resize • touch</text><rect x="701" y="360" width="136" height="38" rx="19" fill="#d1fae5"/><text x="769" y="384" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">Immediate feedback</text></g>
  </g>
</svg>
`;

// Multiplexing concept
const multiplexingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 440" role="img" aria-labelledby="mux-title mux-desc">
  <title id="mux-title">Multiplexing and demultiplexing</title>
  <desc id="mux-desc">Three independent input signals are combined by a multiplexer, share one communication channel, and are separated by a demultiplexer at the destination.</desc>
  <defs>
    <linearGradient id="mux-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <linearGradient id="mux-channel" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#2563eb"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#059669"/></linearGradient>
    <filter id="mux-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="mux-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#64748b"/></marker>
  </defs>
  <rect width="900" height="440" rx="28" fill="url(#mux-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Multiplexing</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Several data streams efficiently share one high-capacity communication channel</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#mux-shadow)">
    <g><rect x="55" y="120" width="150" height="58" rx="17" fill="#2563eb"/><text x="130" y="155" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">DATA STREAM A</text><rect x="55" y="191" width="150" height="58" rx="17" fill="#7c3aed"/><text x="130" y="226" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">DATA STREAM B</text><rect x="55" y="262" width="150" height="58" rx="17" fill="#059669"/><text x="130" y="297" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">DATA STREAM C</text></g>
    <path d="M205 149l80 57M205 220h80M205 291l80-57" fill="none" stroke="#94a3b8" stroke-width="4" marker-end="url(#mux-arrow)"/>
    <path d="M285 145l95 35v80l-95 35z" fill="#172554"/><text x="334" y="214" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">MUX</text><text x="334" y="237" text-anchor="middle" font-size="11" fill="#bfdbfe">COMBINES</text>
    <rect x="380" y="190" width="140" height="60" rx="12" fill="url(#mux-channel)"/><path d="M397 205h106M397 220h106M397 235h106" stroke="#fff" stroke-opacity=".8" stroke-width="6" stroke-dasharray="22 10"/><text x="450" y="283" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">ONE SHARED CHANNEL</text>
    <path d="M615 145l-95 35v80l95 35z" fill="#172554"/><text x="566" y="214" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">DEMUX</text><text x="566" y="237" text-anchor="middle" font-size="11" fill="#bfdbfe">SEPARATES</text>
    <path d="M615 206l80-57M615 220h80M615 234l80 57" fill="none" stroke="#94a3b8" stroke-width="4" marker-end="url(#mux-arrow)"/>
    <g><rect x="695" y="120" width="150" height="58" rx="17" fill="#dbeafe"/><text x="770" y="155" text-anchor="middle" font-size="15" font-weight="800" fill="#1d4ed8">DESTINATION A</text><rect x="695" y="191" width="150" height="58" rx="17" fill="#ede9fe"/><text x="770" y="226" text-anchor="middle" font-size="15" font-weight="800" fill="#6d28d9">DESTINATION B</text><rect x="695" y="262" width="150" height="58" rx="17" fill="#d1fae5"/><text x="770" y="297" text-anchor="middle" font-size="15" font-weight="800" fill="#047857">DESTINATION C</text></g>
  </g>
  <rect x="185" y="365" width="530" height="42" rx="21" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><text x="450" y="391" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="#1e3a8a">The receiver restores each original stream for the correct destination</text>
</svg>
`;

// Generic placeholder image loader (assumes images are in ../computer/images/)
const foundationImage = (fileName: string) =>
  new URL(`../computer/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const commImages = {
  transmissionModes: svgToDataUri(transmissionModesSvg),
  interfaceTypes: svgToDataUri(interfaceTypesSvg),
  multiplexing: svgToDataUri(multiplexingSvg),
};

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const PlaceholderImage: React.FC<{ placeholder: string; alt: string; className?: string }> = ({
  placeholder,
  alt,
  className = 'mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm',
}) => (
  <img
    src={placeholderToImage(placeholder)}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={className}
  />
);

const sections: TopicSection[] = [
  {
    id: 'part-a',
    title: 'Part A: Data Communication',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Data communication</strong> is the electronic transfer of data between devices through a
              transmission medium under agreed rules. Data may be represented by <strong>digital</strong> discrete
              values or <strong>analogue</strong> continuously varying signals.
            </p>
          </div>

          <ConceptExplainer
            title="The Complete Communication Process"
            introduction="Successful communication requires a source, message, transmitter, channel, receiver, destination and protocol. Quality is judged by accuracy, delivery time, capacity and reliability."
            accent="rose"
            concepts={[
              {
                name: 'Sender, Message and Receiver',
                definition: 'The sender creates data, the message is what travels and the receiver accepts it.',
                explanation: 'Devices need agreed addressing and representation so the correct destination can interpret the bits. A response may travel through the same or a different path.',
                examples: ['Laptop sending an email', 'Sensor sending a reading', 'Server returning a web page'],
                examTip: 'Identify all three roles from the scenario rather than naming only the cable.',
              },
              {
                name: 'Analogue and Digital Signals',
                definition: 'Analogue signals vary continuously; digital signals use distinct levels to represent bits.',
                explanation: 'Natural sound begins as an analogue waveform, while computers process binary data. ADC converts sampled analogue values to digital form and DAC recreates an analogue output where required.',
                examples: ['Microphone waveform', 'Binary network pulses', 'Digital audio converted for speakers'],
                examTip: 'Data and signal are related but not identical; digital data may be carried by modulated analogue radio.',
              },
              {
                name: 'Simplex, Half-Duplex and Full-Duplex',
                definition: 'Transmission mode describes which direction communication can travel and whether both directions operate together.',
                explanation: 'Simplex is one-way, half-duplex alternates direction and full-duplex supports simultaneous two-way transfer. Required coordination and channel capacity increase across the modes.',
                examples: ['Keyboard to computer', 'Walkie-talkie conversation', 'Telephone call'],
                examTip: 'Half-duplex is two-way, but only one side transmits at a time.',
              },
              {
                name: 'Synchronous and Asynchronous Transfer',
                definition: 'Timing methods that keep sender and receiver aligned while bits are transferred.',
                explanation: 'Synchronous communication transfers a continuous frame or block using shared timing information. Asynchronous communication frames smaller units with start and stop information, making pauses easier but adding overhead.',
                examples: ['Synchronous network frame', 'Asynchronous serial terminal', 'UART communication'],
                examTip: 'Do not define the difference only as “fast” and “slow”; explain timing and framing.',
              },
              {
                name: 'Bandwidth, Throughput and Latency',
                definition: 'Bandwidth is potential channel capacity, throughput is useful data actually delivered and latency is delay.',
                explanation: 'Protocol overhead, congestion, interference, distance and equipment reduce throughput below the advertised capacity. High bandwidth does not guarantee low delay.',
                examples: ['Video needing high throughput', 'Satellite link with noticeable latency', 'Congested Wi-Fi below its rated bandwidth'],
                examTip: 'Use bits per second for data rate and time units for latency.',
              },
              {
                name: 'Attenuation, Noise and Regeneration',
                definition: 'Signals weaken over distance and may be altered by unwanted interference.',
                explanation: 'Attenuation reduces signal strength; noise changes the received signal. Amplifiers, repeaters, shielding, error detection and suitable media help maintain communication quality.',
                examples: ['Long copper cable loss', 'Radio interference', 'Repeater restoring a digital signal'],
                examTip: 'Attenuation is loss of strength; noise is unwanted added disturbance.',
              },
              {
                name: 'Multiplexing',
                definition: 'Combining several independent data streams so they share one communication link.',
                explanation: 'A multiplexer assigns separate time slots, frequencies, wavelengths or codes. A demultiplexer at the destination separates the combined stream for the correct receivers, improving use of an expensive channel.',
                examples: ['Time-division multiplexing', 'Frequency-division multiplexing', 'Wavelength-division multiplexing'],
                examTip: 'Multiplexing shares a link; it does not merge the users’ messages into one indistinguishable file.',
              },
            ]}
          />

          <div className="grid gap-4">
            {/* Transmission modes */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Transmission Modes</h4>
              <div className="mt-2">
                <img src={commImages.transmissionModes} alt="Transmission modes" className="w-full rounded-xl" />
              </div>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
                <li><strong>Simplex:</strong> One direction only (e.g., TV broadcast).</li>
                <li><strong>Half-Duplex:</strong> Both directions but not simultaneously (e.g., walkie-talkie).</li>
                <li><strong>Full-Duplex:</strong> Both directions simultaneously (e.g., telephone).</li>
              </ul>
              <p className="text-sm text-slate-700 mt-1"><strong>Synchronous:</strong> Data in blocks (fast); <strong>Asynchronous:</strong> Character by character (slow).</p>
            </div>

            {/* Multiplexing */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Multiplexing</h4>
              <p className="text-sm text-slate-700">Allows multiple signals to share the same channel. A <strong>multiplexer</strong> combines signals; a <strong>de‑multiplexer</strong> splits them.</p>
              <div className="mt-2">
                <img src={commImages.multiplexing} alt="Multiplexing" className="w-full rounded-xl" />
              </div>
            </div>

            {/* Transmission media */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Transmission Media</h4>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li><strong>Twisted Pair:</strong> Cheap, good over short distances, suffers attenuation.</li>
                <li><strong>Coaxial:</strong> Higher bandwidth, less attenuation, but expensive and stiff.</li>
                <li><strong>Fibre Optics:</strong> Very high bandwidth, low attenuation and immunity to electromagnetic interference, but installation and repair require specialist equipment.</li>
                <li><strong>Infra‑red:</strong> High bandwidth, short range, doesn't penetrate obstacles.</li>
                <li><strong>Satellite:</strong> Covers very long distances and wide areas, but can have high latency, weather effects and significant service cost.</li>
              </ul>
            </div>

            {/* Wireless */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Wireless Communication</h4>
              <p className="text-sm text-slate-700">Uses radio, infrared, satellite, Bluetooth, Wi‑Fi, 3G, etc.</p>
              <div className="mt-4">
                <ProsConsComparison
                  title="Wireless Communication Advantages and Disadvantages"
                  advantages={[
                    'Users can move within the coverage area while remaining connected.',
                    'Fewer physical data cables are required.',
                    'Installation can be faster in existing buildings.',
                    'Portable devices such as phones and tablets can connect easily.',
                    'Temporary networks can be created for events or emergencies.',
                    'Coverage can reach places where laying cable is difficult.',
                    'Additional users can often join without installing a new cable.',
                    'Wireless links support flexible classroom and office layouts.',
                    'Cellular and satellite systems can cover large geographical areas.',
                    'Voice, video, and data can share modern wireless networks.',
                  ]}
                  disadvantages={[
                    'Signals weaken with distance and physical obstacles.',
                    'Radio interference can reduce speed and reliability.',
                    'Wireless transmissions can be intercepted if security is weak.',
                    'Shared radio bandwidth may become congested.',
                    'Actual speed is often lower or less consistent than a wired connection.',
                    'Coverage can contain dead zones.',
                    'Access points and mobile devices still require electrical power.',
                    'Strong encryption and secure configuration require careful administration.',
                    'Weather can affect some long-distance satellite or microwave links.',
                    'Wireless equipment and spectrum services may involve ongoing costs.',
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Key Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Attenuation – signal loss</li>
              <li>Noise – unwanted signal</li>
              <li>Bandwidth – capacity (bps)</li>
              <li>Multiplexing – sharing channel</li>
              <li>Wireless – no cables</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Computer Viruses and Security',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Malware</strong> is software intentionally designed to disrupt, damage, spy, extort or gain
              unauthorised access. A <strong>virus</strong> is one malware type that attaches to a host file or boot
              area and replicates when that host executes.
            </p>
          </div>

          <ConceptExplainer
            title="Malware and Security Threats Explained"
            introduction="Threat names describe different behaviours. A worm is not simply another virus, a Trojan does not need to replicate, and phishing is a social-engineering attack rather than a self-replicating program."
            accent="rose"
            concepts={[
              {
                name: 'File or Boot-Sector Virus',
                definition: 'Malicious code that attaches to a host program or boot area and copies itself when activated.',
                explanation: 'The virus depends on execution of the infected host. It may modify other files, damage data or remain dormant until a condition occurs.',
                examples: ['Infected executable', 'Macro-infected document', 'Infected boot record'],
                examTip: 'Replication through a host distinguishes a virus from a Trojan.',
              },
              {
                name: 'Worm',
                definition: 'Standalone malware that copies itself automatically across devices or networks.',
                explanation: 'A worm searches for reachable vulnerable systems and spreads without attaching to a normal file. Rapid replication can consume bandwidth and deliver additional harmful code.',
                examples: ['Spreading through an unpatched service', 'Copying through a network share', 'Mass-mailing itself to contacts'],
                examTip: 'A worm is self-contained and network-spreading; it does not require a host file.',
              },
              {
                name: 'Trojan Horse',
                definition: 'Malicious software disguised as a legitimate or useful program.',
                explanation: 'The user is persuaded to install or open it. Once active it may create a backdoor, steal data or download other malware, but it does not define itself by self-replication.',
                examples: ['Fake game installer', 'False security update', 'Malicious email attachment disguised as an invoice'],
                examTip: 'The defining feature is disguise and deception.',
              },
              {
                name: 'Ransomware',
                definition: 'Malware that blocks access to data or systems and demands payment.',
                explanation: 'It may encrypt files, delete accessible backups and spread through shared storage. Offline tested backups, patching, least privilege and incident response reduce damage.',
                examples: ['Encrypted document folders', 'Locked business server', 'Ransom note demanding cryptocurrency'],
                examTip: 'Paying does not guarantee recovery; prevention and tested restoration are essential.',
              },
              {
                name: 'Spyware and Keylogger',
                definition: 'Malware that secretly monitors activity or captures information.',
                explanation: 'Spyware may record browsing and screenshots, while a keylogger captures keystrokes. Stolen credentials and personal data can then support fraud or further intrusion.',
                examples: ['Captured password', 'Recorded browsing activity', 'Secret screenshot collection'],
                examTip: 'The main purpose is covert observation and data theft.',
              },
              {
                name: 'Logic Bomb and Time Trigger',
                definition: 'Hidden malicious instructions activated when a programmed condition becomes true.',
                explanation: 'A condition might be a date, a missing employee record or a particular action. The harmful payload remains inactive until the trigger occurs; “time bomb” describes a time-based trigger.',
                examples: ['Activates on a chosen date', 'Deletes files after an account is removed', 'Runs after a specified number of starts'],
                examTip: 'The trigger is the key feature; it does not have to replicate.',
              },
              {
                name: 'Phishing and Social Engineering',
                definition: 'Manipulating a person into revealing information or performing an unsafe action.',
                explanation: 'Attackers imitate trusted organisations, create urgency and direct victims to false login pages or malicious attachments. Verification through a separate trusted channel is a strong defence.',
                examples: ['Fake password-reset message', 'Fraudulent banking page', 'Caller requesting a one-time code'],
                examTip: 'Phishing targets human trust; an antivirus alone cannot prevent every deception.',
              },
              {
                name: 'Layered Protection',
                definition: 'Using several preventive, detective and recovery controls together.',
                explanation: 'No single product provides complete security. Updates, anti-malware, firewalls, secure configuration, authentication, least privilege, user education, backups and monitoring cover different failure paths.',
                examples: ['Automatic security updates', 'Multi-factor authentication', 'Offline tested backup'],
                examTip: 'For each control, state which risk it reduces and remember that a firewall is not a backup.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Signs of Virus Attack</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li>Reduced performance / slow operation</li>
                <li>Nasty messages or blank screen</li>
                <li>Wrong results, data loss</li>
                <li>Hard disk inaccessible, failure to boot</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Malware and Related Threats</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Virus:</strong> Replicates through an infected host.</li>
                <li><strong>Worm:</strong> Standalone malware that spreads automatically.</li>
                <li><strong>Trojan:</strong> Disguises malicious behaviour as a legitimate program.</li>
                <li><strong>Ransomware:</strong> Denies access and demands payment.</li>
                <li><strong>Spyware:</strong> Secretly collects information.</li>
                <li><strong>Logic bomb:</strong> Activates when a programmed condition is met.</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Prevention Methods</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li>Use reputable anti-malware and keep its engine and threat information updated</li>
                <li>Avoid sharing infected media</li>
                <li>Do not open unknown attachments</li>
                <li>Install firewalls</li>
                <li>Buy original software</li>
              </ul>
              <PlaceholderImage placeholder="{antivirus}" alt="Antivirus software" />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Virus Quick Facts</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Replicates itself</li>
              <li>Spreads via networks/media</li>
              <li>Antivirus protects</li>
              <li>Firewall blocks intrusion</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Human‑Computer Interfaces',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              An <strong>interface</strong> is the means of communication between the user and the computer. A <strong>user‑friendly</strong> interface is easy to learn, intuitive, and consistent.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <img src={commImages.interfaceTypes} alt="Interface types" className="w-full rounded-xl" />
            </div>
          </div>

          <ConceptExplainer
            title="Interface Types and Suitable Users"
            introduction="A human–computer interface (HCI) includes the controls, feedback and rules through which a person interacts with a system. Good design is consistent, accessible, forgiving and suited to the task and user."
            accent="rose"
            concepts={[
              {
                name: 'Graphical User Interface (GUI)',
                definition: 'An interface using visual windows, icons, menus, buttons and a pointer or touch input.',
                explanation: 'GUIs provide visible choices and immediate feedback, reducing memorisation. They require graphics resources and can hide advanced detail behind several screens.',
                examples: ['Desktop operating system', 'Smartphone interface', 'Graphics-editing application'],
                examTip: 'WIMP describes common GUI elements; a GUI can also use touch instead of a mouse.',
              },
              {
                name: 'Command-Line Interface (CLI)',
                definition: 'An interface in which users type commands and parameters using a defined syntax.',
                explanation: 'Experienced users can automate precise repeated tasks through scripts and work efficiently over low-bandwidth links. Beginners must learn commands and typing mistakes can have serious effects.',
                examples: ['Linux shell', 'Windows PowerShell', 'Network-device console'],
                examTip: 'Its strengths are precision and automation; its difficulty is command syntax and discoverability.',
              },
              {
                name: 'Menu-Driven Interface',
                definition: 'An interface that guides users through a limited set of displayed options.',
                explanation: 'Menus prevent invalid commands and help occasional users, but deep menus can slow experienced users and options outside the designed task are unavailable.',
                examples: ['ATM menu', 'Restaurant ordering kiosk', 'Printer settings panel'],
                examTip: 'Choose it when tasks are predictable and the user should select rather than memorise commands.',
              },
              {
                name: 'Form-Based Interface',
                definition: 'An interface organised as labelled fields for entering and reviewing structured data.',
                explanation: 'Validation, input masks, defaults and clear error messages improve data quality. The order and grouping of fields should match the real workflow.',
                examples: ['Online application form', 'Patient registration screen', 'Point-of-sale product form'],
                examTip: 'A form is best for structured records with known fields.',
              },
              {
                name: 'Direct Manipulation and Touch',
                definition: 'Users act on visible objects through gestures such as drag, resize, rotate or tap.',
                explanation: 'Actions feel immediate because the object remains visible and feedback is continuous. Small targets, hidden gestures and precision tasks can create accessibility problems.',
                examples: ['Dragging a file to a folder', 'Pinch-to-zoom on a map', 'Moving a shape in a drawing program'],
                examTip: 'Explain the visible object, physical action and immediate feedback.',
              },
              {
                name: 'Natural-Language and Voice Interface',
                definition: 'An interface that accepts spoken or written everyday-language requests.',
                explanation: 'It can improve accessibility and hands-free operation, but accents, noise, ambiguity and privacy affect reliability. Critical actions should be confirmed before execution.',
                examples: ['Voice assistant', 'Dictation system', 'Text-based support chatbot'],
                examTip: 'Natural language is convenient but does not guarantee that the computer understands context like a human.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">GUI (Graphical User Interface)</h4>
              <p className="text-sm text-slate-700">Uses Windows, Icons, Menus, Pointers (WIMP). Easy for beginners, but uses more memory and storage.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Command‑Driven Interface</h4>
              <p className="text-sm text-slate-700">User types commands (e.g., MS‑DOS). Fast for experts, but requires memorisation.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Menu‑Driven Interface</h4>
              <p className="text-sm text-slate-700">User selects from a list of options. Easy but limited.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Direct Manipulation Interface</h4>
              <p className="text-sm text-slate-700">Uses icons and bitmaps; drag‑and‑drop. Very intuitive.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Interface Elements</h4>
              <p className="text-sm text-slate-700">Window, Icon, Menu, Pointer, Dialog box, Scroll bar, Cursor, Prompt.</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Interface Summary</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>GUI – icons, mouse</li>
              <li>Command – typing</li>
              <li>Menu – list selection</li>
              <li>Direct – drag/drop</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Peripheral Devices Control',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>peripheral</strong> is an input, output or storage device connected to the computer. Because
              peripherals operate at different speeds and require attention at different times, hardware and the
              operating system coordinate them through buffering, interrupts, polling, spooling, handshaking and
              scheduling.
            </p>
          </div>

          <ConceptExplainer
            title="Peripheral-Control Techniques Explained"
            introduction="The techniques solve different problems: matching speed, requesting attention, checking status, queuing work, agreeing readiness and deciding execution order."
            accent="rose"
            concepts={[
              {
                name: 'Buffering',
                definition: 'Temporarily holding data while it moves between components operating at different speeds.',
                explanation: 'A fast sender writes into the buffer and continues while a slower receiver removes data when ready. Buffers smooth short speed differences but can overflow if data arrives faster for too long.',
                examples: ['Printer memory buffer', 'Video-stream buffer', 'Keyboard input buffer'],
                examTip: 'A buffer holds data temporarily; it does not decide the order of many complete print jobs.',
              },
              {
                name: 'Interrupt',
                definition: 'A signal that asks the CPU to pause normal work and service an event.',
                explanation: 'The CPU saves enough state, runs an interrupt service routine and then resumes the earlier program. Priority allows urgent events to be handled before less important ones.',
                examples: ['Key pressed', 'Storage transfer completed', 'Printer reports out of paper'],
                examTip: 'Interrupts avoid continuous checking because the device signals when attention is needed.',
              },
              {
                name: 'Polling',
                definition: 'The processor or controller repeatedly checks device status in turn.',
                explanation: 'Polling is simple and predictable, but repeated checks waste processing time when devices rarely need service. The polling interval controls the trade-off between fast response and overhead.',
                examples: ['Checking sensor-ready flags', 'Scanning keyboard status', 'Microcontroller checking input pins'],
                examTip: 'Polling asks the device; an interrupt lets the device notify the CPU.',
              },
              {
                name: 'Spooling',
                definition: 'Placing complete jobs in a disk-backed queue for a shared slow peripheral.',
                explanation: 'Applications finish sending jobs without waiting for the device. A spooler selects queued jobs and feeds them to the peripheral one at a time, while users can view, pause or cancel jobs.',
                examples: ['Office print queue', 'Batch plotter queue', 'Queued report output'],
                examTip: 'Spooling manages multiple jobs; buffering smooths data transfer within a job.',
              },
              {
                name: 'Handshaking',
                definition: 'Exchanging control signals so communicating devices agree parameters and readiness.',
                explanation: 'Devices may negotiate speed, format or direction and use ready/acknowledge signals before transfer. This prevents a sender from transmitting when the receiver cannot accept data.',
                examples: ['Hardware ready/acknowledge lines', 'Modem connection negotiation', 'USB device setup'],
                examTip: 'Describe the exchange of readiness or configuration signals.',
              },
              {
                name: 'Scheduling',
                definition: 'Choosing which waiting process or device request should receive a resource next.',
                explanation: 'The operating system may consider priority, arrival time, fairness and deadlines. Good scheduling improves response and utilisation but cannot make one resource perform two conflicting jobs simultaneously.',
                examples: ['CPU process scheduling', 'Disk request scheduling', 'Priority print queue'],
                examTip: 'Scheduling selects order; it does not itself store the queued data.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Buffer</h4>
              <p className="text-sm text-slate-700">Temporary storage area that compensates for speed differences between devices (e.g., printer buffer). Allows CPU to continue working while printer prints.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Interrupt</h4>
              <p className="text-sm text-slate-700">A signal sent to the CPU by a peripheral requiring attention (e.g., printer out of paper). Causes a break in current execution.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Polling</h4>
              <p className="text-sm text-slate-700">CPU repeatedly checks peripherals to see if they need service (e.g., during booting or in time‑sharing systems).</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Spooling</h4>
              <p className="text-sm text-slate-700">Data is sent to temporary storage (e.g., disk) and later output to a slow device (e.g., printer). Simultaneous Peripheral Operation On‑Line.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Handshaking</h4>
              <p className="text-sm text-slate-700">Exchange of signals to establish communication between two devices (e.g., modem‑computer). Ensures data integrity.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Scheduling</h4>
              <p className="text-sm text-slate-700">CPU decides the order and timing of program execution to maximise resource usage and response time.</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Control Methods</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Buffer – speed match</li>
              <li>Interrupt – attention signal</li>
              <li>Polling – checking status</li>
              <li>Spooling – queue output</li>
              <li>Handshaking – establish link</li>
              <li>Scheduling – job order</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: Computer Applications',
    content: (
      <div className="space-y-6">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed">
            Computers are used in virtually every sector. Below are key application areas.
          </p>
        </div>

        <ConceptExplainer
          title="Computer Applications Explained by Sector"
          introduction="An application should be described as a complete information flow: what data is captured, how it is processed, what output or control action is produced and why that improves the work."
          accent="rose"
          concepts={[
            {
              name: 'Hospitals and Medicine',
              definition: 'Computers support clinical records, monitoring, imaging, diagnosis, treatment and administration.',
              explanation: 'Sensors and imaging devices capture data, software presents trends or images and authorised professionals make decisions. Safety requires accurate data, privacy, reliable equipment and human oversight.',
              examples: ['Electronic patient record', 'Bedside vital-sign monitor', 'CT image processing'],
              examTip: 'A computer supports a clinician; it does not automatically make every medical decision.',
            },
            {
              name: 'Expert Systems',
              definition: 'Knowledge-based programs that apply encoded specialist rules to facts in a narrow domain.',
              explanation: 'The user supplies case facts, an inference engine applies rules in the knowledge base and the system produces advice, often with an explanation. Knowledge engineers and experts must validate and update it.',
              examples: ['Medical decision support', 'Mineral-prospecting adviser', 'Equipment fault diagnosis'],
              examTip: 'Name the knowledge base, inference engine, interface and explanation facility.',
            },
            {
              name: 'Simulation and Virtual Reality',
              definition: 'Simulation imitates a real process with a model; VR places a user inside an interactive computer-generated environment.',
              explanation: 'Models allow safe, repeatable experiments and predictions, while VR adds immersive visual, audio and motion interaction. Results are limited by the assumptions and accuracy of the model.',
              examples: ['Flight simulator', 'Population-growth model', 'Virtual surgical training'],
              examTip: 'A simulation represents reality; it is not the real process itself.',
            },
            {
              name: 'Business Operations',
              definition: 'Systems that process orders, stock, payroll, accounts and point-of-sale transactions.',
              explanation: 'A sale can update stock, customer records, financial totals and reorder decisions from one captured transaction. Validation, audit trails and backups preserve accuracy and accountability.',
              examples: ['EPOS checkout', 'Payroll system', 'Automatic stock control'],
              examTip: 'Explain which master record a transaction changes.',
            },
            {
              name: 'Computerised Banking',
              definition: 'Networked systems that record, authorise and communicate financial transactions.',
              explanation: 'ATMs, mobile apps, cards and branches connect to secure account systems. Authentication, encryption, transaction logs, fraud monitoring and reliable recovery are essential.',
              examples: ['ATM withdrawal', 'Electronic funds transfer', 'Mobile-banking payment'],
              examTip: 'State both the customer service and the security control.',
            },
            {
              name: 'Education',
              definition: 'Computers support teaching, learning, assessment, accessibility and school administration.',
              explanation: 'Interactive content can provide practice and immediate feedback, while management systems store attendance, marks and timetables. Effective learning still needs appropriate teaching and reliable access.',
              examples: ['Computer-assisted instruction', 'Learning-management system', 'Screen reader for an accessible lesson'],
              examTip: 'Differentiate educational content from administrative record processing.',
            },
            {
              name: 'Weather Forecasting',
              definition: 'Computers combine observations and mathematical models to estimate future atmospheric conditions.',
              explanation: 'Sensors, stations, radar and satellites provide data; quality control prepares it; supercomputers solve numerical models; meteorologists interpret maps and uncertainty.',
              examples: ['Satellite image analysis', 'Numerical weather model', 'Severe-weather warning'],
              examTip: 'Forecasting uses both captured data and simulation.',
            },
            {
              name: 'Industry and Manufacturing',
              definition: 'Computers design products, control machines, monitor production and manage quality.',
              explanation: 'CAD creates a precise design, CAM translates manufacturing instructions and controllers use sensors and actuators to operate machinery. Robots are valuable for repeated, precise or hazardous work.',
              examples: ['CAD model', 'CNC machine control', 'Robot welding a vehicle body'],
              examTip: 'CAD produces the design; CAM helps manufacture it.',
            },
            {
              name: 'Traffic and Transport Control',
              definition: 'Computer systems monitor movement and coordinate signals, routes or vehicles.',
              explanation: 'Sensors and cameras measure flow, algorithms choose timing or identify incidents and controllers operate signals. Safe design needs manual override, fail-safe behaviour and continuous monitoring.',
              examples: ['Adaptive traffic lights', 'Railway signalling', 'Fleet route planning'],
              examTip: 'Describe the sensor input, processing decision and control output.',
            },
          ]}
        />

        <div className="grid gap-4">
          {/* Hospitals */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Hospitals & Medicine</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Patient records, monitoring, diagnosis</li>
              <li>Expert systems for medical advice</li>
              <li>Automated alerts and drug interactions</li>
              <li>Use in surgery and body scanners</li>
            </ul>
            <PlaceholderImage placeholder="{hospital}" alt="Hospital computer application" />
          </div>

          {/* Expert Systems */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Expert Systems</h4>
            <p className="text-sm text-slate-700">Mimic human reasoning in specific fields: medicine, mineral prospecting, finance, chess, etc.</p>
            <p className="text-sm text-slate-700 mt-1"><strong>Components:</strong> Knowledge base, inference engine, user interface, explanation facility.</p>
            <div className="mt-4">
              <ProsConsComparison
                title="Expert System Advantages and Disadvantages"
                advantages={[
                  'Provides consistent decisions for the same facts and rules.',
                  'Can analyse cases quickly.',
                  'Makes scarce specialist knowledge available to more users.',
                  'Can operate at any time without becoming tired.',
                  'Can be used remotely or in hazardous environments.',
                  'Preserves organisational knowledge when human experts leave.',
                  'Can explain which rules led to a recommendation when designed with an explanation facility.',
                  'Helps less-experienced staff make structured decisions.',
                  'Can compare many rules and facts systematically.',
                  'Can reduce the cost of routine expert consultations.',
                ]}
                disadvantages={[
                  'Development and specialist knowledge acquisition can be expensive.',
                  'The system is limited to the knowledge entered into its knowledge base.',
                  'It lacks broad human common sense and emotional understanding.',
                  'Incorrect or incomplete rules can produce unsafe advice.',
                  'Knowledge must be reviewed and updated as the field changes.',
                  'Unusual cases outside the programmed domain may be handled poorly.',
                  'Users may trust a recommendation without questioning it.',
                  'Responsibility can be unclear when the system gives harmful advice.',
                  'Capturing tacit knowledge from human experts is difficult.',
                  'It cannot completely replace qualified human judgement in complex situations.',
                ]}
              />
            </div>
          </div>

          {/* Simulation */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Simulation & Virtual Reality</h4>
            <p className="text-sm text-slate-700">Uses models to predict real‑life events (population growth, flight simulators). Virtual reality creates immersive environments.</p>
          </div>

          {/* Business */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Business Applications</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Order Processing:</strong> Receiving and fulfilling orders.</li>
              <li><strong>Stock Control:</strong> Monitor inventory, automatic re‑ordering.</li>
              <li><strong>Payroll:</strong> Employee wages, deductions, payslips.</li>
              <li><strong>Accounting:</strong> Financial records, Pastel Accounting.</li>
              <li><strong>EPOS/EFTPOS:</strong> Point‑of‑sale systems with electronic funds transfer.</li>
            </ul>
            <PlaceholderImage placeholder="{business}" alt="Business applications" />
          </div>

          {/* Banks */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Banking</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>ATM – cash withdrawal, balance enquiry, PIN change.</li>
              <li>Cheque clearing using MICR.</li>
              <li>EFTPOS – electronic payments at shops.</li>
              <li>Internet / home banking – transfers, bill payments.</li>
            </ul>
            <div className="mt-4">
              <ProsConsComparison
                title="Computerised Banking Advantages and Disadvantages"
                advantagesLabel="Benefits"
                disadvantagesLabel="Risks and limitations"
                advantages={[
                  'ATMs and online services can provide access outside branch hours.',
                  'Transfers and balance enquiries are completed quickly.',
                  'Customers can bank without travelling to a branch.',
                  'Electronic records improve transaction tracking.',
                  'Automatic payments help customers pay regular bills on time.',
                  'MICR and computer processing speed up cheque clearing.',
                  'EFTPOS reduces the need to carry large amounts of cash.',
                  'Banks can process very large numbers of transactions accurately.',
                  'Fraud-monitoring systems can flag unusual transaction patterns.',
                  'Mobile and Internet banking support customers in distant locations.',
                ]}
                disadvantages={[
                  'Phishing, card cloning, malware, and account fraud can steal money.',
                  'Forgotten passwords or PINs can block legitimate access.',
                  'Power, network, or server failures can stop services.',
                  'Incorrect account details may send money to the wrong recipient.',
                  'Customers without devices or digital skills may be excluded.',
                  'Transaction records and tracking create privacy concerns.',
                  'ATM cards or phones can be lost or stolen.',
                  'Automated decisions can make errors or be difficult to challenge.',
                  'Some electronic transactions and accounts carry service fees.',
                  'Reduced branch services can remove jobs and face-to-face assistance.',
                ]}
              />
            </div>
          </div>

          {/* Education */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Education</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>CAL (Computer‑Aided Learning) and CAI (Computer‑Aided Instruction).</li>
              <li>Storage of student records, timetables, exam papers.</li>
              <li>Distance learning, encyclopaedias on CD‑ROM.</li>
              <li>Assist disabled students (voice output, Braille).</li>
            </ul>
          </div>

          {/* Weather */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Weather Forecasting</h4>
            <p className="text-sm text-slate-700">Supercomputers analyse data from sensors and satellites to predict weather. Uses data loggers, ADC, and simulation.</p>
          </div>

          {/* Industry */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Industry & Manufacturing</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>CAD (Computer‑Aided Design):</strong> Design and test models (aeroplanes, buildings).</li>
              <li><strong>Robotics:</strong> Robots in car assembly, dangerous environments.</li>
              <li><strong>Automation:</strong> Production control, monitoring.</li>
            </ul>
            <PlaceholderImage placeholder="{industrial}" alt="Industrial applications" />
          </div>

          {/* Traffic */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Traffic Control</h4>
            <p className="text-sm text-slate-700">Computers monitor traffic flow via sensors and cameras, adjust traffic lights, reduce congestion. Can also handle emergencies.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="grid gap-6 md:grid-cols-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📡</span>
            <h4 className="text-lg font-bold text-blue-700">Communication</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Simplex, half, full duplex</li>
            <li>Media: twisted, coax, fibre, wireless</li>
            <li>Multiplexing, bandwidth</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛡️</span>
            <h4 className="text-lg font-bold text-blue-700">Security</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Viruses: types, signs</li>
            <li>Antivirus, firewall</li>
            <li>Prevention: updates, caution</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🖥️</span>
            <h4 className="text-lg font-bold text-blue-700">Interfaces</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>GUI, Command, Menu</li>
            <li>Direct manipulation</li>
            <li>User‑friendly features</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-blue-700">Peripheral Control</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Buffer, Interrupt, Polling</li>
            <li>Spooling, Handshaking</li>
            <li>Scheduling</li>
          </ul>
        </div>

        <div className="md:col-span-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-blue-700">Applications</h4>
          </div>
          <p className="text-slate-700 mt-1">Hospitals (expert systems), Business (EPOS, stock control), Banking (ATM, home banking), Education (CAL, CAI), Industry (CAD, robotics), Weather, Traffic.</p>
        </div>
      </div>
    ),
  },
];

/* ---------- Components ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          type="button"
          aria-label="Scroll topics left"
          onClick={() => scroll('left')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
        >
          <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeId === s.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.title.replace(/^Part [A-E]: /, '')}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll topics right"
          onClick={() => scroll('right')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
        >
          <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
    </div>
    <div className="prose prose-slate max-w-none">{section.content}</div>
  </section>
);

interface LearningOutcome4Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome4: React.FC<LearningOutcome4Props> = ({
  onNextTopic,
  nextTopicTitle = 'Next Topic',
}) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === active), 0);
  const activeSection = sections[activeIndex];
  const isLastChapter = activeIndex >= sections.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isLastChapter) {
      setActive(sections[activeIndex + 1].id);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNextTopic?.();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-800 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            DATA COMMUNICATION & APPLICATIONS
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Communication, Security, Interfaces & Applications
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl leading-relaxed">
            Explore how data is transmitted, how to protect systems, how humans interact with computers,
            peripheral control techniques, and the wide range of computer applications in modern life.
          </p>
        </div>
      </div>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-rose-600 to-pink-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-rose-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Data Transmission:</strong> Modes (simplex, half, full), media (twisted, coax, fibre, wireless), multiplexing, bandwidth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Viruses:</strong> Replicate and damage; use antivirus, avoid unknown attachments, update regularly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Interfaces:</strong> GUI, command, menu, direct manipulation – each has pros/cons.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Peripheral Control:</strong> Buffer, interrupt, polling, spooling, handshaking, scheduling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Applications:</strong> Medicine (expert systems), business (EPOS, stock), banking (ATM, home banking), education (CAL/CAI), industry (CAD, robotics), weather, traffic.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'Ready for the next section?' : `Chapter ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>
                In the next section, we will learn about <span className="text-blue-600">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-rose-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export as LearningOutcome4
export default LearningOutcome4;
