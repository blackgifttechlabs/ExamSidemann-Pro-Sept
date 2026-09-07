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
          <SubtopicCard title="Definition of Family">

          <p>
            A family is a group of people who are related by blood, marriage, or adoption.
            They live together or stay connected and support each other emotionally, socially, and financially.
            The family is the smallest and most basic social unit in any society.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Family Structure">

          <p>
            Family structures vary across cultures and communities. The way a family is organised
            affects how people relate to each other and how they practice their religion.
            There are several types of family structures:
          </p>
          <ul>
            <li>
              <strong>Nuclear family:</strong> This consists of a father, mother, and their children.
              It is common in modern urban settings and often emphasises independence.
            </li>
            <li>
              <strong>Extended family:</strong> This includes grandparents, aunts, uncles, cousins,
              and other relatives living together or close by. It is common in many African communities
              and provides strong social support.
            </li>
            <li>
              <strong>Single-parent family:</strong> This is headed by one parent who raises the children
              alone, either due to divorce, separation, or choice.
            </li>
            <li>
              <strong>Blended family:</strong> This forms when parents with children from previous relationships
              marry or live together.
            </li>
            <li>
              <strong>Childless family:</strong> A couple who do not have children, either by choice or
              due to circumstances.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Role of Indigenous Religion in Shaping Family Identity">

          <p>
            Indigenous Religion (IR) plays a very important role in shaping family identity in many African communities.
            It provides a sense of belonging and teaches people who they are and where they come from.
            Here are some of the key roles:
          </p>
          <ul>
            <li>
              <strong>Ancestral connection:</strong> IR teaches that ancestors are part of the family.
              Families honour their ancestors through rituals and offerings. This keeps the memory of
              past generations alive and gives the family a long history.
            </li>
            <li>
              <strong>Moral values:</strong> IR teaches respect for elders, honesty, hard work, and
              community service. These values become part of the family's identity and guide how
              family members treat each other.
            </li>
            <li>
              <strong>Naming ceremonies:</strong> In many communities, names are given according to
              religious customs. Names often carry meaning about the circumstances of birth or
              family history. This links the child to their family and their ancestors.
            </li>
            <li>
              <strong>Rites of passage:</strong> IR marks important stages in life such as birth,
              initiation, marriage, and death. These ceremonies bring the family together and
              strengthen their identity as a community.
            </li>
            <li>
              <strong>Community belonging:</strong> IR connects the family to the wider community.
              Families participate in community rituals and festivals, which reinforces their
              identity as part of a larger group.
            </li>
            <li>
              <strong>Conflict resolution:</strong> IR provides ways for families to solve disagreements.
              Elders and religious leaders often help settle disputes, which keeps the family united.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Family</strong> – group of people related by blood, marriage, or adoption</li>
            <li><strong>Nuclear family</strong> – parents and children</li>
            <li><strong>Extended family</strong> – includes grandparents, aunts, uncles, etc.</li>
            <li><strong>Identity</strong> – who you are and where you belong</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Religion and Education',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Education">

          <p>
            Education is the process of learning and acquiring knowledge, skills, values, and habits.
            It helps people develop their minds and character so they can live useful and productive lives.
            Education is not just about reading and writing – it is about learning how to think,
            how to relate to others, and how to contribute to society.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Types of Education">

          <p>
            There are two main types of education. Both are important and work together
            to help people grow and develop. These are formal education and informal education.
          </p>

          <h4 className="text-lg font-semibold mt-4">Formal Education</h4>
          <p>
            Formal education is the structured learning that takes place in schools, colleges, and universities.
            It follows a planned curriculum and is led by trained teachers. It is usually organised by the government
            or other official bodies. Formal education is divided into different levels.
          </p>
          <p>
            <strong>Examples of formal education:</strong>
          </p>
          <ul>
            <li>Primary school – children learn basic reading, writing, and mathematics.</li>
            <li>Secondary school – students study more subjects like science, history, and languages.</li>
            <li>College and university – students specialise in specific fields like medicine, law, or engineering.</li>
            <li>Vocational training – practical training for specific careers like carpentry, plumbing, or nursing.</li>
          </ul>
          <p>
            <strong>Characteristics of formal education:</strong>
          </p>
          <ul>
            <li>It follows a set timetable and syllabus.</li>
            <li>It has a formal structure with grades and examinations.</li>
            <li>It is taught by qualified teachers and lecturers.</li>
            <li>It leads to recognised certificates, diplomas, or degrees.</li>
            <li>It is often compulsory for children up to a certain age.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Informal Education</h4>
          <p>
            Informal education is the learning that happens outside the classroom.
            It is not structured or planned. It happens naturally through daily life,
            family interactions, community activities, and personal experiences.
          </p>
          <p>
            <strong>Examples of informal education:</strong>
          </p>
          <ul>
            <li>Learning how to cook from a parent or grandparent.</li>
            <li>Learning about traditional customs and stories from elders.</li>
            <li>Learning how to farm or fish by watching and helping.</li>
            <li>Learning moral values through religious teachings and family life.</li>
            <li>Learning from media, books, and interactions with others.</li>
          </ul>
          <p>
            <strong>Characteristics of informal education:</strong>
          </p>
          <ul>
            <li>It is not structured or timetabled – it happens naturally.</li>
            <li>There is no formal teacher or certificate at the end.</li>
            <li>It is lifelong – people learn informally throughout their lives.</li>
            <li>It is often based on observation and hands‑on practice.</li>
            <li>It is deeply connected to culture and daily life.</li>
          </ul>
          <p>
            Religion plays a major role in both formal and informal education.
            In many communities, religious institutions like churches, mosques, and temples
            have established schools. Religious leaders also teach values and morals informally
            through sermons, stories, and community gatherings.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Education Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Formal:</strong> Schools, colleges, exams, certificates</li>
            <li><strong>Informal:</strong> Home, community, lifelong learning</li>
            <li><strong>Role of Religion:</strong> Values, morals, church/mosque schools</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'gender',
      title: 'Religion and Gender',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Meaning of Gender">

          <p>
            Gender is about the roles, behaviours, activities, and expectations that a society
            considers appropriate for men and women. It is different from sex, which is biological
            (male/female). Gender is something that is learned through culture and society.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Gender Roles">

          <p>
            Gender roles are the tasks and responsibilities that society gives to men and women.
            These roles are often shaped by culture, tradition, and religion. They can change
            over time as societies develop. In many traditional African societies, gender roles
            were clearly defined:
          </p>
          <ul>
            <li>
              <strong>Men:</strong> Often seen as the head of the family, providers, protectors,
              and decision‑makers. They were expected to work outside the home, hunt, farm, and
              represent the family in public matters.
            </li>
            <li>
              <strong>Women:</strong> Seen as caregivers, homemakers, and nurturers. They were
              responsible for raising children, cooking, gathering food, and managing the household.
              In some communities, women also farmed and traded.
            </li>
          </ul>
          <p>
            Today, gender roles are changing. More women are working outside the home,
            and more men are sharing household tasks. Many religions are also rethinking
            traditional gender roles and promoting equality between men and women.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Characteristics of Masculinity and Femininity">


          <h4 className="text-lg font-semibold mt-4">Masculinity</h4>
          <p>
            Masculinity refers to the traits and behaviours that society considers typical of men.
            These traits are not fixed and can vary across cultures.
          </p>
          <ul>
            <li><strong>Strength:</strong> Men are often expected to be physically strong and brave.</li>
            <li><strong>Leadership:</strong> Men are often seen as leaders and decision‑makers.</li>
            <li><strong>Independence:</strong> Men are expected to be self‑reliant and not show weakness.</li>
            <li><strong>Protector:</strong> Men are expected to protect their families and communities.</li>
            <li><strong>Provider:</strong> Men are expected to earn money and provide for their families.</li>
            <li><strong>Emotional restraint:</strong> Men are often taught not to show emotions like fear or sadness.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Femininity</h4>
          <p>
            Femininity refers to the traits and behaviours that society considers typical of women.
            Like masculinity, these traits can vary across cultures.
          </p>
          <ul>
            <li><strong>Nurturing:</strong> Women are often expected to be caring and supportive.</li>
            <li><strong>Empathy:</strong> Women are expected to understand and share the feelings of others.</li>
            <li><strong>Gentleness:</strong> Women are often seen as gentle and soft‑spoken.</li>
            <li><strong>Domesticity:</strong> Women are traditionally associated with home and family tasks.</li>
            <li><strong>Cooperation:</strong> Women are expected to work well with others and build relationships.</li>
            <li><strong>Emotional expression:</strong> Women are often allowed to express emotions more freely.</li>
          </ul>
          <p>
            It is important to remember that these are generalisations. Not all men or women fit these roles,
            and society is becoming more accepting of diversity in gender expression. Religion can both reinforce
            and challenge these traditional gender roles.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Gender Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Gender</strong> – social roles, not biological</li>
            <li><strong>Masculinity:</strong> strength, leadership, provider</li>
            <li><strong>Femininity:</strong> nurturing, empathy, cooperation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ethics-health',
      title: 'Religion, Ethics, Health and Sexuality',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Ethics and Values Defined">

          <p>
            Ethics are the moral principles that guide how people behave.
            They help people decide what is right and what is wrong.
            Values are the beliefs and ideas that a person or community holds dear.
            Together, ethics and values shape how people treat each other and live their lives.
          </p>
          <p>
            <strong>Examples of ethics and values:</strong>
          </p>
          <ul>
            <li><strong>Honesty:</strong> Telling the truth and being fair.</li>
            <li><strong>Respect:</strong> Treating others with kindness and dignity.</li>
            <li><strong>Responsibility:</strong> Taking care of your duties and obligations.</li>
            <li><strong>Compassion:</strong> Feeling for others who are suffering and wanting to help.</li>
            <li><strong>Justice:</strong> Ensuring that people get what they deserve fairly.</li>
            <li><strong>Forgiveness:</strong> Letting go of anger and giving people another chance.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Meaning of Health">

          <p>
            Health is not just about being free from sickness.
            The World Health Organisation defines health as a state of complete physical, mental, and social well‑being.
            This means that a healthy person feels good physically, thinks clearly, and gets along well with others.
          </p>
          <p>
            Religion often teaches that looking after health is important because the body is a gift from God.
            Many religions promote healthy living through dietary rules, rest, prayer, and community support.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Meaning of Sexuality">

          <p>
            Sexuality is about a person's feelings, attractions, and identity in relation to sex and relationships.
            It includes a person's sexual orientation, which is who they are attracted to, and their gender identity.
            Sexuality is a normal part of being human, and everyone experiences it in their own unique way.
          </p>
          <p>
            Many religions have teachings about sexuality. Some traditions encourage certain types of relationships,
            while others encourage people to wait until marriage. Different religions and communities have different views,
            but most encourage respect and dignity in all relationships.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Examples of Chronic Conditions">

          <p>
            Chronic conditions are long‑term health problems that do not go away quickly.
            They require ongoing care and can affect a person's life in many ways.
            Some common chronic conditions include:
          </p>
          <ul>
            <li>
              <strong>HIV/AIDS:</strong> A virus that attacks the immune system. It can be managed with medication,
              but there is no cure. People with HIV need love, support, and access to medicine.
            </li>
            <li>
              <strong>Diabetes:</strong> A condition where the body cannot regulate sugar levels properly.
              It requires careful diet, exercise, and sometimes medication.
            </li>
            <li>
              <strong>Hypertension (high blood pressure):</strong> A condition that increases the risk of heart disease.
              It is managed with lifestyle changes and medication.
            </li>
            <li>
              <strong>Cancer:</strong> A group of diseases involving abnormal cell growth.
              Treatment includes surgery, chemotherapy, and radiation. Early detection improves outcomes.
            </li>
            <li>
              <strong>Asthma:</strong> A lung condition that makes breathing difficult.
              It can be controlled with medication and avoiding triggers.
            </li>
            <li>
              <strong>Arthritis:</strong> Inflammation of the joints, causing pain and stiffness.
              It can make movement difficult and affect daily life.
            </li>
          </ul>
          <p>
            Religion can help people cope with chronic conditions by offering hope, comfort, and community support.
            Many religious communities provide care for the sick and encourage prayer and fellowship.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Ethics &amp; Health Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Ethics:</strong> moral principles – honesty, respect, compassion</li>
            <li><strong>Health:</strong> physical, mental, social well‑being</li>
            <li><strong>Chronic conditions:</strong> HIV, diabetes, cancer, etc.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'disability',
      title: 'Religion and Disability',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Disability">

          <p>
            Disability is a condition that makes it harder for a person to do certain activities
            or interact with the world around them. It can be physical, mental, sensory, or intellectual.
            Disability is not just about a person's body or mind – it is also about how society treats
            people who have differences.
          </p>
          <p>
            There are many types of disabilities, and they can affect people in different ways.
            Some people are born with disabilities, while others develop them due to injury, illness,
            or ageing. Disability is a normal part of human diversity, and everyone deserves respect
            and inclusion.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Causes of Disability">

          <p>
            Disabilities can be caused by many different things. Understanding the causes helps us
            know how to prevent some disabilities and how to support people who have them.
            Here are the main causes:
          </p>

          <h4 className="text-lg font-semibold mt-4">Genetic and Hereditary Causes</h4>
          <ul>
            <li>Conditions that are passed down from parents to children.</li>
            <li>Examples: Down syndrome, cystic fibrosis, hemophilia.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Maternal and Birth‑Related Causes</h4>
          <ul>
            <li>Problems during pregnancy or childbirth can cause disabilities.</li>
            <li>Examples: Lack of oxygen during birth, premature birth, or illness in the mother.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Illness and Disease</h4>
          <ul>
            <li>Some diseases can cause permanent damage to the body or brain.</li>
            <li>Examples: Polio, meningitis, HIV, diabetes, stroke.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Accidents and Injuries</h4>
          <ul>
            <li>Physical accidents can cause lasting injuries.</li>
            <li>Examples: Road traffic accidents, falls, spinal cord injuries, burns.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Environmental Factors</h4>
          <ul>
            <li>Exposure to harmful substances or conditions can cause disability.</li>
            <li>Examples: Lead poisoning, pollution, lack of nutrition, or poor sanitation.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Age‑Related Causes</h4>
          <ul>
            <li>As people get older, they may develop disabilities.</li>
            <li>Examples: Hearing loss, vision problems, arthritis, dementia.</li>
          </ul>

          <p>
            Religion teaches that all people are created equal and that people with disabilities
            should be treated with dignity and respect. Many religious communities support people
            with disabilities through care, prayer, and inclusion in community life.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Disability Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Genetic:</strong> Down syndrome, cystic fibrosis</li>
            <li><strong>Birth‑related:</strong> premature birth, lack of oxygen</li>
            <li><strong>Illness:</strong> polio, HIV, stroke</li>
            <li><strong>Accidents:</strong> road traffic, falls</li>
            <li><strong>Environmental:</strong> pollution, poor nutrition</li>
            <li><strong>Age‑related:</strong> hearing loss, arthritis</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environment',
      title: 'Religion and the Natural Environment',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Environment">

          <p>
            The environment is everything that surrounds us. It includes the air we breathe,
            the water we drink, the land we live on, and all the living things around us.
            The environment is made up of both natural and human‑made things.
            It is our home, and we depend on it for our survival.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Components of the Environment">

          <p>
            The environment has many parts that work together. These parts are called components.
            Each component is important and affects all the others. The main natural components are:
          </p>

          <h4 className="text-lg font-semibold mt-4">Water</h4>
          <ul>
            <li>Water is essential for all living things – humans, animals, and plants.</li>
            <li>It includes rivers, lakes, oceans, rain, and groundwater.</li>
            <li>Water is used for drinking, farming, washing, and many other purposes.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Vegetation</h4>
          <ul>
            <li>Vegetation includes all plants, trees, and grasses.</li>
            <li>It provides oxygen, food, shelter, and medicine.</li>
            <li>Forests help to regulate the climate and prevent soil erosion.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Wildlife</h4>
          <ul>
            <li>Wildlife includes all the animals, birds, insects, and fish that live in nature.</li>
            <li>It maintains the balance of the ecosystem.</li>
            <li>Many animals are important for tourism and as part of cultural heritage.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Environmental Issues">

          <p>
            The environment is facing many problems. These problems are caused by human activities
            and affect all living things. It is important to understand these issues so that we can
            take action to protect the environment. Here are some major environmental issues:
          </p>

          <h4 className="text-lg font-semibold mt-4">Deforestation</h4>
          <ul>
            <li>Cutting down large areas of forests for farming, timber, or development.</li>
            <li>It destroys habitats and reduces biodiversity.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Pollution</h4>
          <ul>
            <li>Contamination of the air, water, and soil with harmful substances.</li>
            <li>Examples: Smoke from factories, plastic waste, chemical runoff from farms.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Climate Change</h4>
          <ul>
            <li>The warming of the earth due to greenhouse gases.</li>
            <li>It causes droughts, floods, rising sea levels, and extreme weather events.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Overpopulation</h4>
          <ul>
            <li>Too many people using limited resources.</li>
            <li>It leads to shortages of food, water, and land.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Loss of Biodiversity</h4>
          <ul>
            <li>Extinction of plants and animals due to habitat destruction.</li>
            <li>It reduces the variety of life on earth and weakens ecosystems.</li>
          </ul>

          <p>
            Many religions teach that humans have a duty to care for the environment.
            They view the earth as a gift from God and believe that people should be responsible stewards
            of the land, water, and wildlife. Protecting the environment is seen as a moral and spiritual duty.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Environment Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Components:</strong> water, vegetation, wildlife</li>
            <li><strong>Issues:</strong> deforestation, pollution, climate change</li>
            <li><strong>Religious duty:</strong> care for creation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'technology-enterprise',
      title: 'Religion, Technology and Enterprise',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Technology">

          <p>
            Technology is the use of knowledge, tools, and machines to solve problems and make life easier.
            It includes everything from simple tools like a hammer to complex machines like computers and mobile phones.
            Technology is constantly changing and improving, and it affects almost every part of modern life.
          </p>
          <p>
            Examples of technology include:
          </p>
          <ul>
            <li><strong>Communication:</strong> Mobile phones, internet, social media.</li>
            <li><strong>Transport:</strong> Cars, aeroplanes, trains, bicycles.</li>
            <li><strong>Medicine:</strong> MRI machines, vaccines, surgical tools.</li>
            <li><strong>Farming:</strong> Tractors, irrigation systems, genetically modified crops.</li>
            <li><strong>Education:</strong> Computers, tablets, online learning platforms.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Definition of Enterprise">

          <p>
            Enterprise is the ability to start and manage a business or project.
            It involves taking risks, being creative, and finding new ways to do things.
            A person who does this is called an entrepreneur. Enterprise is important for creating jobs,
            improving communities, and helping economies grow.
          </p>
          <p>
            Examples of enterprise include:
          </p>
          <ul>
            <li><strong>Starting a business:</strong> Opening a shop, a restaurant, or a farm.</li>
            <li><strong>Innovation:</strong> Creating new products or services.</li>
            <li><strong>Social enterprise:</strong> Setting up organisations to help the community.</li>
            <li><strong>Freelancing:</strong> Offering services like writing, design, or consulting.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion, Technology and Enterprise">

          <p>
            Religion and technology both play important roles in modern life. They can work together
            to improve people's lives and strengthen communities. Here are some ways they connect:
          </p>
          <ul>
            <li>
              <strong>Religious use of technology:</strong> Many religious groups use technology
              to share their messages. They use websites, social media, and apps to reach more people
              and to connect with their communities.
            </li>
            <li>
              <strong>Technology for religious education:</strong> Online courses, videos, and apps
              help people learn about their faith and study religious texts.
            </li>
            <li>
              <strong>Religious values in business:</strong> Many entrepreneurs use their religious beliefs
              to guide their business practices. They focus on honesty, fairness, and helping their communities.
            </li>
            <li>
              <strong>Religious organisations as enterprises:</strong> Some religious groups run schools,
              hospitals, and charities. These are forms of enterprise that serve the community.
            </li>
            <li>
              <strong>Ethical technology:</strong> Religion can help guide the use of technology
              so that it is used for good and not for harm. It encourages people to use technology
              responsibly and to respect others.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Tech &amp; Enterprise Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Technology:</strong> tools, machines, and knowledge</li>
            <li><strong>Enterprise:</strong> starting and managing a business</li>
            <li><strong>Connection:</strong> values guide responsible use</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'liberation',
      title: 'Religion and the Liberation Struggle',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Background to Chimurenga / Umvukela 1">

          <p>
            Chimurenga is a Shona word that means "revolutionary struggle" or "rebellion".
            In Zimbabwe, the First Chimurenga took place in 1896‑1897. It was a war against
            the British colonisers who were taking over the land and imposing their rule.
            The British South Africa Company, led by Cecil John Rhodes, had begun to occupy
            areas of what is now Zimbabwe. They took land from the local people and forced them
            to work on farms and in mines. The local chiefs and people resisted this takeover.
          </p>
          <p>
            The First Chimurenga was led by two very famous spiritual leaders: Mbuya Nehanda
            and Sekuru Kaguvi. They used their spiritual authority to unite the people and
            inspire them to fight. They believed that the ancestors were on their side and
            that they would be victorious. The war was fought with spears, bows and arrows,
            and later some firearms. Despite the bravery of the people, the British had superior
            weapons, and the rebellion was eventually put down.
          </p>
          <p>
            Mbuya Nehanda and Sekuru Kaguvi were captured and executed by the British.
            Their execution did not end the spirit of resistance. Many people believe that
            their spirits continued to inspire later struggles for freedom. The First Chimurenga
            is remembered as a time when religion and culture came together to resist oppression.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Causes of the Liberation Struggle">

          <p>
            There were many reasons why the people of Zimbabwe fought for their freedom.
            These causes were deeply connected to their religion, culture, and way of life.
            The main causes were:
          </p>

          <h4 className="text-lg font-semibold mt-4">Land Dispossession</h4>
          <ul>
            <li>The British took the best land from the African people.</li>
            <li>They forced people off their ancestral lands and onto small, poor areas.</li>
            <li>Land was not just a source of food – it was sacred and connected to ancestors.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Loss of Political Freedom</h4>
          <ul>
            <li>The British took away the power of African chiefs.</li>
            <li>Local leaders were replaced by British administrators.</li>
            <li>People could no longer make decisions about their own lives and communities.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Forced Labour and Heavy Taxes</h4>
          <ul>
            <li>People were forced to work on British farms and in mines.</li>
            <li>They were paid very little and treated badly.</li>
            <li>They were forced to pay taxes, which they could only earn through labour.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Disrespect for African Religion and Culture</h4>
          <ul>
            <li>The British tried to replace African traditions with Western ways.</li>
            <li>They did not respect the spiritual leaders and the ancestors.</li>
            <li>This made people feel that their identity and dignity were being destroyed.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">The Role of Spiritual Leaders</h4>
          <ul>
            <li>Religious leaders like Mbuya Nehanda and Sekuru Kaguvi inspired the people.</li>
            <li>They told the people that the ancestors were with them and that they would win.</li>
            <li>Religion gave people the courage to fight against a powerful enemy.</li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Liberation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Chimurenga 1:</strong> 1896‑1897, led by Nehanda and Kaguvi</li>
            <li><strong>Causes:</strong> land loss, loss of freedom, forced labour, disrespect</li>
            <li><strong>Religion:</strong> spiritual leaders united people</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rights-responsibility',
      title: 'Religion, Rights and Social Responsibility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Right to Life">

          <p>
            The right to life is the most basic human right. It means that every person has the right
            to live and not be killed or harmed unjustly. This right is protected by law in most countries.
            Religion teaches that life is sacred and comes from God, so it should be respected and protected.
          </p>
          <p>
            The right to life includes:
          </p>
          <ul>
            <li>Protection from murder and violence.</li>
            <li>Access to healthcare so that people can live healthy lives.</li>
            <li>Protection from dangerous working conditions.</li>
            <li>Food, water, and shelter to meet basic needs.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Human Dignity">

          <p>
            Human dignity means that every person is valuable and deserves to be treated with respect.
            It is not something that people earn – they have it simply because they are human.
            No one should be humiliated, abused, or treated as less than a full person.
          </p>
          <p>
            Respecting human dignity includes:
          </p>
          <ul>
            <li>Treating all people fairly, regardless of their age, gender, or background.</li>
            <li>Listening to others and valuing their opinions.</li>
            <li>Not using hurtful words or bullying others.</li>
            <li>Helping those who are vulnerable or struggling.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Right to Education">

          <p>
            Every person has the right to education. Education helps people develop their minds,
            learn useful skills, and improve their lives. It is essential for building a better future.
          </p>
          <p>
            The right to education includes:
          </p>
          <ul>
            <li>Access to free primary education for all children.</li>
            <li>Equal opportunities for girls and boys to go to school.</li>
            <li>The freedom to learn about different subjects and ideas.</li>
            <li>Education that teaches respect for others and for the environment.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Freedom of Worship">

          <p>
            Freedom of worship means that every person has the right to follow their own religion
            or belief system. No one should be forced to believe something they do not accept,
            and no one should be punished for their beliefs.
          </p>
          <p>
            Freedom of worship includes:
          </p>
          <ul>
            <li>The right to pray, worship, and take part in religious ceremonies.</li>
            <li>The right to change one's religion.</li>
            <li>The right to not follow any religion.</li>
            <li>The right to share one's beliefs respectfully with others.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Meaning of Social Responsibility">

          <p>
            Social responsibility is the duty of every person to act in ways that benefit society.
            It means that we should not only think about our own needs but also care about the well‑being
            of others and the community as a whole.
          </p>
          <p>
            Examples of social responsibility include:
          </p>
          <ul>
            <li>Helping people who are poor, sick, or in need.</li>
            <li>Protecting the environment by not polluting or wasting resources.</li>
            <li>Following laws and rules that keep society safe and fair.</li>
            <li>Reporting crime and standing up against injustice.</li>
            <li>Participating in community activities and voting in elections.</li>
            <li>Respecting the rights and dignity of others.</li>
          </ul>
          <p>
            Religion strongly encourages social responsibility. Many religious teachings ask people
            to love their neighbours, help the poor, and work for justice. Faith communities often
            run charities, schools, and hospitals as a way of fulfilling this duty.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Rights &amp; Responsibility</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Right to life:</strong> protection and basic needs</li>
            <li><strong>Human dignity:</strong> respect for every person</li>
            <li><strong>Right to education:</strong> learning for all</li>
            <li><strong>Freedom of worship:</strong> choose your own beliefs</li>
            <li><strong>Social responsibility:</strong> care for others and community</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conflict-resolution',
      title: 'Religion and Conflict Resolution / Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Conflict">

          <p>
            Conflict is a disagreement or clash between people or groups.
            It happens when people have different ideas, needs, or interests.
            Conflict can be small and personal, or it can be large and involve many people.
            Not all conflict is bad – if it is handled well, it can lead to better understanding
            and positive change.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Causes of Conflict at Interpersonal Level">

          <p>
            Interpersonal conflict happens between individuals – for example, between friends,
            family members, or co‑workers. There are many causes of interpersonal conflict.
            Understanding these causes can help people prevent or resolve conflicts effectively.
          </p>

          <h4 className="text-lg font-semibold mt-4">Miscommunication</h4>
          <ul>
            <li>When people do not understand each other properly.</li>
            <li>It can be because of unclear language, assumptions, or lack of listening.</li>
            <li>Example: A person says something sarcastically, but the other person takes it seriously.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Differences in Values or Beliefs</h4>
          <ul>
            <li>When people have different moral, religious, or cultural beliefs.</li>
            <li>They may not agree on what is right or wrong.</li>
            <li>Example: A disagreement about how to raise children or how to spend money.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Scarcity of Resources</h4>
          <ul>
            <li>When there is not enough of something that people need or want.</li>
            <li>It can be about money, time, food, or space.</li>
            <li>Example: Two people arguing over who gets to use the family car.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Unmet Expectations</h4>
          <ul>
            <li>When someone expects something from another person and it does not happen.</li>
            <li>It can lead to disappointment and anger.</li>
            <li>Example: A friend expects help with a task, but the other person does not show up.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Personality Clashes</h4>
          <ul>
            <li>When two people have different personalities and do not get along.</li>
            <li>One person may be very outgoing, while the other is quiet and reserved.</li>
            <li>They may misunderstand each other's intentions or actions.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Power Imbalance</h4>
          <ul>
            <li>When one person has more authority or control than another.</li>
            <li>The person with less power may feel unfairly treated.</li>
            <li>Example: A boss gives orders without listening to an employee's ideas.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Past Hurts or Grudges</h4>
          <ul>
            <li>When people hold onto past grievances and do not forgive.</li>
            <li>Old conflicts can resurface and make new arguments worse.</li>
            <li>Example: A person who has been let down before may not trust others easily.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Role of Religion in Conflict Resolution">

          <p>
            Religion can play a very important role in helping people resolve conflicts.
            Many religious teachings encourage forgiveness, patience, and reconciliation.
            Here are some ways religion helps:
          </p>
          <ul>
            <li>
              <strong>Encouraging forgiveness:</strong> Many religions teach that people should
              forgive each other, just as God forgives. This helps people let go of anger and move forward.
            </li>
            <li>
              <strong>Mediation:</strong> Religious leaders often act as mediators to help
              settle disputes. They are respected and trusted in their communities.
            </li>
            <li>
              <strong>Moral guidance:</strong> Religious teachings provide principles for
              living peacefully with others. They remind people to be honest, kind, and fair.
            </li>
            <li>
              <strong>Community support:</strong> Religious communities offer support to people
              who are in conflict. They provide a safe space for talking and healing.
            </li>
            <li>
              <strong>Rituals of reconciliation:</strong> Some religions have ceremonies
              that help people make peace and restore relationships.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Conflict Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Conflict:</strong> disagreement between people</li>
            <li><strong>Causes:</strong> miscommunication, values, resources, expectations, personalities, power, past hurts</li>
            <li><strong>Religion:</strong> forgiveness, mediation, guidance, support</li>
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
            technology, liberation, rights, and conflict resolution in modern society.
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
                <span><strong className="text-white">Family &amp; Identity:</strong> Religion shapes family identity through ancestors, values, and rituals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Education:</strong> Formal and informal education – both influenced by religious teachings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Gender:</strong> Roles and traits of masculinity and femininity shaped by culture and religion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Ethics, Health &amp; Sexuality:</strong> Values guide how we treat ourselves and others.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Disability:</strong> Caused by genetics, birth, illness, accidents, environment, and ageing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Environment:</strong> Water, vegetation, wildlife – threatened by deforestation and pollution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Technology &amp; Enterprise:</strong> Faith and business can work together for community good.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Liberation Struggle:</strong> Chimurenga 1 – land, freedom, and spiritual leadership.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Rights &amp; Responsibility:</strong> Life, dignity, education, worship – and our duty to help others.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Conflict Resolution:</strong> Understanding causes and using religious values to make peace.</span>
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