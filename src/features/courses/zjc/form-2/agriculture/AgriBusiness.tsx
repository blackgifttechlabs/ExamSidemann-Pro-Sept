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

          <SubtopicCard title="Functions of a Profit and Loss Account">
            <p>
              <strong>Definition:</strong> A Profit and Loss Account (also called
              an Income Statement) is a financial statement that summarises a
              farm's income and expenses over a specific period (usually a year).
              It shows whether the farm made a profit or a loss.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Shows profitability:</strong> It calculates net profit
                (or loss) by subtracting total expenses from total income.
              </li>
              <li>
                <strong>Helps in decision‑making:</strong> Farmers can see which
                enterprises are profitable and which are not.
              </li>
              <li>
                <strong>Assists in budgeting:</strong> Past accounts help plan
                for the next season.
              </li>
              <li>
                <strong>Supports loan applications:</strong> Banks require profit
                and loss accounts to assess the farm's financial health.
              </li>
              <li>
                <strong>Measures efficiency:</strong> It helps compare performance
                over time and against other farms.
              </li>
              <li>
                <strong>Tax compliance:</strong> Governments require accounts for
                calculating tax owed.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Designing a Profit and Loss Account">
            <p>
              A profit and loss account has a simple structure: <strong>Income</strong>
              on one side and <strong>Expenditure</strong> on the other. The
              difference between the two is the <strong>net profit</strong> (if
              income is higher) or <strong>net loss</strong> (if expenditure is higher).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Format of a Profit and Loss Account</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left font-bold" colSpan={2}>
                      Profit and Loss Account – [Farm Name]
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-bold" colSpan={2}>
                      Income (Revenue)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Crop sales (maize, tobacco, etc.)</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$20,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Livestock sales</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$8,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Other income (e.g., manure, machinery hire)</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$2,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-bold">Total Income</td>
                    <td className="border border-slate-300 px-4 py-2 text-right font-bold">$30,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-bold" colSpan={2}>
                      Expenditure (Costs)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Seeds and planting materials</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$3,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Fertilisers and chemicals</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$5,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Feed</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$4,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Labour</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$6,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Fuel and repairs</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$2,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Marketing and transport</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$2,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Other costs (insurance, rent, etc.)</td>
                    <td className="border border-slate-300 px-4 py-2 text-right">$1,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-bold">Total Expenditure</td>
                    <td className="border border-slate-300 px-4 py-2 text-right font-bold">$23,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-bold">Net Profit (Income – Expenditure)</td>
                    <td className="border border-slate-300 px-4 py-2 text-right font-bold">$7,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SubtopicCard>

          <SubtopicCard title="Identifying Income and Expenditure">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Income (Revenue)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cash sales:</strong> Money from selling crops, livestock,
                and livestock products.
              </li>
              <li>
                <strong>Other income:</strong> Manure sales, machinery hire,
                rental income, subsidies, grants, or compensation payments.
              </li>
              <li>
                <strong>Closing stock:</strong> The value of unsold produce at
                the end of the accounting period.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Expenditure (Costs)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Variable costs:</strong> Costs that change with production
                levels.
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seeds, fertilisers, chemicals, feed.</li>
                  <li>Fuel, packaging, marketing costs.</li>
                  <li>Casual labour.</li>
                </ul>
              </li>
              <li>
                <strong>Fixed costs:</strong> Costs that do not change with production
                levels (they are constant).
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Rent, rates, insurance.</li>
                  <li>Depreciation of machinery and buildings.</li>
                  <li>Permanent labour.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Calculating Enterprise Income">
            <p>
              <strong>Definition:</strong> Enterprise income is the profit (or loss)
              from a specific enterprise (e.g., maize, tobacco, cattle) on the farm.
              It helps farmers decide which enterprises are profitable and which
              need improvement or removal.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Formula</h4>
            <p className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
              Enterprise Income = Gross Income from Enterprise – Direct Costs of Enterprise
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example: Maize Enterprise</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Gross Income:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>10 tonnes × $300/tonne = $3,000</li>
                </ul>
              </li>
              <li>
                <strong>Direct Costs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seeds: $200</li>
                  <li>Fertilisers: $500</li>
                  <li>Chemicals: $100</li>
                  <li>Labour: $600</li>
                  <li>Other costs: $200</li>
                  <li>Total: $1,600</li>
                </ul>
              </li>
              <li>
                <strong>Enterprise Income:</strong>
                <br />
                $3,000 – $1,600 = <strong>$1,400</strong> (profit)
              </li>
            </ul>

            <p>
              By calculating the enterprise income for each enterprise, a farmer
              can see which crops or livestock are most profitable and make
              informed decisions for the next season.
            </p>

            <AgriImage
              fileName="profit-loss-account.png"
              alt="A 2D diagram showing the structure of a profit and loss account with income and expenditure categories"
              caption="Profit and Loss Account – understanding income and expenditure."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Profit &amp; Loss Account:</strong> summary of income and expenses</li>
            <li><strong>Income:</strong> money earned (sales, subsidies)</li>
            <li><strong>Expenditure:</strong> money spent (inputs, labour, marketing)</li>
            <li><strong>Variable costs:</strong> change with production</li>
            <li><strong>Fixed costs:</strong> constant (rent, insurance)</li>
            <li><strong>Enterprise income:</strong> profit from one enterprise</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'marketing',
      title: 'Marketing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Marketing?">
            <p>
              <strong>Definition:</strong> Marketing is the process of getting
              farm products from the producer (farmer) to the consumer. It includes
              all activities involved in the sale and distribution of agricultural
              produce, such as grading, packaging, storage, transport, and pricing.
            </p>
            <p>
              In Zimbabwe, farmers use different marketing channels depending on
              the crop or livestock, the scale of production, and market conditions.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Controlled vs Uncontrolled Markets">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Controlled Markets</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Markets where the government or a
                statutory body regulates prices, quality standards, and the
                marketing process.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Government sets minimum or fixed prices.</li>
                  <li>Quality standards are enforced.</li>
                  <li>Marketing boards may be involved (e.g., Grain Marketing Board).</li>
                  <li>Often used for strategic crops (maize, wheat, cotton).</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Farmers have a guaranteed market.</li>
                  <li>Prices are stabilised (less fluctuation).</li>
                  <li>Quality standards are maintained.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Prices may be lower than open market prices.</li>
                  <li>Payment delays are common.</li>
                  <li>Less flexibility for farmers.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Grain Marketing Board (GMB) – buys maize, wheat, and other grains.</li>
                  <li>Cotton Company of Zimbabwe (COTCO) – regulates cotton marketing.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Uncontrolled (Open) Markets</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Markets where prices are determined by
                supply and demand forces, without government intervention.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Prices fluctuate based on supply and demand.</li>
                  <li>No minimum or maximum price restrictions.</li>
                  <li>Farmers negotiate directly with buyers.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Farmers can get higher prices when demand is high.</li>
                  <li>More flexibility and choice.</li>
                  <li>Can sell to the highest bidder.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Price volatility – farmers may get very low prices.</li>
                  <li>No guaranteed market.</li>
                  <li>Farmers may be exploited by middlemen.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Vegetable markets (Mbare Musika, Ngarwe, etc.).</li>
                  <li>Livestock auctions (e.g., cattle sales in communal areas).</li>
                  <li>Private buyers (processors, exporters).</li>
                </ul>
              </li>
            </ul>

            <AgriImage
              fileName="controlled-uncontrolled-markets.png"
              alt="A 2D diagram comparing controlled markets (GMB, COTCO) and uncontrolled markets (open markets, auctions) with advantages and disadvantages"
              caption="Controlled vs uncontrolled markets in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Formal vs Informal Markets">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Formal Markets</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Markets that are officially recognised,
                registered, and operate within a legal framework. They have
                established rules, quality standards, and payment systems.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Registered businesses (companies, co‑operatives).</li>
                  <li>Contracts and agreements are used.</li>
                  <li>Quality standards are enforced.</li>
                  <li>Payments are made through banks (traceable).</li>
                  <li>Taxes are paid.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reliable payment systems.</li>
                  <li>Access to credit and contracts.</li>
                  <li>Better prices (often for high‑quality products).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strict quality requirements – may exclude small farmers.</li>
                  <li>May involve bureaucracy and delays.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples (major crops/livestock):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Tobacco:</strong> Sold through the Tobacco Auction
                    Floors (TAF) or contract farming companies.
                  </li>
                  <li>
                    <strong>Cotton:</strong> Sold through COTCO or contract
                    farming arrangements.
                  </li>
                  <li>
                    <strong>Maize:</strong> Sold to the Grain Marketing Board (GMB)
                    or large processors.
                  </li>
                  <li>
                    <strong>Sugar:</strong> Processed by and sold through Sugar
                    Marketing Corporation.
                  </li>
                  <li>
                    <strong>Cattle:</strong> Sold through registered livestock
                    auctions or directly to abattoirs.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Informal Markets</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Markets that operate outside the
                formal legal and regulatory framework. They are often based on
                direct, personal transactions between farmers and consumers or
                middlemen.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>No formal registration or contracts.</li>
                  <li>Cash payments (often untraceable).</li>
                  <li>No official quality standards.</li>
                  <li>Often low‑value products or small quantities.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Quick and flexible – farmers can sell immediately.</li>
                  <li>No bureaucracy.</li>
                  <li>Accessible to small‑scale farmers.</li>
                  <li>Cash payments (no delays).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Lower prices (farmers may get poor deals).</li>
                  <li>No contracts or guarantees.</li>
                  <li>No quality control – can damage reputation.</li>
                  <li>No tax contributions.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples (major crops/livestock):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Vegetables:</strong> Sold at Mbare Musika, Ngarwe
                    Market, and roadside stalls.
                  </li>
                  <li>
                    <strong>Maize and grain:</strong> Sold locally to neighbours
                    or informal traders.
                  </li>
                  <li>
                    <strong>Poultry and eggs:</strong> Sold locally to consumers
                    and small shops.
                  </li>
                  <li>
                    <strong>Cattle:</strong> Sold directly to neighbours, local
                    dealers, or at informal auctions.
                  </li>
                  <li>
                    <strong>Small livestock:</strong> Goats, sheep, and pigs sold
                    at local markets or directly to consumers.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison: Formal vs Informal Markets</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Formal Markets</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Informal Markets</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Registration</td>
                  <td className="border border-slate-300 px-4 py-2">Yes (regulated)</td>
                  <td className="border border-slate-300 px-4 py-2">No (unregulated)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Contracts</td>
                  <td className="border border-slate-300 px-4 py-2">Yes</td>
                  <td className="border border-slate-300 px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Quality control</td>
                  <td className="border border-slate-300 px-4 py-2">Strict</td>
                  <td className="border border-slate-300 px-4 py-2">Minimal</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Payment</td>
                  <td className="border border-slate-300 px-4 py-2">Bank transfers (traceable)</td>
                  <td className="border border-slate-300 px-4 py-2">Cash</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Prices</td>
                  <td className="border border-slate-300 px-4 py-2">Stable, often higher</td>
                  <td className="border border-slate-300 px-4 py-2">Fluctuate, often lower</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Access</td>
                  <td className="border border-slate-300 px-4 py-2">Commercial farmers</td>
                  <td className="border border-slate-300 px-4 py-2">All farmers (especially small)</td>
                </tr>
              </tbody>
            </table>

            <AgriImage
              fileName="formal-informal-markets.png"
              alt="A 2D diagram comparing formal markets (tobacco auction floors, GMB, contract farming) and informal markets (Mbare, roadside, local sales)"
              caption="Formal vs informal markets for major crops and livestock in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Marketing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Controlled:</strong> GMB, COTCO – stable prices, guaranteed market</li>
            <li><strong>Uncontrolled:</strong> open markets – prices by supply/demand</li>
            <li><strong>Formal:</strong> auction floors, contracts, banks</li>
            <li><strong>Informal:</strong> Mbare, roadside, local sales</li>
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

          <SubtopicCard title="Benefits of Agricultural Cooperatives">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Bargaining power:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Cooperatives buy inputs in bulk (seeds, fertiliser, feed)
                    at lower prices.</li>
                  <li>They negotiate better prices for produce by selling in
                    large quantities.</li>
                </ul>
              </li>
              <li>
                <strong>Access to credit and savings:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Many cooperatives have savings and credit schemes (SACCOs)
                    that provide loans at lower interest rates.</li>
                  <li>Banks are more willing to lend to a cooperative than to
                    individual small farmers.</li>
                </ul>
              </li>
              <li>
                <strong>Shared resources:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Members can share machinery (tractors, tillers), transport,
                    and storage facilities.</li>
                  <li>Reduces costs for individual members.</li>
                </ul>
              </li>
              <li>
                <strong>Knowledge sharing and training:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Cooperatives provide training in improved farming methods,
                    financial management, and marketing.</li>
                  <li>Members learn from each other's experiences.</li>
                </ul>
              </li>
              <li>
                <strong>Improved market access:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Cooperatives can access formal markets that may be
                    unavailable to individual farmers (e.g., export contracts).</li>
                  <li>They can process and package produce to add value.</li>
                </ul>
              </li>
              <li>
                <strong>Reduced transaction costs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Buying and selling in bulk reduces marketing and transport
                    costs per unit.</li>
                </ul>
              </li>
              <li>
                <strong>Social benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Cooperatives build community solidarity and social capital.</li>
                  <li>They provide a forum for farmers to share ideas and support
                    each other.</li>
                </ul>
              </li>
              <li>
                <strong>Government support:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>In Zimbabwe, cooperatives are often eligible for government
                    programmes and subsidies (e.g., Pfumvudza inputs, irrigation
                    schemes).</li>
                </ul>
              </li>
            </ul>

            <AgriImage
              fileName="cooperative-benefits.png"
              alt="A 2D diagram showing benefits of agricultural cooperatives: bargaining power, credit access, shared resources, training, market access, social benefits"
              caption="Benefits of agricultural cooperatives."
            />
          </SubtopicCard>

          <SubtopicCard title="Problems Associated with Agricultural Cooperatives">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Poor management and leadership:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Many cooperatives lack skilled managers.</li>
                  <li>Committee members may lack business and financial knowledge.</li>
                  <li>Poor decision‑making leads to losses.</li>
                </ul>
              </li>
              <li>
                <strong>Insufficient capital:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Members often cannot contribute enough starting capital.</li>
                  <li>Cooperatives struggle to raise funds for operations and
                    investments.</li>
                </ul>
              </li>
              <li>
                <strong>Member conflicts and disagreements:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Disputes over decisions, benefit sharing, and leadership
                    can split the cooperative.</li>
                  <li>Some members may not contribute equally.</li>
                </ul>
              </li>
              <li>
                <strong>Lack of commitment:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Some members join only to get benefits but do not
                    participate actively.</li>
                  <li>This leads to low morale and poor performance.</li>
                </ul>
              </li>
              <li>
                <strong>External competition:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Cooperatives compete with large, well‑established
                    private companies.</li>
                  <li>They may struggle to match the prices and services
                    offered by competitors.</li>
                </ul>
              </li>
              <li>
                <strong>Regulatory and bureaucratic hurdles:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Registration and reporting requirements can be complex
                    and time‑consuming.</li>
                  <li>Government bureaucracy can delay access to support and funding.</li>
                </ul>
              </li>
              <li>
                <strong>Political interference:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Sometimes cooperatives are used for political purposes
                    rather than economic goals.</li>
                  <li>This can undermine their effectiveness and credibility.</li>
                </ul>
              </li>
              <li>
                <strong>Lack of transparency and accountability:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Corruption and misuse of funds can occur if there are no
                    proper checks and balances.</li>
                  <li>Members may not be informed about the cooperative's financial
                    health.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Success stories:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Some irrigation cooperatives in the Lowveld have improved
                    sugar production.</li>
                  <li>Marketing cooperatives in Mashonaland have helped tobacco
                    farmers get better prices.</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Many cooperatives struggle with funding and management.</li>
                  <li>Some have collapsed due to internal conflicts or economic
                    challenges.</li>
                </ul>
              </li>
            </ul>

            <AgriImage
              fileName="cooperative-problems.png"
              alt="A 2D diagram showing problems associated with cooperatives: poor management, capital shortage, conflicts, lack of commitment, competition, bureaucracy"
              caption="Problems associated with agricultural cooperatives."
            />
          </SubtopicCard>

          <SubtopicCard title="Ways to Strengthen Agricultural Cooperatives">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Capacity building:</strong> Provide training in management,
                financial literacy, and leadership skills.
              </li>
              <li>
                <strong>Access to finance:</strong> Government and NGOs should
                provide grants and low‑interest loans.
              </li>
              <li>
                <strong>Strong governance:</strong> Establish clear rules,
                transparent financial management, and accountability mechanisms.
              </li>
              <li>
                <strong>Market links:</strong> Help cooperatives connect with
                formal markets and processors.
              </li>
              <li>
                <strong>Technology adoption:</strong> Support the use of modern
                farming and processing technologies.
              </li>
              <li>
                <strong>Networking:</strong> Encourage cooperatives to form
                federations or unions for greater bargaining power.
              </li>
              <li>
                <strong>Government support:</strong> Reduce bureaucracy, provide
                extension services, and ensure fair policies.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Cooperatives Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Benefits:</strong> bargaining power, credit, shared resources, training</li>
            <li><strong>Problems:</strong> poor management, capital shortage, conflicts</li>
            <li><strong>Solutions:</strong> training, finance, good governance, market links</li>
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
            Understand farm records and accounts (profit and loss), agricultural
            marketing (controlled vs uncontrolled, formal vs informal), and the
            benefits and problems of agricultural cooperatives in Zimbabwe.
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
                  <strong className="text-white">Profit and Loss Account:</strong>
                  It summarises income (sales, subsidies) and expenditure (inputs,
                  labour, marketing). Net profit = Income – Expenditure. It helps
                  farmers decide which enterprises are profitable.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Marketing:</strong> Controlled
                  markets (e.g., GMB, COTCO) have fixed prices and guaranteed
                  markets. Uncontrolled markets (open) have prices set by supply
                  and demand. Formal markets (tobacco auction floors, contracts)
                  are regulated; informal markets (Mbare, roadside) are unregulated.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Cooperatives:</strong> They offer
                  benefits like bargaining power, credit access, shared resources,
                  and training. However, they face problems such as poor management,
                  capital shortage, conflicts, and external competition.
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
   1. profit-loss-account.png
      A 2D diagram showing the structure of a profit and loss account with
      income (crop sales, livestock sales, other income) and expenditure
      (seeds, fertiliser, labour, marketing). Show net profit formula.

   --- MARKETING ---
   2. controlled-uncontrolled-markets.png
      A 2D diagram comparing controlled markets (GMB logo, COTCO logo, fixed
      prices, guaranteed market) with uncontrolled markets (open market scene,
      fluctuating prices, no guarantees).

   3. formal-informal-markets.png
      A 2D diagram comparing formal markets (tobacco auction floor, contract
      farming, bank payments) with informal markets (Mbare Musika, roadside
      sale, cash payments).

   --- AGRICULTURAL COOPERATIVES ---
   4. cooperative-benefits.png
      A 2D diagram showing benefits: bargaining power (bulk buying), credit
      access (money bag), shared resources (tractor), training (blackboard),
      market access (shop), social benefits (handshake).

   5. cooperative-problems.png
      A 2D diagram showing problems: poor management (confused leader),
      capital shortage (empty wallet), conflicts (argument), lack of commitment
      (sleeping member), competition, bureaucracy.

   ============================================================ */