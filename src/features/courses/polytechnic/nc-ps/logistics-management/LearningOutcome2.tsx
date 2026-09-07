import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon,
  MessageCircle, Globe, Currency, Truck as TruckIcon2, CheckSquare, Gavel, Lock, Leaf, Heart,
  Droplet, Flame, Zap as ZapIcon, Factory as FactoryIcon, ShoppingCart, Award, FileText as FileTextIcon, CreditCard, Shield as ShieldIcon, RefreshCw, Save,
  Flame as FlameIcon, Droplet as DropletIcon, Wheat, Coffee, Beef, Banknote, FileCode,
  CreditCard as CreditCardIcon, DollarSign as DollarSignIcon, Clock, FileText as FileTextIcon2, BadgeCheck, Link, Database as DatabaseIcon, Receipt as ReceiptIcon,
  Building2, Landmark, Globe2, HandshakeIcon, Truck as TruckIcon3, ShieldAlert, Scale as ScaleIcon, BookOpenCheck, UserCheck, Rocket,
  FilePlus, FileSearch as FileSearchIcon, FileText as FileTextIcon3, FileCheck as FileCheckIcon, FileSignature, FileMinus, FilePlus as FilePlusIcon, FileSpreadsheet,
  PackageOpen, Boxes, Weight, Ruler, Thermometer, Wrench, Hand, Calendar, Clipboard as ClipboardIcon,
  TrainFront, Ship as ShipIcon,Truck as TruckIcon4, Fuel, Coins as CoinsIcon, PiggyBank,
  GanttChart, ArrowUpDown, AlertCircle, Bell, Phone, Mail,
  HardHat, Construction, Ambulance, Flame as FlameIcon2,
  ShoppingBag, Barcode,
  Calculator, ReceiptText, Percent, ChartNoAxesCombined, ChartColumn, Coins as CoinsIcon2, Landmark as LandmarkIcon, 
  Gauge, Route, MapPin, DollarSign as DollarSignIcon2, Fuel as FuelIcon, Car, Train, Ship as ShipIcon2, Plane as PlaneIcon2
} from 'lucide-react';

