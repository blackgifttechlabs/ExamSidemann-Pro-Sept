import React, { useState, useRef } from 'react';

/**
 * Topic 2: Religion and Contemporary Issues – Full component with sticky navigation,
 * aside cards, and auto‑scroll + double‑highlight on heading.
 */
export const topic2: React.FC = () => {
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

  // Subtopic Card component for consistent styling (Geography style)
  const SubtopicCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rounded-[9px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          {title}
        </h3>
        <div className="text-slate-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );


  const sections: TopicSection[] = [
    {
      id: 'family-identity',
      title: 'Religion, Family and Identity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Inter-dependency of Families">

          <p>
            In Zimbabwean culture, families are not isolated units. They are deeply connected
            to each other and to the wider community. This inter-dependency is a key part of
            how people live and relate to each other. Families rely on each other for support,
            guidance, and survival.
          </p>
          <ul>
            <li>
              <strong>Economic support:</strong> Family members help each other financially.
              If someone is struggling, relatives will step in to help. This is especially
              important in times of hardship, such as illness, death, or unemployment.
            </li>
            <li>
              <strong>Social support:</strong> Families celebrate together and mourn together.
              Important events like weddings, funerals, and ceremonies are family affairs
              where everyone comes together to share the joy or grief.
            </li>
            <li>
              <strong>Child-rearing:</strong> In many families, raising children is a shared
              responsibility. Grandparents, aunts, and uncles all play a role in teaching
              and guiding children. This is often expressed in the saying "It takes a village
              to raise a child."
            </li>
            <li>
              <strong>Emotional support:</strong> Family members provide comfort and advice
              to each other. When someone is facing a difficult time, they turn to their family
              for encouragement and strength.
            </li>
            <li>
              <strong>Spiritual support:</strong> Families pray together and participate in
              religious ceremonies together. This strengthens their bonds and helps them
              feel connected to their ancestors and to God.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="How Indigenous Religion (via Unhu / Ubuntu / Vumunhu) Shapes Zimbabwean Identity">

          <p>
            <strong>Unhu</strong> (in Shona), <strong>Ubuntu</strong> (in Ndebele), and
            <strong>Vumunhu</strong> (in some other Zimbabwean languages) are all words that
            describe the same philosophy: the belief that a person is a person through other people.
            This philosophy is deeply rooted in Indigenous Religion and shapes the identity
            of Zimbabweans in many ways.
          </p>
          <ul>
            <li>
              <strong>Sense of community:</strong> Unhu teaches that we are all connected.
              What happens to one person affects everyone else. This creates a strong sense
              of community and belonging. People do not see themselves as individuals alone –
              they see themselves as part of a larger family and community.
            </li>
            <li>
              <strong>Respect for elders:</strong> Unhu places great value on respecting elders.
              Elders are seen as wise and are respected for their knowledge and experience.
              Young people are taught to listen to and obey their elders.
            </li>
            <li>
              <strong>Sharing and generosity:</strong> Unhu encourages people to share what they have
              with others. It is not acceptable to be selfish. People are expected to help
              those who are less fortunate.
            </li>
            <li>
              <strong>Honesty and integrity:</strong> Unhu teaches that people should be honest
              and trustworthy. Lying, cheating, and stealing are seen as harmful to the community
              and are not acceptable.
            </li>
            <li>
              <strong>Connection to ancestors:</strong> Unhu recognises that ancestors are still
              part of the community. They are honoured and remembered. This gives people a
              sense of continuity and identity. They are part of a story that began long before
              they were born.
            </li>
            <li>
              <strong>Hospitality:</strong> Welcoming visitors is a key part of Unhu. Guests are
              treated with kindness and generosity. This reflects the belief that all people
              are connected and should be treated well.
            </li>
            <li>
              <strong>Forgiveness:</strong> Unhu encourages forgiveness and reconciliation.
              When people make mistakes, they are given a chance to make things right. This
              helps to maintain peace and harmony in the community.
            </li>
          </ul>
          <p>
            In short, Unhu/Ubuntu/Vumunhu is not just a word – it is a way of life that shapes
            how Zimbabweans see themselves and how they relate to others. It is a core part
            of what it means to be a Zimbabwean.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Family &amp; Identity</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Inter-dependency:</strong> economic, social, emotional, spiritual support</li>
            <li><strong>Unhu/Ubuntu:</strong> community, respect, sharing, honesty, ancestors</li>
            <li><strong>Identity:</strong> shaped by connection to family and community</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Religion and Education',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Positive and Negative Impact of Religion in Formal Education">


          <h4 className="text-lg font-semibold mt-4">Positive Impacts</h4>
          <ul>
            <li>
              <strong>Establishment of schools:</strong> Many schools in Zimbabwe were started by
              missionaries and religious organisations. These schools provided education to
              many people who would not have had access to it otherwise.
            </li>
            <li>
              <strong>Moral and values education:</strong> Religious education teaches students
              values like honesty, respect, kindness, and responsibility. These values help
              students become good citizens.
            </li>
            <li>
              <strong>Discipline:</strong> Religious schools often have high standards of discipline.
              This helps create a safe and orderly learning environment.
            </li>
            <li>
              <strong>Community and support:</strong> Religious schools often provide a sense of
              community and belonging. They offer support to students and families in need.
            </li>
            <li>
              <strong>Scholarships and bursaries:</strong> Religious organisations often provide
              financial support to students who cannot afford school fees.
            </li>
            <li>
              <strong>Promoting tolerance:</strong> Learning about different religions helps students
              understand and respect the beliefs of others.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Negative Impacts</h4>
          <ul>
            <li>
              <strong>Imposition of beliefs:</strong> In the past, missionaries sometimes forced
              students to convert to Christianity and reject their traditional beliefs.
              This caused cultural and spiritual confusion for many people.
            </li>
            <li>
              <strong>Conflict with traditional values:</strong> Religious teachings sometimes
              conflict with traditional beliefs and practices. This can create tension for
              students who are trying to balance both.
            </li>
            <li>
              <strong>Discrimination:</strong> In some cases, religious schools have been accused
              of discriminating against students of other faiths or against girls.
            </li>
            <li>
              <strong>Overemphasis on religion:</strong> Some schools may focus too much on
              religious instruction and not enough on other important subjects like science
              and mathematics.
            </li>
            <li>
              <strong>Religious conflicts:</strong> Differences between religious groups can
              sometimes lead to conflict in schools.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Role of Indigenous Religion in Informal Education">

          <p>
            Indigenous Religion plays a very important role in informal education.
            It teaches people values, skills, and traditions outside the classroom.
          </p>
          <ul>
            <li>
              <strong>Learning through storytelling:</strong> Elders tell stories about ancestors,
              spirits, and traditional heroes. These stories teach important lessons about
              courage, respect, and wisdom.
            </li>
            <li>
              <strong>Learning through observation and participation:</strong> Children learn by
              watching adults and taking part in ceremonies and rituals. They see how things
              are done and learn the customs of their community.
            </li>
            <li>
              <strong>Learning values:</strong> IR teaches values like respect for elders,
              sharing, honesty, and community service. These values are learned through daily
              life and the example of family members.
            </li>
            <li>
              <strong>Learning practical skills:</strong> In many rural areas, children learn
              practical skills like farming, cooking, and crafting from their elders.
              These skills are often connected to traditional knowledge and religious beliefs.
            </li>
            <li>
              <strong>Learning about ancestors and family history:</strong> Children learn about
              their ancestors and their family history. This gives them a sense of identity and
              belonging.
            </li>
            <li>
              <strong>Learning through proverbs:</strong> Proverbs are short sayings that carry
              deep meaning. They are used to teach lessons about life, behaviour, and values.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Education Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Positive:</strong> schools, values, discipline, support</li>
            <li><strong>Negative:</strong> imposition of beliefs, discrimination, overemphasis</li>
            <li><strong>IR informal:</strong> storytelling, observation, values, skills</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'gender',
      title: 'Religion and Gender',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Gender Roles Across the Four Religions (Compare and Contrast)">


          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              <strong>Men:</strong> Often seen as leaders of the family and community.
              They are responsible for protecting the family and representing them in public matters.
              They lead many religious ceremonies.
            </li>
            <li>
              <strong>Women:</strong> Respected as mothers and caregivers. They are responsible
              for raising children and managing the household. Some women are spirit mediums
              and have important spiritual authority.
            </li>
            <li>
              <strong>Comparison:</strong> Both men and women have important roles. There is a
              balance between the two, with each contributing to the family and community in
              different ways.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              <strong>Men:</strong> Traditionally, men are the heads of the household and
              religious leaders. They lead prayers in the synagogue and study the Torah.
            </li>
            <li>
              <strong>Women:</strong> Women are responsible for the home and for raising children.
              They also have important roles in certain rituals, like lighting the Shabbat candles.
            </li>
            <li>
              <strong>Comparison:</strong> Traditional Judaism has clear gender roles, with men
              having more public religious roles. However, modern Judaism is more egalitarian,
              with many women becoming rabbis and leaders.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              <strong>Men:</strong> In many traditional churches, men are the leaders – they are
              pastors, priests, and elders. They are seen as the heads of the household.
            </li>
            <li>
              <strong>Women:</strong> Women are often involved in church activities, but in
              traditional churches, they have been less likely to hold leadership positions.
            </li>
            <li>
              <strong>Comparison:</strong> In modern Christian denominations, there is a wide range.
              Some churches still have traditional roles, while others have women as pastors,
              bishops, and leaders. Pentecostal churches often have many women leaders.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              <strong>Men:</strong> Men are the leaders of the family and the community.
              They lead prayers in the mosque and are responsible for providing for their families.
            </li>
            <li>
              <strong>Women:</strong> Women are respected as mothers and are responsible for
              raising children and managing the home. They also have rights to education and work.
            </li>
            <li>
              <strong>Comparison:</strong> Islam has clear roles for men and women, but both are
              valued and respected. In modern times, many Muslim women are becoming leaders and
              scholars.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="How Religion Enhances Women's Empowerment">

          <ul>
            <li>
              <strong>Indigenous Religion:</strong> Women have significant spiritual authority as
              spirit mediums. They are often consulted on important matters and can influence
              decisions in the community.
            </li>
            <li>
              <strong>Christianity:</strong> Many churches now ordain women as pastors and leaders.
              Women are involved in church leadership and are using their positions to advocate
              for social change and women's rights.
            </li>
            <li>
              <strong>Islam:</strong> Islam teaches that women have the right to education,
              work, and property. Many Muslim women are educated and hold important positions
              in society.
            </li>
            <li>
              <strong>Judaism:</strong> Modern Judaism has seen many women becoming rabbis and
              leaders. Women are also playing more active roles in religious life.
            </li>
            <li>
              <strong>Overall:</strong> Across all religions, women are gaining more voice and
              influence. Religious organisations are increasingly recognising the importance
              of women's contributions.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Gender Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>IR:</strong> balance, women as spirit mediums</li>
            <li><strong>Judaism:</strong> traditional roles, modern equality</li>
            <li><strong>Christianity:</strong> varies – traditional to women leaders</li>
            <li><strong>Islam:</strong> clear roles, women have rights</li>
            <li><strong>Empowerment:</strong> women gaining voice in all religions</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ethics-health',
      title: 'Religion, Ethics, Health and Sexuality',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Indigenous Religion as a Source of Morals and Values Shaping Zimbabwean Identity">

          <p>
            Indigenous Religion provides the foundation for many of the morals and values
            that shape Zimbabwean identity. These values are passed down from generation to
            generation and guide how people live their lives.
          </p>
          <ul>
            <li>
              <strong>Respect for life:</strong> Life is seen as sacred. People are expected
              to respect the lives of others and to avoid harming anyone.
            </li>
            <li>
              <strong>Community over self:</strong> The good of the community is more important
              than the good of the individual. People are expected to contribute to the community
              and to help others.
            </li>
            <li>
              <strong>Honesty and integrity:</strong> People are expected to be truthful and
              trustworthy. This builds trust within the community.
            </li>
            <li>
              <strong>Respect for elders:</strong> Elders are valued for their wisdom and
              experience. They are respected and consulted on important decisions.
            </li>
            <li>
              <strong>Responsibility:</strong> People are expected to take responsibility for
              their actions and for the well‑being of others.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Role in Shaping Views on Masculinity and Femininity">

          <ul>
            <li>
              <strong>Masculinity:</strong> Religion often teaches that men should be strong,
              brave, and responsible. They are expected to provide for and protect their families.
              In Indigenous Religion, men are seen as the leaders of ceremonies and rituals.
            </li>
            <li>
              <strong>Femininity:</strong> Religion teaches that women should be caring,
              nurturing, and supportive. They are expected to raise children and manage the home.
              In many religions, women are also seen as spiritual leaders and healers.
            </li>
            <li>
              <strong>Changes:</strong> Views on masculinity and femininity are changing.
              More men are taking on caregiving roles, and more women are becoming leaders.
              Religion can both reinforce traditional roles and support these changes.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Contribution of Indigenous Religion to Unhu / Ubuntu">

          <p>
            Indigenous Religion is the source of the Unhu/Ubuntu philosophy. Without IR,
            Unhu would not exist. The beliefs and practices of IR have shaped the values
            that are at the heart of Unhu.
          </p>
          <ul>
            <li>
              <strong>Ancestors:</strong> The belief in ancestors teaches that people are
              connected to those who came before them. This creates a sense of continuity
              and responsibility.
            </li>
            <li>
              <strong>Community:</strong> IR emphasises the importance of community.
              People are not alone – they are part of a larger group.
            </li>
            <li>
              <strong>Values:</strong> IR teaches values like respect, sharing, and honesty.
              These values are the basis of Unhu.
            </li>
            <li>
              <strong>Rituals:</strong> Religious rituals bring the community together and
              reinforce the values of Unhu.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Positive and Negative Influence on People with Chronic Conditions">


          <h4 className="text-lg font-semibold mt-4">Positive Influences</h4>
          <ul>
            <li>
              <strong>Hope and comfort:</strong> Religion gives people hope and comfort in
              difficult times. It helps them cope with illness and find meaning in their suffering.
            </li>
            <li>
              <strong>Community support:</strong> Religious communities provide support to
              people with chronic conditions. They may pray for them, visit them, and help
              with practical needs.
            </li>
            <li>
              <strong>Encouragement:</strong> Religious teachings encourage people to be strong
              and to trust in God. This can help them stay positive and motivated.
            </li>
            <li>
              <strong>Meaning and purpose:</strong> Religion can help people find meaning in
              their illness. It can help them see it as a test or a way to grow spiritually.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Negative Influences</h4>
          <ul>
            <li>
              <strong>Stigma:</strong> Some religious beliefs can create stigma.
              For example, some people believe that illness is a punishment from God or a
              result of sin. This can make people feel guilty and ashamed.
            </li>
            <li>
              <strong>Avoidance of medical care:</strong> Some religious groups discourage
              people from seeking medical treatment. They may believe that prayer alone is
              enough to heal them. This can be dangerous and can lead to worse health outcomes.
            </li>
            <li>
              <strong>Spiritual abuse:</strong> Some religious leaders may take advantage of
              people who are sick. They may promise healing in exchange for money or may
              use their authority to control people.
            </li>
            <li>
              <strong>Isolation:</strong> People with chronic conditions may feel isolated
              if they are not able to participate in religious activities. This can make
              them feel excluded and alone.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Ethics &amp; Health</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>IR values:</strong> respect for life, community, honesty, responsibility</li>
            <li><strong>Masculinity/Femininity:</strong> shaped by religious teachings</li>
            <li><strong>Unhu/Ubuntu:</strong> rooted in IR beliefs and practices</li>
            <li><strong>Chronic conditions:</strong> positive – hope, support; negative – stigma, avoidance of care</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'disability',
      title: 'Religion and Disability',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Religious Perceptions of Disability">

          <p>
            Different religions have different beliefs about disability.
            These beliefs can affect how people with disabilities are treated in society.
          </p>

          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              Disability may be seen as a result of breaking taboos or offending ancestors.
              It may be viewed as a punishment or a test from the spirits.
            </li>
            <li>
              However, people with disabilities are often still cared for by their families
              and are seen as part of the community. They may also be respected for having
              special spiritual connections.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Many Christians see disability as part of God's plan. They believe that everyone
              has value and purpose, regardless of their abilities.
            </li>
            <li>
              Some Christians believe that healing is possible through prayer and faith.
              Others believe that disability is a way for God to be glorified.
            </li>
            <li>
              Many churches have programmes to support people with disabilities and their families.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              In Islam, disability is seen as a test from Allah. It is not a punishment,
              but an opportunity for spiritual growth.
            </li>
            <li>
              Muslims are encouraged to care for people with disabilities and to treat them
              with kindness and respect.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              Judaism teaches that all people are created in the image of God.
              This means that everyone has inherent dignity and worth.
            </li>
            <li>
              The Jewish community is expected to care for people with disabilities and to
              include them in community life.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Different Types and Severity of Disabilities and Marginalisation">


          <h4 className="text-lg font-semibold mt-4">Types of Disabilities</h4>
          <ul>
            <li>
              <strong>Physical disabilities:</strong> These affect a person's ability to move
              or control their body. Examples: paralysis, amputation, arthritis.
            </li>
            <li>
              <strong>Sensory disabilities:</strong> These affect the senses. Examples:
              blindness, deafness, hearing loss.
            </li>
            <li>
              <strong>Intellectual disabilities:</strong> These affect a person's ability to
              learn and think. Examples: Down syndrome, learning difficulties.
            </li>
            <li>
              <strong>Mental health disabilities:</strong> These affect a person's mental and
              emotional well‑being. Examples: depression, schizophrenia, anxiety disorders.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Severity of Disabilities</h4>
          <ul>
            <li>
              <strong>Mild:</strong> The person can do most things on their own, with some
              difficulty. They may need some support but can live independently.
            </li>
            <li>
              <strong>Moderate:</strong> The person needs regular support to do everyday tasks.
              They may need help with things like bathing, dressing, or eating.
            </li>
            <li>
              <strong>Severe:</strong> The person needs constant care and support.
              They may not be able to communicate or move independently.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Marginalisation of People with Disabilities</h4>
          <ul>
            <li>
              <strong>Exclusion from education:</strong> Many children with disabilities do not
              go to school because schools are not accessible or because of discrimination.
            </li>
            <li>
              <strong>Exclusion from employment:</strong> People with disabilities often have
              difficulty finding jobs. They are often seen as less capable, even when they
              have the skills to work.
            </li>
            <li>
              <strong>Social isolation:</strong> People with disabilities may be excluded from
              social activities. They may be seen as different or as a burden.
            </li>
            <li>
              <strong>Lack of access:</strong> Many buildings and public places are not accessible
              to people with physical disabilities. This limits their ability to participate
              in community life.
            </li>
            <li>
              <strong>Negative attitudes:</strong> People with disabilities often face stigma
              and discrimination. They may be treated with pity, fear, or contempt.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Disability Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Perceptions:</strong> IR – spirit punishment; Christianity – God's plan; Islam – test; Judaism – dignity</li>
            <li><strong>Types:</strong> physical, sensory, intellectual, mental health</li>
            <li><strong>Marginalisation:</strong> education, employment, social isolation, access</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environment',
      title: 'Religion and the Natural Environment',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Judaism's Attitudes to the Environment and Preservation Methods">

          <p>
            Judaism teaches that the earth belongs to God and that humans are caretakers
            of the earth. This idea is called "stewardship." The Bible says that humans
            are to "till and keep" the garden of Eden, which means they are to care for the earth.
          </p>
          <ul>
            <li>
              <strong>Attitude:</strong> The earth is God's creation and should be respected.
              Humans are not owners of the earth, but caretakers who must protect it.
            </li>
            <li>
              <strong>Preservation methods:</strong>
              <ul className="mt-2">
                <li>
                  <strong>Bal Tashchit (Do not destroy):</strong> This is a Jewish law that
                  forbids the unnecessary destruction of things, especially trees and plants.
                  It teaches that people should not waste or destroy resources.
                </li>
                <li>
                  <strong>Shabbat (Sabbath):</strong> The Sabbath is a day of rest for people
                  and also for the land. In ancient times, the land was allowed to rest every
                  seven years. This is called the Sabbatical year.
                </li>
                <li>
                  <strong>Kashrut (Dietary laws):</strong> The dietary laws include rules about
                  how to treat animals. Animals must be treated humanely and killed in a way
                  that causes the least pain.
                </li>
                <li>
                  <strong>Ritual purity:</strong> There are rules about keeping water sources
                  clean. This helps protect the environment and public health.
                </li>
                <li>
                  <strong>Teaching:</strong> Many Jewish organisations today are active in
                  environmental protection, promoting recycling, conservation, and sustainable
                  living.
                </li>
              </ul>
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Islam's Attitudes to the Environment and Preservation Methods">

          <p>
            Islam teaches that the environment is a trust from Allah.
            Muslims are responsible for protecting the earth and using its resources wisely.
            This is called "khalifa" (stewardship).
          </p>
          <ul>
            <li>
              <strong>Attitude:</strong> The earth is a creation of Allah and is sacred.
              All living things are part of a balanced ecosystem that should be protected.
            </li>
            <li>
              <strong>Preservation methods:</strong>
              <ul className="mt-2">
                <li>
                  <strong>Mizan (Balance):</strong> The Quran teaches that Allah created
                  everything in balance. Humans should not disturb this balance by polluting
                  or destroying the environment.
                </li>
                <li>
                  <strong>Hima (Protected areas):</strong> In Islamic tradition, certain areas
                  of land are set aside as protected reserves (Hima). These areas are protected
                  from development and overuse.
                </li>
                <li>
                  <strong>Water conservation:</strong> The Quran teaches that water is a gift
                  from Allah and should not be wasted. Even when there is plenty, people should
                  not be wasteful.
                </li>
                <li>
                  <strong>Planting trees:</strong> The Prophet Muhammad encouraged planting
                  trees and said that planting a tree is a form of charity.
                </li>
                <li>
                  <strong>Treatment of animals:</strong> Islam teaches that animals should be
                  treated with kindness. They should not be overworked or mistreated.
                </li>
                <li>
                  <strong>Teaching:</strong> Many Muslim organisations are active in environmental
                  protection, promoting sustainable development and conservation.
                </li>
              </ul>
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Environment Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Judaism:</strong> stewardship, Bal Tashchit, Shabbat, Kashrut</li>
            <li><strong>Islam:</strong> Khalifa, Mizan, Hima, water conservation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rights',
      title: 'Religion, Rights and Social Responsibility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rights of the Elderly">

          <p>
            The elderly have the right to be treated with respect and dignity.
            They have contributed to society throughout their lives and deserve to be
            cared for in their old age.
          </p>
          <ul>
            <li>
              <strong>Right to care:</strong> Elderly people have the right to receive care
              from their families and the community. This includes food, shelter, and medical care.
            </li>
            <li>
              <strong>Right to respect:</strong> The elderly should be respected for their
              wisdom and experience. They should be listened to and consulted on important matters.
            </li>
            <li>
              <strong>Right to participate:</strong> The elderly should be able to participate
              in community life and make decisions about their own lives.
            </li>
            <li>
              <strong>Right to protection:</strong> The elderly should be protected from abuse,
              neglect, and exploitation.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Rights of Persons with Disabilities">

          <ul>
            <li>
              <strong>Right to equal treatment:</strong> People with disabilities have the right
              to be treated equally and not be discriminated against.
            </li>
            <li>
              <strong>Right to education:</strong> People with disabilities have the right to
              education. Schools should be accessible to all.
            </li>
            <li>
              <strong>Right to work:</strong> People with disabilities have the right to work
              and earn a living. Employers should not discriminate against them.
            </li>
            <li>
              <strong>Right to accessibility:</strong> Public buildings and services should be
              accessible to people with disabilities.
            </li>
            <li>
              <strong>Right to participate:</strong> People with disabilities should be able
              to participate in all aspects of life.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Benefits and Disadvantages of Freedom of Worship">


          <h4 className="text-lg font-semibold mt-4">Benefits</h4>
          <ul>
            <li>
              <strong>Freedom to believe:</strong> People can follow their own faith and beliefs
              without fear of persecution. This is a basic human right.
            </li>
            <li>
              <strong>Diversity:</strong> Freedom of worship allows for religious diversity.
              People from different religions can live together in peace and learn from each other.
            </li>
            <li>
              <strong>Spiritual growth:</strong> People can practise their religion freely,
              which helps them grow spiritually and find meaning in life.
            </li>
            <li>
              <strong>Community:</strong> Religious groups can build communities and support
              their members.
            </li>
            <li>
              <strong>Contribution to society:</strong> Religious groups often contribute to
              society through charities, schools, and hospitals.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Disadvantages</h4>
          <ul>
            <li>
              <strong>Religious extremism:</strong> Freedom of worship can sometimes lead to
              religious extremism, where people use their beliefs to justify violence or intolerance.
            </li>
            <li>
              <strong>Conflicts:</strong> Differences between religious groups can sometimes
              lead to conflict and division.
            </li>
            <li>
              <strong>Abuse:</strong> Some religious leaders may abuse their power and exploit
              their followers.
            </li>
            <li>
              <strong>Discrimination:</strong> Some religious groups may discriminate against
              people who do not share their beliefs.
            </li>
            <li>
              <strong>Imposition on others:</strong> Some groups may try to impose their beliefs
              on others, which can cause resentment and conflict.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Rights Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Elderly:</strong> care, respect, participation, protection</li>
            <li><strong>Disability:</strong> equality, education, work, accessibility</li>
            <li><strong>Freedom of worship:</strong> benefits – freedom, diversity; disadvantages – extremism, conflict</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conflict-management',
      title: 'Religion and Conflict Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Causes of Conflict at Community Level">


          <h4 className="text-lg font-semibold mt-4">Land and Resource Disputes</h4>
          <ul>
            <li>
              Disagreements over land ownership, boundaries, or access to resources
              like water and grazing land are very common in communities.
            </li>
            <li>
              These conflicts can arise between families, clans, or villages.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Political Differences</h4>
          <ul>
            <li>
              Different political views can cause conflict in communities.
              This can be especially intense during election periods.
            </li>
            <li>
              People may be divided by their support for different political parties.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Cultural and Religious Differences</h4>
          <ul>
            <li>
              Communities may have people from different cultural or religious backgrounds.
              Differences in beliefs and practices can lead to misunderstanding and conflict.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Economic Inequality</h4>
          <ul>
            <li>
              When there is a big gap between the rich and the poor, it can create resentment
              and conflict. People who are struggling may blame those who have more.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Misunderstandings and Poor Communication</h4>
          <ul>
            <li>
              When people do not communicate clearly, misunderstandings can happen.
              This can lead to arguments and conflict.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Historical Grievances</h4>
          <ul>
            <li>
              Past conflicts or injustices that have not been resolved can continue to cause
              problems in the community. People may hold onto grudges for a long time.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Causes of Conflict">

          <ul>
            <li>
              <strong>Differences in beliefs:</strong> Different religions have different beliefs
              about God, morality, and how people should live. These differences can cause tension.
            </li>
            <li>
              <strong>Proselytisation:</strong> When religious groups try to convert people
              from other religions, it can cause resentment and conflict.
            </li>
            <li>
              <strong>Religious extremism:</strong> Some people interpret their religion in
              extreme ways and may use violence to achieve their goals.
            </li>
            <li>
              <strong>Competition for followers:</strong> Religious groups may compete with
              each other for followers, which can lead to tension.
            </li>
            <li>
              <strong>Disrespect of sacred things:</strong> Actions that disrespect the sacred
              places, symbols, or practices of a religion can cause conflict.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Impact of Conflict">

          <ul>
            <li>
              <strong>Loss of life:</strong> Conflict can lead to people being injured or killed.
            </li>
            <li>
              <strong>Displacement:</strong> People may be forced to leave their homes and
              communities because of conflict.
            </li>
            <li>
              <strong>Destruction of property:</strong> Homes, businesses, and community
              buildings may be damaged or destroyed.
            </li>
            <li>
              <strong>Trauma:</strong> Conflict can cause lasting psychological trauma for
              individuals and communities.
            </li>
            <li>
              <strong>Breakdown of community:</strong> Conflict can destroy the trust and
              connections that hold communities together.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Efforts at Conflict Management">

          <ul>
            <li>
              <strong>Mediation:</strong> Religious leaders are often respected and trusted
              in their communities. They can act as mediators to help resolve disputes.
            </li>
            <li>
              <strong>Dialogue:</strong> Religious groups can bring people from different
              faiths together to talk and understand each other better.
            </li>
            <li>
              <strong>Teaching tolerance:</strong> Religious teachings often promote peace,
              forgiveness, and tolerance. These teachings can help prevent conflict.
            </li>
            <li>
              <strong>Forgiveness and reconciliation:</strong> Religion teaches people to
              forgive and to try to make peace. This is important for healing after conflict.
            </li>
            <li>
              <strong>Prayer for peace:</strong> Religious groups often pray for peace and
              for an end to conflict.
            </li>
            <li>
              <strong>Community programmes:</strong> Religious organisations may run programmes
              that bring people together and promote understanding.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Conflict Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> land, politics, culture, inequality, communication</li>
            <li><strong>Religious causes:</strong> beliefs, proselytisation, extremism</li>
            <li><strong>Impact:</strong> loss of life, displacement, trauma</li>
            <li><strong>Management:</strong> mediation, dialogue, forgiveness, prayer</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'enterprise',
      title: 'Religion and Enterprise',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Forms of Religion-Based Enterprise">

          <p>
            Religion-based enterprise refers to businesses or projects that are inspired by
            or connected to religious beliefs and values. These enterprises often aim to
            serve the community and uphold religious principles.
          </p>
          <ul>
            <li>
              <strong>Religious institutions as enterprises:</strong>
              <ul className="mt-2">
                <li>
                  Churches, mosques, and temples often run schools, hospitals, and other
                  services. These are forms of enterprise that serve the community.
                </li>
                <li>
                  Some religious organisations run businesses to generate income for their
                  activities. Examples: bakeries, farms, or printing presses.
                </li>
              </ul>
            </li>
            <li>
              <strong>Faith-based businesses:</strong>
              <ul className="mt-2">
                <li>
                  These are businesses that are guided by religious values. For example,
                  a Muslim-owned shop that sells halal food, or a Christian-owned business
                  that prioritises honesty and fairness.
                </li>
                <li>
                  Some businesses serve the religious community. Examples: religious bookshops,
                  clothing stores selling religious garments, or travel agencies that organise
                  pilgrimages.
                </li>
              </ul>
            </li>
            <li>
              <strong>Social enterprises:</strong>
              <ul className="mt-2">
                <li>
                  These are businesses that aim to solve social problems and are often
                  inspired by religious values. For example, a charity that provides food
                  to the hungry or an organisation that supports orphans.
                </li>
              </ul>
            </li>
            <li>
              <strong>Traditional craft enterprises:</strong>
              <ul className="mt-2">
                <li>
                  Many traditional crafts are connected to religious practices.
                  Examples: making drums for ceremonies, carving sacred statues, or weaving
                  baskets used in rituals.
                </li>
              </ul>
            </li>
            <li>
              <strong>Agriculture and farming:</strong>
              <ul className="mt-2">
                <li>
                  Many religious communities practice farming that is guided by traditional
                  and religious values. This includes respecting the land and using sustainable
                  methods.
                </li>
              </ul>
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Teachings That Encourage Enterprise">

          <p>
            Many religions encourage people to work hard, be honest, and use their skills
            to improve their lives and their communities. Here are some teachings that
            encourage enterprise:
          </p>
          <ul>
            <li>
              <strong>Indigenous Religion:</strong>
              <ul className="mt-2">
                <li>
                  IR teaches the value of hard work (kushanda nesimba).
                  People are encouraged to work hard and to be productive.
                </li>
                <li>
                  It also teaches sharing and generosity, which encourages people to use
                  their success to help others.
                </li>
              </ul>
            </li>
            <li>
              <strong>Christianity:</strong>
              <ul className="mt-2">
                <li>
                  The Bible teaches that people should work and not be lazy.
                  It says, "If a man will not work, he shall not eat."
                </li>
                <li>
                  The Parable of the Talents encourages people to use their gifts and
                  resources wisely and to invest them for growth.
                </li>
                <li>
                  Christians are encouraged to be honest and fair in their business dealings.
                </li>
              </ul>
            </li>
            <li>
              <strong>Islam:</strong>
              <ul className="mt-2">
                <li>
                  The Quran encourages trade and commerce. It says that Allah has made
                  trade lawful and that people should conduct their business honestly.
                </li>
                <li>
                  The Prophet Muhammad was a trader himself and set a good example of
                  fair and honest business practices.
                </li>
                <li>
                  Zakat (charity) encourages the wealthy to share their success with those in need.
                </li>
              </ul>
            </li>
            <li>
              <strong>Judaism:</strong>
              <ul className="mt-2">
                <li>
                  Judaism encourages people to work and to support themselves.
                  It teaches that work is a virtue and a way to serve God.
                </li>
                <li>
                  Jewish law has many rules about fair business practices and treating
                  employees well.
                </li>
              </ul>
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Enterprise Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Forms:</strong> religious institutions, faith-based businesses, social enterprises, crafts</li>
            <li><strong>Teachings:</strong> hard work, honesty, sharing, fairness</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'liberation',
      title: 'Religion and the Liberation Struggle',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Role of Indigenous Religion and Christian Practitioners in Chimurenga / Umvukela 1 and 2">


          <h4 className="text-lg font-semibold mt-4">Chimurenga / Umvukela 1 (1896 – 1897)</h4>

          <h5 className="font-semibold mt-3">Indigenous Religion Practitioners</h5>
          <ul>
            <li>
              <strong>Mbuya Nehanda:</strong> She was a powerful spirit medium who inspired
              the people to fight against the British colonisers. She told the people that
              the ancestors were on their side and that they would be victorious.
            </li>
            <li>
              <strong>Sekuru Kaguvi:</strong> He was also a spirit medium who led the rebellion
              in the areas around Harare. He united the people and encouraged them to resist.
            </li>
            <li>
              <strong>Other spirit mediums:</strong> Many other spirit mediums played important
              roles in guiding the fighters and giving them spiritual strength.
            </li>
            <li>
              <strong>Role:</strong> Spirit mediums provided spiritual guidance, predicted
              outcomes, and gave the fighters courage. They were the spiritual backbone of
              the rebellion.
            </li>
          </ul>

          <h5 className="font-semibold mt-3">Christian Practitioners</h5>
          <ul>
            <li>
              <strong>Missionaries:</strong> Some missionaries were sympathetic to the African
              cause and spoke out against the injustices of the colonial system.
            </li>
            <li>
              <strong>Role:</strong> They provided education and healthcare to the people,
              which helped them resist oppression. Some also acted as intermediaries between
              the Africans and the colonial government.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Chimurenga / Umvukela 2 (1960s – 1980)</h4>

          <h5 className="font-semibold mt-3">Indigenous Religion Practitioners</h5>
          <ul>
            <li>
              <strong>Spirit mediums:</strong> The spirit of Mbuya Nehanda was a powerful
              inspiration for the fighters. Many leaders of the liberation movements consulted
              spirit mediums for guidance.
            </li>
            <li>
              <strong>Role:</strong> Spirit mediums gave blessings to the fighters, predicted
              success, and provided spiritual protection. They helped the fighters stay
              strong and believe that they would win.
            </li>
          </ul>

          <h5 className="font-semibold mt-3">Christian Practitioners</h5>
          <ul>
            <li>
              <strong>African Independent Churches (AICs):</strong> These churches strongly
              supported the liberation struggle. Their leaders often encouraged their members
              to support the freedom fighters.
            </li>
            <li>
              <strong>Mission churches:</strong> Some leaders of mission churches also supported
              the struggle. They spoke out against the injustices of the colonial system.
            </li>
            <li>
              <strong>Specific individuals:</strong> Many Christian individuals supported the
              freedom fighters by providing food, shelter, and information. Some even joined
              the armed struggle.
            </li>
            <li>
              <strong>Role:</strong> They provided material support, moral encouragement,
              and spiritual guidance. They also spoke out against injustice and helped to
              mobilise international support for the liberation struggle.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Summary of Religious Contributions</h4>
          <ul>
            <li>
              <strong>Spiritual inspiration:</strong> Religion gave the people hope and courage
              to fight against a powerful enemy.
            </li>
            <li>
              <strong>Unity:</strong> Religion brought people together and united them in
              a common cause.
            </li>
            <li>
              <strong>Guidance:</strong> Religious leaders provided guidance and wisdom to
              the fighters.
            </li>
            <li>
              <strong>Support:</strong> Religious groups provided material support to the
              fighters and their families.
            </li>
            <li>
              <strong>Justice:</strong> Religious leaders spoke out against injustice and
              called for a free and fair society.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Liberation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Chimurenga 1:</strong> Nehanda, Kaguvi – spirit mediums inspired fighters</li>
            <li><strong>Chimurenga 2:</strong> AICs, mission churches, spirit mediums supported struggle</li>
            <li><strong>Contributions:</strong> spiritual inspiration, unity, guidance, support</li>
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

    // Remove highlight from any previously highlighted heading
    document.querySelectorAll('.highlight-heading').forEach((el) => {
      el.classList.remove('highlight-heading');
    });

    // Find the target section
    const sectionEl = document.getElementById(id);
    if (sectionEl) {
      // Scroll to the section
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Find its <h2> heading and apply the highlight
      const heading = sectionEl.querySelector('h2');
      if (heading) {
        heading.classList.remove('highlight-heading');
        void heading.offsetWidth;
        heading.classList.add('highlight-heading');
      }
    }
  };

  // Find active index for footer
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
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{section.title}</h2>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6 max-w-none">{section.content}</div>
        {section.aside && <aside className="lg:sticky lg:top-24 space-y-5">{section.aside}</aside>}
      </div>
    </section>
  );

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <style>{highlightStyles}</style>

      {/* Header */}
      <div className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            FAMILY AND RELIGIOUS STUDIES
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Religion and Contemporary Issues</h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore how religion interacts with family, education, gender, health, disability, environment,
            rights, conflict, enterprise, and the liberation struggle in modern Zimbabwean society.
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
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Family &amp; Identity:</strong> Unhu/Ubuntu shapes
                  Zimbabwean identity through community, respect, sharing, and connection to ancestors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Education:</strong> Religion has both positive impacts
                  (schools, values, discipline) and negative impacts (imposition, discrimination) in
                  formal education; IR plays a key role in informal education.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Gender:</strong> Each religion has different views on
                  gender roles; all religions are increasingly supporting women's empowerment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ethics &amp; Health:</strong> IR provides the moral
                  foundation for Unhu/Ubuntu; religion can positively support people with chronic
                  conditions but can also create stigma and discourage medical care.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Disability:</strong> Perceptions vary – IR (spirit
                  punishment), Christianity (God's plan), Islam (test), Judaism (dignity); people with
                  disabilities often face marginalisation in education, employment, and social life.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Environment:</strong> Judaism uses Bal Tashchit and
                  Shabbat; Islam uses Mizan, Hima, and water conservation to preserve the environment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rights:</strong> The elderly and people with disabilities
                  have rights to care, respect, and participation; freedom of worship has benefits and
                  disadvantages.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conflict:</strong> Community conflicts arise from land,
                  politics, culture, inequality; religion can cause conflict but also provides mediation,
                  dialogue, and forgiveness.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Enterprise:</strong> Religion-based enterprises include
                  institutions, faith-based businesses, and social enterprises; religious teachings
                  encourage hard work, honesty, and fairness.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Liberation:</strong> IR and Christian practitioners
                  played vital roles in Chimurenga 1 (Nehanda, Kaguvi) and Chimurenga 2 (AICs, mission
                  churches, spirit mediums) through spiritual guidance and material support.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Topic 2!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Topic 3</span>?</>
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
                alert('Proceed to Topic 3 (not implemented in this demo)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Topic 3 →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default topic2;