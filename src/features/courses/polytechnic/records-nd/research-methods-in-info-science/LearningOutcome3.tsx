import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked,HelpCircle
} from 'lucide-react';

export const LearningOutcome3: React.FC = () => {
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Records & Information Management: Module LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Statistics in <span className="text-purple-300 font-bold italic">Research</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to statistical tools, measurement scales, central tendency, reliability, validity, SPSS analysis, and quantitative vs qualitative data analysis.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">statistics_guide.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">DEFINE</span><span className="text-white">Statistics;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MEASURE</span><span className="text-white">Central_Tendency;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">ANALYZE</span><span className="text-white">Reliability_Validity;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><BarChart className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Scale className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: DEFINITION OF STATISTICS IN RELATION TO RESEARCH ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Definition of Statistics in Relation to Research</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Statistics as a Tool for Data Analysis and Interpretation</h3>
            <p>In the context of research, statistics refers to the collection, organization, analysis, interpretation, and presentation of data. It serves as a crucial tool for researchers to transform raw data into meaningful insights and draw valid conclusions. Statistics provides a framework for understanding patterns, relationships, and trends within data sets, enabling researchers to make informed decisions and test hypotheses. It allows for the quantification of observed phenomena, enabling researchers to move beyond subjective impressions and rely on empirical evidence. Whether analyzing survey responses, experimental results, or observational data, statistical methods provide the means to summarize, describe, and infer from the data, thereby contributing to the advancement of knowledge. For example, statistics can be used to analyze the results of a survey on library patron satisfaction, allowing researchers to determine the average satisfaction rating, identify significant differences between demographic groups, and assess the overall effectiveness of library services.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Statistics as a Foundation for Hypothesis Testing and Inference</h3>
            <p>Statistics plays a fundamental role in hypothesis testing, which is a core component of scientific research. Researchers use statistical tests to determine whether observed differences or relationships between variables are statistically significant, meaning they are unlikely to have occurred by chance. This allows researchers to evaluate the validity of their hypotheses and draw conclusions about the population from which the sample was drawn. Statistical inference, which involves generalizing findings from a sample to a population, relies heavily on statistical methods. Researchers use confidence intervals and probability distributions to estimate population parameters and assess the uncertainty associated with their estimates. This allows researchers to make informed decisions and draw conclusions that are supported by empirical evidence. For instance, a researcher might use a t-test to determine whether there is a statistically significant difference in information retrieval performance between two different search interfaces, or use a chi-square test to assess the association between library usage and educational attainment.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Statistics as a Means of Describing and Summarizing Data</h3>
            <p>Descriptive statistics are used to summarize and describe the main features of a data set. This includes measures of central tendency, such as the mean, median, and mode, which provide information about the typical values in the data set. Measures of dispersion, such as the standard deviation and variance, provide information about the variability or spread of the data. Descriptive statistics also include graphical representations of data, such as histograms, bar charts, and scatter plots, which allow researchers to visualize patterns and relationships. By summarizing and describing data, researchers can gain a better understanding of the characteristics of their sample and identify potential areas for further investigation. For example, a librarian might use descriptive statistics to calculate the average number of books borrowed per month, the range of borrowing frequency, and the distribution of patron ages.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Statistics as a Tool for Data Reduction and Transformation</h3>
            <p>In many research studies, researchers collect large amounts of data that need to be reduced or transformed into a more manageable format. Statistical techniques, such as factor analysis and principal component analysis, can be used to identify underlying patterns or dimensions in the data, reducing the number of variables and simplifying the analysis. Data transformation techniques, such as standardization and normalization, can be used to adjust the scale or distribution of variables, making them more suitable for statistical analysis. These methods are particularly useful when dealing with complex data sets or when comparing data across different studies. For example, a researcher might use factor analysis to identify underlying factors that influence information-seeking behavior, or use data transformation techniques to compare the performance of different information retrieval systems.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Statistics as a Means of Ensuring Rigor and Objectivity</h3>
            <p>The application of statistical methods ensures rigor and objectivity in research. By using standardized procedures and statistical tests, researchers can minimize bias and ensure that their findings are based on empirical evidence. This enhances the credibility and validity of the research, making it more likely to be accepted by the scientific community. Statistical methods also provide a framework for evaluating the quality of data and assessing the reliability and validity of research instruments. By adhering to statistical principles, researchers can enhance the trustworthiness of their research and contribute to the advancement of knowledge. Therefore, statistics are an integral part of high quality research.</p>
          </div>
        </section>

        {/* ========== SECTION 2: IMPORTANCE OF STATISTICAL TOOLS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of Statistical Tools in Research Work</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Enabling Objective Data Analysis and Interpretation</h3>
            <p>Statistical tools are indispensable for researchers as they provide a systematic and objective approach to analyzing and interpreting data. In research, raw data, whether numerical or categorical, often lacks inherent meaning. Statistical methods allow researchers to transform this raw data into meaningful insights by summarizing, organizing, and analyzing it. This objectivity is crucial for reducing bias and ensuring that conclusions are based on empirical evidence rather than subjective opinions. Statistical tools provide a standardized framework for analyzing data, allowing researchers to identify patterns, relationships, and trends that might otherwise go unnoticed. For example, when analyzing survey data on library resource usage, statistical techniques can reveal significant differences in resource utilization between different demographic groups, providing objective evidence for targeted service improvements.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Facilitating Hypothesis Testing and Drawing Valid Inferences</h3>
            <p>A cornerstone of scientific research is hypothesis testing, and statistical tools are essential for evaluating the validity of hypotheses. Statistical tests, such as t-tests, ANOVA, and chi-square tests, allow researchers to determine whether observed differences or relationships between variables are statistically significant, meaning they are unlikely to have occurred by chance. This rigorous approach to hypothesis testing ensures that research findings are reliable and can be generalized to the population from which the sample was drawn. Statistical inference, which involves drawing conclusions about a population based on sample data, relies heavily on statistical methods. Confidence intervals and probability distributions enable researchers to estimate population parameters and assess the uncertainty associated with their estimates, providing a solid foundation for making informed decisions.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PieChart size={20} /> Enhancing the Precision and Accuracy of Research Findings</h3>
            <p>Statistical tools enhance the precision and accuracy of research findings by providing researchers with the ability to quantify and measure variables with a high degree of precision. Measures of central tendency, such as the mean and median, and measures of dispersion, such as the standard deviation and variance, allow researchers to describe the characteristics of their data with accuracy. Statistical modeling and regression analysis enable researchers to identify and quantify the relationships between variables, providing precise estimates of effect sizes. This precision is crucial for ensuring that research findings are reliable and replicable. For example, in an experimental study evaluating the effectiveness of a new information retrieval system, statistical analysis can provide precise estimates of the system's performance, allowing researchers to compare it with existing systems.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Supporting Evidence-Based Decision-Making and Policy Formulation</h3>
            <p>In various fields, including information science, records management, and public policy, statistical tools play a vital role in supporting evidence-based decision-making. By analyzing data and generating reliable findings, researchers can provide policymakers and practitioners with the information they need to make informed decisions. Statistical analysis can be used to evaluate the effectiveness of programs, policies, and interventions, providing evidence for what works and what does not. For instance, statistical analysis of library usage data can inform decisions about resource allocation, service development, and program evaluation. This ensures that decisions are based on data rather than assumptions or anecdotal evidence.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Enabling the Identification of Trends and Patterns in Large Datasets</h3>
            <p>In the era of big data, researchers are increasingly faced with the challenge of analyzing large and complex datasets. Statistical tools are essential for identifying trends, patterns, and relationships in these datasets. Data mining and machine learning techniques, which rely heavily on statistical methods, enable researchers to extract valuable insights from large volumes of data. This is particularly relevant in information science, where researchers may need to analyze large datasets of user interactions, online content, or social media data. For example, statistical analysis of user search queries can reveal emerging trends in information-seeking behavior.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Facilitating the Communication of Research Findings</h3>
            <p>Statistical tools facilitate the communication of research findings by providing a standardized language and framework for presenting data. Statistical tables, graphs, and charts are used to summarize and visualize data, making it easier for researchers to communicate their findings to a wider audience. Statistical tests and confidence intervals provide a means of quantifying the uncertainty associated with research findings, ensuring that the results are interpreted correctly. By using statistical tools to present their findings, researchers can enhance the clarity, transparency, and credibility of their research.</p>
          </div>
        </section>

        {/* ========== SECTION 3: HOW CENTRAL TENDENCY IS MEASURED ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Demonstrating How Central Tendency is Measured</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Understanding Central Tendency</h3>
            <p>Central tendency is a statistical measure that identifies a single value that attempts to describe the center of a data set. It aims to provide a representative value that summarizes the typical or average value of a distribution. The three primary measures of central tendency are the mean, median, and mode, each of which provides a different perspective on the central value of the data. The choice of which measure to use depends on the nature of the data and the research question. Central tendency is essential for understanding the overall distribution of data and for making comparisons between different data sets.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hash size={20} /> Mean (Arithmetic Average)</h3>
            <p>The mean, often referred to as the average, is calculated by summing all the values in a data set and dividing by the total number of values. It is the most commonly used measure of central tendency, particularly for interval or ratio data that is symmetrically distributed. The mean is sensitive to extreme values or outliers, which can significantly influence its value. For example, if we have a data set representing the number of books borrowed by library patrons in a week: {'5, 7, 8, 10, 15'}, the mean is calculated as (5 + 7 + 8 + 10 + 15) / 5 = 9. However, if we add an outlier, like 50, to the data set {'5, 7, 8, 10, 15, 50'}, the mean becomes (5 + 7 + 8 + 10 + 15 + 50) / 6 = 15.83, demonstrating the sensitivity of the mean to extreme values. The mean is valuable for providing a balanced representation of the data when it is not heavily skewed.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Median (Middle Value)</h3>
            <p>The median is the middle value in a data set when the values are arranged in ascending or descending order. If the data set has an even number of values, the median is the average of the two middle values. The median is a robust measure of central tendency that is not affected by extreme values or outliers. It is particularly useful for ordinal or skewed data, where the mean may not be a representative measure. For example, in the data set {'5, 7, 8, 10, 15'}, the median is 8, as it is the middle value. In the data set {'5, 7, 8, 10, 15, 50'}, the median is (8 + 10) / 2 = 9, demonstrating its resistance to the outlier 50. The median provides a more accurate representation of the central value when the data is skewed or contains outliers.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Mode (Most Frequent Value)</h3>
            <p>The mode is the value that appears most frequently in a data set. A data set can have one mode (unimodal), two modes (bimodal), or multiple modes (multimodal). The mode is particularly useful for nominal or categorical data, where the mean and median are not applicable. It provides information about the most common value or category in the data set. For example, in a data set representing the preferred genre of books among library patrons: {'Fiction, Fiction, Non-Fiction, Mystery, Fiction, Mystery, Romance'}, the mode is Fiction, as it appears most frequently. The mode is valuable for identifying the most typical or common value in a data set, especially when dealing with categorical data.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Illustrative Example</h3>
            <p>Consider a data set representing the number of digital articles accessed by a group of researchers in a month: {'10, 12, 15, 15, 18, 20, 25'}.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The mean is calculated as (10 + 12 + 15 + 15 + 18 + 20 + 25) / 7 = 16.43.</li>
              <li>The median is 15, as it is the middle value when the data is arranged in ascending order.</li>
              <li>The mode is 15, as it appears most frequently in the data set.</li>
            </ul>
            <p className="mt-2">This example demonstrates how the mean, median, and mode can provide different perspectives on the central value of a data set. The choice of which measure to use depends on the research question and the characteristics of the data.</p>
          </div>
        </section>

        {/* ========== SECTION 4: ANALYSIS OF SCALES OF MEASUREMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Analysis of Scales of Measurement</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Introduction to Scales of Measurement</h3>
            <p>Scales of measurement are fundamental concepts in statistics and research methodology, as they determine the type of statistical analysis that can be applied to data. They categorize data based on the properties of the values assigned to variables. Understanding the different scales of measurement is crucial for researchers to select appropriate statistical techniques and draw valid conclusions from their data. There are four primary scales of measurement: nominal, ordinal, interval, and ratio. Each scale possesses distinct characteristics that influence the interpretation and analysis of data.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hash size={20} /> Nominal Scale</h3>
            <p>The nominal scale is the most basic level of measurement, used for categorical data where values are assigned to name or label categories without any inherent order or ranking. Nominal data is qualitative in nature, and the values assigned are used for identification or classification purposes only. Examples of nominal data include gender (male, female), eye color (blue, brown, green), and types of documents (reports, letters, memos). Statistical analyses that can be applied to nominal data are limited to frequency counts, percentages, and mode calculations. Researchers can use nominal data to categorize and summarize data, but they cannot perform arithmetic operations or determine the magnitude of differences between categories. For example, a librarian might use nominal data to categorize books by genre, but they cannot say that one genre is "greater than" another.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Ordinal Scale</h3>
            <p>The ordinal scale involves categorical data that can be ranked or ordered, but the intervals between the ranks are not equal or meaningful. Ordinal data indicates relative position or order, but it does not provide information about the magnitude of differences between ranks. Examples of ordinal data include educational attainment (high school, bachelor's, master's, doctoral), customer satisfaction ratings (very dissatisfied, dissatisfied, neutral, satisfied, very satisfied), and levels of information literacy (beginner, intermediate, advanced). Statistical analyses that can be applied to ordinal data include frequency counts, percentages, mode, median, and non-parametric tests. Researchers can use ordinal data to determine the relative order of categories, but they cannot perform arithmetic operations or calculate meaningful differences between ranks. For instance, a user satisfaction survey could collect ordinal data, showing that one user is more satisfied than another, but it cannot quantify how much more satisfied they are.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Interval Scale</h3>
            <p>The interval scale involves numerical data where the intervals between values are equal and meaningful, but there is no true zero point. This means that arithmetic operations, such as addition and subtraction, can be performed on interval data, but ratio comparisons are not meaningful. Examples of interval data include temperature measured in Celsius or Fahrenheit, and calendar years. The absence of a true zero point means that a value of zero does not indicate the absence of the measured attribute. For example, a temperature of 0 degrees Celsius does not mean the absence of temperature. Statistical analyses that can be applied to interval data include frequency counts, percentages, mode, median, mean, standard deviation, and parametric tests. Researchers can use interval data to calculate meaningful differences between values, but they cannot make ratio comparisons. For example, one can say that the difference between 20 degrees and 30 degrees is the same as the difference between 30 degrees and 40 degrees, but one cannot say that 40 degrees is twice as hot as 20 degrees.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> Ratio Scale</h3>
            <p>The ratio scale is the highest level of measurement, involving numerical data where the intervals between values are equal and meaningful, and there is a true zero point. This means that all arithmetic operations, including ratio comparisons, can be performed on ratio data. A true zero point indicates the absence of the measured attribute. Examples of ratio data include height, weight, age, income, and the number of books borrowed from a library. Statistical analyses that can be applied to ratio data include all statistical techniques, including frequency counts, percentages, mode, median, mean, standard deviation, parametric tests, and ratio comparisons. Researchers can use ratio data to calculate meaningful differences between values and make ratio comparisons. For example, one can say that someone who is 6 feet tall is twice as tall as someone who is 3 feet tall, or that someone who borrowed 10 books borrowed twice as many as someone who borrowed 5 books.</p>
          </div>
        </section>

        {/* ========== SECTION 5: APPLYING STATISTICS IN RESEARCH ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applying Statistics in Research</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Descriptive Statistics</h3>
            <p>Descriptive statistics are used to summarize and describe the main features of a dataset. They provide a concise overview of the data, allowing researchers to understand the distribution, central tendency, and variability of variables. These statistics are essential for presenting data in a meaningful way and for identifying patterns or trends. Common descriptive statistics include measures of central tendency (mean, median, mode), measures of dispersion (standard deviation, variance, range), and measures of shape (skewness, kurtosis). For instance, in a study examining library usage, descriptive statistics could be used to calculate the average number of books borrowed per month, the range of patron ages, or the most frequently used library resources. Researchers can also use graphical representations, such as histograms, bar charts, and pie charts, to visually present descriptive statistics and enhance the understanding of data. Descriptive statistics are the foundation of understanding any data set.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Relational Statistics (Correlational Statistics)</h3>
            <p>Relational statistics, often referred to as correlational statistics, are used to examine the relationships between two or more variables. They help researchers understand the strength and direction of associations between variables, but they do not establish cause-and-effect relationships. Correlation coefficients, such as Pearson's r and Spearman's rho, are commonly used to quantify the strength and direction of linear relationships. For example, in a study exploring the relationship between online search skills and academic performance, relational statistics could be used to determine the correlation between students' search skills scores and their grade point averages. Scatter plots can visually represent the relationship between two variables, providing insights into the patterns of association. Relational statistics are valuable for identifying potential predictors or risk factors, but they should be interpreted with caution, as correlation does not imply causation. These types of statistics are used when you have two or more variables, and want to know how they relate to each other.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Inferential Statistics</h3>
            <p>Inferential statistics are used to draw conclusions about a population based on data from a sample. They allow researchers to generalize findings from a sample to a larger group, providing a basis for making predictions and decisions. Hypothesis testing is a key component of inferential statistics, where researchers use statistical tests to determine whether observed differences or relationships are statistically significant. Common inferential statistics include t-tests, ANOVA, chi-square tests, and regression analysis. For instance, in a study comparing the effectiveness of two different information retrieval systems, inferential statistics could be used to determine whether there is a statistically significant difference in user performance between the two systems. Confidence intervals and p-values are used to quantify the uncertainty associated with statistical inferences, ensuring that researchers can assess the reliability of their findings. Inferential statistics are crucial for making evidence-based decisions and drawing valid conclusions from sample data.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Multiple Statistics (Multivariate Statistics)</h3>
            <p>Multiple statistics, also known as multivariate statistics, are used to analyze complex datasets involving multiple variables simultaneously. They allow researchers to explore the relationships between multiple independent and dependent variables, providing insights into the complex interactions and patterns within the data. Multivariate statistical techniques include multiple regression, factor analysis, cluster analysis, and discriminant analysis. For example, in a study examining the factors that influence information-seeking behavior, multiple regression could be used to determine the relative contribution of multiple variables, such as age, education level, and internet access, to information-seeking behavior. Factor analysis could be used to identify underlying dimensions or factors that explain the variability in information-seeking behavior. Cluster analysis could be used to identify groups of individuals with similar information-seeking patterns. Multivariate statistics are essential for analyzing complex data sets and for developing comprehensive models of phenomena. They provide a more holistic understanding of the research topic, allowing researchers to explore the interplay of multiple variables and to identify complex patterns that might be missed with simpler statistical techniques.</p>
          </div>
        </section>

        {/* ========== SECTION 6: RELIABILITY AND VALIDITY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Reliability and Validity in Research</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Reliability</h3>
            <p>Reliability refers to the consistency and stability of measurement. A reliable measurement tool produces consistent results when applied repeatedly to the same individuals or objects under similar conditions. In essence, it answers the question: "Can we trust the consistency of the results?" If a research instrument, such as a questionnaire or test, yields similar scores or observations across multiple administrations or by different researchers, it is considered reliable. Reliability is crucial for ensuring that research findings are stable and replicable. For example, if a library uses a survey to assess patron satisfaction, the survey should produce consistent results when administered to the same group of patrons at different times, assuming no significant changes in library services. Different forms of reliability can be assessed, including test-retest reliability (consistency over time), inter-rater reliability (consistency across observers), and internal consistency reliability (consistency among items within a test). High reliability indicates that the measurement tool is free from random errors and provides stable and dependable data.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Validity</h3>
            <p>Validity, on the other hand, refers to the accuracy and appropriateness of a measurement tool. It addresses the question: "Are we measuring what we intend to measure?" A valid measurement tool accurately reflects the construct or concept it is designed to measure. Validity is essential for ensuring that research findings are meaningful and relevant. It is possible for a measurement tool to be reliable but not valid. For example, a scale might consistently report the same weight for an object (reliable), but if the scale is calibrated incorrectly, the weight might be inaccurate (not valid). Different forms of validity can be assessed, including content validity (the extent to which the measurement tool covers all aspects of the construct), criterion-related validity (the extent to which the measurement tool correlates with other relevant measures), and construct validity (the extent to which the measurement tool accurately reflects the theoretical construct). Construct validity is often considered the most important form of validity, as it ensures that the measurement tool is measuring the intended theoretical concept. In information science, validity might be assessed by ensuring that a test of information literacy skills accurately measures the theoretical concept of information literacy, rather than related concepts such as general knowledge or reading comprehension. Validity provides the assurance that the research is truly measuring the intended variables.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> The Interplay Between Reliability and Validity</h3>
            <p>Reliability and validity are interrelated but distinct concepts. Reliability is a necessary but not sufficient condition for validity. A measurement tool can be reliable without being valid, but it cannot be valid without being reliable. In other words, consistent results do not guarantee accurate measurement. However, if a measurement tool is not reliable, it cannot be valid. Researchers must strive to achieve both reliability and validity in their research to ensure that their findings are trustworthy and meaningful. The relationship is often described with the analogy of a target. High reliability is like consistently hitting the same spot on the target, while high validity is like consistently hitting the bullseye. Ideally, a measurement tool should consistently hit the bullseye.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Importance in Research</h3>
            <p>Both reliability and validity are critical for ensuring the quality and trustworthiness of research. Without reliable and valid measurement, research findings may be inaccurate, misleading, or irrelevant. Researchers must carefully select and evaluate their measurement tools to ensure that they meet the standards of reliability and validity. This involves using established and validated instruments, conducting pilot studies, and employing appropriate statistical techniques. The rigor with which reliability and validity are assessed directly influences the credibility and impact of research.</p>
          </div>
        </section>

        {/* ========== SECTION 7: ATTAINING VALIDITY AND RELIABILITY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Attaining Validity and Reliability of Information Gathered in Research</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SettingsIcon size={20} /> Attaining Reliability through Rigorous Methodological Practices</h3>
            <p>Researchers attain reliability in their gathered information through meticulous adherence to standardized procedures and consistent measurement practices. This involves developing clear and unambiguous research protocols that outline the steps for data collection, ensuring that all researchers or data collectors follow the same procedures. For quantitative research, this may include using standardized questionnaires, calibrated instruments, and well-defined coding schemes. In qualitative research, reliability can be enhanced through the use of detailed interview protocols, consistent coding procedures, and the establishment of inter-rater reliability. Test-retest reliability, which involves administering the same instrument to the same participants at different times, can also be used to assess the stability of measurements over time. For example, in a study analyzing user behavior on a library website, researchers can ensure reliability by using consistent methods for tracking website traffic, defining user interactions, and coding observational data. Regular checks on the data collection process, such as inter-rater reliability checks or internal consistency assessments, can help to identify and address any inconsistencies or errors. By maintaining consistency and stability in their measurement practices, researchers can minimize random errors and enhance the reliability of their findings.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Establishing Validity through Careful Instrument Design and Validation</h3>
            <p>Researchers establish validity by ensuring that their measurement instruments accurately reflect the constructs they intend to measure. This involves a rigorous process of instrument design and validation. Content validity, which assesses whether the instrument adequately covers all aspects of the construct, can be established through expert review and pilot testing. Criterion-related validity, which examines the correlation between the instrument and other relevant measures, can be assessed by comparing the instrument's scores with established criteria or benchmarks. Construct validity, which evaluates whether the instrument accurately reflects the theoretical construct, can be assessed through factor analysis, convergent validity, and discriminant validity. For example, when developing a questionnaire to measure information literacy skills, researchers must ensure that the questions accurately reflect the various dimensions of information literacy, such as the ability to locate, evaluate, and use information. Pilot testing the questionnaire with a representative sample of participants can help to identify any unclear or ambiguous questions. Researchers can also compare the questionnaire's scores with other measures of information literacy or academic performance to assess criterion-related validity. By carefully designing and validating their measurement instruments, researchers can enhance the accuracy and appropriateness of their findings.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Enhancing Validity through Triangulation and Multiple Data Sources</h3>
            <p>Triangulation, which involves using multiple data sources or methods to investigate a research question, can enhance the validity of research findings. By combining data from different sources, such as interviews, surveys, and observations, researchers can obtain a more comprehensive and nuanced understanding of the research topic. Triangulation can help to confirm or refute findings from a single data source, increasing the confidence in the overall conclusions. For example, in a study examining the impact of a new library program, researchers might combine data from patron surveys, staff interviews, and program attendance records. This multifaceted approach helps to mitigate the limitations of any single data source and enhances the credibility of the research. Researchers should also strive to use data sources that are relevant, credible, and representative of the population being studied.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Addressing Potential Sources of Bias and Error</h3>
            <p>Researchers must be vigilant in identifying and addressing potential sources of bias and error that can compromise the validity and reliability of their findings. This involves carefully considering the research design, sampling methods, and data collection procedures. Researchers should also be aware of their own biases and assumptions and take steps to minimize their influence on the research process. For example, in a study involving interviews, researchers should use open-ended questions and avoid leading or biased language. Researchers should also strive to minimize non-response bias by implementing strategies to increase response rates, such as sending reminders or offering incentives. By addressing potential sources of bias and error, researchers can enhance the trustworthiness and credibility of their research.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Maintaining Transparency and Documentation</h3>
            <p>Transparency and thorough documentation are essential for ensuring the validity and reliability of research findings. Researchers should provide clear and detailed descriptions of their research methods, data collection procedures, and analysis techniques. This allows other researchers to replicate the study and evaluate the quality of the findings. Researchers should also maintain accurate records of their data and analysis, ensuring that the research process is auditable and verifiable. For example, researchers should document the sampling frame, the response rate, and any deviations from the research protocol. By maintaining transparency and documentation, researchers can enhance the credibility and accountability of their research.</p>
          </div>
        </section>

        {/* ========== SECTION 8: ANALYZING RESEARCH STATISTICAL DATA USING SPSS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Analyzing Research Statistical Data Using Statistical Package for Social Science (SPSS)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Data Entry and Preparation in SPSS</h3>
            <p>The initial step in analyzing research statistical data using SPSS involves entering and preparing the data for analysis. This process is crucial, as the accuracy and reliability of the subsequent statistical analyses depend on the quality of the data. Data entry typically involves creating variables in the SPSS Data Editor, defining their properties (e.g., variable type, label, values), and then inputting the raw data. SPSS allows for various data formats, including numeric, string, and date, providing flexibility for different types of research data. Once the data is entered, researchers must clean and prepare it for analysis. This involves checking for errors, inconsistencies, and missing values. SPSS provides several tools for data cleaning, such as frequency distributions, descriptive statistics, and data validation procedures. Researchers can use these tools to identify and correct errors, recode variables, and create new variables as needed. Data preparation also includes transforming variables, such as creating composite scores or standardizing data, to meet the assumptions of specific statistical tests. For instance, if a researcher is analyzing survey data on library patron satisfaction, they might recode categorical variables, such as "satisfaction level," into numerical values, and then create a composite score for overall satisfaction.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Descriptive Statistical Analysis in SPSS</h3>
            <p>SPSS offers a wide range of descriptive statistical procedures that allow researchers to summarize and describe the main features of their data. Researchers can use these procedures to calculate measures of central tendency (mean, median, mode), measures of dispersion (standard deviation, variance, range), and measures of shape (skewness, kurtosis). SPSS also provides tools for creating frequency distributions, histograms, bar charts, and other graphical representations of data. These descriptive statistics provide a concise overview of the data, allowing researchers to understand the distribution, central tendency, and variability of variables. For example, a librarian conducting a study on book borrowing patterns can use SPSS to calculate the average number of books borrowed per month, the range of borrowing frequency, and the most frequently borrowed genres. Graphical representations, such as histograms and bar charts, can visually display the distribution of book borrowings and patron demographics. Descriptive statistics are essential for understanding the basic characteristics of the data and for identifying potential areas for further investigation.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Inferential Statistical Analysis in SPSS</h3>
            <p>SPSS is a powerful tool for conducting inferential statistical analysis, which involves drawing conclusions about a population based on data from a sample. Researchers can use SPSS to perform a variety of statistical tests, such as t-tests, ANOVA, chi-square tests, and regression analysis, to test hypotheses and determine whether observed differences or relationships are statistically significant. T-tests, for example, are used to compare the means of two groups, while ANOVA is used to compare the means of multiple groups. Chi-square tests are used to analyze categorical data and assess the association between variables. Regression analysis is used to model the relationship between a dependent variable and one or more independent variables. SPSS provides options for conducting both parametric and non-parametric tests, allowing researchers to select the appropriate test based on the characteristics of their data. For instance, in a study comparing the effectiveness of two different online library catalogs, researchers can use an independent samples t-test to determine whether there is a statistically significant difference in search efficiency between the two catalogs.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Relational Statistical Analysis in SPSS</h3>
            <p>SPSS is very useful for relational statistical analysis, which is used to examine relationships between two or more variables. Correlation coefficients, such as Pearson's r and Spearman's rho, can be calculated to quantify the strength and direction of linear relationships between variables. Scatter plots can be used to visualize the relationship between two variables, providing insights into the patterns of association. SPSS also provides tools for conducting partial correlation analysis, which allows researchers to control for the effects of extraneous variables. Relational statistics are valuable for identifying potential predictors or risk factors, but they should be interpreted with caution, as correlation does not imply causation. For example, a researcher might use SPSS to analyze the correlation between the number of library visits and academic performance, or to examine the relationship between online search skills and job satisfaction.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Advanced Statistical Analysis in SPSS</h3>
            <p>SPSS offers a range of advanced statistical procedures for analyzing complex datasets. These include multivariate statistical techniques, such as multiple regression, factor analysis, cluster analysis, and discriminant analysis. Multiple regression is used to model the relationship between a dependent variable and multiple independent variables. Factor analysis is used to identify underlying dimensions or factors that explain the variability in a set of variables. Cluster analysis is used to identify groups of individuals or cases that are similar to each other. Discriminant analysis is used to classify individuals or cases into different groups based on their characteristics. These advanced statistical techniques allow researchers to explore complex interactions and patterns within their data, providing a more comprehensive understanding of the research topic. SPSS also provides options for conducting time series analysis, survival analysis, and other specialized statistical procedures. Researchers can use SPSS to build and test complex statistical models, providing valuable insights into the phenomena they are studying.</p>
          </div>
        </section>

        {/* ========== SECTION 9: APPLYING QUANTITATIVE AND QUALITATIVE DATA ANALYSIS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applying Quantitative and Qualitative Data Analysis in Research</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Quantitative Data Analysis</h3>
            <p>Quantitative data analysis involves the systematic examination of numerical data to identify patterns, trends, and relationships. This approach is characterized by its emphasis on objectivity, precision, and statistical rigor. Researchers utilize statistical techniques to summarize, describe, and infer from numerical data, allowing them to draw conclusions about populations or test hypotheses. Descriptive statistics, such as means, medians, and standard deviations, provide a concise overview of the data's central tendency and variability. Inferential statistics, such as t-tests, ANOVA, and regression analysis, enable researchers to make generalizations from sample data to larger populations and to determine the statistical significance of observed effects. For example, in a study investigating the impact of digital resource usage on student academic performance, quantitative data analysis might involve collecting data on students' grades and their frequency of using online databases. Statistical techniques, such as correlation analysis or regression analysis, could then be used to determine the strength and direction of the relationship between these variables. Software packages like SPSS or R facilitate the execution of these statistical analyses, allowing researchers to efficiently process and interpret large datasets. The goal of quantitative analysis is to provide evidence-based conclusions that are generalizable and replicable.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Qualitative Data Analysis</h3>
            <p>Qualitative data analysis focuses on the exploration and interpretation of non-numerical data, such as text, images, and audio recordings, to gain a deeper understanding of meanings, experiences, and perspectives. This approach is characterized by its emphasis on subjectivity, context, and the richness of human experience. Researchers employ various techniques, such as thematic analysis, content analysis, and narrative analysis, to identify patterns, themes, and insights within qualitative data. Thematic analysis involves identifying recurring themes or patterns in the data, while content analysis focuses on quantifying the presence of specific words or concepts. Narrative analysis explores the stories and experiences of individuals or groups. For instance, in a study examining librarians' perceptions of digital archiving challenges, qualitative data analysis might involve conducting in-depth interviews and analyzing the transcripts to identify common themes related to technological, organizational, and ethical issues. Researchers might use coding to categorize and organize the data, and then develop a thematic framework to summarize the key findings. Qualitative data analysis is an iterative process, involving repeated cycles of data exploration and interpretation. The goal is to develop a rich and nuanced understanding of the research topic, capturing the complexity and diversity of human experiences.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Integrating Quantitative and Qualitative Data Analysis (Mixed Methods)</h3>
            <p>In many research studies, integrating quantitative and qualitative data analysis, known as mixed methods research, can provide a more comprehensive and insightful understanding of the research topic. This approach allows researchers to combine the strengths of both quantitative and qualitative methods, enhancing the validity and reliability of their findings. Quantitative data can provide a broad overview of patterns and trends, while qualitative data can provide in-depth insights into the underlying mechanisms and meanings. For example, a researcher might use a survey to collect quantitative data on library patron satisfaction and then conduct focus group discussions to explore the reasons behind the satisfaction levels. This integrated approach can provide a more complete picture of patron experiences and inform targeted service improvements. Mixed methods research can involve various designs, such as convergent parallel design, explanatory sequential design, and exploratory sequential design, depending on the research objectives and the relationship between the quantitative and qualitative components. The aim is to achieve triangulation, where different data sources and methods converge to provide a more robust and credible understanding of the research topic.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> The Importance of Context and Interpretation</h3>
            <p>Both quantitative and qualitative data analysis require careful consideration of context and interpretation. In quantitative research, researchers must be mindful of the assumptions underlying statistical tests and the limitations of their data. In qualitative research, researchers must be aware of their own biases and assumptions and strive to provide a transparent and reflexive account of their interpretation process. Researchers should also consider the ethical implications of their research and ensure that their findings are presented in a responsible and unbiased manner. The rigor and credibility of data analysis depend on the researcher's ability to critically evaluate their data, consider alternative interpretations, and provide a clear and compelling argument for their conclusions.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Statistics in Research</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Statistics Definition</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Central Tendency</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Scales of Measurement</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reliability & Validity</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">SPSS</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Research Statistics. 📊📈</p>
        </footer>

      </div>
    </div>
  );
};