export const LearningOutcome2: React.FC = () => {
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Costing & <span className="text-sky-300 font-bold italic">Pricing Methods</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to costing methods, pricing strategies, cost classification, exchange rates, fuel management, freight costs, tariffs, and payment terms.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">costing_pricing.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CALCULATE</span><span className="text-white">Costs;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Pricing;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CLASSIFY</span><span className="text-white">Expenses;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Calculator className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><DollarSign className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: INTRODUCTION ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Costing and pricing methods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Costing and pricing methods are fundamental to any business, determining how much it costs to produce a product or service and how much to charge customers for it. These methods directly impact profitability, competitiveness, and overall business success. Let's break down the key concepts:</p>
          </div>
        </section>

        {/* ========== SECTION 2: COSTING METHODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Costing Methods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Costing methods are used to determine the total cost of producing a product or service. This information is essential for pricing decisions, inventory valuation, and performance evaluation.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Job Costing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method is used when products or services are unique or customized. Costs are tracked for each individual job or project. Examples include construction projects, custom furniture manufacturing, and consulting services.</li>
              <li>Each job is treated as a separate cost object, and direct materials, direct labour, and overhead costs are assigned to it.</li>
              <li>This method provides detailed cost information for each specific job.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FactoryIcon size={20} /> Process Costing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method is used when products are mass-produced and homogeneous. Costs are accumulated for each production process or department. Examples include chemical manufacturing, food processing, and oil refining.</li>
              <li>Costs are averaged across all units produced in a given period.</li>
              <li>This method is simpler than job costing but provides less detailed cost information.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Activity-Based Costing (ABC)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method assigns costs to products or services based on the activities they consume. It recognizes that overhead costs are often driven by activities, not just production volume.</li>
              <li>ABC identifies and assigns costs to activities, and then assigns activity costs to products or services based on their consumption of those activities.</li>
              <li>This method provides more accurate cost information than traditional costing methods, especially for businesses with complex overhead structures.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PieChart size={20} /> Variable Costing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method only includes variable manufacturing costs when calculating the cost of a product. Fixed manufacturing overhead is treated as a period expense.</li>
              <li>This costing method is most often used for internal management decisions.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ScaleIcon size={20} /> Absorption Costing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method includes both variable and fixed manufacturing costs when calculating the cost of a product. This is the method most often used for external financial reporting.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: PRICING METHODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Pricing Methods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Pricing methods are used to determine the selling price of a product or service. The goal is to set a price that is both profitable and competitive.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calculator size={20} /> Cost-Plus Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves adding a markup to the cost of producing a product or service. The markup is intended to cover overhead costs and generate a profit.</li>
              <li>This method is simple and easy to use, but it may not be optimal in competitive markets.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Competitive Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves setting prices based on the prices charged by competitors. Businesses may choose to match, undercut, or exceed competitor prices.</li>
              <li>This method is commonly used in highly competitive markets.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Value-Based Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves setting prices based on the perceived value of the product or service to the customer.</li>
              <li>This method requires a deep understanding of customer needs and preferences.</li>
              <li>This method is used when the product has a very high perceived value.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Demand-Based Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves setting prices based on the level of demand for the product or service. Prices may be higher when demand is high and lower when demand is low.</li>
              <li>This method is commonly used for seasonal products or services.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Rocket size={20} /> Penetration Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves setting a low initial price to gain market share quickly.</li>
              <li>This method is often used for new products or services.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Skimming Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves setting a high initial price to maximize profits from early adopters.</li>
              <li>This method is often used for innovative or luxury products.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Dynamic Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This method involves adjusting prices in real-time based on factors such as demand, competition, and customer behaviour.</li>
              <li>This method is commonly used in e-commerce and travel industries.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: COST CLASSIFICATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Cost Classification</h2>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">By Behaviour</h3>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Fixed Costs</h4>
            <p>Fixed costs are those expenses that remain remarkably consistent in total, regardless of fluctuations in production volume or activity levels, within a defined relevant range. This means that whether a company produces 100 units or 1,000 units, the total fixed costs will generally stay the same. Examples of fixed costs include rent for a manufacturing facility, salaries of permanent staff, and insurance premiums. These costs are often associated with long-term commitments or investments and are not easily adjusted in the short term. While the total fixed cost remains constant, it's important to note that the fixed cost per unit decreases as production increases. This is because the fixed cost is spread over a larger number of units. This characteristic of fixed costs can have significant implications for profitability, as higher production volumes can lead to lower per-unit costs and increased profit margins. Understanding fixed costs is crucial for budgeting, forecasting, and making informed decisions about production capacity.</p>
          </div>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Variable Costs</h4>
            <p>Variable costs, in contrast to fixed costs, exhibit a direct and proportional relationship with changes in production volume or activity levels. This means that as production increases, total variable costs increase, and as production decreases, total variable costs decrease. Examples of variable costs include direct materials, direct labour, and sales commissions. Direct materials, for instance, are the raw materials that are directly incorporated into the finished product, and their cost varies with the number of units produced. Direct labour represents the wages paid to workers directly involved in the production process, and these costs also fluctuate with production volume. The key characteristic of variable costs is that while the total variable cost changes, the variable cost per unit remains constant. This means that each unit produced incurs the same variable cost, regardless of the overall production volume. Understanding variable costs is essential for determining the break-even point, calculating contribution margins, and making informed decisions about pricing and production levels.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Mixed Costs (Semi-Variable Costs)</h4>
            <p>Mixed costs, also known as semi-variable costs, present a unique challenge in cost analysis as they contain both fixed and variable components. These costs exhibit a base level of expense that remains constant, regardless of activity levels, and a component that varies with changes in production or activity. A classic example is a telephone bill, which typically includes a fixed monthly charge for basic service and a variable charge based on usage. For accurate cost analysis and decision-making, it's crucial to separate mixed costs into their fixed and variable components. This can be achieved using various methods, such as the high-low method or regression analysis. By segregating mixed costs, businesses can gain a clearer understanding of their cost structure and make more informed decisions about pricing, production, and resource allocation. This separation is very important for accurate budgeting.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">By Function</h3>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FactoryIcon size={20} /> Manufacturing Costs</h4>
            <p>Manufacturing costs are those expenses directly associated with the production of goods. They encompass all costs incurred in the process of transforming raw materials into finished products. These costs are typically classified into three categories: direct materials, direct labour, and manufacturing overhead. Direct materials are the raw materials that become an integral part of the finished product and can be traced directly to it. Direct labour represents the wages paid to workers directly involved in the production process. Manufacturing overhead includes all other manufacturing costs that are not direct materials or direct labour, such as indirect materials, indirect labour, and factory rent. These costs are essential for determining the cost of goods manufactured and the cost of goods sold. Accurate tracking and allocation of manufacturing costs are crucial for inventory valuation, pricing decisions, and performance evaluation.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Selling and Administrative Costs</h4>
            <p>Selling and administrative costs are those expenses related to the selling and administrative functions of the business. These costs are not directly associated with the production of goods but are essential for the overall operation of the company. Selling expenses are costs incurred in marketing and selling products, such as advertising, sales commissions, and shipping. Administrative expenses are costs incurred in the general management of the business, such as salaries of administrative staff, office rent, and legal fees. These costs are typically treated as period costs and are expensed in the period in which they are incurred. Understanding selling and administrative costs is essential for budgeting, forecasting, and making informed decisions about marketing, sales, and administrative operations.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">By Traceability</h3>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Direct Costs</h4>
            <p>Direct costs are those expenses that can be directly traced to a specific cost object, such as a product, department, or project. These costs are easily identified and assigned to the cost object without the need for allocation. Examples of direct costs include direct materials and direct labour. For instance, the cost of lumber used to build a table is a direct cost of the table. Similarly, the wages paid to the workers who assemble the table are direct labour costs. Direct costs are essential for determining the profitability of specific cost objects and making informed decisions about pricing and product mix.</p>
          </div>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Indirect Costs</h4>
            <p>Indirect costs, in contrast to direct costs, cannot be directly traced to a specific cost object. These costs are often shared among multiple cost objects and require allocation to be assigned. Examples of indirect costs include manufacturing overhead and administrative expenses. For instance, factory rent is an indirect cost of the products manufactured in the factory, as it is difficult to trace the rent to specific products. Similarly, the salary of the company's CEO is an administrative expense that cannot be directly traced to any specific product. Indirect costs are typically allocated to cost objects using an allocation base, such as direct labour hours or machine hours. Accurate allocation of indirect costs is crucial for determining the total cost of cost objects and making informed decisions about pricing and resource allocation.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">By Time Period</h3>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Product Costs</h4>
            <p>Product costs are those expenses associated with the production of goods and are included in the cost of inventory. These costs are typically classified as direct materials, direct labour, and manufacturing overhead. Product costs are initially recorded as inventory assets and are expensed as cost of goods sold when the inventory is sold. This matching of product costs with sales revenue is essential for accurate income measurement. Understanding product costs is crucial for inventory valuation, pricing decisions, and performance evaluation.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><ClockIcon size={20} /> Period Costs</h4>
            <p>Period costs are those expenses that are not associated with the production of goods and are expensed in the period in which they are incurred. These costs are typically classified as selling and administrative expenses. Period costs are not included in the cost of inventory and are not matched with sales revenue. Understanding period costs is essential for budgeting, forecasting, and making informed decisions about selling and administrative operations.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">By Relevance to Decision-Making</h3>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Relevant Costs</h4>
            <p>Relevant costs are those future costs that differ between alternative courses of action. These costs are considered in making decisions, as they have a direct impact on the outcome of the decision. For instance, if a company is considering whether to accept a special order, the relevant costs would be the incremental costs associated with producing and delivering the special order. Relevant costs are essential for making informed decisions about pricing, production, and resource allocation.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><XCircle size={20} /> Irrelevant Costs</h4>
            <p>Irrelevant costs are those costs that do not differ between alternative courses of action or are sunk costs (costs that have already been incurred and cannot be recovered). These costs are not considered in decision-making, as they have no impact on the outcome of the decision. For instance, the original cost of a machine that has already been purchased is a sunk cost and is irrelevant to the decision of whether to replace the machine. Irrelevant costs should be ignored when making decisions, as they can lead to biased or incorrect conclusions.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowRightCircle size={20} /> Opportunity Costs</h4>
            <p>Opportunity cost is the potential benefit that is given up when one alternative is selected over another. It represents the value of the next best alternative that is forgone. For instance, if a company chooses to invest in a new product line, the opportunity cost would be the potential profit that could have been earned from investing in a different product line. Opportunity costs are often difficult to quantify but are essential for making informed decisions about resource allocation.</p>
          </div>
        </section>

        {/* ========== SECTION 5: EXCHANGE RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Exchange Rates of Currencies</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Exchange rates are the values of one currency relative to another. They determine how much of one currency you can get for another. These rates fluctuate constantly due to a variety of economic and political factors. Understanding exchange rates is crucial for businesses engaged in international trade, as they directly impact the cost of imports and exports, as well as the value of foreign assets.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Factors Affecting Exchange Rates:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Economic Indicators:</strong> Factors like inflation rates, interest rates, and GDP growth influence a currency's value. Higher interest rates can attract foreign investment, increasing demand for a currency and driving up its value. Conversely, high inflation can weaken a currency.</li>
              <li><strong>Political Stability:</strong> Political instability or uncertainty can lead to a decrease in investor confidence, causing a currency's value to decline. Stable political environments tend to attract investment and strengthen currencies.</li>
              <li><strong>Supply and Demand:</strong> Like any commodity, the value of a currency is determined by supply and demand. If demand for a currency is high and supply is low, its value will increase. Conversely, if demand is low and supply is high, its value will decrease.</li>
              <li><strong>Government Policies:</strong> Central bank policies, such as setting interest rates and controlling the money supply, can significantly impact exchange rates. Governments may also intervene in currency markets to stabilize or manipulate exchange rates.</li>
              <li><strong>Market Sentiment:</strong> Investor confidence and market expectations can also influence exchange rates. Even if the data shows a country is doing well economically, if investors are nervous, the currency can drop.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Impact on Businesses:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Import and Export Costs:</strong> Fluctuations in exchange rates can affect the cost of importing and exporting goods. A strong domestic currency makes imports cheaper and exports more expensive. A weak domestic currency has the opposite effect.</li>
              <li><strong>Foreign Investment:</strong> Exchange rates influence the attractiveness of foreign investments. A strong currency can make it more expensive for foreign investors to purchase assets in a country.</li>
              <li><strong>Financial Reporting:</strong> Businesses with international operations must translate foreign currency transactions into their domestic currency for financial reporting purposes. Exchange rate fluctuations can lead to gains or losses on these translations.</li>
              <li><strong>Pricing Strategies:</strong> Companies that sell goods internationally must consider exchange rate fluctuations when setting prices. They may need to adjust prices to remain competitive in different markets.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: FUEL MANAGEMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Fuel Management</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Fuel management is the process of efficiently controlling and optimizing fuel consumption. This is particularly important in transportation and logistics, where fuel costs can represent a significant portion of operating expenses. Effective fuel management not only reduces costs but also contributes to environmental sustainability by minimizing emissions.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Key Aspects of Fuel Management:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Route Optimization:</strong> Planning efficient routes can minimize travel distance and reduce fuel consumption. This involves using GPS navigation, traffic data, and route optimization software.</li>
              <li><strong>Driver Training:</strong> Training drivers in fuel-efficient driving techniques, such as smooth acceleration, consistent speed, and anticipating traffic conditions, can significantly reduce fuel consumption.</li>
              <li><strong>Vehicle Maintenance:</strong> Regular vehicle maintenance, including tire pressure checks, engine tune-ups, and filter replacements, can improve fuel efficiency.</li>
              <li><strong>Fuel Monitoring and Tracking:</strong> Implementing fuel monitoring systems can track fuel consumption in real time, identify inefficiencies, and detect fuel theft.</li>
              <li><strong>Fleet Management Systems:</strong> Fleet management systems can provide valuable data on fuel consumption, driver behaviour, and vehicle performance, enabling businesses to identify areas for improvement.</li>
              <li><strong>Fuel Procurement:</strong> Negotiating favourable fuel contracts and purchasing fuel in bulk can reduce fuel costs.</li>
              <li><strong>Alternative Fuels:</strong> Exploring alternative fuels, such as electric vehicles, natural gas, or biofuels, can reduce reliance on fossil fuels and minimize emissions.</li>
              <li><strong>Idling Reduction:</strong> Reducing unnecessary vehicle idling can save a lot of fuel. Anti-idling technology can be used.</li>
              <li><strong>Load Optimization:</strong> Evenly distributed and optimized loads can reduce drag and improve fuel efficiency.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: DETERMINING FREIGHT COSTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Determining Freight Costs</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Determining freight costs is a multifaceted process, as it involves considering numerous variables that can significantly impact the final price. Businesses employ various methods to calculate these costs, each with its own set of advantages and considerations. Here's a breakdown of common methods:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Weight size={20} /> 1. Weight-Based Pricing</h3>
            <p>This is one of the most traditional and straightforward methods. The freight cost is calculated based on the weight of the shipment. Typically, a rate is established per unit of weight (e.g., per kilogram or pound), and the total cost is determined by multiplying this rate by the shipment's weight.</p>
            <p className="mt-2">This method is commonly used for less-than-truckload (LTL) shipments, where multiple shipments from different customers are consolidated onto a single truck. It's also prevalent in air freight and some ocean freight scenarios.</p>
            <p className="mt-2">While simple, this method may not accurately reflect the cost of transporting bulky but lightweight items, as they occupy more space than their weight suggests.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> 2. Volume-Based Pricing</h3>
            <p>This method calculates freight costs based on the space occupied by the shipment. The volume is typically measured in cubic meters or cubic feet.</p>
            <p className="mt-2">This method is particularly relevant for shipments with low density but high volume, where the space occupied is a more significant cost driver than the weight.</p>
            <p className="mt-2">It's often used in situations where the carrier needs to maximize the utilization of their vehicle's cargo space.</p>
            <p className="mt-2">This is very common in ocean shipping, and air shipping.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Route size={20} /> 3. Distance-Based Pricing</h3>
            <p>This method calculates freight costs based on the distance the shipment travels. A rate is established per unit of distance (e.g., per mile or kilometre), and the total cost is determined by multiplying this rate by the distance.</p>
            <p className="mt-2">This method is commonly used in trucking and rail transportation, where the distance travelled is a primary cost factor.</p>
            <p className="mt-2">Factors like fuel costs, tolls, and driver labour are often factored into the distance-based rate.</p>
            <p className="mt-2">This is often combined with other factors.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> 4. Freight Class Pricing</h3>
            <p>This method is used primarily in the United States for LTL shipments. The National Motor Freight Classification (NMFC) system assigns freight classes to different commodities based on their density, stow ability, handling, and liability.</p>
            <p className="mt-2">Higher freight classes indicate higher costs, reflecting the increased difficulty or risk associated with transporting those commodities.</p>
            <p className="mt-2">This method provides a standardized approach to pricing LTL shipments, ensuring fairness and consistency.</p>
            <p className="mt-2">This system creates a standard way to price many different types of goods.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> 5. Zone-Based Pricing</h3>
            <p>This method divides the delivery area into zones and assigns a fixed rate to each zone. The freight cost is determined based on the zone to which the shipment is being delivered.</p>
            <p className="mt-2">This method is commonly used for small package delivery and local or regional shipments.</p>
            <p className="mt-2">It simplifies pricing and makes it easier to calculate freight costs for shipments within a defined area.</p>
            <p className="mt-2">This method is very common with companies like FedEx, and ups.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> 6. Contract Pricing</h3>
            <p>For businesses with high shipping volumes or long-term relationships with carriers, contract pricing is often used. This involves negotiating a fixed rate or discounted rate for a specific period or volume of shipments.</p>
            <p className="mt-2">Contract pricing provides cost predictability and stability, allowing businesses to budget and forecast freight expenses more accurately.</p>
            <p className="mt-2">It also strengthens relationships with carriers and can lead to preferential treatment.</p>
            <p className="mt-2">These contracts can be very complex.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FuelIcon size={20} /> 7. Fuel Surcharges</h3>
            <p>Due to the volatility of fuel prices, carriers often add fuel surcharges to freight costs. These surcharges fluctuate based on current fuel prices and are intended to offset the carrier's increased fuel expenses.</p>
            <p className="mt-2">Fuel surcharges are typically calculated as a percentage of the base freight rate or as a fixed amount per unit of weight or volume.</p>
            <p className="mt-2">They are a common practice in trucking, air freight, and ocean freight.</p>
            <p className="mt-2">These surcharges can add a significant amount to the final cost.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FilePlusIcon size={20} /> 8. Accessorial Charges</h3>
            <p>These are additional charges for services beyond basic transportation, such as liftgate delivery, inside delivery, residential delivery, or storage.</p>
            <p className="mt-2">Accessorial charges vary depending on the specific service required.</p>
            <p className="mt-2">It's important to understand and account for these charges when calculating total freight costs.</p>
            <p className="mt-2">These charges are often overlooked but are very important.</p>
          </div>
        </section>

        {/* ========== SECTION 8: TARIFFS OF FREIGHT RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Tariffs of Freight Rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>A tariff, in the realm of freight transportation, transcends a mere price list; it's a meticulously crafted document, or increasingly, a sophisticated electronic database, which encapsulates the intricate web of rates, rules, and regulations governing the movement of goods by a carrier. It serves as the definitive guide to the carrier's pricing structure, outlining the financial obligations associated with transporting various commodities, while simultaneously establishing the contractual framework within which the transportation service is rendered. Historically, these tariffs were physically printed documents, often thick and complex, requiring careful study to decipher. However, with the advent of digital technology, they have largely transitioned to electronic formats, accessible through carrier websites or specialized software platforms, enabling greater efficiency and ease of access. This evolution reflects the broader trend towards digitalization in the logistics industry, facilitating real-time updates and seamless information sharing.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Components of Freight Tariffs:</h4>

            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Base Rates:</strong> At the core of every freight tariff lies the base rate, the fundamental charge levied for the transportation of goods. This rate is typically determined by a confluence of factors, including the shipment's weight, volume, the distance it travels, and its freight classification. It represents the baseline cost of moving the cargo from origin to destination, forming the bedrock upon which all other charges are built. However, the base rate is rarely a static figure; it's often subject to adjustments based on a multitude of variables, such as fuel surcharges, accessorial fees, and market conditions. Understanding the intricacies of base rate calculation is crucial for shippers seeking to accurately estimate their transportation expenses and optimize their logistics strategies.
              </li>
              <li>
                <strong>Accessorial Charges:</strong> Beyond the base rate, freight tariffs often include a comprehensive list of accessorial charges, which are supplementary fees levied for services that extend beyond the standard transportation process. These charges cover a wide range of ancillary services, such as liftgate delivery, inside delivery, residential delivery, storage, detention (charges for delays in loading or unloading), and hazardous material handling. Each accessorial charge is meticulously defined within the tariff, specifying the conditions under which it applies and the corresponding fee. This level of detail ensures transparency and prevents disputes between carriers and shippers. For instance, a shipper requiring delivery to a residential address with limited access may incur additional charges for liftgate service and residential delivery. It is very important to understand these charges, as they can add a significant amount to the final cost.
              </li>
              <li>
                <strong>Rules and Regulations:</strong> Freight tariffs serve as more than just a pricing guide; they also function as a comprehensive rulebook, outlining the terms and conditions that govern the transportation of goods. These rules and regulations encompass a wide array of provisions, including liability limitations, claims procedures, packaging requirements, payment terms, and cancellation policies. They are designed to protect the interests of both the carrier and the shipper, establishing a clear framework for resolving disputes and ensuring compliance with industry standards. For example, the tariff may specify the carrier's liability for lost or damaged cargo, the procedures for filing claims, and the acceptable packaging materials for different types of goods. These rules and regulations provide a legal foundation for the transportation contract, fostering trust and accountability between the parties involved.
              </li>
              <li>
                <strong>Freight Classification:</strong> In certain regions, particularly within the United States, freight tariffs incorporate freight classification systems, such as the National Motor Freight Classification (NMFC). This system categorizes commodities into different classes based on their density, stow ability, handling, and liability. Each freight class corresponds to a specific rate, allowing carriers to charge different prices for transporting different types of goods. This classification system promotes fairness and consistency in pricing, ensuring that shippers are charged rates commensurate with the characteristics of their cargo. For example, fragile or high-value items may be assigned to a higher freight class, reflecting the increased risk and handling requirements associated with their transportation.
              </li>
              <li>
                <strong>Fuel Surcharges:</strong> Given the fluctuating nature of fuel prices, freight tariffs often include provisions for fuel surcharges. These surcharges are adjustments to the base rate, designed to offset the carrier's increased fuel expenses. They are typically calculated as a percentage of the base rate or as a fixed amount per unit of weight or volume, fluctuating in tandem with prevailing fuel prices. This mechanism allows carriers to mitigate the impact of fuel price volatility on their operating costs, ensuring that they can maintain profitability while providing competitive rates.
              </li>
              <li>
                <strong>Geographic Zones:</strong> Many freight carriers structure their rates based on geographic zones. These zones define specific areas, and the tariff will list the applicable rates for shipments traveling to or from each zone. This system simplifies pricing for shipments within defined regions, making it easier for shippers to calculate costs. The zones can be defined by zip codes, city boundaries, or larger regional areas.
              </li>
              <li>
                <strong>Discount Structures:</strong> To incentivize high-volume shipping or foster long-term relationships, carriers often offer various discount structures. These discounts may be based on the volume of shipments, the frequency of shipping, or contractual agreements. The details of these discounts are typically outlined within the tariff, providing transparency and clarity for shippers. These discounts can significantly impact the overall cost of shipping, making it crucial for shippers to understand and leverage them effectively.
              </li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Purpose of Tariffs:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Transparency:</strong> Tariffs serve as a cornerstone of transparency in the freight industry, providing shippers with clear and accessible information about freight rates and charges. This transparency empowers shippers to make informed decisions about their transportation options, compare rates from different carriers, and accurately budget their logistics expenses. By eliminating ambiguity and promoting price clarity, tariffs foster trust and confidence between carriers and shippers.</li>
              <li><strong>Consistency:</strong> Tariffs establish a standardized pricing structure, ensuring consistency in freight charges for similar shipments. This consistency is essential for maintaining fairness and preventing price discrimination. By adhering to a uniform set of rates and rules, carriers ensure that all shippers are treated equitably, regardless of their size or bargaining power.</li>
              <li><strong>Legal Compliance:</strong> Freight tariffs serve as legal documents, outlining the terms and conditions of the transportation contract. They provide a clear and unambiguous framework for resolving disputes, ensuring that both the carrier and the shipper are bound by the same set of rules. This legal foundation safeguards the interests of both parties, promoting accountability and minimizing the risk of litigation.</li>
              <li><strong>Cost Control:</strong> Tariffs play a vital role in cost control for shippers, enabling them to accurately estimate and manage their freight expenses. By providing detailed information about rates and charges, tariffs empower shippers to budget effectively, negotiate favourable contracts, and optimize their logistics strategies.</li>
              <li><strong>Dispute Resolution:</strong> In the event of disputes related to freight charges, tariffs serve as a crucial reference point. They provide a clear and objective basis for resolving disagreements, minimizing the potential for costly litigation. This ensures that both the carrier and the shipper have a recourse in case of misunderstandings or discrepancies.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: FREIGHT COST CALCULATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Freight Cost Calculations</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Ruler size={20} /> 1. Cost per Kilometre (Cost/km)</h3>
            <p><strong>What it is:</strong> This calculation determines the cost of transporting goods over a single kilometre. It's useful for understanding the basic transportation expense based on distance.</p>
            <p className="mt-2"><strong>How to Calculate:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Step 1: Determine the total transportation cost.</li>
              <li>Step 2: Determine the total distance travelled (in kilometres).</li>
              <li>Step 3: Divide the total transportation cost by the total distance travelled.</li>
              <li><strong>Formula:</strong> Cost/km = Total Transportation Cost / Total Distance (km)</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2">
              <p className="font-bold">Example 1:</p>
              <p>A truck travels 500 km, and the total transportation cost (including fuel, driver wages, and tolls) is $1,000.</p>
              <p>Cost/km = $1,000 / 500 km = $2/km</p>
              <p className="font-bold mt-2">Example 2:</p>
              <p>A train travels 1200km. The total cost of the trip is 2400 dollars.</p>
              <p>Cost/km = $2400/1200km = $2/km</p>
            </div>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Weight size={20} /> 2. Cost per Ton per Kilometre (Cost/ton/km)</h3>
            <p><strong>What it is:</strong> This calculation determines the cost of transporting one ton of goods over one kilometre. It is valuable for analysing the efficiency of transporting heavy loads over distance.</p>
            <p className="mt-2"><strong>How to Calculate:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Step 1: Determine the total transportation cost.</li>
              <li>Step 2: Determine the total weight of the goods (in tons).</li>
              <li>Step 3: Determine the total distance travelled (in kilometres).</li>
              <li>Step 4: Divide the total transportation cost by the product of the total weight and the total distance.</li>
              <li><strong>Formula:</strong> Cost/ton/km = Total Transportation Cost / (Total Weight (tons) x Total Distance (km))</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2">
              <p className="font-bold">Example 1:</p>
              <p>A truck travels 300 km, carrying 10 tons of cargo. The total transportation cost is $1,500.</p>
              <p>Cost/ton/km = $1,500 / (10 tons x 300 km) = $0.5/ton/km</p>
              <p className="font-bold mt-2">Example 2:</p>
              <p>A train travels 800 km carrying 200 tons of coal. The total cost is $8000.</p>
              <p>Cost/ton/km = $8000 / (200 tons x 800km) = $0.05/ton/km</p>
            </div>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> 3. Cost per Ton/Litre/Cubic Meter/Pallet</h3>
            <p><strong>What it is:</strong> This calculation determines the cost of transporting a single unit of weight, volume, or a pallet. It's used to analyse the cost-effectiveness of transporting specific types of cargo. This is where you will see many different types of units used.</p>
            <p className="mt-2"><strong>How to Calculate:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Step 1: Determine the total transportation cost.</li>
              <li>Step 2: Determine the total quantity of the unit being measured (tons, litres, cubic meters, pallets).</li>
              <li>Step 3: Divide the total transportation cost by the total quantity of the unit.</li>
              <li><strong>Formula:</strong> Cost/unit = Total Transportation Cost / Total Quantity of Unit</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2">
              <p className="font-bold">Example 1 (Cost per Ton):</p>
              <p>A shipment of 50 tons of steel is transported for $2,500.</p>
              <p>Cost/ton = $2,500 / 50 tons = $50/ton</p>
              <p className="font-bold mt-2">Example 2 (Cost per Cubic Meter):</p>
              <p>A shipment of furniture occupying 20 cubic meters is transported for $1000.</p>
              <p>Cost/cubic meter = $1000 / 20 cubic meters = $50/cubic meter</p>
              <p className="font-bold mt-2">Example 3 (Cost per Litre):</p>
              <p>A truck transports 10,000 litres of liquid for a cost of $2000.</p>
              <p>Cost/litre = $2000 / 10,000 litres = $0.20/litre</p>
              <p className="font-bold mt-2">Example 4 (Cost per pallet):</p>
              <p>A shipment of 10 pallets is transported for a cost of 500 dollars.</p>
              <p>Cost/pallet = $500 / 10 pallets = $50/pallet</p>
            </div>
          </div>
        </section>

        {/* ========== SECTION 10: ABSORPTION COSTING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Absorption Costing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p><strong>What it is:</strong> Absorption costing, also known as "full costing," is an accounting method that allocates all manufacturing costs, both fixed and variable, to the cost of a product. This means that direct materials, direct labour, variable manufacturing overhead, and fixed manufacturing overhead are all included in the cost of each unit produced.</p>
            <p className="mt-2">This method is required for external financial reporting under Generally Accepted Accounting Principles (GAAP) in the United States and similar accounting standards internationally.</p>
            <p className="mt-2">Essentially, it "absorbs" all manufacturing costs into the cost of the product.</p>
            <p className="mt-2"><strong>Key points:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>It includes all manufacturing costs, not just variable costs.</li>
              <li>Fixed manufacturing overhead is allocated to each unit produced.</li>
              <li>It's used for external financial reporting and tax purposes.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 11: COMPLETE HAUL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Complete Haul</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p><strong>What it is:</strong> In the transportation and logistics industry, a "complete haul" typically refers to the full transportation of a shipment from its origin to its destination. It implies that the carrier is responsible for the entire journey, without handing off the shipment to another carrier.</p>
            <p className="mt-2">It can also mean that a vehicle is filled to its full capacity.</p>
            <p className="mt-2">This is very important for costing, as it creates a clear boundary for what costs should be included.</p>
            <p className="mt-2"><strong>Key points:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>It represents the full transportation journey.</li>
              <li>It can also mean a vehicle filled to capacity.</li>
              <li>It creates a clear picture of what costs should be included in analysis.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Connection Between Absorption Costing and Complete Haul</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Accurate Costing in Transportation:</strong> When calculating the cost of a "complete haul," absorption costing principles become highly relevant. To determine the true cost of a haul, transportation companies must consider all costs associated with that haul. This includes direct costs: Fuel, driver wages, tolls, and indirect costs: Vehicle depreciation, maintenance, insurance, and a portion of administrative overhead. Absorption costing provides a framework for allocating these indirect costs to each haul, ensuring that the company accurately accounts for all expenses.</li>
              <li><strong>Pricing and Profitability:</strong> By using absorption costing, transportation companies can determine the full cost of each haul, which is essential for setting profitable pricing. Knowing the complete cost of a haul allows companies to set competitive rates that cover all expenses, evaluate the profitability of specific routes or customers, and make informed decisions about resource allocation.</li>
              <li><strong>Financial Reporting:</strong> For transportation companies that produce financial reports, absorption costing is crucial for accurately reporting the cost of services provided.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 12: MARGINAL COSTING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Marginal Costing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p><strong>What it is:</strong> Marginal costing, also known as variable costing, is an accounting method that only includes variable manufacturing costs in the cost of a product or service. Fixed manufacturing overhead is treated as a period expense and is not allocated to individual units.</p>
            <p className="mt-2">This method focuses on the incremental cost of producing or providing one additional unit or service.</p>
            <p className="mt-2">It's primarily used for internal management decision-making, such as pricing, production planning, and special-order analysis.</p>
            <p className="mt-2"><strong>Key Points:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Only variable costs are included in the cost of a product or service.</li>
              <li>Fixed costs are treated as period expenses.</li>
              <li>It's useful for short-term decision-making.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 13: RETURN LOAD ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Return Load</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p><strong>What it is:</strong> A return load, also known as a backhaul, refers to the practice of utilizing a transportation vehicle to carry cargo on its return journey after delivering a shipment.</p>
            <p className="mt-2">Instead of returning empty, the vehicle picks up another load, maximizing its utilization and reducing empty mileage.</p>
            <p className="mt-2">This is a common practice in trucking and other transportation industries.</p>
            <p className="mt-2"><strong>Key Points:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>It involves carrying cargo on a vehicle's return journey.</li>
              <li>It maximizes vehicle utilization and reduces empty mileage.</li>
              <li>It helps to increase profitability.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Connection Between Marginal Costing and Return Loads</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Incremental Cost Analysis:</strong> When considering whether to accept a return load, transportation companies often use marginal costing principles to assess the profitability of the opportunity. They focus on the incremental costs associated with the return load, such as additional fuel consumption, driver labour costs for the extra distance, and any loading or unloading fees. Fixed costs, such as vehicle depreciation or insurance, are typically ignored in this analysis, as they would be incurred regardless of whether the return load is accepted.</li>
              <li><strong>Pricing Decisions:</strong> Marginal costing helps companies determine the minimum price they should charge for a return load. As long as the revenue from the return load exceeds the incremental costs, it will contribute to the company's overall profitability. This allows companies to accept return loads at lower rates than they would charge for a full, outbound haul, as they are primarily covering the variable costs.</li>
              <li><strong>Maximizing Vehicle Utilization:</strong> The goal of return loads is to maximize vehicle utilization and reduce empty mileage. Marginal costing supports this goal by focusing on the incremental costs and benefits of each return load opportunity. By focusing on the variable cost, companies can make choices that increase profitability, even if the profit per load is lower.</li>
              <li><strong>Short Term Decisions:</strong> Return loads are often short-term decisions. Marginal costing is perfectly suited for those types of short-term decisions.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 14: FLAT RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Flat rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Flat rates are a pricing structure where a single, fixed price is charged for a service or product, regardless of usage or other variable factors. This simplicity makes them attractive to both businesses and customers. In the context of transportation and logistics, flat rates can apply to various services.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">What are Flat Rates?</h4>
            <p>Essentially, a flat rate means you pay one set price for a defined service. This price remains constant, regardless of factors that might typically influence cost, such as distance, weight, or time.</p>
            <p className="mt-2">This removes the variability and unpredictability associated with other pricing methods, providing cost certainty.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Applications of Flat Rates in Logistics:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Small Parcel Delivery:</strong> Many courier services offer flat-rate boxes or envelopes for shipping small packages. This is particularly common for items of a certain size and weight, where the carrier can standardize the packaging and pricing. This simplifies shipping for customers, as they don't have to worry about calculating costs based on weight and dimensions.</li>
              <li><strong>Local Delivery Services:</strong> Local delivery services, such as those for food or groceries, often use flat rates for deliveries within a specific radius. This allows customers to know the exact delivery cost upfront. This is very helpful to customers.</li>
              <li><strong>Long-Distance Trucking (in specific cases):</strong> While less common for long-haul trucking, flat rates can be used for dedicated routes or contracted shipments. This provides the shipper with cost predictability and can be beneficial for businesses with consistent shipping needs. This usually requires a contract between the two parties.</li>
              <li><strong>Freight Forwarding:</strong> Freight forwarders may offer flat rates for certain services, such as customs clearance or documentation preparation. This simplifies the process for shippers and provides cost certainty.</li>
              <li><strong>Warehouse Storage:</strong> Some warehouse facilities will offer a flat rate for storage of pallets or other units, for a set period of time.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Advantages of Flat Rates:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Simplicity:</strong> Flat rates are easy to understand and calculate, making them attractive to customers.</li>
              <li><strong>Predictability:</strong> Customers know the exact cost upfront, allowing for better budgeting and planning.</li>
              <li><strong>Transparency:</strong> Flat rates eliminate hidden fees or unexpected charges.</li>
              <li><strong>Ease of Use:</strong> Flat rates are easy to implement for the service provider.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Disadvantages of Flat Rates:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Potential for Overpayment:</strong> Customers may end up paying more than they would with other pricing methods, especially for smaller or lighter shipments.</li>
              <li><strong>Limited Flexibility:</strong> Flat rates may not be suitable for all types of shipments or services, particularly those with highly variable characteristics.</li>
              <li><strong>Risk for Service Providers:</strong> If costs rise unexpectedly, the service provider may end up losing profit.</li>
              <li><strong>Potential for abuse:</strong> If a customer is able to send a very large amount of goods for a flat rate, the service provider can lose money.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 15: STAGE RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stage Rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Stage and graduated/step-up rates are pricing structures that involve incremental changes in rates over time or based on specific usage thresholds. They're designed to incentivize certain behaviours, manage demand, or reflect increasing costs. Here's a breakdown of each:</p>

            <h4 className="text-lg font-bold mt-4 mb-2">What they are:</h4>
            <p>Stage rates involve distinct pricing tiers or stages. The rate changes abruptly when a customer's usage or activity crosses a predefined threshold.</p>
            <p className="mt-2">Each stage has a fixed rate that applies within its boundaries.</p>
            <p className="mt-2">This type of rate is common in services where cost increases significantly at certain usage levels.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Tiered data plans:</strong> Mobile phone data plans often use stage rates, where the cost per gigabyte increases as you move from one data tier to the next.</li>
              <li><strong>Warehouse storage:</strong> A warehouse might charge one rate for the first 100 pallets, a higher rate for 101-500 pallets, and an even higher rate for over 500 pallets.</li>
              <li><strong>Progressive taxation:</strong> Tax brackets operate on stage rates, where income within each bracket is taxed at a specific rate.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Abrupt changes in price at thresholds.</li>
              <li>Clear, distinct pricing tiers.</li>
              <li>Incentivizes staying within lower tiers.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 16: GRADUATED/STEP-UP RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Graduated/Step-Up Rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p><strong>What they are:</strong> Graduated or step-up rates involve incremental increases in the rate as usage or activity increases. The rate changes gradually, rather than abruptly.</p>
            <p className="mt-2">Often, the rate increases by a small amount for each additional unit of usage or activity.</p>
            <p className="mt-2">This is often used in situations where costs increase steadily.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Utilities (electricity, water):</strong> Utility companies often use graduated rates, where the cost per unit increases as consumption rises.</li>
              <li><strong>Long-term contracts:</strong> A service provider might offer a contract with a gradually increasing rate over time, reflecting increasing operational costs.</li>
              <li><strong>Interest rates:</strong> Some loans or savings accounts may have step-up interest rates, where the rate increases at predetermined intervals.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Incremental, gradual changes in price.</li>
              <li>Reflects a continuous increase in cost.</li>
              <li>Often used to encourage conservation.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Differences and Considerations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Abrupt vs. Gradual Changes:</strong> The primary difference is the nature of the rate change. Stage rates have sudden jumps, while graduated rates have smooth increases.</li>
              <li><strong>Incentives:</strong> Stage rates incentivize staying within lower tiers to avoid sudden price increases. Graduated rates incentivize conservation and efficient usage.</li>
              <li><strong>Cost Reflection:</strong> Graduated rates often reflect a closer correlation between increasing usage and increasing costs. Stage rates may be used for other purposes, such as managing demand.</li>
              <li><strong>Customer Perception:</strong> Stage rates can sometimes cause customer dissatisfaction if they unexpectedly jump into a higher tier. Graduated rates are often perceived as fairer.</li>
              <li><strong>Clarity:</strong> Stage rates are very easy to understand. Graduated rates can be more complex.</li>
              <li><strong>Contracts:</strong> Graduated rates are often used in long term contracts, whereas stage rates are often used for shorter term service agreements.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 17: SEASONAL RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Seasonal Rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The fundamental principle underpinning seasonal rates is the dynamic adjustment of prices to mirror the ebb and flow of market demand throughout the year. This approach recognizes that demand for goods and services is rarely static; it fluctuates significantly due to a variety of factors, including holidays, weather patterns, and special events. By aligning prices with these fluctuations, businesses aim to maximize revenue during periods of high demand while simultaneously stimulating sales during slower periods. In essence, seasonal rates are a strategic tool for optimizing revenue by capitalizing on peak demand and mitigating the impact of off-peak lulls. When demand surges, businesses can command higher prices, reflecting the increased value of their offerings during those times. Conversely, when demand wanes, prices are lowered to attract price-sensitive customers and maintain a steady flow of business. This dynamic pricing strategy requires a deep understanding of market trends, customer behaviour, and the factors that drive seasonal fluctuations.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Factors Influencing Seasonal Rates:</h4>
            <p>The determination of seasonal rates is not arbitrary; it's a carefully considered process that takes into account a multitude of factors that influence demand. Foremost among these are holidays, which often create significant spikes in demand for travel, accommodations, and retail products. Major holidays like Christmas, Thanksgiving, and New Years are prime examples, as they trigger a surge in consumer spending and travel. Weather patterns also play a critical role, particularly in industries like tourism, agriculture, and construction. For instance, summer months typically see increased demand for beach vacations and outdoor activities, while winter months may see a surge in demand for ski resorts and winter apparel. Local or national events, such as festivals, sporting events, or conferences, can also create temporary spikes in demand, leading businesses to adjust their prices accordingly. Additionally, school schedules, including breaks and vacations, influence family travel and leisure activities, creating predictable patterns of demand that businesses can leverage. Understanding these factors and their interplay is essential for businesses to accurately predict and respond to seasonal fluctuations in demand.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Industries That Commonly Use Seasonal Rates:</h4>
            <p>Seasonal rates are not universally applied across all industries; they are most prevalent in sectors where demand exhibits significant seasonal variations. The hospitality industry, encompassing hotels, resorts, and vacation rentals, is a prime example. These businesses frequently adjust their rates based on seasonal demand, with peak seasons like summer or holiday periods commanding significantly higher prices. Similarly, the tourism industry, including airlines, cruise lines, and tour operators, relies heavily on seasonal rates to reflect fluctuations in travel demand. Retailers also utilize seasonal pricing strategies, offering discounts and promotions during slow periods to clear out inventory and attract customers, while increasing prices during peak shopping seasons. The transportation industry, particularly freight and shipping companies, may also adjust rates based on seasonal demand, especially during peak shipping periods associated with holidays or agricultural harvests. These industries, among others, have learned to adapt their pricing strategies to the rhythm of seasonal demand, ensuring that they can maximize revenue and maintain profitability throughout the year.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Benefits of Seasonal Rates:</h4>
            <p>The adoption of seasonal rates offers numerous benefits to businesses that experience fluctuations in demand. Primarily, it allows for revenue optimization during peak seasons by charging higher prices, effectively capturing the increased value of their offerings. This strategy ensures that businesses can maximize their earnings during periods of high demand, contributing to overall profitability. Furthermore, seasonal rates serve as a valuable tool for demand management. By lowering prices during off-peak seasons, businesses can attract price-sensitive customers and maintain a consistent flow of business, mitigating the impact of slow periods. This helps to stabilize revenue streams and ensure that resources are utilized efficiently throughout the year. Additionally, seasonal discounts can aid retailers in managing inventory, clearing out excess stock to make room for new products. Offering competitive seasonal rates can also provide a significant competitive advantage, attracting customers and differentiating a business from its rivals.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Considerations:</h4>
            <p>While seasonal rates offer numerous benefits, their successful implementation requires careful consideration of several factors. Accurate data analysis is crucial for determining optimal seasonal rates. Businesses must analyse historical sales data, market trends, and competitor pricing to identify patterns and predict future demand. This data-driven approach ensures that pricing decisions are based on sound evidence rather than guesswork. Customer perception is also paramount. Businesses must communicate seasonal rate changes clearly and transparently, ensuring that customers perceive the pricing as fair and reasonable. Failure to do so can lead to customer dissatisfaction and damage to brand reputation. Moreover, in today's dynamic market, many businesses are moving towards dynamic pricing, which can be seen as an advanced form of seasonal pricing. This approach involves real-time adjustments to prices based on a multitude of factors, including demand, competition, and customer behaviour. Dynamic pricing allows for greater flexibility and responsiveness to changing market conditions, enabling businesses to optimize revenue and maintain a competitive edge.</p>
          </div>
        </section>

        {/* ========== SECTION 18: MARKET-BASED RATES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Market-Based Rates</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Market-based rates, particularly those influenced by customer and competitor rates, are a dynamic pricing strategy where businesses set their prices based on prevailing market conditions rather than solely on their internal costs. This approach is crucial for remaining competitive and responsive to customer expectations. Let's break down the key aspects:</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Understanding Market-Based Rates</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>External Focus:</strong> Unlike cost-plus pricing, which focuses on internal costs, market-based pricing prioritizes external factors, primarily customer perceptions and competitor actions.</li>
              <li><strong>Dynamic Pricing:</strong> Market-based rates are often dynamic, meaning they can change frequently in response to shifts in market conditions. This requires constant monitoring of customer behaviour and competitor pricing.</li>
              <li><strong>Customer-Centric Approach:</strong> Understanding customer needs, preferences, and price sensitivity is vital. Businesses must determine what customers are willing to pay for their offerings.</li>
              <li><strong>Competitive Analysis:</strong> Closely monitoring competitor pricing is essential. This involves analysing competitor rates, discounts, and promotions to ensure that your prices remain competitive.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Customer Rates:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Value Perception:</strong> Customer rates are heavily influenced by the perceived value of a product or service. If customers perceive a high value, they are generally willing to pay a higher price. Factors that influence value perception include quality, features, brand reputation, and customer service.</li>
              <li><strong>Price Sensitivity:</strong> Customers have varying degrees of price sensitivity. Some customers are highly price-conscious, while others are more willing to pay a premium for quality or convenience. Understanding customer price sensitivity allows businesses to segment their market and tailor their pricing strategies.</li>
              <li><strong>Demand Elasticity:</strong> Demand elasticity refers to the responsiveness of demand to changes in price. Products or services with high demand elasticity experience significant changes in demand when prices fluctuate. Understanding demand elasticity helps businesses predict the impact of price changes on sales.</li>
              <li><strong>Customer Feedback:</strong> Gathering customer feedback through surveys, reviews, and social media monitoring is essential for understanding customer perceptions and price expectations.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Competitor Rates:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Competitive Analysis:</strong> Regularly monitoring competitor pricing is crucial for staying competitive. This involves analysing competitor rates, discounts, and promotions. Tools like competitor price tracking software can help businesses automate this process.</li>
              <li><strong>Price Matching:</strong> Some businesses adopt a price-matching strategy, where they match or beat competitor prices. This can be effective in attracting price-sensitive customers.</li>
              <li><strong>Price Differentiation:</strong> Rather than simply matching competitor prices, businesses may choose to differentiate their offerings by providing additional value or features. This allows them to justify charging a premium price.</li>
              <li><strong>Competitive Positioning:</strong> Understanding your competitive positioning is essential for determining your pricing strategy. Are you a low-cost provider, a premium brand, or something in between? Your pricing should reflect your competitive positioning.</li>
              <li><strong>Market Share:</strong> Pricing can be used to increase market share. Sometimes, businesses will lower pricing to try and capture more of the market.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Combining Customer and Competitor Rates</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Balancing Act:</strong> The key to successful market-based pricing is to strike a balance between customer perceptions and competitor actions. You must set prices that are both attractive to customers and competitive in the marketplace.</li>
              <li><strong>Value-Based Pricing:</strong> Value-based pricing is a form of market-based pricing that focuses on the perceived value of the product or service to the customer. This approach allows businesses to charge a premium price for high-value offerings.</li>
              <li><strong>Dynamic Pricing Strategies:</strong> In today's digital age, many businesses use dynamic pricing strategies that adjust prices in real-time based on factors such as demand, competition, and customer behaviour. This allows for greater flexibility and responsiveness to changing market conditions.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 19: PAYMENT TERMS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Payment Terms</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowRightCircle size={20} /> Pay forward</h3>
            <p>The term implies a payment made in advance, or before the service or delivery of goods is completed. Its meaning is derived from its component parts: "pay" and "forward."</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Core Concept:</h4>
            <p><strong>Payment in Advance:</strong> At its most basic, "pay forward" signifies that payment is expected before the goods or services are provided. This is similar to a prepayment or advance payment. It shifts the risk of non-payment from the seller or service provider to the buyer.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Possible Applications and Interpretations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Prepayment for Services:</strong> A service provider might request a "pay forward" to secure their services, particularly for high-demand or specialized services. This could be common in consulting, event planning, or custom manufacturing.</li>
              <li><strong>Deposit or Down Payment:</strong> "Pay forward" could be used to describe a deposit or down payment, where a portion of the total cost is paid upfront to initiate a project or order.</li>
              <li><strong>Subscription or Membership Fees:</strong> In a subscription-based model, "pay forward" could refer to paying for a subscription period in advance, such as paying for a year of software access.</li>
              <li><strong>Shipping or Delivery Charges:</strong> A shipping or delivery company might require a "pay forward" to cover the cost of transportation, especially for international shipments or high-value items.</li>
              <li><strong>Informal Agreement:</strong> Because it is not a standard term, it could be used in an informal agreement between two parties. In this case, it is very important that both parties have a clear understanding of what the term means.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Key Considerations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Risk for the Buyer:</strong> "Pay forward" places the buyer at greater risk, as they are paying before receiving the goods or services. Therefore, it's crucial to ensure that the seller or service provider is reputable and trustworthy.</li>
              <li><strong>Clarity and Documentation:</strong> When using "pay forward" terms, it's essential to have clear and detailed documentation outlining the payment schedule, the goods or services to be provided, and any applicable terms and conditions.</li>
              <li><strong>Contractual Agreement:</strong> It is very important that any pay forward agreement, be put into a formal contract. This will protect both parties.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Half Payment Terms</h3>
            <p>Half payment terms, commonly involving a deposit and balance payment structure, are a widely used method for managing payments, particularly for larger transactions or services that span a considerable period. This approach provides financial security for the seller while offering payment flexibility to the buyer. Here's a detailed explanation:</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Understanding Half Payment Terms</h4>
            <p><strong>Core Principle:</strong> Half payment terms divide the total cost into two distinct payments: an initial deposit and a final balance. This structure provides a financial commitment from the buyer while allowing them to spread the payment burden.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Components of Half Payment Terms</h4>
            <p><strong>Deposit:</strong> The deposit is an upfront payment made by the buyer to secure the goods or services. It serves several purposes: demonstrates the buyer's commitment to the transaction, provides the seller with initial funds to cover upfront costs, such as materials or labour, and reduces the seller's risk of non-payment. The amount of the deposit can vary depending on the industry, the value of the transaction, and the agreement between the parties.</p>
            <p className="mt-2"><strong>Balance:</strong> The balance is the remaining amount owed after the deposit has been paid. It is typically paid upon completion of the service, delivery of the goods, or at a predetermined milestone. The timing of the balance payment should be clearly defined in the agreement.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Applications of Half Payment Terms</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Construction and Home Improvement:</strong> Contractors often use half payment terms, with a deposit to start the project and the balance upon completion.</li>
              <li><strong>Event Planning and Catering:</strong> Event planners and caterers may require a deposit to secure their services and the balance before or after the event.</li>
              <li><strong>Custom Manufacturing and Orders:</strong> Businesses that produce custom goods or fulfil large orders may use half payment terms to cover the cost of materials and production.</li>
              <li><strong>Consulting and Professional Services:</strong> Consultants and other professionals may require a deposit to initiate a project and the balance upon completion of specific milestones or the project as a whole.</li>
              <li><strong>Large Retail Purchases:</strong> For very large purchases, such as large appliances, or furniture, a store may require a deposit, and then the balance upon delivery.</li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Advantages of Half Payment Terms</h4>
            <p><strong>For the Seller:</strong> Reduces the risk of non-payment, provides initial funds to cover upfront costs, and demonstrates the buyer's commitment.</p>
            <p className="mt-2"><strong>For the Buyer:</strong> Spreads the payment burden over time, provides flexibility in managing finances, and allows for inspection or verification before final payment.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Key Considerations</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Clear Agreement:</strong> It's crucial to have a clear and detailed agreement outlining the payment schedule, the goods or services to be provided, and any applicable terms and conditions.</li>
              <li><strong>Documentation:</strong> All payments should be documented with receipts or invoices.</li>
              <li><strong>Milestones:</strong> For complex projects, it may be beneficial to define specific milestones that trigger balance payments.</li>
              <li><strong>Contractual Protection:</strong> It is very important that a contract is put in place to protect both the buyer and the seller.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Cash on delivery (COD)</h3>
            <p>Cash on delivery (COD) is a payment method where the recipient pays for goods or services at the time of delivery. It's a straightforward concept, but its implications for both buyers and sellers are significant. Here's a comprehensive overview:</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Core Concept:</h4>
            <p><strong>Payment at Delivery:</strong> The fundamental principle of COD is that payment is exchanged when the goods are physically delivered to the recipient. This contrasts with prepayment, where payment is made before shipping.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Key Features and Variations:</h4>
            <p><strong>Payment Forms:</strong> While traditionally "cash" was the primary form of payment, COD now often encompasses other methods, including: Cash, Checks, Debit/credit card payments (processed by the delivery person), and Electronic payments via mobile devices.</p>
            <p className="mt-2"><strong>Role of the Carrier:</strong> The delivery carrier (e.g., a courier service, postal service, or in-house delivery team) acts as an intermediary, collecting the payment on behalf of the seller. The carrier then remits the payment to the seller.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Advantages of COD:</h4>
            <p><strong>For Buyers:</strong> Reduced Risk: Buyers can inspect the goods before paying, minimizing the risk of receiving damaged or incorrect items. Increased Trust: It can build trust, especially when dealing with unfamiliar sellers. Accessibility: It allows individuals without credit cards or online payment options to make purchases.</p>
            <p className="mt-2"><strong>For Sellers:</strong> Expanded Market: It can attract customers who prefer not to use online payment methods. Increased Sales: It can encourage impulse purchases, as customers don't have to pay until they receive the goods. Faster Payment: In many cases, COD transactions can lead to faster payment compared to invoice-based methods.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Disadvantages of COD:</h4>
            <p><strong>For Sellers:</strong> Increased Risk of Returns: Customers may refuse delivery, leading to returned shipments and associated costs. Logistical Challenges: Handling cash and other payment methods adds complexity to delivery operations. Increased Costs: Carriers often charge additional fees for COD services.</p>
            <p className="mt-2"><strong>For Buyers:</strong> Inconvenience: It requires having the exact payment amount on hand at the time of delivery. Potential for Delays: If the buyer is unavailable or unable to pay, delivery may be delayed.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">COD in Modern Commerce:</h4>
            <p><strong>E-commerce:</strong> COD remains a popular payment option in many e-commerce markets, particularly in developing countries where credit card penetration is low.</p>
            <p><strong>Food Delivery:</strong> Many food delivery services offer COD as a convenient payment option.</p>
            <p><strong>Local Deliveries:</strong> Local businesses often use COD for deliveries within their service area.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Key Account</h3>
            <p>The terms "key account," "fortnight account," and "30-day account" relate to business relationships and payment terms. Let us break down each concept:</p>

            <h4 className="text-lg font-bold mt-4 mb-2">What it is:</h4>
            <p>A key account refers to a customer that is significant to a business. These customers typically generate a substantial portion of the company's revenue or have strategic value.</p>
            <p className="mt-2">Key accounts often receive special treatment, such as dedicated account managers, customized service or product offerings, preferential pricing or payment terms, and closer communication and relationship building.</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Importance:</h4>
            <p>Maintaining strong relationships with key accounts is crucial for business stability and growth. These accounts can provide a steady stream of revenue and act as valuable references. It is very important to keep these customers happy.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> Fortnight Account</h3>
            <p><strong>What it is:</strong> A "fortnight account" refers to a payment term where the customer is expected to pay their invoices every two weeks (a fortnight).</p>
            <p className="mt-2">This means that the billing cycle is bi-weekly, and payments are due at these intervals.</p>
            <p className="mt-2"><strong>Usage:</strong> This payment term is less common than monthly (30-day) accounts but may be used in specific industries or by businesses with frequent transactions. It can be useful for businesses that need a more frequent cash flow.</p>
            <p className="mt-2"><strong>Example:</strong> A company might bill a customer every other Friday, with payment due within a specified number of days (e.g., 7 days) from the invoice date.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> 30-Day Account</h3>
            <p><strong>What it is:</strong> A "30-day account" is a common payment term where the customer is expected to pay their invoices within 30 days of the invoice date.</p>
            <p className="mt-2">This is a standard payment term in many business-to-business (B2B) transactions.</p>
            <p className="mt-2"><strong>Usage:</strong> It provides customers with a reasonable timeframe to process and pay invoices. It allows businesses to manage their accounts receivable and cash flow.</p>
            <p className="mt-2"><strong>Example:</strong> An invoice dated January 1st would be due by January 31st.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Costing and Pricing Methods</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Costing Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pricing Strategies</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cost Classification</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Freight Costs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tariffs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Terms</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Costing & Pricing. 💰📊</p>
        </footer>

      </div>
    </div>
  );
};
