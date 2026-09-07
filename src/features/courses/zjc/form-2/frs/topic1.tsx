import React, { useState, useRef } from 'react';

/**
 * Topic 1: Religion in Zimbabwe – Full component with sticky navigation,
 * aside cards, and auto‑scroll + double‑highlight on heading.
 */
export const topic1: React.FC = () => {
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
      id: 'concept-religion',
      title: 'Concept of Religion in Zimbabwe',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Different Religions Found in Zimbabwe">

          <p>
            Zimbabwe is a country with a rich diversity of religious beliefs and practices.
            People in Zimbabwe follow different religions, and these religions shape their
            cultures, values, and ways of life. The major religions in Zimbabwe include:
          </p>

          <h4 className="text-lg font-semibold mt-4">Indigenous Religion (African Traditional Religion)</h4>
          <ul>
            <li>
              This is the oldest religion in Zimbabwe. It is based on the belief in a Supreme Being,
              ancestral spirits, and other spirits. It is deeply connected to the land, nature, and community.
            </li>
            <li>
              Indigenous Religion is still practised by many people in Zimbabwe, often alongside other religions.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Christianity is the most widely practised religion in Zimbabwe.
              It was brought by missionaries in the 19th century.
            </li>
            <li>
              There are many Christian denominations in Zimbabwe, including Roman Catholic,
              Anglican, Methodist, Pentecostal, and African Independent Churches.
            </li>
            <li>
              African Independent Churches combine Christian teachings with some elements of
              Indigenous Religion, such as healing and prayer.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              Islam is practised by a smaller but significant number of people in Zimbabwe.
              It was brought by traders and immigrants from other parts of Africa and Asia.
            </li>
            <li>
              Muslims in Zimbabwe follow the teachings of the Quran and the Prophet Muhammad.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              Judaism is practised by a small community in Zimbabwe.
              The Jewish community has historical roots and has contributed to the country's development.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Hinduism and Other Religions</h4>
          <ul>
            <li>
              There are also smaller communities of Hindus, Baha'is, and other religious groups in Zimbabwe.
              These groups add to the rich religious diversity of the country.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Key Characteristics of Religions in Zimbabwe">

          <p>
            Although these religions are different, they share some common characteristics in the Zimbabwean context:
          </p>
          <ul>
            <li>
              <strong>Belief in a higher power:</strong> All religions in Zimbabwe believe in some form
              of higher power – God, Allah, or the Supreme Being of Indigenous Religion.
            </li>
            <li>
              <strong>Moral teachings:</strong> Each religion teaches its followers how to live good lives
              and treat others with respect and kindness.
            </li>
            <li>
              <strong>Community worship:</strong> Religious services are often communal, bringing people
              together to pray, sing, and celebrate.
            </li>
            <li>
              <strong>Rituals and ceremonies:</strong> All religions have special ceremonies for important
              life events such as birth, marriage, and death.
            </li>
            <li>
              <strong>Sacred texts or teachings:</strong> Most religions have written or oral teachings
              that guide their followers.
            </li>
            <li>
              <strong>Places of worship:</strong> Each religion has special places where people gather
              to worship – churches, mosques, synagogues, or sacred shrines.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Religions in Zimbabwe</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Indigenous:</strong> oldest, ancestral spirits</li>
            <li><strong>Christianity:</strong> largest, many denominations</li>
            <li><strong>Islam:</strong> smaller, Quran teachings</li>
            <li><strong>Judaism:</strong> small community</li>
            <li><strong>Hinduism &amp; others:</strong> diverse groups</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'indigenous',
      title: 'Indigenous Religion (IR)',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Key Beliefs of Indigenous Religion">


          <h4 className="text-lg font-semibold mt-4">Belief in a Supreme Being</h4>
          <ul>
            <li>
              Indigenous Religion believes in a Supreme Being who is the creator of the universe.
              This Supreme Being is known by different names in different cultures.
            </li>
            <li>
              Examples: In Zimbabwe, the Shona people call the Supreme Being <strong>Mwari</strong> or <strong>Musikavanhu</strong>
              (the Creator of People). The Ndebele people call Him <strong>uMvelinqangi</strong>.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Belief in Ancestral Spirits</h4>
          <ul>
            <li>
              Ancestral spirits are the spirits of people who have died. They are believed to watch over
              their living relatives and help them in times of need.
            </li>
            <li>
              Ancestors are seen as intermediaries between the living and the Supreme Being.
              People communicate with them through prayer, offerings, and rituals.
            </li>
            <li>
              The Shona call ancestral spirits <strong>vadzimu</strong>, and the Ndebele call them <strong>amadlozi</strong>.
            </li>
            <li>
              Ancestors are honoured and respected. They are believed to punish those who break
              traditional customs and reward those who follow them.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Belief in Other Spirits</h4>
          <ul>
            <li>
              Indigenous Religion also believes in other spirits that live in nature. These spirits
              can be good or bad, and they are found in rivers, mountains, trees, and animals.
            </li>
            <li>
              Some spirits are called <strong>mashave</strong> (in Shona) or <strong>amahlozi</strong> (in Ndebele).
              These are spirits that are not ancestors but can influence people's lives.
            </li>
            <li>
              Some people are believed to have special relationships with these spirits and can
              communicate with them. These people are called spirit mediums or traditional healers.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Symbols of Indigenous Religion">

          <ul>
            <li>
              <strong>Fire:</strong> Fire is an important symbol in Indigenous Religion.
              It represents purity, communication with ancestors, and spiritual presence.
              Fire is used in ceremonies and rituals.
            </li>
            <li>
              <strong>Rivers and water:</strong> Water is seen as a source of life and purification.
              Many rituals are performed near rivers or using water from rivers.
            </li>
            <li>
              <strong>Sacred trees:</strong> Some trees, such as the baobab or the mutiti tree,
              are considered sacred. They are places where ancestors are believed to dwell.
            </li>
            <li>
              <strong>Ceremonial drums and rattles:</strong> These are used in ceremonies to call the
              spirits and to create a rhythm for dancing and singing.
            </li>
            <li>
              <strong>Totems:</strong> Totems are symbols that represent a clan or family group.
              They are often animals or birds and are used to identify people and connect them to their ancestors.
            </li>
            <li>
              <strong>Traditional clothing and beads:</strong> Special clothing and beads are worn
              during ceremonies to show respect and to connect with the spiritual world.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Totems and Taboos, and Their Purpose">


          <h4 className="text-lg font-semibold mt-4">Totems</h4>
          <ul>
            <li>
              A totem is an animal, bird, or plant that represents a clan or family.
              The Shona call totems <strong>mitupo</strong>, and the Ndebele call them <strong>izibongo</strong>.
            </li>
            <li>
              Totems are usually animals like the zebra, lion, monkey, fish, or the pangolin.
              Each clan has its own totem.
            </li>
            <li>
              <strong>Purpose of totems:</strong>
              <ul className="mt-2">
                <li>They identify people and show which clan they belong to.</li>
                <li>They connect people to their ancestors.</li>
                <li>They create a sense of belonging and unity within the clan.</li>
                <li>They prevent people from marrying someone from the same clan (exogamy).</li>
                <li>They remind people of their responsibilities to their family and community.</li>
              </ul>
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Taboos</h4>
          <ul>
            <li>
              A taboo is something that is forbidden or not allowed. Taboos are rules that people
              must follow to avoid offending the spirits or bringing bad luck.
              The Shona call taboos <strong>zviramu</strong> (or <strong>zviera</strong>).
            </li>
            <li>
              <strong>Examples of taboos:</strong>
              <ul className="mt-2">
                <li>Eating the animal that is your totem.</li>
                <li>Marrying someone from the same clan.</li>
                <li>Pointing at graves or sacred places.</li>
                <li>Whistling at night.</li>
                <li>Killing or harming animals that are considered sacred.</li>
              </ul>
            </li>
            <li>
              <strong>Purpose of taboos:</strong>
              <ul className="mt-2">
                <li>They protect people from harm and misfortune.</li>
                <li>They maintain respect for ancestors and the spiritual world.</li>
                <li>They preserve the environment and wildlife.</li>
                <li>They teach discipline and self‑control.</li>
                <li>They strengthen the bonds within the community.</li>
              </ul>
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Indigenous Religion Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Supreme Being:</strong> Mwari, Musikavanhu, uMvelinqangi</li>
            <li><strong>Ancestors:</strong> vadzimu / amadlozi</li>
            <li><strong>Symbols:</strong> fire, water, sacred trees, totems</li>
            <li><strong>Totems:</strong> identify clan, prevent inter‑clan marriage</li>
            <li><strong>Taboos:</strong> protect people and the environment</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'judaism',
      title: 'Judaism',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Key Beliefs of Judaism">

          <p>
            Judaism is one of the oldest monotheistic religions in the world.
            It is the religion of the Jewish people. Here are the key beliefs:
          </p>
          <ul>
            <li>
              <strong>Belief in One God:</strong> Jews believe in only one God, who is the creator
              of the universe. This is the most important belief in Judaism.
              The central prayer of Judaism is the Shema: "Hear, O Israel: the Lord our God, the Lord is One."
            </li>
            <li>
              <strong>The Covenant:</strong> Jews believe that God made a special agreement (covenant)
              with Abraham and later with Moses. This covenant promised that the Jewish people would
              be God's chosen people and that they would follow God's laws.
            </li>
            <li>
              <strong>The Torah:</strong> Jews believe that God gave the Torah (the first five books
              of the Bible) to Moses on Mount Sinai. The Torah contains the laws and teachings that
              guide Jewish life.
            </li>
            <li>
              <strong>Mitzvot:</strong> Mitzvot are the commandments or good deeds that Jews are
              supposed to do. There are 613 mitzvot in the Torah. They cover every aspect of life,
              including how to pray, how to eat, and how to treat others.
            </li>
            <li>
              <strong>The Messiah:</strong> Jews believe that a Messiah (a saviour) will come in the future.
              The Messiah will bring peace and justice to the world and restore the kingdom of Israel.
            </li>
            <li>
              <strong>Life after Death:</strong> Judaism teaches that there is life after death.
              Many Jews believe in the resurrection of the dead or in an afterlife in the world to come.
            </li>
            <li>
              <strong>Chosen People:</strong> Jews believe that they are God's chosen people.
              This does not mean they are better than others. It means they have a special responsibility
              to follow God's laws and to be a light to the nations.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Scriptures Used in Judaism">

          <p>
            The main scriptures of Judaism are contained in the Hebrew Bible, which is also called the Tanakh.
            The Tanakh has three parts:
          </p>
          <ul>
            <li>
              <strong>Torah (The Law):</strong> The first five books – Genesis, Exodus, Leviticus, Numbers,
              and Deuteronomy. These contain the laws and the story of creation and the early history of the
              Jewish people.
            </li>
            <li>
              <strong>Nevi'im (The Prophets):</strong> Books written by prophets such as Isaiah, Jeremiah,
              and Ezekiel. They contain warnings, teachings, and messages from God.
            </li>
            <li>
              <strong>Ketuvim (The Writings):</strong> Other books such as Psalms, Proverbs, and the
              Song of Songs. These include poetry, wisdom, and songs.
            </li>
          </ul>
          <p>
            In addition to the Tanakh, Judaism also has the <strong>Talmud</strong>, which is a collection
            of discussions and interpretations of the laws of the Torah.
            It helps guide Jews on how to follow the laws in daily life.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Symbols of Judaism">

          <ul>
            <li>
              <strong>Star of David (Magen David):</strong> This is a six‑pointed star made of two
              triangles. It is the most recognised symbol of Judaism.
              It represents the connection between God and the Jewish people.
            </li>
            <li>
              <strong>Menorah:</strong> A seven‑branched lampstand that was used in the ancient Temple.
              It is a symbol of light, wisdom, and divine presence.
            </li>
            <li>
              <strong>Mezuzah:</strong> A small box that is fixed to the doorposts of Jewish homes.
              It contains a scroll with verses from the Torah. It reminds people of God's presence
              and commandments.
            </li>
            <li>
              <strong>Kippah (Yarmulke):</strong> A small cap worn by Jewish men as a sign of respect
              for God. It reminds them that God is always above them.
            </li>
            <li>
              <strong>Tallit (Prayer Shawl):</strong> A shawl with fringes that is worn during prayer.
              The fringes remind people of the commandments.
            </li>
            <li>
              <strong>Torah Scroll:</strong> The Torah is written by hand on a scroll. It is kept in
              the synagogue and read during services.
            </li>
            <li>
              <strong>Shofar:</strong> A ram's horn that is blown during certain holidays like Rosh Hashanah.
              Its sound calls people to repentance.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Judaism Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Belief:</strong> One God, covenant, Torah</li>
            <li><strong>Scriptures:</strong> Torah, Nevi'im, Ketuvim, Talmud</li>
            <li><strong>Symbols:</strong> Star of David, Menorah, Mezuzah</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'christianity',
      title: 'Christianity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Key Beliefs of Christianity">

          <p>
            Christianity is based on the life and teachings of Jesus Christ.
            Christians believe that Jesus is the Son of God and the Saviour of the world.
            Here are the key beliefs:
          </p>
          <ul>
            <li>
              <strong>Belief in One God:</strong> Christians believe in one God who is the creator
              of the universe. They believe that God is love and that He cares for all people.
            </li>
            <li>
              <strong>The Trinity:</strong> Christians believe that God exists in three persons
              in one – God the Father, God the Son (Jesus Christ), and God the Holy Spirit.
              This is called the Trinity.
            </li>
            <li>
              <strong>Jesus Christ as Saviour:</strong> Christians believe that Jesus Christ is the
              Son of God and the Messiah. They believe that Jesus died on the cross to save people
              from their sins, and that He rose from the dead on the third day.
            </li>
            <li>
              <strong>Salvation through Faith:</strong> Christians believe that people are saved
              by faith in Jesus Christ. They believe that believing in Jesus and following His
              teachings leads to eternal life.
            </li>
            <li>
              <strong>The Bible as God's Word:</strong> Christians believe that the Bible is the
              inspired word of God. It contains the teachings, stories, and prophecies that guide
              Christian faith and practice.
            </li>
            <li>
              <strong>Life after Death:</strong> Christians believe that there is life after death.
              Those who believe in Jesus will live forever with God in heaven, while those who reject
              Him will be separated from God.
            </li>
            <li>
              <strong>Love and Forgiveness:</strong> Christians are taught to love God and to love
              their neighbours as themselves. They are also taught to forgive others, just as God
              forgives them.
            </li>
            <li>
              <strong>Sacraments:</strong> Christians have sacraments (sacred rites) such as baptism
              and the Eucharist (Holy Communion). These are outward signs of inward grace.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Symbols of Christianity">

          <ul>
            <li>
              <strong>The Cross:</strong> The cross is the most important symbol of Christianity.
              It represents the crucifixion of Jesus Christ and His sacrifice for the sins of humanity.
              It is a symbol of salvation, love, and hope.
            </li>
            <li>
              <strong>Ichthys (The Fish):</strong> A simple fish symbol used by early Christians.
              The Greek word for fish is "ichthys", which is an acronym for "Jesus Christ, Son of God, Saviour."
            </li>
            <li>
              <strong>Alpha and Omega:</strong> The first and last letters of the Greek alphabet.
              They represent that God is the beginning and the end of all things.
            </li>
            <li>
              <strong>The Dove:</strong> Represents the Holy Spirit. It is a symbol of peace and purity.
              It appears in the story of Jesus' baptism.
            </li>
            <li>
              <strong>The Eucharist / Bread and Wine:</strong> Symbols of Jesus' body and blood,
              shared during Holy Communion. They remind Christians of Jesus' sacrifice.
            </li>
            <li>
              <strong>The Chi‑Rho:</strong> A monogram formed by the first two letters of the
              Greek word for Christ (XP). It is an ancient Christian symbol.
            </li>
            <li>
              <strong>Fish and Loaves:</strong> Symbolises the miracle of Jesus feeding the
              five thousand people with five loaves and two fish.
            </li>
            <li>
              <strong>The Vine and Branches:</strong> Jesus is described as the vine and His
              followers as the branches. This symbolises the connection between Jesus and His followers.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Christianity Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Belief:</strong> Trinity, Jesus as Saviour, salvation through faith</li>
            <li><strong>Scriptures:</strong> The Bible (Old and New Testaments)</li>
            <li><strong>Symbols:</strong> Cross, Ichthys, Alpha and Omega, Dove</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'islam',
      title: 'Islam',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Key Beliefs of Islam">

          <p>
            Islam is a monotheistic religion that believes in one God, Allah.
            Muslims follow the teachings of the Prophet Muhammad, who is the last and final messenger.
            Here are the key beliefs:
          </p>
          <ul>
            <li>
              <strong>Belief in One God (Tawhid):</strong> Muslims believe in one God, Allah.
              Allah is the creator of everything and is all‑powerful, all‑knowing, and merciful.
              Associating any partner with Allah is considered the greatest sin.
            </li>
            <li>
              <strong>Belief in Prophets:</strong> Muslims believe in many prophets, including
              Adam, Noah, Abraham, Moses, and Jesus. They believe that Muhammad is the last and
              final prophet.
            </li>
            <li>
              <strong>Belief in the Quran:</strong> The Quran is the holy book of Islam.
              Muslims believe that it was revealed to Muhammad by the Angel Gabriel.
              It is the final revelation from God.
            </li>
            <li>
              <strong>Belief in Angels:</strong> Muslims believe in angels who carry out God's commands.
              Angels are invisible beings made of light. The most important angels are Gabriel and Michael.
            </li>
            <li>
              <strong>Belief in the Day of Judgment:</strong> Muslims believe that there will be a
              Day of Judgment when all people will be judged by God based on their actions in life.
              The righteous will go to paradise (Jannah), and the wicked will go to hell (Jahannam).
            </li>
            <li>
              <strong>Belief in Divine Decree:</strong> Muslims believe that everything happens
              according to God's plan and will. God has knowledge of all things and has written
              everything that will happen.
            </li>
            <li>
              <strong>The Five Pillars of Islam:</strong> These are the core practices that
              every Muslim is expected to follow:
              <ul className="mt-2">
                <li><strong>Shahada:</strong> Declaration of faith – "There is no god but Allah, and Muhammad is His messenger."</li>
                <li><strong>Salah:</strong> Prayer five times a day facing Mecca.</li>
                <li><strong>Zakat:</strong> Giving charity to the poor and needy.</li>
                <li><strong>Sawm:</strong> Fasting during the month of Ramadan.</li>
                <li><strong>Hajj:</strong> Pilgrimage to Mecca at least once in a lifetime if financially able.</li>
              </ul>
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Symbols of Islam">

          <ul>
            <li>
              <strong>Crescent and Star:</strong> This is the most recognised symbol of Islam.
              The crescent represents progress and the beginning of a new month in the Islamic calendar.
              The star represents light and guidance.
            </li>
            <li>
              <strong>Calligraphy of Allah:</strong> The name "Allah" written in beautiful Arabic
              calligraphy is a common symbol. It represents the presence and majesty of God.
            </li>
            <li>
              <strong>The Kaaba:</strong> A cube‑shaped building in Mecca that is the most sacred
              site in Islam. Muslims face towards the Kaaba during their daily prayers.
            </li>
            <li>
              <strong>The Quran:</strong> The holy book itself is a symbol of God's revelation
              and guidance. It is often decorated with beautiful calligraphy and kept in a special place.
            </li>
            <li>
              <strong>The Prayer Rug:</strong> A mat used by Muslims during prayer. It provides
              a clean and dedicated space for connecting with God.
            </li>
            <li>
              <strong>The Color Green:</strong> Green is often associated with Islam.
              It is said to have been a favourite colour of the Prophet Muhammad and represents
              paradise and life.
            </li>
            <li>
              <strong>Minaret:</strong> A tall tower attached to a mosque from which the call
              to prayer (adhan) is announced. It is a symbol of the presence of Islam in a community.
            </li>
            <li>
              <strong>Mosque Architecture:</strong> Features like domes, arches, and geometric
              patterns are symbols of Islamic art and architecture.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Islam Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Belief:</strong> One God (Allah), prophets, Quran, Day of Judgment</li>
            <li><strong>Five Pillars:</strong> Shahada, Salah, Zakat, Sawm, Hajj</li>
            <li><strong>Symbols:</strong> Crescent and Star, Kaaba, Arabic calligraphy</li>
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
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            FAMILY AND RELIGIOUS STUDIES
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Religion in Zimbabwe</h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the different religions found in Zimbabwe, their key beliefs, symbols, and practices.
            Learn about Indigenous Religion, Judaism, Christianity, and Islam in the Zimbabwean context.
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
                  <strong className="text-white">Religions in Zimbabwe:</strong> Indigenous Religion,
                  Christianity, Islam, Judaism, and Hinduism – each with unique beliefs and practices.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Indigenous Religion:</strong> Belief in Supreme Being
                  (Mwari/uMvelinqangi), ancestral spirits (vadzimu/amadlozi), and other spirits (mashave).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Symbols of IR:</strong> Fire, water, sacred trees,
                  totems (mitupo/izibongo), and taboos (zviramu) that protect people and the environment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Judaism:</strong> One God, covenant, Torah,
                  symbols include Star of David, Menorah, and Mezuzah.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Christianity:</strong> Trinity, Jesus as Saviour,
                  Bible, symbols include Cross, Ichthys, Alpha and Omega.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Islam:</strong> One God (Allah), prophets, Quran,
                  Five Pillars, symbols include Crescent and Star, Kaaba.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Topic 1!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Topic 4</span>?</>
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
                alert('Proceed to Topic 4 (not implemented in this demo)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Topic 4 →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default topic1;