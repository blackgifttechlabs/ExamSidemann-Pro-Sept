import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon,
  MessageCircle, Globe, Currency, Truck as TruckIcon2, CheckSquare, Gavel, Lock, Leaf, Heart,
  Droplet, Flame, Zap as ZapIcon, Factory as FactoryIcon, ShoppingCart, Award, FileText as FileTextIcon, CreditCard, Shield as ShieldIcon, RefreshCw, Save,
  Flame as FlameIcon, Droplet as DropletIcon, Wheat, Coffee, Beef, Banknote, FileCode,Send,
  CreditCard as CreditCardIcon, DollarSign as DollarSignIcon, Clock, FileText as FileTextIcon2, BadgeCheck, Link, Database as DatabaseIcon, Receipt as ReceiptIcon
} from 'lucide-react';

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
              NC PURCHASING &amp; SUPPLY: MODULE LO5
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Processing <span className="text-rose-300 font-bold italic">Payments</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to processing payments in international purchasing, including currency exchange, payment methods, transaction costs, regulatory compliance, and payment procedures.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">payment_processing.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">VERIFY</span><span className="text-white">Invoice;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">SELECT</span><span className="text-white">Payment_Method;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">EXECUTE</span><span className="text-white">Transaction;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><CreditCardIcon className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: PROCESSING PAYMENTS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Processing Payments</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Processing payments in international purchasing is a critical aspect of global trade, requiring careful consideration of various factors to ensure secure, efficient, and cost-effective transactions. Given the complexities of cross-border payments, businesses must navigate currency fluctuations, varying regulations, and potential risks to maintain smooth financial operations. Here are seven key factors to consider:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Currency size={20} /> Currency Exchange Rates and Volatility</h3>
            <p>One of the most significant factors in international payment processing is the fluctuation of currency exchange rates. These fluctuations can significantly impact the final cost of goods and services, potentially eroding profit margins or increasing expenses. Businesses must carefully monitor exchange rate trends and consider implementing strategies to mitigate currency risk. This may involve using forward contracts, options, or other hedging instruments to lock in exchange rates for future transactions. Alternatively, businesses can consider using multi-currency accounts or payment platforms that offer competitive exchange rates and real-time currency conversions. Understanding the timing of payments and the potential for currency volatility is crucial for accurate financial planning and risk management. Also, depending on the currencies being exchanged, there can be large fees associated with the exchange.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCardIcon size={20} /> Payment Methods and Security</h3>
            <p>Selecting the appropriate payment method is essential for ensuring secure and efficient transactions. Various payment methods are available, including wire transfers, letters of credit, documentary collections, and online payment platforms. Each method has its own advantages and disadvantages in terms of cost, speed, and security. Wire transfers, while generally fast, can be expensive and may pose security risks if not handled properly. Letters of credit offer a high level of security but can be complex and costly. Online payment platforms, such as PayPal or Stripe, offer convenience and speed but may have limitations on transaction amounts and currency conversions. Businesses must carefully evaluate the security features of each payment method and choose one that aligns with their risk tolerance and transaction requirements. Using well known and respected payment methods will help protect both parties.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> Transaction Costs and Fees</h3>
            <p>International payment transactions often involve various costs and fees, including bank fees, transfer fees, and exchange rate markups. These costs can vary significantly depending on the payment method, the banks involved, and the currencies being exchanged. Businesses should carefully compare the costs and fees associated with different payment options to minimize expenses. Negotiating favourable terms with banks and payment providers can also help to reduce transaction costs. Transparency in fee structures is essential for accurate cost calculations and financial planning. Some banks have hidden fees, so it is important to check.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Regulatory Compliance and Documentation</h3>
            <p>International payment transactions are subject to various regulations, including anti-money laundering (AML) and know-your-customer (KYC) requirements. Businesses must ensure that they comply with all applicable regulations and maintain accurate documentation for all transactions. This includes verifying the identity of the parties involved, maintaining records of transaction details, and complying with reporting requirements. Failure to comply with regulations can result in penalties and legal repercussions. Staying informed about changes in regulations and seeking expert advice when needed is crucial for ensuring compliance. Different countries have very different regulations.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> Payment Speed and Settlement Time</h3>
            <p>The speed of payment and the settlement time are important considerations, particularly for time-sensitive transactions. Wire transfers are generally the fastest payment method, with funds typically arriving within a few business days. However, settlement times can vary depending on the banks involved and the currencies being exchanged. Letters of credit and documentary collections may involve longer settlement times due to the documentation and verification processes. Businesses should carefully consider the payment speed and settlement time required for each transaction and choose a payment method that meets their needs. Delays in payment can cause serious problems for both parties.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Supplier Relationships and Payment Terms</h3>
            <p>Establishing clear payment terms and maintaining good relationships with suppliers is essential for smooth payment processing. This involves negotiating favourable payment terms, such as payment deadlines and discounts for early payment, and communicating clearly with suppliers about payment procedures. Building trust and maintaining open communication can help to resolve any payment related issues promptly. Also, making sure that all agreed upon terms are in the contracts is very important.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DatabaseIcon size={20} /> Technological Infrastructure and Integration</h3>
            <p>The technological infrastructure used for payment processing can significantly impact efficiency and security. Businesses should consider using payment platforms and software that integrate with their existing accounting and enterprise resource planning (ERP) systems. This can help to automate payment processes, reduce manual errors, and improve data accuracy. Modern payment platforms often offer features such as real-time payment tracking, automated reconciliation, and fraud detection. Investing in robust technological infrastructure can enhance payment efficiency and security.</p>
          </div>
        </section>

        {/* ========== SECTION 2: PERFORMING PAYMENT PROCEDURES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Performing payment procedures in international purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Performing payment procedures in international purchasing is a multi-faceted process that demands precision and vigilance. It's not merely about transferring funds; it's about ensuring those funds reach the intended recipient securely, efficiently, and in compliance with international regulations. This process requires a systematic approach, starting with meticulous verification and culminating in thorough record-keeping. Each step is crucial for maintaining financial integrity and fostering positive relationships with overseas suppliers.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Meticulous Invoice Verification and Payment Term Confirmation</h3>
            <p>Before any payment is initiated, a thorough verification of the supplier's invoice is paramount. This goes beyond a simple glance; it's a detailed cross-referencing exercise. The invoice must be compared against the original purchase order, the packing list, and the bill of lading or air waybill. This ensures that the goods or services listed, their quantities, and the agreed upon prices are all consistent. Special attention must be paid to the supplier's name and address, the invoice number and date, and the total amount due. Critically, the currency of payment and the supplier's bank account details must be verified for accuracy. The payment terms, such as net 30 days or the use of a letter of credit, must be confirmed and matched against the initial agreement. Any discrepancies, no matter how small, should be immediately addressed with the supplier to prevent potential misunderstandings or delays. This initial verification stage is not just a formality; it's a crucial safeguard against errors and fraud.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Strategic Selection of the Appropriate Payment Method</h3>
            <p>The choice of payment method is a strategic decision that impacts both cost and security. Factors such as the transaction value, the level of trust between the buyer and seller, and the agreed-upon payment terms all play a role. Wire transfers, while offering speed and reliability for large transactions, can be costly and require meticulous attention to bank details. Letters of credit, though complex and expensive, provide the highest level of security, particularly for high-risk transactions or when dealing with new suppliers. Documentary collections offer a balance between security and cost, acting as an intermediary for document and payment exchange. Online payment platforms, while convenient for smaller transactions, may have limitations on transaction amounts, currency conversions, and associated fees. Businesses must carefully evaluate the costs, speed, security, and convenience of each payment method to select the most appropriate option for each transaction. The selection should be documented and justified.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClipboardCheck size={20} /> Securing Necessary Approvals and Maintaining an Audit Trail</h3>
            <p>Internal controls are essential for preventing fraud and ensuring compliance with company policies. Depending on the company's size and structure, payment requests may require approval from designated personnel, such as finance managers or department heads. These approvals should be obtained before initiating any payment. A clear audit trail of all approvals, including the date, time, and name of the approver, should be maintained. This documentation serves as evidence of compliance and can be invaluable during audits or dispute resolution. Implementing a robust approval process not only safeguards company funds but also promotes accountability and transparency.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Send size={20} /> Precise Payment Initiation and Confirmation</h3>
            <p>Once the invoice is verified and approvals are secured, the payment process can begin. For wire transfers, meticulous attention to detail is required when entering the beneficiary's bank account details, including the account number, SWIFT code, and bank address. For letters of credit, all required documents must be submitted to the issuing bank within the stipulated timeframe. For online payment platforms, the platform's instructions must be followed diligently. After initiating the payment, confirmation from the bank or payment platform should be obtained. This confirmation, including the transaction reference number and date, should be retained as proof of payment. The supplier should be promptly notified of the payment, and the payment confirmation details should be provided.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Diligent Payment Reconciliation and Discrepancy Resolution</h3>
            <p>Upon receipt of the goods or services, a thorough reconciliation of the payment is essential. This involves comparing the payment amount against the invoice and other relevant documents to ensure accuracy. Any discrepancies, such as overpayments or underpayments, should be addressed with the supplier immediately. If the goods or services received do not match the purchase order, the supplier should be notified, and appropriate action should be taken. Maintaining a clear record of all reconciliation activities is crucial for financial accuracy and dispute resolution. Promptly addressing and resolving discrepancies helps to maintain positive supplier relationships.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Save size={20} /> Comprehensive Record-Keeping and Regulatory Compliance</h3>
            <p>Maintaining accurate and complete records of all payment transactions is a fundamental requirement. This includes invoices, payment confirmations, bank statements, and any other relevant documentation. These records are essential for accounting purposes, internal and external audits, and dispute resolution. All records should be stored securely and in compliance with relevant regulations, such as data privacy laws and tax regulations. Businesses must stay informed about changes in regulations and ensure that their payment procedures are always compliant. Implementing a robust record-keeping system not only ensures compliance but also provides valuable insights into financial performance and risk management.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 5 — Processing Payments</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Currency Exchange</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction Costs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Regulatory Compliance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Procedures</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master International Payments. 💳🌍</p>
        </footer>

      </div>
    </div>
  );
};
