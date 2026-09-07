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
      id: 'principles-economics',
      title: 'Principles of Economics',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Opportunities Available to the Farmer and the Concept of Opportunity Cost">
            <p>
              <strong>Definition:</strong> In farming, a <strong>choice</strong>
              involves deciding how to use limited resources (land, labour, capital)
              among competing alternatives. <strong>Opportunity cost</strong> is
              the value of the next best alternative that is given up when a
              choice is made.
            </p>
            <p>
              Farmers face choices every day, such as what to plant, how much to
              produce, and when to sell.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Opportunities Available to the Farmer</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Choice of crop:</strong>
                <br />
                A farmer can choose to plant maize, tobacco, cotton, or vegetables
                on a given piece of land. Each option has different costs, returns,
                and risks.
              </li>
              <li>
                <strong>Choice of livestock:</strong>
                <br />
                A farmer can choose to keep cattle, goats, pigs, or poultry.
                Each has different capital requirements, management needs, and
                market opportunities.
              </li>
              <li>
                <strong>Choice of market:</strong>
                <br />
                A farmer can choose to sell through formal channels (e.g., GMB,
                auction floors) or informal channels (e.g., local markets, direct
                to consumers).
              </li>
              <li>
                <strong>Choice of technology:</strong>
                <br />
                A farmer can choose between traditional methods (hand ploughing)
                and modern methods (tractors, irrigation). Technology affects
                costs and productivity.
              </li>
              <li>
                <strong>Choice of timing:</strong>
                <br />
                A farmer can choose when to plant, when to harvest, and when to
                sell. Timing affects yields and prices.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Concept of Opportunity Cost</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong>
                <br />
                The opportunity cost of a decision is the value of the best
                alternative that is forgone.
              </li>
              <li>
                <strong>Example 1:</strong>
                <br />
                If a farmer uses 2 hectares of land to plant maize, the opportunity
                cost is the profit they could have made by planting tobacco on
                that land (the next best alternative).
              </li>
              <li>
                <strong>Example 2:</strong>
                <br />
                If a farmer spends $500 on fertiliser, the opportunity cost is
                what else they could have bought with that $500 (e.g., a new
                water pump or extra seed).
              </li>
              <li>
                <strong>Example 3:</strong>
                <br />
                If a farmer uses their own labour on the farm, the opportunity
                cost is the wage they could have earned working elsewhere.
              </li>
              <li>
                <strong>Example 4:</strong>
                <br />
                If a farmer stores maize to sell later (hoping for a higher price),
                the opportunity cost is the income they forgo by not selling it
                immediately.
              </li>
            </ul>

            <AgriImage
              fileName="opportunity-cost-farmer.png"
              alt="A 2D diagram showing farmer choices and the concept of opportunity cost with examples"
              caption="Opportunities available to the farmer and the concept of opportunity cost."
            />
          </SubtopicCard>

          <SubtopicCard title="Laws of Demand and Supply">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">The Law of Demand</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong>
                <br />
                The law of demand states that as the price of a product increases,
                the quantity demanded decreases (and vice versa), assuming all
                other factors remain constant (ceteris paribus).
              </li>
              <li>
                <strong>Explanation:</strong>
                <br />
                When prices are high, consumers buy less. When prices are low,
                consumers buy more. This is because consumers have limited income
                and will look for substitutes if prices rise.
              </li>
              <li>
                <strong>Agricultural example:</strong>
                <br />
                If the price of maize increases, consumers will buy less maize
                and may switch to cheaper alternatives like sorghum or sweet potatoes.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">The Law of Supply</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong>
                <br />
                The law of supply states that as the price of a product increases,
                the quantity supplied increases (and vice versa), assuming all
                other factors remain constant (ceteris paribus).
              </li>
              <li>
                <strong>Explanation:</strong>
                <br />
                When prices are high, producers are willing to supply more because
                they can earn higher profits. When prices are low, producers supply
                less.
              </li>
              <li>
                <strong>Agricultural example:</strong>
                <br />
                If the price of tobacco increases, farmers will plant more tobacco
                (increase supply) to take advantage of the higher price.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Interpreting Demand and Supply Curves and Schedules">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Demand and Supply Schedules</h4>
            <p>
              A <strong>schedule</strong> is a table showing the quantity demanded
              or supplied at different prices.
            </p>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Demand Schedule for Maize</h5>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Price (USD/kg)</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Quantity Demanded (tonnes)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">0.50</td>
                  <td className="border border-slate-300 px-4 py-2">100</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">0.75</td>
                  <td className="border border-slate-300 px-4 py-2">80</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.00</td>
                  <td className="border border-slate-300 px-4 py-2">60</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.25</td>
                  <td className="border border-slate-300 px-4 py-2">40</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.50</td>
                  <td className="border border-slate-300 px-4 py-2">20</td>
                </tr>
              </tbody>
            </table>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Supply Schedule for Maize</h5>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Price (USD/kg)</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Quantity Supplied (tonnes)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">0.50</td>
                  <td className="border border-slate-300 px-4 py-2">20</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">0.75</td>
                  <td className="border border-slate-300 px-4 py-2">40</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.00</td>
                  <td className="border border-slate-300 px-4 py-2">60</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.25</td>
                  <td className="border border-slate-300 px-4 py-2">80</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1.50</td>
                  <td className="border border-slate-300 px-4 py-2">100</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Demand and Supply Curves</h4>
            <p>
              A <strong>curve</strong> is a graph of the schedule. The demand curve
              slopes <strong>downwards</strong> (from left to right), showing that
              as price increases, quantity demanded decreases. The supply curve
              slopes <strong>upwards</strong> (from left to right), showing that
              as price increases, quantity supplied increases.
            </p>
            <p>
              The point where the demand and supply curves intersect is the
              <strong>equilibrium</strong> – the market clearing price and quantity.
              At this point, quantity demanded equals quantity supplied.
            </p>

            <AgriImage
              fileName="demand-supply-curves.png"
              alt="A 2D diagram showing demand and supply curves with schedules, illustrating equilibrium price and quantity"
              caption="Demand and supply curves and schedules – interpreting market equilibrium."
            />
          </SubtopicCard>

          <SubtopicCard title="Determinants of Market Price">
            <p>
              <strong>Definition:</strong> Market price is the price at which
              goods and services are exchanged. It is determined by the interaction
              of supply and demand.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Affecting Demand (Shift of the Demand Curve)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Consumer income:</strong>
                <br />
                Higher incomes increase demand for normal goods (e.g., meat,
                vegetables). Lower incomes decrease demand.
              </li>
              <li>
                <strong>Consumer preferences:</strong>
                <br />
                Changes in tastes and preferences affect demand. For example,
                increased health awareness may increase demand for organic produce.
              </li>
              <li>
                <strong>Price of substitutes:</strong>
                <br />
                If the price of a substitute (e.g., sorghum) increases, demand
                for maize may increase.
              </li>
              <li>
                <strong>Price of complements:</strong>
                <br />
                If the price of a complement (e.g., bread) increases, demand for
                wheat may decrease.
              </li>
              <li>
                <strong>Consumer expectations:</strong>
                <br />
                If consumers expect prices to rise in the future, they may buy
                more now (increase demand).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Affecting Supply (Shift of the Supply Curve)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Production costs:</strong>
                <br />
                Higher input costs (fertiliser, labour, fuel) reduce supply
                (shift left). Lower costs increase supply (shift right).
              </li>
              <li>
                <strong>Technology:</strong>
                <br />
                Improved technology (e.g., better seeds, irrigation) increases
                supply by reducing costs or increasing yields.
              </li>
              <li>
                <strong>Weather and climate:</strong>
                <br />
                Favourable weather increases supply (higher yields). Droughts,
                floods, or pests reduce supply.
              </li>
              <li>
                <strong>Government policies:</strong>
                <br />
                Subsidies increase supply; taxes and regulations reduce supply.
              </li>
              <li>
                <strong>Number of producers:</strong>
                <br />
                More producers increase supply. Fewer producers reduce supply.
              </li>
            </ul>

            <AgriImage
              fileName="demand-supply-determinants.png"
              alt="A 2D diagram showing factors that shift demand and supply curves in agriculture"
              caption="Determinants of market price: factors affecting demand and supply."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Opportunity cost:</strong> the value of the next best alternative given up</li>
            <li><strong>Demand:</strong> quantity consumers are willing to buy at a given price</li>
            <li><strong>Supply:</strong> quantity producers are willing to sell at a given price</li>
            <li><strong>Equilibrium:</strong> where demand = supply (market price)</li>
            <li><strong>Ceteris paribus:</strong> all other things being equal</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-budgeting',
      title: 'Farm Budgeting',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Farm Budgeting?">
            <p>
              <strong>Definition:</strong> Farm budgeting is the process of
              planning and estimating the expected income and expenditure for
              a farm or an enterprise over a specific period (usually a season
              or a year). It helps farmers make informed decisions and control costs.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Importance of Budgeting">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Planning:</strong>
                <br />
                Helps farmers plan what to produce, how much to produce, and
                what inputs are needed.
              </li>
              <li>
                <strong>Decision‑making:</strong>
                <br />
                Assists in choosing between different enterprises (e.g., maize
                vs tobacco) by comparing potential profitability.
              </li>
              <li>
                <strong>Financial control:</strong>
                <br />
                Provides a benchmark to compare actual performance against
                planned performance. Identifies areas of overspending.
              </li>
              <li>
                <strong>Loan applications:</strong>
                <br />
                Banks and lenders require budgets to assess the viability of
                a farming project.
              </li>
              <li>
                <strong>Risk management:</strong>
                <br />
                Helps farmers anticipate costs and income, reducing financial
                uncertainty.
              </li>
              <li>
                <strong>Monitoring and evaluation:</strong>
                <br />
                Allows farmers to track progress and make adjustments during
                the season.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Sources of Budgeting Information">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Farm records (past seasons):</strong>
                <br />
                Past income and expenditure records provide historical data for
                estimating future budgets.
              </li>
              <li>
                <strong>Market prices:</strong>
                <br />
                Current and projected prices for inputs (seed, fertiliser) and
                outputs (crops, livestock).
              </li>
              <li>
                <strong>Agricultural extension services:</strong>
                <br />
                Government or private extension officers provide advice on
                recommended practices, yields, and costs.
              </li>
              <li>
                <strong>Input suppliers:</strong>
                <br />
                Suppliers provide price lists for seeds, fertiliser, chemicals,
                and equipment.
              </li>
              <li>
                <strong>Industry publications:</strong>
                <br />
                Magazines, bulletins, and online resources provide average yields,
                costs, and market trends.
              </li>
              <li>
                <strong>Peer farmers:</strong>
                <br />
                Other farmers can share their experiences and cost estimates.
              </li>
              <li>
                <strong>Research institutions:</strong>
                <br />
                Research stations (e.g., Agritex, universities) provide data on
                recommended practices and yields.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Calculating Gross Margin">
            <p>
              <strong>Definition:</strong> Gross margin is the difference between
              the total income from an enterprise and the total variable costs
              (costs that change with production). It shows the profitability of
              an enterprise before fixed costs are deducted.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Formula</h4>
            <p className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
              <strong>Gross Margin = Total Income – Total Variable Costs</strong>
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example: Gross Margin for Maize (1 hectare)</h4>
            <p>
              <strong>Income:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Yield: 5 tonnes/ha</li>
              <li>Price: $300/tonne</li>
              <li><strong>Total Income = 5 × $300 = $1,500</strong></li>
            </ul>
            <p>
              <strong>Variable Costs:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Seeds: $80</li>
              <li>Fertilisers (basal + top dressing): $350</li>
              <li>Chemicals (herbicides, pesticides): $120</li>
              <li>Labour (planting, weeding, harvesting): $200</li>
              <li>Fuel/transport: $50</li>
              <li><strong>Total Variable Costs = $800</strong></li>
            </ul>
            <p>
              <strong>Gross Margin = $1,500 – $800 = $700</strong>
            </p>
            <p className="text-sm text-slate-600 italic">
              This $700 contributes to covering fixed costs (rent, machinery
              depreciation, permanent labour) and profit.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Preparing Partial and Complete/Whole‑Farm Budgets">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Partial Budget</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong>
                <br />
                A partial budget analyses the financial effect of a small change
                in the farm business (e.g., introducing a new crop, buying a new
                tractor, or changing a production practice).
              </li>
              <li>
                <strong>Structure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Additional income:</strong> Extra revenue from the change.
                  </li>
                  <li>
                    <strong>Costs saved:</strong> Costs that are avoided because
                    of the change.
                  </li>
                  <li>
                    <strong>Additional costs:</strong> New costs incurred because
                    of the change.
                  </li>
                  <li>
                    <strong>Income foregone:</strong> Revenue lost from the change
                    (opportunity cost).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Formula:</strong>
                <br />
                <span className="bg-slate-100 p-1 rounded font-mono text-sm">
                  Net Benefit = (Additional Income + Costs Saved) – (Additional Costs + Income Foregone)
                </span>
              </li>
              <li>
                <strong>Example:</strong>
                <br />
                A farmer is considering replacing 1 hectare of maize with tobacco.
                <br />
                Additional income from tobacco: $2,000
                <br />
                Costs saved (maize costs): $800
                <br />
                Additional costs (tobacco inputs): $1,200
                <br />
                Income foregone (maize income): $1,500
                <br />
                Net Benefit = ($2,000 + $800) – ($1,200 + $1,500) = $2,800 – $2,700 = <strong>+$100</strong>
                <br />
                The change is worthwhile (small profit).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Complete/Whole‑Farm Budget</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong>
                <br />
                A complete budget covers the entire farm business for a full
                production period (usually one year). It includes all income
                from all enterprises and all costs (both variable and fixed).
              </li>
              <li>
                <strong>Structure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Total Income:</strong>
                    <br />
                    From all crops, livestock, and other farm enterprises
                    (e.g., manure sales, machinery hire).
                  </li>
                  <li>
                    <strong>Total Expenditure:</strong>
                    <br />
                    <em>Variable costs:</em> Seeds, fertiliser, chemicals, labour,
                    fuel, marketing.
                    <br />
                    <em>Fixed costs:</em> Rent, rates, insurance, depreciation,
                    permanent labour.
                  </li>
                  <li>
                    <strong>Net Profit (or Loss):</strong>
                    <br />
                    Total Income – Total Expenditure.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong>
                <br />
                A farm has three enterprises: maize, cattle, and vegetables.
                <br />
                <strong>Total Income:</strong> $50,000
                <br />
                <strong>Total Variable Costs:</strong> $30,000
                <br />
                <strong>Total Fixed Costs:</strong> $10,000
                <br />
                <strong>Total Expenditure:</strong> $40,000
                <br />
                <strong>Net Profit = $50,000 – $40,000 = $10,000</strong>
              </li>
              <li>
                <strong>Uses:</strong>
                <br />
                Helps assess the overall profitability of the farm. Used for
                loan applications, tax purposes, and long‑term planning.
              </li>
            </ul>

            <AgriImage
              fileName="farm-budgeting.png"
              alt="A 2D diagram showing gross margin calculation, partial budget structure, and whole-farm budget structure"
              caption="Farm budgeting: gross margin, partial budget, and complete budget."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Budgeting Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Gross margin:</strong> Income – Variable Costs</li>
            <li><strong>Partial budget:</strong> analyses a small change</li>
            <li><strong>Whole‑farm budget:</strong> full farm, all costs, all income</li>
            <li><strong>Sources:</strong> records, market prices, extension, suppliers</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'agricultural-marketing',
      title: 'Agricultural Marketing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Agricultural Marketing?">
            <p>
              <strong>Definition:</strong> Agricultural marketing is the process
              of moving farm products from the producer (farmer) to the consumer.
              It includes all the activities involved in the sale and distribution
              of agricultural produce – production planning, harvesting, grading,
              packaging, storage, transport, pricing, and selling.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Functions of Marketing in Agriculture">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Production planning:</strong>
                <br />
                Helping farmers decide what, how much, and when to produce based
                on market demand and price signals.
              </li>
              <li>
                <strong>Grading and standardisation:</strong>
                <br />
                Sorting produce by quality and size (e.g., grade A, B, C). This
                helps in determining prices and meeting buyer requirements.
              </li>
              <li>
                <strong>Packaging:</strong>
                <br />
                Protecting produce during transport and storage. Attractive
                packaging can also increase sales.
              </li>
              <li>
                <strong>Storage:</strong>
                <br />
                Storing produce after harvest to stabilise supply and reduce
                post‑harvest losses. Warehouses, silos, and cold stores are used.
              </li>
              <li>
                <strong>Transport:</strong>
                <br />
                Moving produce from the farm to markets. Efficient transport
                reduces costs and spoilage.
              </li>
              <li>
                <strong>Processing:</strong>
                <br />
                Adding value to raw products (e.g., milling maize into mealie‑meal,
                processing milk into cheese, curing tobacco).
              </li>
              <li>
                <strong>Pricing:</strong>
                <br />
                Determining the price of produce based on supply, demand,
                quality, and market conditions.
              </li>
              <li>
                <strong>Market information:</strong>
                <br />
                Providing farmers with information on prices, demand, and
                market trends to inform decision‑making.
              </li>
              <li>
                <strong>Risk management:</strong>
                <br />
                Using marketing strategies (e.g., contracts, futures) to reduce
                price and production risks.
              </li>
              <li>
                <strong>Financing:</strong>
                <br />
                Providing credit to farmers (often through contracts or
                marketing boards) to finance production.
              </li>
            </ul>

            <AgriImage
              fileName="marketing-functions.png"
              alt="A 2D diagram showing the functions of agricultural marketing: production planning, grading, packaging, storage, transport, processing, pricing, market information, risk management, financing"
              caption="Functions of marketing in agriculture."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Affecting Marketing of Agricultural Produce">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Production Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Seasonality:</strong>
                <br />
                Most agricultural products are seasonal – they are produced at
                specific times of the year. This leads to gluts (oversupply) at
                harvest and shortages at other times, affecting prices.
              </li>
              <li>
                <strong>Perishability:</strong>
                <br />
                Many products (e.g., vegetables, fruits, milk, eggs) are perishable.
                They must be marketed quickly, requiring efficient transport and
                storage (cold chains).
              </li>
              <li>
                <strong>Volume and bulk:</strong>
                <br />
                Agricultural produce is often bulky (e.g., maize, hay) or heavy
                (e.g., potatoes), making transport expensive.
              </li>
              <li>
                <strong>Quality and variability:</strong>
                <br />
                Quality varies due to weather, pests, and management. Inconsistent
                quality makes it hard to market produce reliably.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Market Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Demand and price fluctuations:</strong>
                <br />
                Prices vary with supply and demand. This uncertainty makes it
                difficult for farmers to plan and budget.
              </li>
              <li>
                <strong>Market distance:</strong>
                <br />
                The distance between farms and markets affects transport costs
                and spoilage. Remote farmers are at a disadvantage.
              </li>
              <li>
                <strong>Market information:</strong>
                <br />
                Lack of price and demand information means farmers may sell at
                low prices or miss market opportunities.
              </li>
              <li>
                <strong>Market structure:</strong>
                <br />
                Some markets are dominated by a few large buyers (oligopsony),
                giving buyers more bargaining power over farmers.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Infrastructure Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Transport and roads:</strong>
                <br />
                Poor roads (especially during the rainy season) increase transport
                costs and spoilage. Good transport infrastructure is essential.
              </li>
              <li>
                <strong>Storage facilities:</strong>
                <br />
                Lack of storage facilities (silos, cold rooms) forces farmers to
                sell immediately at harvest, when prices are low.
              </li>
              <li>
                <strong>Processing facilities:</strong>
                <br />
                Lack of processing facilities limits value addition and reduces
                the range of products that can be sold.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Institutional Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Government policies:</strong>
                <br />
                Policies like price controls, subsidies, import/export restrictions,
                and marketing board regulations affect marketing.
              </li>
              <li>
                <strong>Market regulations:</strong>
                <br />
                Quality standards, grading requirements, and food safety
                regulations can help or hinder marketing.
              </li>
              <li>
                <strong>Cooperative organisations:</strong>
                <br />
                Cooperatives can improve marketing by pooling produce and
                negotiating better prices.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Other Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Political stability:</strong>
                <br />
                Political instability disrupts markets and reduces access to
                markets.
              </li>
              <li>
                <strong>International trade:</strong>
                <br />
                Global prices, trade agreements, and tariffs affect exports
                and imports of agricultural products.
              </li>
              <li>
                <strong>Consumer preferences:</strong>
                <br />
                Changes in consumer tastes (e.g., demand for organic products)
                affect marketing strategies.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tobacco:</strong>
                <br />
                Tobacco is marketed through the Tobacco Auction Floors (TAF) or
                contract farming. Factors affecting marketing: international
                prices (fluctuations), quality (leaf grade), and storage
                (conditioned tobacco).
              </li>
              <li>
                <strong>Maize:</strong>
                <br />
                Maize is marketed through the Grain Marketing Board (GMB) or
                private buyers. Factors: seasonal supply (glut at harvest), storage
                (silos), and government price controls.
              </li>
              <li>
                <strong>Vegetables:</strong>
                <br />
                Vegetables are marketed through Mbare Musika, Ngarwe, and other
                informal markets. Factors: perishability (need quick sale),
                transport (roads), and quality (size, freshness).
              </li>
              <li>
                <strong>Livestock:</strong>
                <br />
                Cattle are marketed through auctions, abattoirs, or direct sales.
                Factors: animal health, weight, breed, and market demand.
              </li>
            </ul>

            <AgriImage
              fileName="marketing-factors.png"
              alt="A 2D diagram showing factors affecting agricultural marketing: production factors (seasonality, perishability), market factors (demand, distance), infrastructure (roads, storage), institutional (policies, cooperatives)"
              caption="Factors affecting marketing of agricultural produce."
            />
          </SubtopicCard>

          <SubtopicCard title="Marketing Channels in Zimbabwe">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Producer → Consumer (direct):</strong>
                <br />
                Farmers sell directly to consumers at farm gates, roadside
                stalls, or local markets.
              </li>
              <li>
                <strong>Producer → Retailer → Consumer:</strong>
                <br />
                Farmers supply retailers (shops, supermarkets) who sell to
                consumers.
              </li>
              <li>
                <strong>Producer → Wholesaler → Retailer → Consumer:</strong>
                <br />
                Farmers sell to wholesalers who distribute to retailers.
                Common for vegetables and grains.
              </li>
              <li>
                <strong>Producer → Processor → Consumer:</strong>
                <br />
                Farmers supply processing companies (e.g., millers, oil presses)
                who process and sell to consumers.
              </li>
              <li>
                <strong>Producer → Marketing Board → Consumer/Export:</strong>
                <br />
                Strategic crops (maize, wheat, cotton) are channelled through
                marketing boards like GMB and COTCO.
              </li>
              <li>
                <strong>Producer → Auction Floor → Processor/Exporter:</strong>
                <br />
                Tobacco and other high‑value crops are sold through auction
                floors (e.g., Tobacco Auction Floors).
              </li>
            </ul>

            <AgriImage
              fileName="zimbabwe-marketing-channels.png"
              alt="A 2D diagram showing marketing channels in Zimbabwe: direct, retailer, wholesaler, processor, marketing board, auction floor"
              caption="Marketing channels for agricultural produce in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Marketing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Marketing functions:</strong> planning, grading, packaging, storage, transport, processing, pricing, info</li>
            <li><strong>Production factors:</strong> seasonality, perishability, bulk</li>
            <li><strong>Market factors:</strong> price fluctuations, distance, information</li>
            <li><strong>Infrastructure:</strong> roads, storage, processing</li>
            <li><strong>Institutional:</strong> policies, regulations, cooperatives</li>
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
            Explore the principles of economics (opportunity cost, demand and
            supply), farm budgeting (gross margin, partial and whole‑farm budgets),
            and agricultural marketing (functions and influencing factors) in
            the Zimbabwean context.
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
                  <strong className="text-white">Opportunity cost:</strong> The
                  value of the next best alternative given up when a choice is
                  made. Farmers must consider this when deciding what to produce
                  or invest in.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Demand and supply:</strong> The
                  law of demand states price and quantity demanded have an inverse
                  relationship; the law of supply states price and quantity
                  supplied have a direct relationship. Market price is determined
                  where demand equals supply.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm budgeting:</strong> Gross
                  margin = Income – Variable Costs. Partial budgets analyse small
                  changes (Additional Income + Costs Saved – Additional Costs –
                  Income Foregone). Whole‑farm budgets cover all enterprises and
                  costs over a full year.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Agricultural marketing:</strong>
                  Functions include planning, grading, packaging, storage,
                  transport, processing, pricing, and market information. Factors
                  affecting marketing: seasonality, perishability, bulk,
                  infrastructure, policies, and market structure.
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

   --- PRINCIPLES OF ECONOMICS ---
   1. opportunity-cost-farmer.png
      A 2D diagram showing farmer choices (crops, livestock, markets, technology,
      timing) and the concept of opportunity cost with examples (maize vs tobacco,
      fertiliser vs pump, labour alternative, storage).

   2. demand-supply-curves.png
      A 2D diagram with demand and supply schedules (tables) and graphs showing
      the intersection (equilibrium price and quantity). Label axes: Price and
      Quantity.

   3. demand-supply-determinants.png
      A 2D diagram showing factors that shift demand (income, preferences,
      substitutes, complements, expectations) and supply (costs, technology,
      weather, policies, number of producers).

   --- FARM BUDGETING ---
   4. farm-budgeting.png
      A 2D diagram showing: (a) Gross margin calculation (Income – Variable Costs),
      (b) Partial budget structure (Additional Income + Costs Saved – Additional
      Costs – Income Foregone), (c) Whole‑farm budget structure (Total Income –
      Total Expenditure = Net Profit).

   --- AGRICULTURAL MARKETING ---
   5. marketing-functions.png
      A 2D diagram showing the functions of agricultural marketing: production
      planning, grading, packaging, storage, transport, processing, pricing,
      market information, risk management, financing.

   6. marketing-factors.png
      A 2D diagram showing factors affecting agricultural marketing: production
      (seasonality, perishability, bulk), market (demand, distance, information),
      infrastructure (roads, storage, processing), institutional (policies,
      regulations, cooperatives).

   7. zimbabwe-marketing-channels.png
      A 2D diagram showing marketing channels in Zimbabwe: Producer → Consumer
      (direct); Producer → Retailer; Producer → Wholesaler → Retailer; Producer →
      Processor; Producer → Marketing Board; Producer → Auction Floor.

   ============================================================ */