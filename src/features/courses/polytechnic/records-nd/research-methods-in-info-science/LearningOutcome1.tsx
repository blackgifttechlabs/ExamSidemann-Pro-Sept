import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked
} from 'lucide-react';

export const LearningOutcome1: React.FC = () => {
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

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Records & Information Management: Module LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Research in <span className="text-emerald-300 font-bold italic">Records Management</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to research definitions, basic vs applied research, variables, hypotheses, importance, and quantitative vs qualitative approaches.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">research_methods.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">DEFINE</span><span className="text-white">Research;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">EXPLORE</span><span className="text-white">Variables_Hypotheses;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">COMPARE</span><span className="text-white">Quant_Qual;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Lightbulb className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><PieChart className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: RESEARCH ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Research</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Definition</h3>
            <p>Research is a systematic and organized investigation conducted to increase knowledge or understanding of a particular topic. It involves gathering, analyzing, and interpreting information to answer questions or solve problems. In essence, it's a process of discovering new facts or validating existing ones.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PenTool size={20} /> Explanation</h3>
            <p>Think of research as a journey of exploration. It's not just randomly looking for things; it's a structured way to find answers. You start with a question or a problem, then you plan how to find the answer, collect information, look for patterns, and finally, share what you've learned. Whether it's finding better ways to organize digital information or understanding how people use search engines, research gives us the tools to explore and improve.</p>
          </div>
        </section>

        {/* ========== SECTION 2: BASIC RESEARCH ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Basic Research</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Definition</h3>
            <p>Basic research, also known as pure or fundamental research, aims to expand the existing knowledge base without immediate practical applications in mind. Its primary goal is to enhance understanding of fundamental principles and theories.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lightbulb size={20} /> Explanation</h3>
            <p>Basic research is about curiosity-driven discovery. It's like asking "why" questions to understand the world better. For example, a basic research project in Information Science might explore the fundamental cognitive processes involved in how people categorize information. The goal isn't to create a specific product or solve an immediate problem, but to gain a deeper understanding of how the human mind works with information. This kind of research lays the groundwork for future applied research.</p>
          </div>
        </section>

        {/* ========== SECTION 3: APPLIED RESEARCH ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applied Research</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Definition</h3>
            <p>Applied research focuses on solving specific, practical problems or addressing real-world issues. It seeks to apply existing knowledge to develop solutions, improve processes, or create new technologies.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Explanation</h3>
            <p>Applied research is about finding practical solutions. If basic research tells us how people categorize information, applied research might use that knowledge to design a more user-friendly library catalog or a better search interface. It's about taking the knowledge we have and using it to make things better in the real world. For instance, testing different search algorithms to improve the accuracy of a search engine is applied research. The outcome of applied research is often a tangible product, a new method, or an improved system.</p>
          </div>
        </section>

        {/* ========== SECTION 4: RESEARCH VARIABLES AND HYPOTHESIS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Research Variables and Hypothesis</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hash size={20} /> Definition</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Research Variables:</strong> These are any factors or characteristics that can be manipulated, controlled, or measured in a research study. They can change or vary and are the building blocks of research questions.</li>
              <li><strong>Hypothesis:</strong> A hypothesis is a testable prediction or educated guess about the relationship between variables. It's a statement that researchers aim to prove or disprove through their study.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Puzzle size={20} /> Explanation</h3>
            <p><strong>Variables:</strong> Imagine you're studying how long people spend searching for information online. Variables are the things you can measure or change, like the complexity of the search query, the user's age, or the type of search engine used. Variables can be independent (the cause, like the search engine used) or dependent (the effect, like the time spent searching).</p>
            <p className="mt-2"><strong>Hypothesis:</strong> A hypothesis is your best guess about how these variables are connected. For example, you might hypothesize that "users who use a semantic search engine will find information faster than those who use a keyword-based search engine." This is a testable statement that you can investigate through your research. A good hypothesis is clear, specific, and based on existing knowledge or observations. It guides your research and helps you determine what data to collect and how to analyze it.</p>
          </div>
        </section>

        {/* ========== SECTION 5: IMPORTANCE OF RESEARCH IN RMIS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of Research in Records Management and Information Science</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Enhancing Efficiency and Effectiveness</h3>
            <p>Research in records management and information science is crucial for developing and refining methods for organizing, storing, and retrieving information. By conducting research, professionals can identify inefficiencies in current systems and develop innovative solutions to streamline workflows. For instance, research might explore the effectiveness of different metadata schemas in improving information retrieval or investigate the impact of automated classification systems on records processing time. This leads to more efficient information management practices, saving time and resources.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Improving Information Accessibility and Usability</h3>
            <p>Research plays a vital role in ensuring that information is accessible and usable for its intended purpose. Studies can investigate user behavior and information-seeking patterns to understand how people interact with information systems. This knowledge can then be used to design user-friendly interfaces, develop intuitive search functionalities, and create information architectures that meet the needs of diverse users. Research also helps in developing strategies to make information accessible to individuals with disabilities, ensuring inclusivity.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Preserving Information for Future Generations</h3>
            <p>Records management and information science are responsible for preserving information for long-term access. Research helps in developing best practices for digital preservation, ensuring that valuable information remains accessible even as technology evolves. Studies might explore the longevity of different storage media, investigate the impact of file format obsolescence, or develop strategies for migrating digital records to new platforms. This ensures that historical and cultural information is preserved for future research and understanding.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Addressing Emerging Challenges</h3>
            <p>The field of records management and information science is constantly evolving due to technological advancements and changing information needs. Research is essential for addressing these emerging challenges. For example, studies might investigate the implications of artificial intelligence and machine learning on records management practices or explore the ethical considerations of data privacy and security in the digital age. Research enables professionals to stay ahead of the curve and adapt to the changing landscape of information management.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Supporting Evidence-Based Decision-Making</h3>
            <p>Research provides the empirical evidence needed to support informed decision-making in records management and information science. By conducting rigorous studies, professionals can gather data to evaluate the effectiveness of different policies, procedures, and technologies. This evidence-based approach ensures that decisions are based on sound data rather than assumptions or anecdotal evidence, leading to better outcomes.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookMarked size={20} /> Advancing Theoretical Understanding</h3>
            <p>Research contributes to the development of theoretical frameworks and models that underpin records management and information science. Basic research helps to expand our understanding of fundamental concepts, such as information behavior, knowledge organization, and information retrieval. This theoretical understanding provides a foundation for developing practical applications and addressing real-world problems.</p>
          </div>
        </section>

        {/* ========== SECTION 6: QUANTITATIVE AND QUALITATIVE RESEARCH APPROACHES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Quantitative and Qualitative Research Approaches</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Definition</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Quantitative Research:</strong> A research approach that focuses on collecting and analyzing numerical data to identify patterns, relationships, and trends. It emphasizes objective measurement and statistical analysis.</li>
              <li><strong>Qualitative Research:</strong> A research approach that focuses on exploring and understanding the meanings, experiences, and perspectives of individuals or groups. It emphasizes subjective interpretation and the analysis of non-numerical data.</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">Distinguishing between quantitative and qualitative research approaches:</h3>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Nature of Data</h4>
            <p><strong>Quantitative</strong> research deals with numerical data, such as counts, measurements, and statistics. Researchers use instruments like surveys with closed-ended questions or experiments to gather data that can be statistically analyzed.</p>
            <p className="mt-2"><strong>Qualitative</strong> research deals with non-numerical data, such as words, images, and observations. Researchers use methods like interviews, focus groups, and case studies to gather rich, descriptive data.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Purpose of Research</h4>
            <p><strong>Quantitative</strong> research aims to test hypotheses, establish cause-and-effect relationships, and generalize findings to larger populations. It seeks to quantify phenomena and identify patterns.</p>
            <p className="mt-2"><strong>Qualitative</strong> research aims to explore and understand complex phenomena, gain insights into people's experiences, and develop theories. It seeks to understand the "why" and "how" behind behaviors and experiences.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><SettingsIcon size={20} /> Research Methods</h4>
            <p><strong>Quantitative</strong> research uses structured methods, such as surveys, experiments, and statistical analysis. It emphasizes objectivity, control, and standardization.</p>
            <p className="mt-2"><strong>Qualitative</strong> research uses flexible and iterative methods, such as interviews, focus groups, and content analysis. It emphasizes subjectivity, interpretation, and context.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Data Analysis</h4>
            <p><strong>Quantitative</strong> data is analyzed using statistical techniques, such as descriptive statistics, inferential statistics, and regression analysis. The goal is to identify patterns, relationships, and trends in the numerical data.</p>
            <p className="mt-2"><strong>Qualitative</strong> data is analyzed through thematic analysis, content analysis, and narrative analysis. The goal is to identify patterns, themes, and meanings in the textual or visual data.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Generalizability</h4>
            <p><strong>Quantitative</strong> research aims to generalize findings to larger populations through statistical inference. Researchers use random sampling to ensure that the sample is representative of the population.</p>
            <p className="mt-2"><strong>Qualitative</strong> research typically focuses on in-depth understanding of a specific context or group, and findings are not necessarily generalizable to other populations. The goal is to provide rich, detailed insights rather than statistical generalizations.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Researcher's Role</h4>
            <p><strong>Quantitative</strong> research: the researcher strives for objectivity and minimizes their influence on the data. They maintain distance from the participants and use standardized procedures.</p>
            <p className="mt-2"><strong>Qualitative</strong> research: the researcher is actively involved in the data collection and analysis process. Their perspectives and interpretations are acknowledged, and they seek to understand the participants' perspectives.</p>
          </div>
        </section>

        {/* ========== SECTION 7: QUANTITATIVE RESEARCH STRENGTHS AND WEAKNESSES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Quantitative Research Strengths</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Objectivity and Generalizability</h3>
            <p>Quantitative research strives for objectivity by using standardized measurements and statistical analysis. This means that researchers aim to minimize personal biases and ensure that the data is collected and analyzed in a consistent manner. Because of this focus on standardized procedures and larger sample sizes, the findings from quantitative studies can often be generalized to a larger population. This is particularly valuable when researchers want to understand broad trends or make predictions about a large group of people. For example, a survey using a large, representative sample can provide insights into the overall information-seeking behaviors of a specific demographic.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PieChart size={20} /> Precise Measurement and Statistical Analysis</h3>
            <p>The reliance on numerical data allows for precise measurement and statistical analysis. Researchers can use statistical tools to identify patterns, relationships, and trends with a high degree of accuracy. This precision is essential for testing hypotheses and establishing cause-and-effect relationships. For instance, researchers can use statistical tests to determine the strength of the relationship between two variables, such as the correlation between the number of hours spent studying and exam scores. This level of precision allows for strong conclusions.</p>
          </div>

          <div className="flex items-center gap-4 dark:border-red-500 text-red-600 dark:text-red-400 pl-6 mt-8">
            <h2 className={sectionHeaderClasses}>Quantitative Research Weaknesses</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Limited Depth of Understanding</h3>
            <p>While quantitative research excels at measuring and quantifying phenomena, it may overlook the nuances and complexities of human experiences. By focusing on numerical data and statistical analysis, researchers may miss important contextual factors and individual perspectives. For example, a survey might reveal that a certain percentage of people use a particular search engine, but it may not explain why they prefer that search engine or how they experience using it. This lack of depth can limit the overall understanding of the research topic.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Layout size={20} /> Contextual Limitations</h3>
            <p>The standardized nature of quantitative research can sometimes create contextual limitations. Researchers design their studies to control variables and ensure consistency, which can lead to artificial or unrealistic settings. This means that the findings may not accurately reflect real-world situations, where multiple factors interact in complex ways. For example, an experimental study conducted in a controlled laboratory setting may not accurately predict how people will behave in a natural setting, such as a busy library.</p>
          </div>
        </section>

        {/* ========== SECTION 8: QUALITATIVE RESEARCH STRENGTHS AND WEAKNESSES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Qualitative Research Strengths</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> In-Depth Understanding</h3>
            <p>Qualitative research provides rich, detailed insights into the meanings, experiences, and perspectives of individuals or groups. By using methods such as interviews, focus groups, and observations, researchers can gather in-depth data that reveals the complexities of human behavior. This allows for a deeper understanding of the "why" and "how" behind people's actions and beliefs. For example, in-depth interviews with librarians can reveal detailed information about the challenges they face in managing digital resources and the strategies they use to overcome those challenges.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Contextual Richness</h3>
            <p>Qualitative research emphasizes the importance of context, recognizing that human behavior is influenced by social, cultural, and historical factors. Researchers immerse themselves in the context of their study, gathering data that reflects the real-world experiences of participants. This contextual richness allows for a more comprehensive understanding of the research topic. For instance, a case study of a community library can provide insights into how the library's services are shaped by the specific needs and characteristics of the local community.</p>
          </div>

          <div className="flex items-center gap-4 dark:border-red-500 text-red-600 dark:text-red-400 pl-6 mt-8">
            <h2 className={sectionHeaderClasses}>Qualitative Research Weaknesses</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Edit size={20} /> Subjectivity and Potential for Bias</h3>
            <p>Qualitative research is inherently subjective, as it relies on the researcher's interpretations and perspectives. This subjectivity can introduce bias into the data collection and analysis process. Researchers must be aware of their own biases and take steps to minimize their influence on the study. For example, a researcher's own beliefs about information literacy could influence how they interpret interview data about library users' search behaviors.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Limited Generalizability</h3>
            <p>Qualitative research typically focuses on in-depth understanding of specific contexts or groups, and findings are not necessarily generalizable to other populations. Because of the small sample sizes and focus on unique experiences, findings are often specific to the studied group. For example, findings from a qualitative study of a specific online community may not be applicable to other online communities with different demographics or interests.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Research in Records Management</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Research Definition</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Basic & Applied</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Variables & Hypothesis</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quant vs Qual</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Research Methods. 📚🔍</p>
        </footer>

      </div>
    </div>
  );
};