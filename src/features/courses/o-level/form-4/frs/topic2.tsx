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
          <SubtopicCard title="Agents of Cultural Change and Their Effect on Family">

          <p>
            Cultural change happens when new ideas, technologies, or ways of life
            influence a society. These changes can affect families in both positive
            and negative ways. Here are some of the main agents of cultural change:
          </p>

          <h4 className="text-lg font-semibold mt-4">Technology and Media</h4>
          <ul>
            <li>
              <strong>Effect on family:</strong> Technology has changed how families
              communicate and spend time together. Mobile phones and social media
              allow families to stay connected even when they are far apart.
            </li>
            <li>
              However, technology can also reduce face‑to‑face interaction. Family
              members may spend more time on their devices and less time talking
              to each other.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Education</h4>
          <ul>
            <li>
              <strong>Effect on family:</strong> Education exposes people to new
              ideas and ways of thinking. Children may learn values and beliefs
              that are different from those of their parents.
            </li>
            <li>
              This can create generational gaps but also helps families grow and adapt.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Urbanisation</h4>
          <ul>
            <li>
              <strong>Effect on family:</strong> Moving from rural areas to cities
              changes family structures. Extended families may break up as people
              move away for work.
            </li>
            <li>
              Nuclear families become more common, and traditional roles may change.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Globalisation</h4>
          <ul>
            <li>
              <strong>Effect on family:</strong> Exposure to other cultures through
              travel, media, and the internet introduces new ideas about family,
              marriage, and gender roles.
            </li>
            <li>
              Some families embrace these changes, while others resist them.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Religion</h4>
          <ul>
            <li>
              <strong>Effect on family:</strong> Religion can both preserve traditional
              family values and introduce new ones. Religious institutions teach
              families how to live and relate to each other.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Family's Role in National Values and Good Citizenship">

          <ul>
            <li>
              <strong>Teaching values:</strong> Families are the first place where
              children learn values like honesty, respect, and responsibility.
              These values are the foundation of good citizenship.
            </li>
            <li>
              <strong>Modelling behaviour:</strong> Parents and elders model good
              citizenship by participating in community activities, following the law,
              and helping others. Children learn by watching.
            </li>
            <li>
              <strong>Community involvement:</strong> Families that are involved in
              their communities help to build strong, cohesive societies.
              They teach their children the importance of contributing to the common good.
            </li>
            <li>
              <strong>Preserving culture:</strong> Families pass down cultural
              traditions and values from one generation to the next.
              This helps to maintain the identity of the nation.
            </li>
            <li>
              <strong>Respect for diversity:</strong> Families teach children to
              respect people who are different from them. This promotes tolerance
              and unity in the nation.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Indigenous Religion's Role in African Identity">

          <ul>
            <li>
              <strong>Connection to ancestors:</strong> IR connects people to their
              ancestors and gives them a sense of history and belonging.
              This is a core part of African identity.
            </li>
            <li>
              <strong>Cultural values:</strong> IR teaches values like respect for
              elders, community, and generosity. These values are central to being
              African and are expressed through Unhu/Ubuntu.
            </li>
            <li>
              <strong>Sense of community:</strong> IR emphasises that people are
              not alone – they are part of a larger community that includes both
              the living and the ancestors. This is a key aspect of African identity.
            </li>
            <li>
              <strong>Rituals and ceremonies:</strong> IR rituals mark important
              life events and connect people to their culture. They reinforce a
              sense of identity and belonging.
            </li>
            <li>
              <strong>Resistance to oppression:</strong> IR has been a source of
              strength and resistance. It has helped African people to resist
              colonialism and to maintain their identity.
            </li>
            <li>
              <strong>Connection to the land:</strong> IR teaches that the land is
              sacred and is connected to the ancestors. This is a fundamental part
              of African identity.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Family &amp; Identity</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Agents of change:</strong> technology, education, urbanisation, globalisation</li>
            <li><strong>Family role:</strong> teaches values, models good citizenship</li>
            <li><strong>IR &amp; African identity:</strong> ancestors, community, Unhu/Ubuntu</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Religion and Education',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Role of Religion in Nation‑Building and Educational Institutions">

          <ul>
            <li>
              <strong>Establishing schools:</strong> Religious organisations have
              played a major role in establishing schools in Zimbabwe and across Africa.
              These schools provide education to millions of people.
            </li>
            <li>
              <strong>Moral and values education:</strong> Religious schools teach
              values like honesty, respect, and responsibility. These values are
              essential for building a strong nation.
            </li>
            <li>
              <strong>Developing leaders:</strong> Religious institutions have trained
              many of Africa's leaders. They provide education and leadership skills
              that are used in government, business, and the community.
            </li>
            <li>
              <strong>Promoting unity:</strong> Religious institutions bring people
              together across ethnic and cultural divides. This helps to promote
              national unity and peace.
            </li>
            <li>
              <strong>Contributing to development:</strong> Religious organisations
              are involved in development projects, such as building hospitals,
              providing clean water, and fighting poverty.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Role in Human Resource Capacity Building">

          <ul>
            <li>
              <strong>Skills training:</strong> Religious organisations run vocational
              training centres that teach people practical skills like carpentry,
              sewing, and agriculture.
            </li>
            <li>
              <strong>Leadership development:</strong> Religious institutions train
              people to become leaders in their communities and churches.
              They learn public speaking, counselling, and organisational skills.
            </li>
            <li>
              <strong>Moral development:</strong> Religion teaches people to be
              honest, hard‑working, and responsible. These qualities make them
              valuable employees and citizens.
            </li>
            <li>
              <strong>Health and well‑being:</strong> Religious organisations also
              train people in health and wellness, including HIV/AIDS education,
              nutrition, and hygiene.
            </li>
            <li>
              <strong>Entrepreneurship:</strong> Some religious groups run programmes
              that teach people how to start and run their own businesses.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Negative Impact of Religion on Access to Formal Education">

          <ul>
            <li>
              <strong>Discrimination:</strong> Some religious schools may discriminate
              against students from other religions or against girls.
              This can limit access to education for some groups.
            </li>
            <li>
              <strong>Overemphasis on religious instruction:</strong> Some religious
              schools may focus too much on religious studies and not enough on
              other important subjects like science and mathematics.
            </li>
            <li>
              <strong>Imposition of beliefs:</strong> Some religious schools may
              force students to convert to their religion or to follow their practices.
              This can create a hostile environment for non‑believers.
            </li>
            <li>
              <strong>Conflict with traditional values:</strong> Religious teachings
              may conflict with traditional beliefs and practices. This can create
              tension for students who are trying to balance both.
            </li>
            <li>
              <strong>Financial barriers:</strong> Some religious schools charge high
              fees, which limits access for poor families.
            </li>
            <li>
              <strong>Religious conflicts:</strong> In some areas, conflicts between
              religious groups have forced schools to close or have made it unsafe
              for children to attend.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Education Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Positive:</strong> schools, values, leaders, unity, development</li>
            <li><strong>Human resources:</strong> skills, leadership, morality, health</li>
            <li><strong>Negative:</strong> discrimination, overemphasis, imposition, costs</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'gender',
      title: 'Religion and Gender',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Gender Views Across Religions (Compare and Contrast)">


          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              <strong>View:</strong> Both men and women are valued and have important roles.
              There is a balance between the two.
            </li>
            <li>
              <strong>Men:</strong> Often leaders of the family and community, responsible
              for protection and public representation.
            </li>
            <li>
              <strong>Women:</strong> Respected as mothers and caregivers, some are also
              spirit mediums with spiritual authority.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              <strong>View:</strong> Traditional Judaism has clear gender roles, but modern
              Judaism is more egalitarian.
            </li>
            <li>
              <strong>Men:</strong> Traditionally, men are heads of the household and
              lead prayers in the synagogue.
            </li>
            <li>
              <strong>Women:</strong> Responsible for the home and raising children, but
              also have important roles in rituals like lighting Shabbat candles.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              <strong>View:</strong> Views vary widely. Some churches have traditional roles,
              while others have women as pastors, bishops, and leaders.
            </li>
            <li>
              <strong>Men:</strong> In many traditional churches, men are leaders – pastors,
              priests, and elders.
            </li>
            <li>
              <strong>Women:</strong> Often involved in church activities, but leadership
              roles vary by denomination. Pentecostal churches often have many women leaders.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              <strong>View:</strong> Islam has clear roles for men and women, but both are
              valued and respected.
            </li>
            <li>
              <strong>Men:</strong> Leaders of the family and community, responsible for
              providing for their families.
            </li>
            <li>
              <strong>Women:</strong> Respected as mothers, responsible for raising children,
              but also have rights to education and work.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Forms, Causes, and Religious Solutions to Gender‑Based Violence">


          <h4 className="text-lg font-semibold mt-4">Forms of Gender‑Based Violence</h4>
          <ul>
            <li>
              <strong>Physical violence:</strong> Hitting, slapping, beating, or any
              physical harm.
            </li>
            <li>
              <strong>Sexual violence:</strong> Rape, sexual harassment, forced marriage,
              or any unwanted sexual activity.
            </li>
            <li>
              <strong>Emotional and psychological violence:</strong> Verbal abuse,
              insults, threats, controlling behaviour, and isolation.
            </li>
            <li>
              <strong>Economic violence:</strong> Controlling a person's access to money
              or resources, preventing them from working or going to school.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Causes of Gender‑Based Violence</h4>
          <ul>
            <li>
              <strong>Power imbalances:</strong> When one person has more power or
              control over another, it can lead to abuse.
            </li>
            <li>
              <strong>Cultural norms:</strong> Some cultures accept violence against
              women as a way to "discipline" them.
            </li>
            <li>
              <strong>Poverty and stress:</strong> Financial difficulties and stress
              can lead to frustration and violence.
            </li>
            <li>
              <strong>Substance abuse:</strong> Alcohol and drugs can reduce self‑control
              and increase violent behaviour.
            </li>
            <li>
              <strong>Inadequate laws:</strong> When laws do not protect people from
              violence, it can continue unchecked.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Religious Solutions to Gender‑Based Violence</h4>
          <ul>
            <li>
              <strong>Teaching equality and respect:</strong> Religions teach that all
              people are created equal and should be treated with respect.
            </li>
            <li>
              <strong>Condemning violence:</strong> Religious leaders speak out against
              violence and teach that it is wrong.
            </li>
            <li>
              <strong>Providing support:</strong> Religious organisations provide
              counselling, shelter, and support to victims of violence.
            </li>
            <li>
              <strong>Promoting forgiveness and reconciliation:</strong> Religions
              encourage people to forgive and to seek reconciliation, which can help
              break the cycle of violence.
            </li>
            <li>
              <strong>Education and awareness:</strong> Religious institutions can
              teach people about the causes and effects of gender‑based violence.
            </li>
            <li>
              <strong>Community action:</strong> Religious communities can work together
              to support victims and to prevent violence.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Gender Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Gender views:</strong> varied across religions</li>
            <li><strong>GBV forms:</strong> physical, sexual, emotional, economic</li>
            <li><strong>Causes:</strong> power, culture, poverty, substance abuse</li>
            <li><strong>Religious solutions:</strong> teaching equality, support, education</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ethics-health',
      title: 'Religion, Ethics, Health and Sexuality',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Unhu / Ubuntu and African Identity as Derived from Indigenous Religion">

          <ul>
            <li>
              <strong>Unhu/Ubuntu is the foundation of African identity:</strong> It is
              a philosophy that emphasises community, respect, and the interconnectedness
              of all people.
            </li>
            <li>
              <strong>Derived from IR:</strong> Unhu/Ubuntu comes directly from the
              beliefs and practices of Indigenous Religion. It teaches that people
              are connected to each other, to their ancestors, and to the land.
            </li>
            <li>
              <strong>Key values:</strong> Respect for elders, sharing, honesty,
              hospitality, and community service. These values shape how Africans
              see themselves and relate to others.
            </li>
            <li>
              <strong>Identity:</strong> Unhu/Ubuntu gives Africans a sense of identity
              and belonging. It reminds them that they are part of a larger community
              that includes their ancestors and future generations.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Contribution to Shaping Attitudes on Femininity and Masculinity">

          <ul>
            <li>
              <strong>Femininity:</strong> Religion often teaches that women should be
              caring, nurturing, and supportive. They are seen as the heart of the
              family and are responsible for raising children and maintaining the home.
            </li>
            <li>
              <strong>Masculinity:</strong> Religion often teaches that men should be
              strong, brave, and responsible. They are seen as the leaders and protectors
              of the family and community.
            </li>
            <li>
              <strong>Changing attitudes:</strong> As societies change, attitudes toward
              femininity and masculinity are also changing. More women are becoming
              leaders, and more men are taking on caregiving roles. Religion can
              both support and resist these changes.
            </li>
            <li>
              <strong>Positive contributions:</strong> Religion teaches that both men
              and women have value and dignity. It encourages mutual respect and
              partnership between the sexes.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Influence on People with Health Conditions">


          <h4 className="text-lg font-semibold mt-4">Positive Influences</h4>
          <ul>
            <li>
              <strong>Hope and comfort:</strong> Religion gives people hope in difficult
              times. It helps them cope with illness and find meaning in their suffering.
            </li>
            <li>
              <strong>Community support:</strong> Religious communities provide practical
              and emotional support to people who are sick. They pray for them, visit them,
              and help with daily tasks.
            </li>
            <li>
              <strong>Encouragement:</strong> Religious teachings encourage people to
              be strong and to trust in God. This can help them stay positive and
              motivated to recover.
            </li>
            <li>
              <strong>Meaning and purpose:</strong> Religion can help people find
              meaning in their illness. They may see it as a test, a way to grow
              spiritually, or a way to help others.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Negative Influences</h4>
          <ul>
            <li>
              <strong>Stigma:</strong> Some religious beliefs create stigma around
              certain conditions. For example, some people believe that HIV/AIDS
              is a punishment from God. This can make people feel guilty and ashamed.
            </li>
            <li>
              <strong>Avoidance of medical care:</strong> Some religious groups
              discourage people from seeking medical treatment. They may believe
              that prayer alone is enough to heal them. This can be dangerous.
            </li>
            <li>
              <strong>Spiritual abuse:</strong> Some religious leaders may take
              advantage of people who are sick. They may promise healing in exchange
              for money or may use their authority to control people.
            </li>
            <li>
              <strong>Isolation:</strong> People who are sick may feel isolated if
              they cannot participate in religious activities. This can make them
              feel excluded and alone.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Ethics &amp; Health</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Unhu/Ubuntu:</strong> core of African identity, derived from IR</li>
            <li><strong>Femininity/Masculinity:</strong> shaped by religious teachings</li>
            <li><strong>Health:</strong> positive – hope, support; negative – stigma, avoidance</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'disability',
      title: 'Religion and Disability',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Religious Attitudes Toward Disability">


          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              Disability may be seen as a result of breaking taboos or offending
              the ancestors. It may be viewed as a punishment or a test from the spirits.
            </li>
            <li>
              However, people with disabilities are often still cared for by their
              families and are seen as part of the community.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Many Christians see disability as part of God's plan. They believe that
              everyone has value and purpose, regardless of their abilities.
            </li>
            <li>
              Some believe that healing is possible through prayer and faith.
              Others believe that disability is a way for God to be glorified.
            </li>
            <li>
              Many churches have programmes to support people with disabilities and
              their families.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              In Islam, disability is seen as a test from Allah. It is not a punishment,
              but an opportunity for spiritual growth.
            </li>
            <li>
              Muslims are encouraged to care for people with disabilities and to
              treat them with kindness and respect.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              Judaism teaches that all people are created in the image of God.
              This means that everyone has inherent dignity and worth.
            </li>
            <li>
              The Jewish community is expected to care for people with disabilities
              and to include them in community life.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Intervention Measures for Persons with Disability">

          <ul>
            <li>
              <strong>Support and care:</strong> Religious communities provide care
              for people with disabilities and their families. This can include
              practical help, emotional support, and financial assistance.
            </li>
            <li>
              <strong>Prayer and healing:</strong> Many religious groups pray for
              healing for people with disabilities. Some believe that healing can
              be a miraculous event, while others see it as a process of acceptance
              and support.
            </li>
            <li>
              <strong>Inclusion:</strong> Religious communities can include people
              with disabilities in all aspects of community life. This means making
              sure they can participate in worship, activities, and decision‑making.
            </li>
            <li>
              <strong>Education and awareness:</strong> Religious institutions can
              educate their members about disabilities and how to support people
              who have them.
            </li>
            <li>
              <strong>Advocacy:</strong> Religious groups can advocate for the rights
              of people with disabilities. They can speak out against discrimination
              and work to change laws and policies.
            </li>
            <li>
              <strong>Accessible facilities:</strong> Religious buildings should be
              accessible to people with physical disabilities. This includes ramps,
              wide doorways, and accessible washrooms.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Disability Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Attitudes:</strong> IR – spirit punishment; Christianity – God's plan; Islam – test; Judaism – dignity</li>
            <li><strong>Interventions:</strong> support, prayer, inclusion, education, advocacy</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rights',
      title: 'Religion, Rights and Social Responsibility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Advantages and Disadvantages of Freedom of Worship">


          <h4 className="text-lg font-semibold mt-4">Advantages</h4>
          <ul>
            <li>
              <strong>Freedom to believe:</strong> People can follow their own faith
              and beliefs without fear of persecution. This is a basic human right.
            </li>
            <li>
              <strong>Diversity:</strong> Freedom of worship allows for religious
              diversity. People from different religions can live together in peace
              and learn from each other.
            </li>
            <li>
              <strong>Spiritual growth:</strong> People can practise their religion
              freely, which helps them grow spiritually and find meaning in life.
            </li>
            <li>
              <strong>Community:</strong> Religious groups can build communities
              and support their members.
            </li>
            <li>
              <strong>Contribution to society:</strong> Religious groups often
              contribute to society through charities, schools, and hospitals.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Disadvantages</h4>
          <ul>
            <li>
              <strong>Religious extremism:</strong> Freedom of worship can sometimes
              lead to religious extremism, where people use their beliefs to justify
              violence or intolerance.
            </li>
            <li>
              <strong>Conflicts:</strong> Differences between religious groups can
              sometimes lead to conflict and division.
            </li>
            <li>
              <strong>Abuse:</strong> Some religious leaders may abuse their power
              and exploit their followers.
            </li>
            <li>
              <strong>Discrimination:</strong> Some religious groups may discriminate
              against people who do not share their beliefs.
            </li>
            <li>
              <strong>Imposition on others:</strong> Some groups may try to impose
              their beliefs on others, which can cause resentment and conflict.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Relationship Between Rights and Social Responsibility">

          <ul>
            <li>
              <strong>Rights come with responsibilities:</strong> Having rights means
              also having responsibilities. For example, the right to freedom of
              speech comes with the responsibility to speak respectfully and not to
              spread hatred.
            </li>
            <li>
              <strong>Balancing rights:</strong> People's rights must be balanced
              with the rights of others. No one's rights should harm another person.
            </li>
            <li>
              <strong>Social responsibility:</strong> Social responsibility is the
              duty to act in ways that benefit society. It means caring about the
              well‑being of others and the community.
            </li>
            <li>
              <strong>Religious teachings:</strong> Many religions teach that people
              have a responsibility to care for others. This is often called "love
              your neighbour" or "help the poor."
            </li>
            <li>
              <strong>Citizenship:</strong> Good citizenship is about both rights
              and responsibilities. Citizens have the right to participate in their
              community, but they also have the responsibility to contribute to it.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Role in Shaping Leadership Styles">

          <ul>
            <li>
              <strong>Servant leadership:</strong> Many religions teach that leaders
              should serve others, not just themselves. Jesus said, "The greatest
              among you will be your servant."
            </li>
            <li>
              <strong>Integrity and honesty:</strong> Religious teachings encourage
              leaders to be honest and to act with integrity.
            </li>
            <li>
              <strong>Compassion and care:</strong> Religious leaders are often
              expected to be compassionate and to care for the people they lead.
            </li>
            <li>
              <strong>Responsibility:</strong> Leaders are held accountable for
              their actions. They are expected to lead with fairness and justice.
            </li>
            <li>
              <strong>Community focus:</strong> Religious leaders are often focused
              on building community and serving the common good.
            </li>
            <li>
              <strong>Examples:</strong> Many great leaders in Africa were inspired
              by their religious beliefs. They used their faith to guide their
              leadership and to work for justice and freedom.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Rights &amp; Responsibility</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Freedom of worship:</strong> advantages – freedom, diversity; disadvantages – extremism, conflict</li>
            <li><strong>Rights &amp; responsibility:</strong> rights come with duties, social responsibility</li>
            <li><strong>Leadership:</strong> servant leadership, integrity, compassion</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conflict-management',
      title: 'Religion and Conflict Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Causes of Religious Conflict at National and Global Level">


          <h4 className="text-lg font-semibold mt-4">Differences in Beliefs and Practices</h4>
          <ul>
            <li>
              Different religions have different beliefs about God, morality, and
              how people should live. These differences can lead to tension and conflict.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Competition for Followers</h4>
          <ul>
            <li>
              Religious groups may compete with each other for followers. This can
              lead to aggressive proselytisation and conflict.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Political and Economic Factors</h4>
          <ul>
            <li>
              Religious conflicts are often linked to political and economic issues.
              Groups may use religion to justify political power or control of resources.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Historical Grievances</h4>
          <ul>
            <li>
              Past conflicts and injustices can fuel religious conflict. Groups
              may hold onto grievances for generations.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Religious Extremism</h4>
          <ul>
            <li>
              Some people interpret their religion in extreme ways and may use
              violence to achieve their goals. This is a major cause of religious
              conflict around the world.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Misunderstandings and Stereotypes</h4>
          <ul>
            <li>
              When people do not understand each other's religions, stereotypes
              and prejudice can develop. This can lead to conflict.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Impact of Religious Conflict">

          <ul>
            <li>
              <strong>Loss of life:</strong> Religious conflicts can lead to many
              people being injured or killed.
            </li>
            <li>
              <strong>Displacement:</strong> People may be forced to leave their
              homes and communities because of religious violence.
            </li>
            <li>
              <strong>Destruction of property:</strong> Homes, businesses, and places
              of worship may be damaged or destroyed.
            </li>
            <li>
              <strong>Trauma:</strong> Religious conflict can cause lasting psychological
              trauma for individuals and communities.
            </li>
            <li>
              <strong>Division and hatred:</strong> Religious conflict can create
              deep divisions between groups and foster hatred and mistrust.
            </li>
            <li>
              <strong>Economic damage:</strong> Conflict can damage the economy by
              disrupting trade, destroying infrastructure, and deterring investment.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Role in Conflict Management">

          <ul>
            <li>
              <strong>Mediation and reconciliation:</strong> Religious leaders are
              often respected and trusted. They can act as mediators to help resolve
              conflicts and promote reconciliation.
            </li>
            <li>
              <strong>Dialogue and understanding:</strong> Religious groups can bring
              people from different faiths together to talk and understand each other
              better. This is called interfaith dialogue.
            </li>
            <li>
              <strong>Teaching tolerance and peace:</strong> Religious teachings often
              promote peace, forgiveness, and tolerance. These teachings can help
              prevent conflict.
            </li>
            <li>
              <strong>Humanitarian assistance:</strong> Religious organisations often
              provide humanitarian assistance to people affected by conflict.
              This includes food, shelter, and medical care.
            </li>
            <li>
              <strong>Advocacy for peace:</strong> Religious leaders can advocate
              for peace and speak out against violence. They can use their influence
              to pressure governments and other groups to end conflict.
            </li>
            <li>
              <strong>Prayer for peace:</strong> Religious groups often pray for peace
              and for an end to conflict. Prayer can bring comfort and hope to people
              who are suffering.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Conflict Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> beliefs, competition, politics, extremism, stereotypes</li>
            <li><strong>Impact:</strong> loss of life, displacement, trauma, division</li>
            <li><strong>Management:</strong> mediation, dialogue, tolerance, humanitarian aid</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'technology-enterprise',
      title: 'Religion, Technology and Enterprise',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Forms of Technology and How Religion Interacts with It">


          <h4 className="text-lg font-semibold mt-4">Forms of Technology</h4>
          <ul>
            <li>
              <strong>Communication technology:</strong> Mobile phones, internet,
              social media, and email. These allow people to connect instantly.
            </li>
            <li>
              <strong>Medical technology:</strong> Diagnostic machines, vaccines,
              surgical tools, and telemedicine. These help treat and prevent illness.
            </li>
            <li>
              <strong>Agricultural technology:</strong> Tractors, irrigation systems,
              and genetically modified crops. These improve food production.
            </li>
            <li>
              <strong>Transportation technology:</strong> Cars, aeroplanes, trains,
              and bicycles. These make travel faster and easier.
            </li>
            <li>
              <strong>Educational technology:</strong> Computers, tablets, online
              learning platforms, and digital resources. These improve access to education.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">How Religion Interacts with Technology</h4>
          <ul>
            <li>
              <strong>Religious use of technology:</strong> Many religious groups use
              technology to share their messages. They use websites, social media,
              and apps to reach more people.
            </li>
            <li>
              <strong>Technology for religious education:</strong> Online courses,
              videos, and apps help people learn about their faith and study religious texts.
            </li>
            <li>
              <strong>Religious broadcasting:</strong> Many religious groups have
              their own television and radio stations. They broadcast sermons,
              prayers, and religious programmes.
            </li>
            <li>
              <strong>Virtual worship:</strong> During the COVID‑19 pandemic, many
              churches and mosques began holding virtual services. This allowed
              people to continue worshipping from home.
            </li>
            <li>
              <strong>Religious apps:</strong> There are apps for prayer times,
              Bible reading, Quran study, and meditation.
            </li>
            <li>
              <strong>Ethical concerns:</strong> Religion also raises questions about
              the ethical use of technology. For example, issues like privacy,
              artificial intelligence, and genetic engineering are considered from
              a moral and spiritual perspective.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion's Positive and Negative Impact on Enterprise">


          <h4 className="text-lg font-semibold mt-4">Positive Impacts</h4>
          <ul>
            <li>
              <strong>Work ethic:</strong> Many religions teach that hard work is a
              virtue. This encourages people to be diligent and productive in their work.
            </li>
            <li>
              <strong>Fiscal discipline:</strong> Religious teachings often encourage
              saving, avoiding debt, and being responsible with money.
            </li>
            <li>
              <strong>Religious tourism:</strong> Pilgrimages and religious tourism
              generate income for many communities. People travel to sacred sites
              and spend money on accommodation, food, and souvenirs.
            </li>
            <li>
              <strong>Honesty and trustworthiness:</strong> Religion teaches people
              to be honest in their business dealings. This builds trust and helps
              businesses to succeed.
            </li>
            <li>
              <strong>Community support:</strong> Religious communities often support
              their members who are starting businesses. They may provide loans,
              advice, or connections.
            </li>
            <li>
              <strong>Ethical business practices:</strong> Religious values guide
              entrepreneurs to run their businesses in a way that is good for the
              environment and good for society.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Negative Impacts</h4>
          <ul>
            <li>
              <strong>Religious restrictions:</strong> Some religious rules may
              restrict certain types of business. For example, Islam prohibits
              businesses that deal with alcohol, gambling, or interest‑based finance.
            </li>
            <li>
              <strong>Discrimination:</strong> Some businesses may discriminate
              against people of other religions or against women.
            </li>
            <li>
              <strong>Conflict with traditional enterprise:</strong> Some religious
              teachings may discourage certain traditional business practices.
            </li>
            <li>
              <strong>Misuse of religious trust:</strong> Some religious leaders
              may take advantage of their followers by encouraging them to invest
              in businesses that are not legitimate.
            </li>
            <li>
              <strong>Overemphasis on material success:</strong> Some religious
              groups may promote the idea that wealth is a sign of God's favour,
              which can lead to greed and exploitation.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Tech &amp; Enterprise</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Technology:</strong> communication, medical, agricultural, transport, education</li>
            <li><strong>Religion &amp; tech:</strong> religious broadcasting, apps, virtual worship</li>
            <li><strong>Positive:</strong> work ethic, fiscal discipline, religious tourism, honesty</li>
            <li><strong>Negative:</strong> restrictions, discrimination, misuse of trust</li>
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
              <strong>Mbuya Nehanda:</strong> A powerful spirit medium who inspired
              the people to fight against the British colonisers. She told the people
              that the ancestors were on their side and that they would be victorious.
            </li>
            <li>
              <strong>Sekuru Kaguvi:</strong> A spirit medium who led the rebellion
              in the areas around Harare. He united the people and encouraged them to resist.
            </li>
            <li>
              <strong>Role:</strong> Spirit mediums provided spiritual guidance,
              predicted outcomes, and gave the fighters courage. They were the spiritual
              backbone of the rebellion.
            </li>
          </ul>

          <h5 className="font-semibold mt-3">Christian Practitioners</h5>
          <ul>
            <li>
              <strong>Missionaries:</strong> Some missionaries were sympathetic to
              the African cause and spoke out against the injustices of the colonial system.
            </li>
            <li>
              <strong>Role:</strong> They provided education and healthcare to the
              people, which helped them resist oppression. Some also acted as
              intermediaries between the Africans and the colonial government.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Chimurenga / Umvukela 2 (1960s – 1980)</h4>

          <h5 className="font-semibold mt-3">Indigenous Religion Practitioners</h5>
          <ul>
            <li>
              <strong>Spirit mediums:</strong> The spirit of Mbuya Nehanda was a
              powerful inspiration for the fighters. Many leaders of the liberation
              movements consulted spirit mediums for guidance.
            </li>
            <li>
              <strong>Role:</strong> Spirit mediums gave blessings to the fighters,
              predicted success, and provided spiritual protection.
            </li>
          </ul>

          <h5 className="font-semibold mt-3">Christian Practitioners</h5>
          <ul>
            <li>
              <strong>African Independent Churches (AICs):</strong> These churches
              strongly supported the liberation struggle. Their leaders often encouraged
              their members to support the freedom fighters.
            </li>
            <li>
              <strong>Mission churches:</strong> Some leaders of mission churches
              also supported the struggle. They spoke out against the injustices of
              the colonial system.
            </li>
            <li>
              <strong>Specific individuals:</strong> Many Christian individuals
              supported the freedom fighters by providing food, shelter, and information.
            </li>
            <li>
              <strong>Role:</strong> They provided material support, moral encouragement,
              and spiritual guidance. They also spoke out against injustice and helped
              to mobilise international support for the liberation struggle.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Summary of Religious Contributions</h4>
          <ul>
            <li>
              <strong>Spiritual inspiration:</strong> Religion gave the people hope
              and courage to fight against a powerful enemy.
            </li>
            <li>
              <strong>Unity:</strong> Religion brought people together and united
              them in a common cause.
            </li>
            <li>
              <strong>Guidance:</strong> Religious leaders provided guidance and
              wisdom to the fighters.
            </li>
            <li>
              <strong>Support:</strong> Religious groups provided material support
              to the fighters and their families.
            </li>
            <li>
              <strong>Justice:</strong> Religious leaders spoke out against injustice
              and called for a free and fair society.
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
            Explore how religion interacts with family, education, gender, health, disability, rights,
            conflict, technology, enterprise, and the liberation struggle in modern society.
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
                  <strong className="text-white">Family &amp; Identity:</strong> Technology, education,
                  urbanisation, and globalisation change families; families teach values for good
                  citizenship; IR shapes African identity through ancestors and Unhu/Ubuntu.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Education:</strong> Religion builds nations through
                  schools and values; develops human resources; but can also limit access through
                  discrimination and costs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Gender:</strong> Views vary across religions; GBV
                  includes physical, sexual, emotional, and economic violence; religious solutions
                  include teaching equality and providing support.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ethics &amp; Health:</strong> Unhu/Ubuntu is the
                  foundation of African identity; religion shapes views on femininity and masculinity;
                  can support or stigmatise people with health conditions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Disability:</strong> Attitudes vary – IR (spirit),
                  Christianity (God's plan), Islam (test), Judaism (dignity); interventions include
                  support, inclusion, and advocacy.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rights &amp; Responsibility:</strong> Freedom of
                  worship has benefits and disadvantages; rights come with responsibilities; religion
                  shapes servant leadership.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conflict Management:</strong> Religious conflicts
                  arise from beliefs, politics, and extremism; impact includes loss of life and
                  division; religion offers mediation, dialogue, and humanitarian aid.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Technology &amp; Enterprise:</strong> Religion uses
                  technology for broadcasting and apps; positive impacts include work ethic and
                  religious tourism; negative impacts include restrictions and misuse of trust.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Liberation Struggle:</strong> IR practitioners
                  (Nehanda, Kaguvi) and Christian practitioners (AICs, mission churches) provided
                  spiritual guidance, unity, and material support in Chimurenga 1 and 2.
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