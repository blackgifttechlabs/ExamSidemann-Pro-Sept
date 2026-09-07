import React, { useState, useRef } from 'react';

/**
 * Topic: Agri‑Business
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const AgriBusiness: React.FC = () => {
  // ---------- CSS keyframes for the double highlight ----------
  const highlightStyles = `
    @keyframes highlight-flash {
      0% { background-color: transparent; }
      25% { background-color: #fef08a; }
      50% { background-color: transparent; }
      75% { background-color: #fef08a; }
      100% { background-color: transparent; }
    }
    .highlight-heading {
      animation: highlight-flash 0.9s ease 2;
      border-radius: 4px;
      padding: 0 4px;
      display: inline-block;
    }
  `;

  // ---------- Section definitions ----------
  interface TopicSection {
    id: string;
    title: string;
    content: React.ReactNode;
    aside?: React.ReactNode;
  }

  // Image helper
  const AgriImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {fileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/agri-business/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/agri-business/${fileName}`}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
            onError={() => setIsMissing(true)}
          />
        )}
        <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
          {caption}
        </figcaption>
      </figure>
    );
  };

  // Subtopic Card component for consistent styling
  const SubtopicCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rounded-[9px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-6">
        <h3 className="text-3xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
          {title}
        </h3>
        <div className="text-slate-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  // ---------- Section content ----------
  const sections: TopicSection[] = [
    {
      id: 'farm-records-accounts',
      title: 'Farm Records and Accounts',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Farm Records and Accounts?">
            <p>
              <strong>Definition:</strong> Farm records are systematic written
              documents that capture all activities, transactions, and events on
              a farm. Farm accounts are the financial summaries derived from these
              records, showing income, expenditure, and overall profitability.
            </p>
            <p>
              Good record‑keeping is essential for making informed decisions,
              obtaining credit, and measuring farm performance.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Importance of Farm Records">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Decision‑making:</strong> Records help farmers decide what
                to plant, how many livestock to keep, and when to sell.
              </li>
              <li>
                <strong>Financial management:</strong> Track income and expenses
                to assess profitability and plan budgets.
              </li>
              <li>
                <strong>Access to credit:</strong> Banks and lenders require records
                to assess loan applications.
              </li>
              <li>
                <strong>Tax compliance:</strong> Records are needed to calculate
                taxes and comply with government regulations.
              </li>
              <li>
                <strong>Monitoring and evaluation:</strong> Compare performance
                over time and identify areas for improvement.
              </li>
              <li>
                <strong>Marketing:</strong> Records of yields, quality, and prices
                help in negotiating better deals.
              </li>
              <li>
                <strong>Insurance claims:</strong> In case of losses (drought, fire,
                disease), records support claims.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Physical vs Financial Records">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Records that describe the physical
                aspects of farm operations – what is produced, used, or held.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Field records (crop type, planting date, fertiliser applied, yields).</li>
                  <li>Livestock records (breeding, health treatments, weight gains).</li>
                  <li>Inventory records (feed, seed, chemicals, machinery).</li>
                  <li>Labour records (hours worked, tasks performed).</li>
                </ul>
              </li>
              <li>
                <strong>Purpose:</strong> To monitor production efficiency, resource
                use, and biological performance.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Financial Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Records that track money flows –
                income, expenses, assets, and liabilities.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Income records (sales of crops, livestock, products).</li>
                  <li>Expenditure records (purchases of inputs, fuel, repairs).</li>
                  <li>Cash book (daily cash transactions).</li>
                  <li>Profit and loss statement (summary of revenues and costs).</li>
                  <li>Balance sheet (assets, liabilities, net worth).</li>
                </ul>
              </li>
              <li>
                <strong>Purpose:</strong> To determine profitability, manage cash
                flow, and plan for investments.
              </li>
            </ul>
            <AgriImage
              fileName="physical-financial-records.png"
              alt="A 2D diagram showing physical records (crop, livestock, inventory) and financial records (income, expenses, balance sheet)"
              caption="Physical vs Financial farm records."
            />
          </SubtopicCard>

          <SubtopicCard title="Examples in the Zimbabwean Context">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Small‑scale farmers in Zimbabwe often keep simple records using
                notebooks, but increasingly digital tools (farm apps) are being used.
              </li>
              <li>
                Commercial farmers maintain comprehensive records for auditing,
                taxation, and financing purposes.
              </li>
              <li>
                Government extension services encourage record‑keeping through
                training and provision of record books.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Farm records:</strong> documents of farm activities</li>
            <li><strong>Physical records:</strong> production, inputs, labour</li>
            <li><strong>Financial records:</strong> income, expenses, assets</li>
            <li><strong>Importance:</strong> decisions, credit, tax, monitoring</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'agricultural-cooperatives',
      title: 'Agricultural Cooperatives',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Agricultural Cooperatives?">
            <p>
              <strong>Definition:</strong> An agricultural cooperative is a
              voluntary association of farmers who join together to achieve
              common goals – such as buying inputs cheaper, processing products,
              or marketing produce collectively.
            </p>
            <p>
              Cooperatives are based on the principles of self‑help, mutual
              assistance, and democratic control. They help small‑scale farmers
              overcome the disadvantages of being small and isolated.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Principles of Agricultural Cooperatives">
            <p>
              The International Cooperative Alliance (ICA) defines seven cooperative
              principles:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>1. Voluntary and open membership:</strong> Anyone can join
                without discrimination.
              </li>
              <li>
                <strong>2. Democratic control:</strong> Members have equal voting
                rights (one member, one vote).
              </li>
              <li>
                <strong>3. Member economic participation:</strong> Members contribute
                capital and share benefits proportionally.
              </li>
              <li>
                <strong>4. Autonomy and independence:</strong> Cooperatives are
                self‑governing.
              </li>
              <li>
                <strong>5. Education, training, and information:</strong> Members
                are trained to manage the cooperative.
              </li>
              <li>
                <strong>6. Cooperation among cooperatives:</strong> Cooperatives
                work together at local, national, and international levels.
              </li>
              <li>
                <strong>7. Concern for community:</strong> Cooperatives work for
                the sustainable development of their communities.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="How Cooperatives Are Formed">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>1. Identification of needs:</strong> A group of farmers
                identifies a common problem (e.g., high input costs, poor market access).
              </li>
              <li>
                <strong>2. Formation of a steering committee:</strong> Interested
                members meet, elect leaders, and draft a constitution.
              </li>
              <li>
                <strong>3. Registration:</strong> The cooperative is registered
                with the relevant government authority (e.g., in Zimbabwe, the
                Department of Cooperatives under the Ministry of Lands, Agriculture,
                Fisheries, Water and Rural Development).
              </li>
              <li>
                <strong>4. Capital mobilisation:</strong> Members contribute shares
                or registration fees to raise starting capital.
              </li>
              <li>
                <strong>5. Development of business plan:</strong> The cooperative
                decides on activities – input buying, processing, marketing, etc.
              </li>
              <li>
                <strong>6. Operation:</strong> The cooperative starts functioning
                with elected management and regular member meetings.
              </li>
            </ul>
            <AgriImage
              fileName="cooperative-formation-steps.png"
              alt="A 2D diagram showing the steps to form an agricultural cooperative: needs, committee, registration, capital, plan, operation"
              caption="Steps in forming an agricultural cooperative."
            />
          </SubtopicCard>

          <SubtopicCard title="Types of Agricultural Cooperatives in Zimbabwe">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>1. Marketing cooperatives:</strong> Help farmers market
                their produce collectively to get better prices. Examples: tobacco
                marketing cooperatives in Mashonaland.
              </li>
              <li>
                <strong>2. Input supply cooperatives:</strong> Bulk purchase of
                seeds, fertiliser, pesticides, and fuel at lower prices. E.g.,
                <em>Zimbabwe Farmers Union (ZFU) cooperative input schemes</em>.
              </li>
              <li>
                <strong>3. Credit and savings cooperatives:</strong> Provide
                loans and savings facilities to members, often at lower interest
                rates than banks. Also known as SACCOs (Savings and Credit Cooperative
                Organisations).
              </li>
              <li>
                <strong>4. Processing cooperatives:</strong> Add value to farm
                products – e.g., milk processing, peanut butter making, or ginning
                of cotton.
              </li>
              <li>
                <strong>5. Multipurpose cooperatives:</strong> Offer a combination
                of services – marketing, inputs, credit, and processing.
              </li>
              <li>
                <strong>6. Irrigation cooperatives:</strong> Manage water resources
                and irrigation infrastructure collectively – common in communal
                irrigation schemes.
              </li>
            </ul>
            <AgriImage
              fileName="zimbabwe-cooperative-types.png"
              alt="A 2D diagram showing different types of agricultural cooperatives in Zimbabwe: marketing, input supply, credit, processing, multipurpose, irrigation"
              caption="Types of agricultural cooperatives in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Benefits and Challenges of Cooperatives in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Benefits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Bargaining power – better prices for inputs and outputs.</li>
              <li>Access to credit and savings facilities.</li>
              <li>Shared resources (machinery, transport, storage).</li>
              <li>Knowledge sharing and training.</li>
              <li>Improved market access and reduced transaction costs.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Challenges</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Poor management and leadership – lack of business skills.</li>
              <li>Insufficient capital – many cooperatives are underfunded.</li>
              <li>Member conflicts – disagreements over decisions and distribution of benefits.</li>
              <li>External competition – from well‑established private companies.</li>
              <li>Regulatory and bureaucratic hurdles – lengthy registration processes.</li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Cooperatives Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Definition:</strong> farmers’ joint organisation</li>
            <li><strong>Principles:</strong> voluntary, democratic, economic participation</li>
            <li><strong>Types:</strong> marketing, input supply, credit, processing, irrigation</li>
            <li><strong>Benefits:</strong> bargaining power, shared resources</li>
            <li><strong>Challenges:</strong> poor management, capital shortage</li>
          </ul>
        </div>
      ),
    },
  ];

  // ---------- State ----------
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  // ---------- Navigation handlers ----------
  const handleNavigate = (id: string) => {
    setActiveId(id);

    document.querySelectorAll('.highlight-heading').forEach((el) => {
      el.classList.remove('highlight-heading');
    });

    const sectionEl = document.getElementById(id);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const heading = sectionEl.querySelector('h2');
      if (heading) {
        heading.classList.remove('highlight-heading');
        void heading.offsetWidth;
        heading.classList.add('highlight-heading');
      }
    }
  };

  const activeIndex = Math.max(sections.findIndex((s) => s.id === activeId), 0);
  const isLastChapter = activeIndex >= sections.length - 1;

  // ---------- Sub-components ----------
  const TopicNav: React.FC<{
    activeId: string;
    onNavigate: (id: string) => void;
  }> = ({ activeId, onNavigate }) => {
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s.title}
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
        <h2 className="text-4xl font-bold text-slate-900">{section.title}</h2>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="max-w-none">{section.content}</div>
        {section.aside && <aside className="lg:sticky lg:top-24 space-y-5">{section.aside}</aside>}
      </div>
    </section>
  );

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <style>{highlightStyles}</style>

      {/* Header */}
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            AGRICULTURE
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Agri‑Business
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand farm records and accounts, and the role of agricultural
            cooperatives in Zimbabwe – from principles and formation to types
            and challenges.
          </p>
        </div>
      </div>

      {/* Sticky Navigation */}
      <TopicNav activeId={activeId} onNavigate={handleNavigate} />

      {/* Main content */}
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-[9px] text-white shadow-lg">
            <h3 className="font-bold text-2xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm records</strong> are essential
                  for decision‑making, credit access, and tax compliance. They include
                  physical records (crops, livestock) and financial records (income,
                  expenses, assets).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Agricultural cooperatives</strong>
                  are farmer organisations that pool resources and buy/sell together.
                  They follow principles like voluntary membership, democratic control,
                  and economic participation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Types in Zimbabwe</strong> include
                  marketing, input supply, credit, processing, and irrigation
                  cooperatives. They offer benefits but face challenges such as
                  poor management and capital shortage.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Agri‑Business topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">another topic</span>?</>
            ) : (
              <>Next: <span className="text-blue-600">{sections[activeIndex + 1].title}</span></>
            )}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!isLastChapter) {
                handleNavigate(sections[activeIndex + 1].id);
              } else {
                alert('Proceed to next topic');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Next Topic →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriBusiness;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/agri-business/
   Use a mix of 2D diagram style and realistic photographs.

   --- FARM RECORDS AND ACCOUNTS ---
   1. physical-financial-records.png
      A split diagram: left side – icons for physical records (field notebook, livestock, feed bag, tractor), right side – icons for financial records (cash, receipt, balance sheet, piggy bank).

   --- AGRICULTURAL COOPERATIVES ---
   2. cooperative-formation-steps.png
      A flowchart: Needs → Committee → Registration → Capital → Plan → Operation, with icons.

   3. zimbabwe-cooperative-types.png
      A 2D diagram showing six types: marketing (tobacco bale), input supply (seed bag), credit (money), processing (milk bottle), multipurpose (various icons), irrigation (water drop).

   ============================================================ */