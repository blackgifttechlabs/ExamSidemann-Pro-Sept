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
          <SubtopicCard title="Role of Names and Totems in Family Relationships">

          <p>
            In Indigenous Religion, names and totems are very important. They connect people to their family,
            clan, and ancestors. A person's name is not just a label – it carries meaning and tells a story.
          </p>
          <ul>
            <li>
              <strong>Names:</strong> Names are given to children based on circumstances of birth,
              family history, or the wishes of ancestors. For example, a child born during a difficult
              time might be named "Tendai" (meaning "be thankful") or "Nokutenda" (meaning "with thanks").
              Names remind people of their family's history and values.
            </li>
            <li>
              <strong>Totems (Mitupo / Izibongo):</strong> Totems are animals, birds, or symbols that
              represent a clan. They connect people to their ancestors and to each other.
              People with the same totem are considered relatives, even if they have never met.
              This creates strong bonds of loyalty and support within the clan.
            </li>
            <li>
              <strong>How names and totems shape relationships:</strong> They teach people who they are
              and where they come from. They create a sense of belonging and responsibility.
              They also guide behaviour – people with the same totem cannot marry each other,
              and they must support each other in times of need.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Role of Indigenous Religion in Community Identity">

          <ul>
            <li>
              <strong>Connection to ancestors:</strong> Indigenous Religion teaches that ancestors are
              always present and watching over the community. This creates a sense of continuity and
              belonging. People feel that they are part of a larger story that began long before they were born.
            </li>
            <li>
              <strong>Shared rituals and ceremonies:</strong> The community comes together for important
              events like births, initiations, marriages, and funerals. These rituals strengthen the
              bonds between people and remind them of their shared identity.
            </li>
            <li>
              <strong>Moral values:</strong> Indigenous Religion teaches values like respect, honesty,
              kindness, and community service. These values shape the identity of the community and
              guide how people treat each other.
            </li>
            <li>
              <strong>Sacred places:</strong> Certain places like mountains, rivers, and trees are
              considered sacred. They are connected to ancestors and spirits. Protecting these places
              is part of the community's identity and responsibility.
            </li>
            <li>
              <strong>Language and stories:</strong> Traditional stories, proverbs, and songs are
              passed down from generation to generation. They carry the history, wisdom, and values
              of the community and keep the identity alive.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Family and Community Values">

          <ul>
            <li>
              <strong>Respect for elders (Kukudza vakuru / Hlonipha abadala):</strong> Elders are
              highly respected in Indigenous Religion. They are seen as wise and are consulted on
              important matters. Young people are taught to listen to and obey their elders.
            </li>
            <li>
              <strong>Communal living (Hukama / Ubuntu):</strong> People are expected to help each other.
              When someone is in need, the community comes together to support them. This is expressed
              in the saying "I am because we are."
            </li>
            <li>
              <strong>Hospitality (Kugamuchira vaeni / Ukwamukela izivakashi):</strong> Welcoming visitors
              is a very important value. Guests are treated with kindness and generosity.
            </li>
            <li>
              <strong>Honesty and integrity (Kutendeseka / Ukuthembeka):</strong> People are expected
              to be truthful and trustworthy. Lying and cheating are seen as disrespectful to the
              community and to the ancestors.
            </li>
            <li>
              <strong>Hard work (Kushanda nesimba / Ukusebenza ngokuzikhandla):</strong> People are
              encouraged to work hard and contribute to the community. Laziness is not accepted.
            </li>
            <li>
              <strong>Sharing and generosity (Kugovana / Ukwabelana):</strong> People share what they
              have with others, especially those who are in need. This helps to reduce poverty and
              strengthen community bonds.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Family &amp; Identity</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Names:</strong> carry meaning and family history</li>
            <li><strong>Totems:</strong> connect people to clan and ancestors</li>
            <li><strong>Community:</strong> shared rituals, moral values</li>
            <li><strong>Values:</strong> respect, sharing, hospitality, honesty</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Religion and Education',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Formal Education and the Role of Religion">

          <p>
            Formal education in Zimbabwe happens in schools, colleges, and universities.
            It follows a structured curriculum and is led by trained teachers.
            Religion plays an important role in formal education in several ways:
          </p>
          <ul>
            <li>
              <strong>Religious schools:</strong> Many schools in Zimbabwe were started by missionaries.
              The Roman Catholic Church, Anglican Church, Methodist Church, and others established
              schools that still exist today. These schools often include religious education in their curriculum.
            </li>
            <li>
              <strong>Religious education as a subject:</strong> In many schools, students learn about
              different religions. They study Christianity, Indigenous Religion, Islam, Judaism, and other faiths.
              This helps students understand the beliefs of others and promotes tolerance.
            </li>
            <li>
              <strong>Values education:</strong> Religious organisations often teach values like honesty,
              respect, and kindness in schools. These values help students become good citizens.
            </li>
            <li>
              <strong>Chaplains and religious leaders:</strong> Many schools and universities have
              chaplains or religious leaders who provide spiritual guidance and support to students.
            </li>
            <li>
              <strong>Religious holidays and observances:</strong> Schools often recognise important
              religious holidays, such as Christmas, Easter, and Islamic festivals.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Informal Education and Its Role">

          <p>
            Informal education happens outside the classroom. It is not structured or planned,
            but it is very important for learning values, skills, and traditions.
            Religion plays a big role in informal education:
          </p>
          <ul>
            <li>
              <strong>Learning from family and elders:</strong> Children learn about religion and morality
              from their parents, grandparents, and other family members. They hear stories about
              ancestors, learn prayers, and observe religious rituals.
            </li>
            <li>
              <strong>Learning through participation:</strong> Children learn by taking part in religious
              ceremonies and community events. They see how adults behave and copy their actions.
            </li>
            <li>
              <strong>Learning through storytelling:</strong> Traditional stories, proverbs, and songs
              carry important moral lessons. These are shared informally in the home and community.
            </li>
            <li>
              <strong>Learning values:</strong> Through informal education, people learn values like
              respect, honesty, and kindness. These values guide their behaviour throughout life.
            </li>
            <li>
              <strong>Learning practical skills:</strong> In rural areas, children learn practical
              skills like farming, cooking, and crafting from their elders. These skills are often
              connected to traditional knowledge and religious beliefs.
            </li>
          </ul>
          <p>
            Both formal and informal education are important. Formal education provides knowledge and skills,
            while informal education provides values and traditions. Together, they help people become
            well‑rounded and responsible members of society.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Education Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Formal:</strong> Schools, colleges, religious education subject</li>
            <li><strong>Informal:</strong> Family, elders, storytelling, participation</li>
            <li><strong>Role of Religion:</strong> Values, moral teaching, chaplains</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'gender',
      title: 'Religion and Gender Roles',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Gender Roles as Assigned at Home">

          <p>
            Gender roles are the tasks and responsibilities that society gives to men and women.
            These roles are often taught at home from a very young age. In many traditional families,
            boys and girls are raised with different expectations:
          </p>
          <ul>
            <li>
              <strong>Boys:</strong> They are often given more freedom and are encouraged to be
              independent and strong. They may be expected to do tasks like herding cattle,
              helping with heavy work, and representing the family in public matters.
              They are taught to be brave and not show weakness.
            </li>
            <li>
              <strong>Girls:</strong> They are often taught to be caring, gentle, and hard‑working.
              They may be expected to help with cooking, cleaning, and taking care of younger children.
              They are taught to be respectful and obedient.
            </li>
          </ul>
          <p>
            These roles can be different in different families and communities. Some families are
            more flexible, while others follow traditional roles very strictly.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="How Religion Impacts Gender Roles">

          <p>
            Religion can either reinforce traditional gender roles or challenge them.
            In Zimbabwe, different religions have different teachings about the roles of men and women.
          </p>

          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              In Indigenous Religion, men are often seen as the leaders of the family and the community.
              They are responsible for protecting the family and representing them in religious ceremonies.
            </li>
            <li>
              Women are respected as mothers and caregivers. They are responsible for raising children
              and managing the household. Some women are also spiritual leaders, such as spirit mediums.
            </li>
            <li>
              There is a balance between men and women. Both are valued for their different roles and contributions.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Some Christian traditions teach that men are the heads of the household and that women
              should be submissive to their husbands. This is based on some passages in the Bible.
            </li>
            <li>
              Other Christian denominations, especially more modern ones, teach that men and women
              are equal and can both lead and serve in the church. In many churches today, women are
              pastors and leaders.
            </li>
            <li>
              Christianity has also influenced gender roles by challenging harmful practices like
              violence against women and promoting education for girls.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              In Islam, men and women are considered equal before God, but they have different roles
              in life. Men are often seen as the providers and protectors, while women are seen as
              the caregivers and managers of the home.
            </li>
            <li>
              Muslim women are valued for their role as mothers and are respected in the community.
              Many Muslim women also work outside the home and contribute to the family's income.
            </li>
          </ul>

          <p>
            Today, many people are rethinking traditional gender roles. Both men and women are
            realising that they can do many different things. Religion can be a source of support
            for equality, but it can also be used to justify inequality. It is important to look
            at each religion's teachings carefully and to think about how they apply to modern life.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Gender Roles</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>At home:</strong> boys – strength, girls – caregiving</li>
            <li><strong>IR:</strong> balance, both valued</li>
            <li><strong>Christianity:</strong> varies – from traditional to equality</li>
            <li><strong>Islam:</strong> equal before God, different roles</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ethics-health-sexuality',
      title: 'Religion, Ethics, Health and Sexuality',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Unhu / Ubuntu – Right vs Wrong Conduct">

          <p>
            <strong>Unhu</strong> (in Shona) or <strong>Ubuntu</strong> (in Ndebele) is a philosophy
            that guides how people should behave. It is about being a good person and treating
            others with kindness and respect. Unhu is not just about following rules – it is
            about having a good heart and caring for others.
          </p>
          <ul>
            <li>
              <strong>What is right conduct?</strong> Right conduct means doing things that help others
              and do not harm anyone. It includes showing respect for elders, being honest, helping
              people in need, and living in peace with others.
            </li>
            <li>
              <strong>What is wrong conduct?</strong> Wrong conduct means doing things that hurt others
              or go against the values of the community. It includes lying, stealing, cheating,
              disrespecting elders, and causing harm.
            </li>
            <li>
              <strong>Why does Unhu matter?</strong> Unhu is what makes a person truly human.
              A person who does not care about others is not seen as a good person.
              Unhu teaches that we are all connected, and that our actions affect others.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion and Sexuality / Sexual Conduct">

          <ul>
            <li>
              <strong>Indigenous Religion:</strong> Sexuality is seen as a normal and natural part of life.
              It is connected to the continuation of the family and community. Sexual behaviour is
              guided by customs and traditions. For example, there are rules about who can marry whom
              (you cannot marry someone from the same clan). There are also rites of passage that
              teach young people about their roles and responsibilities in relationships.
            </li>
            <li>
              <strong>Christianity:</strong> Christianity teaches that sex should happen within marriage.
              Many Christians believe that sex is a gift from God and should be used for love and
              unity between a husband and wife. Sexual activity outside marriage is often seen as wrong.
              Different Christian denominations have different views on issues like contraception
              and homosexuality.
            </li>
            <li>
              <strong>Islam:</strong> Islam also teaches that sex should happen within marriage.
              Sex is seen as a way to express love and to have children. Muslims are encouraged to
              be modest and to avoid sexual behaviour outside marriage.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Health Conditions and Related Religious Beliefs">

          <p>
            In Zimbabwe, different religions have different beliefs about health and sickness.
            These beliefs affect how people understand illness and what they do about it.
          </p>
          <ul>
            <li>
              <strong>Indigenous Religion:</strong> Health is seen as a balance between the physical
              and spiritual worlds. Illness can be caused by angry ancestors, evil spirits, or
              breaking taboos. Traditional healers (n'anga) use herbs, rituals, and prayers to
              heal people. People may also consult spirit mediums to find out what is causing the illness.
            </li>
            <li>
              <strong>Christianity:</strong> Christians believe that God can heal people through
              prayer and faith. Many Christians also believe in modern medicine and see it as a gift
              from God. Some Christian groups practise faith healing and believe that God can heal
              sickness directly. Others focus on prayer and support for the sick.
            </li>
            <li>
              <strong>Islam:</strong> Muslims believe that illness is a test from Allah.
              They are encouraged to seek medical treatment and to pray for healing.
              The Quran is often recited for protection and healing.
            </li>
            <li>
              <strong>HIV/AIDS:</strong> Religious groups in Zimbabwe have been involved in fighting
              HIV/AIDS. They provide education, care, and support to people living with HIV.
              However, some religious beliefs have also created stigma, with some people believing
              that HIV is a punishment from God. This has made it harder for some people to get help.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Ethics &amp; Health</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Unhu/Ubuntu:</strong> right conduct, care for others</li>
            <li><strong>Sexuality:</strong> IR – natural, guided by customs; Christianity/Islam – within marriage</li>
            <li><strong>Health:</strong> IR – spirits/ancestors; Christianity/Islam – prayer + medicine</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'disability',
      title: 'Religion and Disability',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Possible Causes of Disability">

          <p>
            Disability can be caused by many different things. Understanding these causes helps us
            know how to support people with disabilities and how to prevent some disabilities.
            Here are the main causes:
          </p>

          <h4 className="text-lg font-semibold mt-4">Genetic and Hereditary Causes</h4>
          <ul>
            <li>Conditions that are passed down from parents to children through genes.</li>
            <li>Examples: Down syndrome, cystic fibrosis, and hemophilia.</li>
            <li>These conditions are present from birth.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Maternal and Birth‑Related Causes</h4>
          <ul>
            <li>Problems during pregnancy or childbirth can cause disabilities.</li>
            <li>Examples: Lack of oxygen during birth, premature birth, or the mother getting sick during pregnancy (like rubella).</li>
            <li>Poor nutrition during pregnancy can also affect the baby's development.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Illness and Disease</h4>
          <ul>
            <li>Some diseases can cause permanent damage to the body or brain.</li>
            <li>Examples: Polio (causes paralysis), meningitis (can cause brain damage), HIV (can weaken the body), diabetes (can cause blindness or amputation), and stroke.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Accidents and Injuries</h4>
          <ul>
            <li>Physical accidents can cause lasting injuries.</li>
            <li>Examples: Road traffic accidents, falls, workplace accidents, spinal cord injuries, and burns.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Environmental Factors</h4>
          <ul>
            <li>Exposure to harmful substances or conditions can cause disability.</li>
            <li>Examples: Lead poisoning, pollution, poor sanitation, and lack of clean water.</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Age‑Related Causes</h4>
          <ul>
            <li>As people get older, they may develop disabilities.</li>
            <li>Examples: Hearing loss, vision problems, arthritis, and dementia.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Perceptions of Disability">

          <p>
            Different religions have different beliefs about disability.
            These beliefs can affect how people with disabilities are treated.
          </p>

          <h4 className="text-lg font-semibold mt-4">Indigenous Religion</h4>
          <ul>
            <li>
              In Indigenous Religion, disability is sometimes seen as a result of breaking taboos
              or offending the ancestors. It may be seen as a punishment from the spirits.
            </li>
            <li>
              However, people with disabilities are often still respected as part of the community.
              They may be cared for by their family and given support.
            </li>
            <li>
              Traditional healers may try to find out what caused the disability and perform rituals
              to make things right.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Many Christians believe that God has a purpose for everyone, including people with disabilities.
              They often see disability as an opportunity to show God's love and care.
            </li>
            <li>
              Some Christians believe that healing is possible through prayer and faith.
              Others believe that people with disabilities should be accepted and included in the community.
            </li>
            <li>
              Many churches in Zimbabwe have programmes to support people with disabilities and their families.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              In Islam, disability is seen as a test from Allah. People with disabilities are respected
              and are considered to have special status.
            </li>
            <li>
              Muslims are encouraged to care for people with disabilities and to treat them with kindness.
            </li>
            <li>
              The Quran teaches that all people are equal in the eyes of God.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Disability Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> genetic, birth, illness, accidents, environment, age</li>
            <li><strong>IR:</strong> sometimes seen as punishment, but still cared for</li>
            <li><strong>Christianity:</strong> God's purpose, care and inclusion</li>
            <li><strong>Islam:</strong> test from Allah, all people equal</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environment',
      title: 'Religion and the Natural Environment',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Indigenous Religion Beliefs on Preserving the Environment">

          <p>
            Indigenous Religion teaches that the environment is sacred. People are connected to the land,
            water, animals, and plants. The environment is not just for human use – it is home to spirits
            and ancestors. Here are some ways Indigenous Religion helps preserve the environment:
          </p>

          <h4 className="text-lg font-semibold mt-4">Totems</h4>
          <ul>
            <li>
              Totems are animals or birds that represent a clan. People with a certain totem are not
              allowed to kill or eat that animal. This protects the species from being overhunted.
            </li>
            <li>
              For example, a person with the lion totem must not kill a lion. This helps to keep
              the lion population from being wiped out.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Sacred Places</h4>
          <ul>
            <li>
              Certain places are considered sacred. These include mountains, forests, rivers, and springs.
              People believe that ancestors and spirits live in these places.
            </li>
            <li>
              It is forbidden to cut down trees or harm animals in sacred places.
              This protects the environment and keeps the area clean and peaceful.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Sacred Trees</h4>
          <ul>
            <li>
              Some trees are considered sacred, such as the baobab tree and the mutiti tree.
              These trees are believed to be homes to spirits. They are protected and not cut down.
            </li>
            <li>
              This helps to preserve the forest and maintain biodiversity.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Taboos</h4>
          <ul>
            <li>
              Taboos (zviramu) help protect the environment. For example, it is taboo to pollute rivers
              or to waste water. It is also taboo to cut down trees near graves or sacred places.
            </li>
            <li>
              These rules help to keep the environment clean and healthy.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Christianity's Environmental Problems and Preservation Practices">

          <p>
            Christianity has also addressed environmental issues. However, there have been challenges.
          </p>

          <h4 className="text-lg font-semibold mt-4">Environmental Problems</h4>
          <ul>
            <li>
              Some Christian traditions have focused more on spiritual salvation than on caring for the earth.
              This has led to some Christians not paying enough attention to the environment.
            </li>
            <li>
              The expansion of churches and mission stations has sometimes led to the clearing of forests
              and the destruction of wildlife habitats.
            </li>
            <li>
              Some Christians see the earth as something to be "used" by humans, rather than protected.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Preservation Practices</h4>
          <ul>
            <li>
              Many Christians now recognise that caring for the environment is part of their faith.
              They believe that God created the earth and that humans are stewards who must protect it.
            </li>
            <li>
              Some churches have started tree‑planting programmes, recycling projects, and campaigns
              to stop pollution.
            </li>
            <li>
              Some denominations have connected environmental protection to social justice.
              They see that environmental damage often hurts the poor the most.
            </li>
            <li>
              Some Christian groups have returned to a focus on creation care, which means protecting
              the earth as God's creation.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Environment Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>IR:</strong> totems protect animals, sacred places protect land</li>
            <li><strong>Taboos:</strong> protect water, trees, and cleanliness</li>
            <li><strong>Christianity:</strong> sometimes has harmed, but now embracing creation care</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rights',
      title: 'Religion, Rights and Social Responsibility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Basic Human Rights in the Zimbabwean Constitution">

          <p>
            The Constitution of Zimbabwe protects the rights of all people.
            These rights are based on human dignity and respect for all individuals.
            Here are some of the basic rights included in the Constitution:
          </p>
          <ul>
            <li>
              <strong>Right to life:</strong> Everyone has the right to life. No one should be killed
              unjustly. This right protects people from murder, violence, and the death penalty.
            </li>
            <li>
              <strong>Right to human dignity:</strong> Every person has the right to be treated with
              respect. No one should be humiliated, tortured, or treated in a degrading way.
            </li>
            <li>
              <strong>Right to education:</strong> Everyone has the right to education.
              Primary education is compulsory for all children. This helps people develop and improve their lives.
            </li>
            <li>
              <strong>Freedom of worship:</strong> Everyone has the right to choose their own religion
              and to practise it freely. No one can be forced to follow a religion they do not believe in.
            </li>
            <li>
              <strong>Right to equality:</strong> Everyone is equal before the law.
              People should not be discriminated against because of their gender, race, religion, or disability.
            </li>
            <li>
              <strong>Right to healthcare:</strong> Everyone has the right to access healthcare services.
              The government should provide health services to all citizens.
            </li>
            <li>
              <strong>Right to freedom of expression:</strong> Everyone has the right to speak freely
              and to share their ideas. This is important for a free and open society.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion and Social Responsibility">

          <p>
            Social responsibility is the duty of every person to act in ways that benefit society.
            It means caring about the well‑being of others and the community.
            Religion encourages social responsibility in many ways:
          </p>
          <ul>
            <li>
              <strong>Helping the poor and needy:</strong> Religious groups often run charities,
              food programmes, and shelters for people who are struggling.
            </li>
            <li>
              <strong>Caring for the sick:</strong> Many hospitals and clinics were started by
              religious organisations. Religious groups also visit the sick and pray for them.
            </li>
            <li>
              <strong>Supporting education:</strong> Religious groups have built schools and
              provide scholarships to children who cannot afford to go to school.
            </li>
            <li>
              <strong>Promoting peace and reconciliation:</strong> Religious leaders often work
              to resolve conflicts and bring people together. They teach forgiveness and understanding.
            </li>
            <li>
              <strong>Protecting human rights:</strong> Religious groups speak out against injustice
              and work to protect the rights of all people.
            </li>
            <li>
              <strong>Caring for the environment:</strong> Many religious groups have started programmes
              to protect the environment. They believe that caring for the earth is part of their faith.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Rights &amp; Responsibility</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Constitution:</strong> life, dignity, education, worship</li>
            <li><strong>Social responsibility:</strong> help the poor, sick, and needy</li>
            <li><strong>Religion:</strong> promotes peace, justice, and care for all</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'liberation',
      title: 'Religion and the Liberation Struggle',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Religious Groups Involved in Chimurenga 2 and Their Roles">

          <p>
            Chimurenga 2 (also known as the Second Chimurenga) was the liberation struggle
            that took place in Zimbabwe from the 1960s to 1980. It led to the independence of Zimbabwe
            from British colonial rule. Religious groups and leaders played very important roles
            in this struggle.
          </p>

          <h4 className="text-lg font-semibold mt-4">African Independent Churches</h4>
          <ul>
            <li>
              African Independent Churches (AICs) are churches that were started by African people,
              separate from mission churches. Many of these churches supported the liberation struggle.
            </li>
            <li>
              The <strong>Zionist Church</strong> and <strong>African Apostolic Church</strong> were
              important. Their leaders often encouraged their members to support the freedom fighters.
            </li>
            <li>
              Some church leaders used their knowledge of the land and their connections to the community
              to help the fighters. They provided food, shelter, and information.
            </li>
            <li>
              Many AICs believed that the struggle for independence was part of God's plan and that
              they were fighting for justice.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Mission Churches (Roman Catholic, Anglican, Methodist, etc.)</h4>
          <ul>
            <li>
              Mission churches also played a role in the liberation struggle, although in different ways.
              Some missionaries and church leaders supported the struggle, while others were against it.
            </li>
            <li>
              Some church leaders spoke out against the injustices of the colonial system.
              They called for equality and justice for all people.
            </li>
            <li>
              Some missionaries provided medical care and education to the people, which was a form
              of support and helped the community resist oppression.
            </li>
            <li>
              The <strong>Roman Catholic Church</strong> in Zimbabwe had leaders who supported
              the freedom fighters and spoke out against the government's violence.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Spirit Mediums and Traditional Religious Leaders</h4>
          <ul>
            <li>
              Traditional religious leaders and spirit mediums were very important during Chimurenga 2.
              The spirit of <strong>Mbuya Nehanda</strong> was a powerful inspiration for the fighters.
            </li>
            <li>
              Spirit mediums were consulted by the leaders of the liberation movements.
              They provided guidance, predicted outcomes, and gave blessings to the fighters.
            </li>
            <li>
              The spirits of ancestors were believed to be on the side of the freedom fighters.
              This gave the people hope and courage to continue the fight.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Muslim Communities</h4>
          <ul>
            <li>
              Muslim communities in Zimbabwe also supported the liberation struggle.
              Some Muslim leaders encouraged their followers to support the movement for freedom.
            </li>
            <li>
              They provided support and resources to the freedom fighters and their families.
            </li>
          </ul>

          <p>
            Religion was a source of hope and strength during the liberation struggle.
            It united the people and gave them the courage to fight for their freedom.
          </p>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Liberation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>AICs:</strong> supported fighters, provided shelter</li>
            <li><strong>Mission Churches:</strong> some spoke out, provided care</li>
            <li><strong>Spirit mediums:</strong> guided and inspired the fighters</li>
            <li><strong>Muslims:</strong> supported the struggle</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'enterprise',
      title: 'Religion and Enterprise',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Nature and Forms of Enterprise">

          <p>
            Enterprise is the activity of starting and running a business or project.
            It involves taking risks, being creative, and working hard to achieve a goal.
            Enterprise can take many different forms:
          </p>

          <h4 className="text-lg font-semibold mt-4">Sole Proprietorship</h4>
          <ul>
            <li>
              This is a business owned and run by one person. The person is responsible for everything,
              from making decisions to doing the work.
            </li>
            <li>
              Examples: A small shop, a hairdresser, a carpenter, or a farmer.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Partnership</h4>
          <ul>
            <li>
              This is a business owned by two or more people who share the responsibilities, risks, and profits.
            </li>
            <li>
              Examples: Law firms, medical practices, or family businesses.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Cooperative</h4>
          <ul>
            <li>
              This is a business owned and run by a group of people who work together for their mutual benefit.
              Co‑operatives are common in farming and marketing.
            </li>
            <li>
              Examples: A farming co‑operative where farmers share resources and sell their produce together.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Company / Corporation</h4>
          <ul>
            <li>
              This is a larger business owned by shareholders. It is registered with the government
              and has a legal identity separate from its owners.
            </li>
            <li>
              Examples: Manufacturing companies, banks, and large retail stores.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Social Enterprise</h4>
          <ul>
            <li>
              This is a business that aims to solve a social problem, rather than just making profit.
              The profits are used to benefit the community or the environment.
            </li>
            <li>
              Examples: Organisations that provide clean water, education, or health services.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Informal Enterprise</h4>
          <ul>
            <li>
              This is a business that is not officially registered with the government.
              It is often small‑scale and run by individuals or families.
            </li>
            <li>
              Examples: Selling vegetables at the market, street vending, or offering services like tailoring.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religion and Enterprise">

          <p>
            Religion can have a big impact on how people run their businesses and what they do.
            Many religious teachings encourage hard work, honesty, and caring for others.
          </p>
          <ul>
            <li>
              <strong>Honesty and fairness:</strong> Religious teachings often say that people should
              be honest in their business dealings. They should not cheat, lie, or steal.
              This builds trust with customers and helps the business grow.
            </li>
            <li>
              <strong>Care for others:</strong> Many religious groups encourage their members to
              help people who are struggling. This can lead to businesses that provide jobs,
              support local communities, and share profits with the poor.
            </li>
            <li>
              <strong>Hard work:</strong> Religions often teach that hard work is a virtue.
              People who work hard are respected and often succeed in their businesses.
            </li>
            <li>
              <strong>Community support:</strong> Religious communities often support their members
              who are starting businesses. They may provide loans, advice, or connections.
            </li>
            <li>
              <strong>Ethical entrepreneurship:</strong> Religious values can guide entrepreneurs
              to run their businesses in a way that is good for the environment and good for society.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Enterprise Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Types:</strong> sole proprietor, partnership, co‑op, company, social, informal</li>
            <li><strong>Religion:</strong> honesty, hard work, fairness, community support</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conflict-resolution',
      title: 'Religion and Conflict Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Conflicts at Family Level">

          <p>
            Conflicts can happen in any family. When people live together, there are bound to be
            disagreements. Family conflicts can be about many things, and if they are not resolved,
            they can harm relationships and cause lasting pain.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Causes of Family Conflict">


          <h4 className="text-lg font-semibold mt-4">Financial Problems</h4>
          <ul>
            <li>
              Money is one of the most common causes of conflict in families.
              When there is not enough money to pay bills or buy food, stress increases.
              Family members may argue about how money should be spent.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Different Expectations</h4>
          <ul>
            <li>
              Family members may have different ideas about how things should be done.
              For example, parents may expect children to help with chores, but children may want more free time.
              This can cause disagreements.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Misunderstandings and Poor Communication</h4>
          <ul>
            <li>
              When people do not communicate well, misunderstandings happen.
              A person might say something that is taken the wrong way, or they might not explain their feelings properly.
              This can lead to anger and resentment.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Disrespect</h4>
          <ul>
            <li>
              When family members do not treat each other with respect, conflict can arise.
              This can include name‑calling, shouting, or ignoring each other.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Jealousy and Competition</h4>
          <ul>
            <li>
              Sometimes, family members may compete for attention, resources, or approval.
              Siblings might be jealous of each other, or a spouse might feel neglected.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Substance Abuse</h4>
          <ul>
            <li>
              Alcohol or drug abuse can cause serious family conflicts.
              It can lead to violence, neglect, and broken relationships.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Influence of In‑Laws</h4>
          <ul>
            <li>
              Sometimes, conflicts arise because of disagreements with extended family members,
              such as in‑laws or grandparents.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Ways of Managing Family Conflict">

          <p>
            Religion provides many ways to help families resolve their conflicts peacefully.
            These methods are based on values like forgiveness, patience, and love.
          </p>

          <h4 className="text-lg font-semibold mt-4">Prayer</h4>
          <ul>
            <li>
              Prayer is a way for people to ask God for guidance and strength.
              When family members are in conflict, they can pray together or individually.
              Prayer can help calm emotions and bring people closer together.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Seeking Advice from Elders and Religious Leaders</h4>
          <ul>
            <li>
              Elders and religious leaders are respected in their communities.
              They can offer wise advice and help mediate conflicts.
              They are seen as neutral and fair.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Forgiveness</h4>
          <ul>
            <li>
              Forgiveness is a key teaching in many religions.
              Family members are encouraged to forgive each other, just as God forgives.
              This helps people let go of anger and move forward.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Communication</h4>
          <ul>
            <li>
              Religious teachings often encourage people to speak respectfully to each other.
              They encourage listening and understanding.
              Good communication can prevent misunderstandings.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Rituals of Reconciliation</h4>
          <ul>
            <li>
              Some religions have ceremonies that help people make peace.
              In Indigenous Religion, there may be rituals to restore harmony with ancestors and the community.
              In Christianity, there is the sacrament of confession.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Shared Values</h4>
          <ul>
            <li>
              Religion teaches values like respect, patience, and kindness.
              When family members share these values, they are more likely to resolve conflicts peacefully.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Conflict Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> money, expectations, communication, disrespect, jealousy</li>
            <li><strong>Religious ways:</strong> prayer, elders, forgiveness, communication, rituals</li>
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
            rights, liberation, enterprise, and conflict resolution in modern society.
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
                  <strong className="text-white">Family &amp; Identity:</strong> Names and totems connect people to their family and ancestors; IR shapes community identity through shared rituals, values, and sacred places.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Education:</strong> Formal education includes religious schools and RE as a subject; informal education happens through family, elders, and storytelling.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Gender Roles:</strong> Boys and girls are raised with different expectations; religion can reinforce or challenge traditional roles.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ethics, Health &amp; Sexuality:</strong> Unhu/Ubuntu guides right conduct; sexuality is guided by religious teachings; health involves both spiritual and physical aspects.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Disability:</strong> Caused by genetics, birth, illness, accidents, environment, and age; religions have different perceptions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Environment:</strong> IR uses totems, sacred places, and taboos to protect the environment; Christianity has issues but is embracing creation care.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rights &amp; Responsibility:</strong> Zimbabwe's Constitution protects rights to life, dignity, education, and worship; social responsibility means caring for others.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Liberation Struggle:</strong> AICs, mission churches, spirit mediums, and Muslim communities supported Chimurenga 2.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Enterprise:</strong> Different forms of enterprise; religious values like honesty, hard work, and fairness guide business.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conflict Management:</strong> Family conflicts arise from money, expectations, communication, etc.; religion uses prayer, elders, forgiveness, and rituals to resolve them.
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