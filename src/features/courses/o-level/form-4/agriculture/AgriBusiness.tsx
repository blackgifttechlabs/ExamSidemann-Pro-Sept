import { AgricultureLessonImage as AgriImage } from '../../../common/AgricultureLessonImage';
import React, { useState, useRef } from 'react';

/**
 * Topic: Agri‑Business
 * Full component with sticky navigation, container cards (9px border-radius),
 * lesson illustrations, and auto‑scroll + double‑highlight on heading.
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
      id: 'principles-economics',
      title: 'Principles of Economics',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Law of Diminishing Returns and Its Implications in Agriculture">
            <p>
              <strong>Definition:</strong> The law of diminishing returns states
              that as more and more units of a variable input (e.g., fertiliser,
              labour) are added to a fixed input (e.g., land), the total output
              will eventually increase at a decreasing rate. Beyond a certain
              point, additional inputs will result in a decline in total output.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Stages of the Law of Diminishing Returns</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Stage 1 – Increasing returns (positive returns):</strong>
                <br />
                As more input is added, total output increases at an increasing
                rate. This is because fixed resources are being used more efficiently.
                <br />
                <strong>Example:</strong> Adding fertiliser to a field for the
                first time – yields increase significantly.
              </li>
              <li>
                <strong>Stage 2 – Diminishing returns:</strong>
                <br />
                As more input is added, total output increases but at a decreasing
                rate. This is the most common stage in agriculture.
                <br />
                <strong>Example:</strong> Adding more fertiliser to a field –
                yields still increase, but each additional unit of fertiliser
                gives a smaller increase in yield.
              </li>
              <li>
                <strong>Stage 3 – Negative returns:</strong>
                <br />
                Adding more input actually reduces total output. This is due to
                overcrowding, toxicity, or other negative effects.
                <br />
                <strong>Example:</strong> Excessive fertiliser application burns
                crops and reduces yields.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Interpreting the Law from Graphs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Total Product (TP) curve:</strong>
                <br />
                The TP curve slopes upward initially (Stage 1), then continues to
                rise but flattens out (Stage 2), and eventually declines (Stage 3).
              </li>
              <li>
                <strong>Marginal Product (MP) curve:</strong>
                <br />
                The MP curve rises (Stage 1), then peaks, then declines (Stage 2),
                and eventually becomes negative (Stage 3).
              </li>
              <li>
                <strong>Average Product (AP) curve:</strong>
                <br />
                The AP curve rises, peaks, and then declines (but stays positive
                until Stage 3).
              </li>
              <li>
                <strong>Optimum input level:</strong>
                <br />
                The point where MP = AP (maximum average product) is the most
                efficient use of inputs. Beyond this, returns diminish.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Implications in Agriculture</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fertiliser application:</strong>
                <br />
                Farmers must apply fertiliser at the optimum rate. Too little
                reduces yields; too much wastes money and can damage crops.
              </li>
              <li>
                <strong>Labour management:</strong>
                <br />
                Adding more labour to a fixed piece of land eventually leads to
                diminishing returns (too many workers may get in each other's way).
              </li>
              <li>
                <strong>Irrigation:</strong>
                <br />
                Over‑irrigation can lead to waterlogging, salinisation, and
                reduced yields.
              </li>
              <li>
                <strong>Livestock stocking rates:</strong>
                <br />
                Adding more animals to a fixed grazing area eventually reduces
                individual animal growth and may degrade the pasture.
              </li>
            </ul>

            <AgriImage
              fileName="law-diminishing-returns.webp"
              alt="A 2D diagram showing the law of diminishing returns with Total Product, Marginal Product, and Average Product curves, and the three stages of production"
              caption="Law of diminishing returns – stages and graphical interpretation."
            />
          </SubtopicCard>

          <SubtopicCard title="Risk vs Uncertainty in Agriculture">
            <p>
              <strong>Definition:</strong> Farmers face many uncertainties in
              their operations. Understanding the difference between risk and
              uncertainty is important for decision‑making.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Risk</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Risk occurs when the possible outcomes
                and their probabilities are known (measurable uncertainty).
              </li>
              <li>
                <strong>Agricultural examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Price risk:</strong> Farmers know that prices can go
                    up or down, but the probability of each outcome can be estimated
                    from past data.
                  </li>
                  <li>
                    <strong>Production risk:</strong> Yields vary due to weather,
                    pests, and diseases. Historical data can estimate the likelihood
                    of different outcomes.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Characteristics:</strong> Can be quantified and insured
                against (e.g., crop insurance).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Uncertainty</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Uncertainty occurs when the possible
                outcomes and their probabilities are unknown or cannot be estimated.
              </li>
              <li>
                <strong>Agricultural examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Climate change:</strong> Future rainfall patterns and
                    temperatures are uncertain – exact probabilities are unknown.
                  </li>
                  <li>
                    <strong>New pests/diseases:</strong> A new disease may emerge
                    (e.g., African swine fever) with unknown spread and impact.
                  </li>
                  <li>
                    <strong>Policy changes:</strong> Government policies on
                    subsidies, taxes, or trade can change unexpectedly.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Characteristics:</strong> Cannot be easily quantified or
                insured against. Requires flexible strategies.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ways of Minimising the Effects of Risk and Uncertainty</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Diversification:</strong>
                <br />
                Growing different crops and keeping different livestock reduces
                the impact of failure in one enterprise.
                <br />
                <strong>Zimbabwe example:</strong> A farmer growing both maize
                and tobacco, and keeping cattle.
              </li>
              <li>
                <strong>Insurance:</strong>
                <br />
                Crop insurance, livestock insurance, and income insurance can
                protect against losses.
                <br />
                <strong>Zimbabwe example:</strong> Agricultural insurance through
                the Agricultural Insurance Company (AIC).
              </li>
              <li>
                <strong>Contract farming:</strong>
                <br />
                Entering into contracts with buyers (e.g., tobacco companies)
                guarantees a market and price, reducing price risk.
              </li>
              <li>
                <strong>Use of technology:</strong>
                <br />
                Improved seeds, irrigation, pest control, and forecasting reduce
                production risk.
              </li>
              <li>
                <strong>Storage:</strong>
                <br />
                Storing produce (e.g., in silos) allows farmers to sell when
                prices are higher, reducing price risk.
              </li>
              <li>
                <strong>Flexible planning:</strong>
                <br />
                Develop contingency plans for different scenarios (e.g., drought
                plan, pest outbreak plan).
              </li>
              <li>
                <strong>Market information:</strong>
                <br />
                Access to price and demand information helps farmers make
                better decisions.
              </li>
            </ul>

            <AgriImage
              fileName="risk-uncertainty-agriculture.webp"
              alt="A 2D diagram showing risk vs uncertainty in agriculture, with examples and strategies to minimise effects"
              caption="Risk vs uncertainty in agriculture – minimising their effects."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Decision‑Making in Agriculture">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Resource allocation:</strong>
                <br />
                Decisions determine how land, labour, and capital are used.
                Good decisions maximise returns.
              </li>
              <li>
                <strong>Profitability:</strong>
                <br />
                Decisions affect costs and revenues. Poor decisions lead to losses.
              </li>
              <li>
                <strong>Risk management:</strong>
                <br />
                Decisions help manage and reduce risks (e.g., choosing drought‑
                tolerant crops).
              </li>
              <li>
                <strong>Adaptation:</strong>
                <br />
                Farmers must adapt to changing conditions (weather, markets,
                technology). Good decision‑making allows this.
              </li>
              <li>
                <strong>Sustainability:</strong>
                <br />
                Decisions affect long‑term sustainability (soil health, water use,
                environmental impact).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Economic Factors Influencing Farm Decisions">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Price of inputs:</strong>
                <br />
                High fertiliser or seed prices may reduce the amount used or
                change the crop choice.
              </li>
              <li>
                <strong>Price of outputs:</strong>
                <br />
                High product prices encourage more production; low prices may
                cause farmers to switch to other crops.
              </li>
              <li>
                <strong>Cost of labour:</strong>
                <br />
                High wages may encourage mechanisation; low wages may favour
                labour‑intensive crops.
              </li>
              <li>
                <strong>Government policies and subsidies:</strong>
                <br />
                Subsidies (e.g., input subsidies) encourage production; taxes
                and regulations discourage it.
              </li>
              <li>
                <strong>Interest rates:</strong>
                <br />
                High interest rates make borrowing expensive, reducing investment
                in new equipment or expansion.
              </li>
              <li>
                <strong>Access to markets:</strong>
                <br />
                Markets that are close and accessible reduce transport costs and
                increase profitability.
              </li>
              <li>
                <strong>Technology availability:</strong>
                <br />
                Access to improved seeds, irrigation, and machinery affects
                productivity and costs.
              </li>
              <li>
                <strong>Risk and uncertainty:</strong>
                <br />
                As discussed above, risk and uncertainty affect decisions about
                what to produce and how much.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Steps in Farm Decision‑Making">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1 – Identify the problem or opportunity:</strong>
                <br />
                Recognise that a decision needs to be made. Example: "Which crop
                should I plant next season?"
              </li>
              <li>
                <strong>Step 2 – Gather information:</strong>
                <br />
                Collect data on prices, costs, yields, weather forecasts, and
                market trends.
              </li>
              <li>
                <strong>Step 3 – Identify alternatives:</strong>
                <br />
                List all possible options. Example: Maize, tobacco, cotton,
                sunflower, or vegetables.
              </li>
              <li>
                <strong>Step 4 – Analyse alternatives:</strong>
                <br />
                Evaluate each option based on costs, returns, risks, and resources
                required. Use budgets and gross margin calculations.
              </li>
              <li>
                <strong>Step 5 – Choose the best alternative:</strong>
                <br />
                Select the option that maximises net returns while meeting
                constraints (capital, labour, etc.).
              </li>
              <li>
                <strong>Step 6 – Implement the decision:</strong>
                <br />
                Put the chosen plan into action (plant, buy inputs, etc.).
              </li>
              <li>
                <strong>Step 7 – Monitor and evaluate:</strong>
                <br />
                Track performance against the plan. Adjust if necessary.
              </li>
            </ul>

            <AgriImage
              fileName="farm-decision-making.webp"
              alt="A 2D diagram showing the steps in farm decision-making: identify problem, gather information, identify alternatives, analyse, choose, implement, monitor"
              caption="Steps in farm decision‑making."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Diminishing returns:</strong> additional input gives less extra output</li>
            <li><strong>Risk:</strong> measurable uncertainty (probabilities known)</li>
            <li><strong>Uncertainty:</strong> unknown probabilities</li>
            <li><strong>Diversification:</strong> reducing risk by mixing enterprises</li>
            <li><strong>Decision‑making:</strong> steps: identify → information → alternatives → analyse → choose → implement → monitor</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'marketing-legislation',
      title: 'Marketing – Legislation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Marketing Legislation for Agricultural Produce and Commodities">
            <p>
              <strong>Definition:</strong> Marketing legislation refers to laws,
              regulations, and policies that govern the sale, distribution, and
              pricing of agricultural products. These laws aim to protect farmers,
              consumers, and the national economy.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose of marketing legislation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Protect farmers from exploitation by middlemen.</li>
                  <li>Ensure food security and stable prices.</li>
                  <li>Maintain quality standards for exports and domestic consumption.</li>
                  <li>Control the supply and distribution of strategic commodities.</li>
                  <li>Generate revenue through taxes and levies.</li>
                </ul>
              </li>
              <li>
                <strong>Key legislation in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Grain Marketing Act:</strong> Establishes the Grain
                    Marketing Board (GMB) and regulates the marketing of grains
                    (maize, wheat, sorghum, millet).
                  </li>
                  <li>
                    <strong>Tobacco Industry and Marketing Act:</strong> Regulates
                    the tobacco industry, including licensing of buyers, auction
                    floors, and contract farming.
                  </li>
                  <li>
                    <strong>Cereal Marketing Act:</strong> Governs the marketing
                    of cereals and other grains.
                  </li>
                  <li>
                    <strong>Cotton Marketing Act:</strong> Regulates the cotton
                    industry, including licensing of ginners and buyers.
                  </li>
                  <li>
                    <strong>Dairy Act:</strong> Regulates the dairy industry
                    (quality standards, licensing of processors).
                  </li>
                  <li>
                    <strong>Meat and Meat Products Act:</strong> Regulates the
                    meat industry (abattoirs, meat inspections, exports).
                  </li>
                  <li>
                    <strong>Wine and Spirits Act:</strong> Regulates the marketing
                    of wine and spirits (quality control).
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Crop and Animal Products Controlled by Marketing Legislation in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Grains and Cereals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodities:</strong> Maize, wheat, sorghum, millet,
                barley, and other cereals.
              </li>
              <li>
                <strong>Controlling authority:</strong> Grain Marketing Board (GMB).
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of buyers and sellers.</li>
                  <li>Minimum or fixed prices (sometimes).</li>
                  <li>Quality standards (moisture content, foreign matter).</li>
                  <li>Export and import controls.</li>
                  <li>Compulsory delivery of strategic reserves (in some cases).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tobacco</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodity:</strong> Flue‑cured and air‑cured tobacco.
              </li>
              <li>
                <strong>Controlling authority:</strong> Tobacco Industry and
                Marketing Board (TIMB), Tobacco Auction Floors (TAF).
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of growers, buyers, and merchants.</li>
                  <li>Marketing through auction floors or contract farming.</li>
                  <li>Quality grading and classification.</li>
                  <li>Export licensing and quotas.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cotton</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodity:</strong> Seed cotton and lint.
              </li>
              <li>
                <strong>Controlling authority:</strong> Cotton Company of Zimbabwe
                (COTCO) under the Cotton Marketing Act.
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of growers, ginners, and buyers.</li>
                  <li>Contract farming arrangements.</li>
                  <li>Quality standards (staple length, trash content).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sugar</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodity:</strong> Sugar cane and refined sugar.
              </li>
              <li>
                <strong>Controlling authority:</strong> Sugar Marketing Corporation
                (SMC) and Sugar Processing Industry.
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of sugar processors.</li>
                  <li>Price controls (sometimes).</li>
                  <li>Export and import controls.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dairy Products</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodities:</strong> Milk, cheese, butter, yoghurt.
              </li>
              <li>
                <strong>Controlling authority:</strong> Zimbabwe Dairy Industry
                Trust (ZDIT) under the Dairy Act.
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of dairy processors.</li>
                  <li>Quality standards (fat content, bacterial count).</li>
                  <li>Price controls (sometimes).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Meat and Meat Products</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodities:</strong> Beef, pork, mutton, poultry, and
                processed meats.
              </li>
              <li>
                <strong>Controlling authority:</strong> Meat Industry Board under
                the Meat and Meat Products Act.
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Licensing of abattoirs and meat processors.</li>
                  <li>Meat inspection and quality standards.</li>
                  <li>Export controls and certification.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Horticultural Products</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commodities:</strong> Fresh fruit, vegetables, flowers
                (for export).
              </li>
              <li>
                <strong>Controlling authority:</strong> Horticultural Export
                Authority (HEA) under the Horticultural Export Act.
              </li>
              <li>
                <strong>Regulations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Export licensing and certification.</li>
                  <li>Quality standards (size, grade, packaging).</li>
                  <li>Phytosanitary (pest and disease) control.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Other Controlled Products</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Oilseeds:</strong> Soyabeans, sunflower, groundnuts
                (controlled through licensing and contract farming).
              </li>
              <li>
                <strong>Tea and Coffee:</strong> Quality control and export
                licensing.
              </li>
              <li>
                <strong>Hides and Skins:</strong> Export controls and licensing
                of tanneries.
              </li>
            </ul>

            <AgriImage
              fileName="marketing-legislation-zimbabwe.webp"
              alt="A 2D diagram showing marketing legislation for agricultural products in Zimbabwe: grains (GMB), tobacco (TIMB/TAF), cotton (COTCO), sugar (SMC), dairy (ZDIT), meat, horticulture (HEA)"
              caption="Crop and animal products controlled by marketing legislation in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Marketing Legislation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Purpose:</strong> protect farmers, ensure food security, quality control</li>
            <li><strong>Key Acts:</strong> Grain Marketing Act, Tobacco Act, Cotton Act, Dairy Act</li>
            <li><strong>Controlled:</strong> maize, wheat, tobacco, cotton, sugar, dairy, meat, horticulture</li>
            <li><strong>Authorities:</strong> GMB, TIMB, COTCO, SMC, ZDIT, HEA</li>
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
            Explore the law of diminishing returns, risk vs uncertainty,
            decision‑making in agriculture, and marketing legislation for
            agricultural products in Zimbabwe.
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
                  <strong className="text-white">Law of diminishing returns:</strong>
                  Adding more inputs to fixed resources eventually gives smaller
                  extra outputs (fertiliser, labour, irrigation). Farmers must find
                  the optimum input level (where MP = AP).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Risk vs uncertainty:</strong> Risk
                  has measurable probabilities (price, yield); uncertainty has
                  unknown probabilities (climate change, new diseases). Minimise
                  effects through diversification, insurance, contracts, technology,
                  and flexible planning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Decision‑making:</strong> Steps
                  include identify problem, gather information, identify alternatives,
                  analyse, choose, implement, monitor. Economic factors influencing
                  decisions: input/output prices, labour costs, policies, interest
                  rates, and markets.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Marketing legislation:</strong>
                  Laws regulate the sale of agricultural products. In Zimbabwe,
                  controlled products include grains (GMB), tobacco (TIMB/TAF),
                  cotton (COTCO), sugar (SMC), dairy (ZDIT), meat, and horticulture
                  (HEA). Legislation protects farmers and ensures quality.
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

   1. law-diminishing-returns.png
      A 2D diagram showing three stages of production with Total Product (TP),
      Marginal Product (MP), and Average Product (AP) curves. Label Stages 1
      (increasing), 2 (diminishing), and 3 (negative). Show optimum point where
      MP = AP.

   2. risk-uncertainty-agriculture.png
      A 2D diagram comparing risk (measurable – price risk, production risk)
      and uncertainty (unknown – climate change, new diseases). Show strategies
      to minimise effects: diversification, insurance, contracts, technology,
      storage, flexible planning.

   3. farm-decision-making.png
      A flowchart diagram showing the 7 steps in farm decision-making:
      identify problem → gather information → identify alternatives → analyse →
      choose → implement → monitor/evaluate.

   4. marketing-legislation-zimbabwe.png
      A 2D diagram showing controlled agricultural products and their authorities:
      Grains (GMB), Tobacco (TIMB/TAF), Cotton (COTCO), Sugar (SMC), Dairy (ZDIT),
      Meat, Horticulture (HEA). Show icons for each product.

   ============================================================ */