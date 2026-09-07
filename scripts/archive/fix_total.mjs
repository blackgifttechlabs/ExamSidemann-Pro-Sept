import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      if (fs.statSync(file).isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.tsx') && file.includes('LearningOutcome')) results.push(file);
      }
    });
  } catch (e) {}
  return results;
}

const files = walk('./components/courses/polytechnic/nc-it');

const contents = {
  'computer-networking': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">\n      <Globe className="w-3 h-3 text-blue-400" />\n      network-topology\n    </div>\n  </div>\n  <div className="p-6 h-64 relative flex items-center justify-center">\n    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500 rounded-full border-4 border-[#1e1e2e] shadow-lg z-10 flex items-center justify-center animate-pulse"><Server className="text-white w-5 h-5"/></div>\n    <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-indigo-500 rounded-full border-4 border-[#1e1e2e] shadow-lg z-10 flex items-center justify-center"><Monitor className="text-white w-4 h-4"/></div>\n    <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-green-500 rounded-full border-4 border-[#1e1e2e] shadow-lg z-10 flex items-center justify-center"><Globe className="text-white w-6 h-6"/></div>\n    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-600 stroke-2"><line x1="25%" y1="25%" x2="33%" y2="75%" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" /><line x1="25%" y1="25%" x2="75%" y2="33%" /><line x1="33%" y1="75%" x2="75%" y2="33%" /></svg>\n  </div>\n</div>',
  'computer-security': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">\n      <ShieldCheck className="w-3 h-3 text-red-500" />\n      security_dashboard\n    </div>\n  </div>\n  <div className="p-6 h-64 flex flex-col justify-center">\n    <div className="flex items-center justify-between mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">\n      <div className="flex items-center gap-3"><ShieldCheck className="text-red-500 animate-pulse w-6 h-6" /><span className="font-bold text-red-400">Firewall Active</span></div>\n      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">SEC_L5</span>\n    </div>\n    <div className="space-y-2">\n      <div className="flex items-center justify-between text-sm"><span className="text-gray-400">Intrusion Prevention</span><span className="text-green-500 font-bold">Online</span></div>\n      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden"><div className="bg-green-500 w-full h-full"></div></div>\n    </div>\n    <div className="space-y-2 mt-4">\n      <div className="flex items-center justify-between text-sm"><span className="text-gray-400">Threat Definitions</span><span className="text-blue-500 font-bold">Updated</span></div>\n      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 w-[85%] h-full"></div></div>\n    </div>\n  </div>\n</div>',
  'database-concepts': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">\n      <Database className="w-3 h-3 text-purple-500" />\n      db_viewer\n    </div>\n  </div>\n  <div className="p-0 overflow-hidden h-64">\n    <div className="bg-purple-900/30 font-bold text-xs text-purple-300 px-4 py-2 flex gap-4 border-b border-purple-800/50"><div className="w-1/3">ID</div><div className="w-1/3">Column Name</div><div className="w-1/3">Data Type</div></div>\n    <div className="flex gap-4 px-4 py-3 border-b border-gray-800 text-sm font-mono text-gray-400 hover:bg-gray-800 transition-colors"><div className="w-1/3 text-blue-500">1</div><div className="w-1/3 text-gray-200">user_id</div><div className="w-1/3 text-purple-500">INT(11)</div></div>\n    <div className="flex gap-4 px-4 py-3 border-b border-gray-800 text-sm font-mono text-gray-400 hover:bg-gray-800 transition-colors"><div className="w-1/3 text-blue-500">2</div><div className="w-1/3 text-gray-200">username</div><div className="w-1/3 text-purple-500">VARCHAR(50)</div></div>\n    <div className="flex gap-4 px-4 py-3 border-b border-gray-800 text-sm font-mono text-gray-400 hover:bg-gray-800 transition-colors"><div className="w-1/3 text-blue-500">3</div><div className="w-1/3 text-gray-200">created_at</div><div className="w-1/3 text-purple-500">DATETIME</div></div>\n    <div className="px-4 py-3 text-xs text-gray-400 italic font-mono">~ SELECT * FROM users LIMIT 10;</div>\n  </div>\n</div>',
  'entrepreneurship': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2">\n      <Zap className="w-3 h-3 text-amber-500" />\n      business_dashboard\n    </div>\n  </div>\n  <div className="p-6 h-64 flex flex-col justify-end relative">\n    <div className="absolute top-6 left-6 right-6 flex justify-between items-end mb-4">\n      <div><div className="text-gray-400 text-xs font-bold uppercase">Monthly Growth</div><div className="text-2xl font-black text-white mt-1">+24.8%</div></div>\n      <div className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold">Profit Up</div>\n    </div>\n    <div className="flex items-end justify-between h-32 gap-2 mt-auto">\n      <div className="w-1/6 bg-blue-900/50 rounded-t-lg h-[40%] hover:bg-blue-400 transition-colors"></div>\n      <div className="w-1/6 bg-blue-800/60 rounded-t-lg h-[55%] hover:bg-blue-400 transition-colors"></div>\n      <div className="w-1/6 bg-blue-700/70 rounded-t-lg h-[45%] hover:bg-blue-500 transition-colors"></div>\n      <div className="w-1/6 bg-blue-600/80 rounded-t-lg h-[70%] hover:bg-blue-400 transition-colors"></div>\n      <div className="w-1/6 bg-blue-500 rounded-t-lg h-[85%] hover:bg-blue-400 transition-colors relative"><div className="absolute -top-3 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div></div>\n    </div>\n  </div>\n</div>',
  'workplace-communication': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2">\n      <MessageCircle className="w-3 h-3 text-green-500" />\n      team-chat\n    </div>\n  </div>\n  <div className="p-4 h-64 flex flex-col gap-3 overflow-hidden">\n    <div className="flex w-full mt-2"><div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]"><p className="text-xs text-gray-200">Hi team, please review the latest presentation draft before the meeting. 📎</p></div></div>\n    <div className="flex w-full justify-end mt-2 animate-fade-in delay-300"><div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-[85%]"><p className="text-xs">Looks good! Clear and professional tone. ✅</p></div></div>\n    <div className="flex w-full mt-2 relative"><div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%] flex gap-2"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div></div>\n  </div>\n</div>',
  'module1': '<div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">\n  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">\n    <div className="flex gap-1.5">\n      <div className="w-3 h-3 rounded-full bg-red-500"></div>\n      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>\n      <div className="w-3 h-3 rounded-full bg-green-500"></div>\n    </div>\n    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2">\n      <Cpu className="w-3 h-3 text-blue-500" />\n      sys_monitor\n    </div>\n  </div>\n  <div className="p-6 h-64 flex flex-col justify-center">\n    <div className="space-y-4">\n      <div className="grid grid-cols-2 gap-4">\n        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm"><div className="text-[10px] uppercase font-bold text-gray-500 mb-1">CPU Load</div><div className="text-xl font-mono text-white font-black">24%</div><div className="w-full h-1 bg-gray-700 mt-2 rounded"><div className="w-[24%] h-full bg-blue-500 rounded"></div></div></div>\n        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm"><div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Memory</div><div className="text-xl font-mono text-white font-black">4.2<span className="text-sm">GB</span></div><div className="w-full h-1 bg-gray-700 mt-2 rounded"><div className="w-[42%] h-full bg-purple-500 rounded"></div></div></div>\n      </div>\n      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm flex items-center justify-between"><div className="flex items-center gap-3"><HardDrive className="text-gray-400 w-5 h-5" /><div><div className="text-xs font-bold text-gray-100">Disk Storage</div><div className="text-[10px] text-gray-500">Secondary Drive</div></div></div><span className="text-xs font-mono font-bold text-green-500 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded">HEALTHY</span></div>\n    </div>\n  </div>\n</div>'
};

let modifiedCount = 0;

for (let file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('Right Side Illustration')) continue;

  let key = '';
  if (file.includes('computer-networking')) key = 'computer-networking';
  else if (file.includes('computer-security')) key = 'computer-security';
  else if (file.includes('database-concepts')) key = 'database-concepts';
  else if (file.includes('entrepreneurship')) key = 'entrepreneurship';
  else if (file.includes('workplace-communication')) key = 'workplace-communication';
  else if (file.includes('module1')) key = 'module1';

  if (!key || !contents[key]) continue;

  // Find start and end exactly!
  const startText = '{/* Right Side Illustration */}';
  let p1 = content.indexOf(startText);
  if (p1 === -1) continue;

  // Locate the </header> AFTER p1
  let p2 = content.indexOf('</header>', p1);
  if (p2 === -1) continue;

  // The replacement block
  let replacement = startText + '\n' +
                    '          <div className="hidden lg:flex justify-center items-center">\n' +
                    '            <div className="relative group w-full max-w-lg">\n' + 
                    '              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>\n' +
                    '              ' + contents[key] + '\n' +
                    '            </div>\n' +
                    '          </div>\n' +
                    '        </div>\n' +
                    '      </header>';

  // Replace from p1 up to the end of </header> (including </header>)
  content = content.substring(0, p1) + replacement + content.substring(p2 + 9);
  
  if (key === 'workplace-communication' && !content.includes('MessageCircle')) {
      content = content.replace('import { ', 'import { MessageCircle, ');
  }
  if (key === 'computer-networking') {
      if (!content.includes('Globe')) content = content.replace('import { ', 'import { Globe, Server, Monitor, ');
  }
  if (key === 'database-concepts') {
      if (!content.includes('Database')) content = content.replace('import { ', 'import { Database, ');
  }
  if (key === 'entrepreneurship') {
      if (!content.includes('Zap')) content = content.replace('import { ', 'import { Zap, ');
  }
  if (key === 'module1') {
      if (!content.includes('HardDrive')) content = content.replace('import { ', 'import { HardDrive, ');
  }

  fs.writeFileSync(file, content);
  modifiedCount++;
  console.log('Fixed exactly -> ' + file);
}
console.log('Done: ' + modifiedCount);
