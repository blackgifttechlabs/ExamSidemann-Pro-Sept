import React, { useState, useRef } from 'react';

/**
 * Topic 1: Religion – Full component with sticky navigation,
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
      id: 'concept-distribution',
      title: 'Concept of Religion – Global Distribution',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Global Distribution of Religions">

          <p>
            Religion is practised all over the world. Different regions have different
            major religions, and understanding where religions are found helps us see
            how faith shapes cultures, societies, and histories across the globe.
            Here is an overview of the global distribution of the major religions:
          </p>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              <strong>Regions:</strong> Christianity is the largest religion in the world.
              It is most widespread in the Americas (North and South America), Europe,
              Sub-Saharan Africa, and parts of Asia (like the Philippines).
            </li>
            <li>
              <strong>Statistics:</strong> There are about 2.3 billion Christians in the world,
              which is about 31% of the global population.
            </li>
            <li>
              <strong>Denominations:</strong> Christianity has many branches, including
              Roman Catholic (the largest), Protestant, and Eastern Orthodox.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              <strong>Regions:</strong> Islam is the second largest religion. It is most
              widespread in the Middle East, North Africa, West Africa, South Asia
              (especially Pakistan, India, and Bangladesh), and Southeast Asia
              (especially Indonesia, Malaysia, and Brunei).
            </li>
            <li>
              <strong>Statistics:</strong> There are about 1.9 billion Muslims in the world,
              which is about 24% of the global population.
            </li>
            <li>
              <strong>Branches:</strong> The two main branches are Sunni (the majority)
              and Shia.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Hinduism</h4>
          <ul>
            <li>
              <strong>Regions:</strong> Hinduism is the third largest religion. It is mainly
              found in South Asia, especially India and Nepal. There are also Hindu
              communities in other parts of the world, including the United Kingdom,
              the United States, and Southeast Asia.
            </li>
            <li>
              <strong>Statistics:</strong> There are about 1.2 billion Hindus in the world,
              which is about 15% of the global population.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Buddhism</h4>
          <ul>
            <li>
              <strong>Regions:</strong> Buddhism is mainly found in East Asia and
              Southeast Asia. Major Buddhist countries include China, Japan, South Korea,
              Thailand, Myanmar, Sri Lanka, and Vietnam.
            </li>
            <li>
              <strong>Statistics:</strong> There are about 520 million Buddhists in the world,
              which is about 7% of the global population.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Indigenous and Traditional Religions</h4>
          <ul>
            <li>
              <strong>Regions:</strong> These are found mainly in Africa, the Americas,
              Australia, and parts of Asia. They are often practised by indigenous peoples
              and are closely connected to the land and local cultures.
            </li>
            <li>
              <strong>Statistics:</strong> They make up about 5% of the global population.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              <strong>Regions:</strong> Judaism is mainly found in Israel and the United States.
              There are also Jewish communities in Europe, Canada, and other parts of the world.
            </li>
            <li>
              <strong>Statistics:</strong> There are about 14 million Jews in the world,
              which is less than 1% of the global population.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Other Religions and Non‑Religious</h4>
          <ul>
            <li>
              <strong>Other religions:</strong> These include Sikhism, Jainism, Baha'i,
              Zoroastrianism, and many others. They are found in various parts of the world.
            </li>
            <li>
              <strong>Non‑religious:</strong> About 15% of the global population identifies
              as atheist, agnostic, or having no religion. This is especially common in
              parts of Europe, East Asia, and Oceania.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Global Religion Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Christianity:</strong> 31% – Americas, Europe, Africa</li>
            <li><strong>Islam:</strong> 24% – Middle East, Africa, South/Southeast Asia</li>
            <li><strong>Hinduism:</strong> 15% – South Asia (India, Nepal)</li>
            <li><strong>Buddhism:</strong> 7% – East/Southeast Asia</li>
            <li><strong>Indigenous:</strong> 5% – Africa, Americas, Australia</li>
            <li><strong>Judaism:</strong> &lt;1% – Israel, USA</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'indigenous',
      title: 'Indigenous Religion (IR)',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rites of Passage">

          <p>
            Rites of passage are ceremonies that mark important stages in a person's life.
            In Indigenous Religion, these ceremonies are very important. They help people
            move from one stage of life to another and connect them to their community
            and ancestors.
          </p>

          <h4 className="text-lg font-semibold mt-4">Birth and Naming Ceremonies</h4>
          <ul>
            <li>
              When a child is born, a naming ceremony is held. The name is chosen carefully
              because it carries meaning and connects the child to their family and ancestors.
            </li>
            <li>
              The ceremony involves giving thanks to the ancestors and asking for their
              protection over the child.
            </li>
            <li>
              The child is introduced to the community and becomes part of the extended family.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Initiation (Coming of Age)</h4>
          <ul>
            <li>
              This is one of the most important rites of passage. It marks the transition
              from childhood to adulthood.
            </li>
            <li>
              Young people are taught about their responsibilities, relationships, and
              traditions. They learn about their roles in the family and community.
            </li>
            <li>
              For boys, this often includes being taught about hunting, farming, and
              leadership. For girls, it includes learning about marriage, motherhood,
              and household management.
            </li>
            <li>
              The ceremonies often involve special teachings, tests of endurance, and
              celebrations.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Marriage</h4>
          <ul>
            <li>
              Marriage is a very important ceremony that brings two families together.
              It is not just about the couple – it is about uniting two clans or families.
            </li>
            <li>
              There are negotiations between the families (lobola / roora), which involve
              the exchange of gifts and agreements.
            </li>
            <li>
              The ceremony includes prayers to the ancestors asking for blessings on the
              new couple. Traditional rituals and celebrations are held.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Death and Burial</h4>
          <ul>
            <li>
              When a person dies, funeral ceremonies are held to honour the person and to
              send their spirit to the ancestors.
            </li>
            <li>
              The burial is an important ritual. It involves prayers, mourning, and
              community support for the grieving family.
            </li>
            <li>
              After the burial, there is a ceremony called <strong>Kurova Guva</strong>
              (bringing home the spirit) where the spirit of the deceased is welcomed back
              into the family as an ancestor.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Attire and Regalia">

          <ul>
            <li>
              <strong>Animal skins and hides:</strong> Traditional healers and spirit mediums
              often wear animal skins, such as leopard or lion skin. These are believed to
              give them special powers and connect them to the spirit world.
            </li>
            <li>
              <strong>Beads and jewelry:</strong> Beads are used for decoration and also
              have spiritual meaning. Different colours and patterns can have specific meanings.
            </li>
            <li>
              <strong>Feathers:</strong> Feathers, especially from eagles, are often worn
              in ceremonies. They symbolise connection to the sky and the spiritual realm.
            </li>
            <li>
              <strong>Staffs and sticks:</strong> Traditional leaders often carry staffs or
              sticks that symbolise their authority and connection to the ancestors.
            </li>
            <li>
              <strong>Traditional clothing:</strong> Special clothing is worn during ceremonies.
              This can include wraps, aprons, and headpieces made from traditional materials.
            </li>
            <li>
              <strong>Regalia for spirit mediums:</strong> Spirit mediums often wear special
              regalia that identifies them and shows their connection to a particular spirit.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Days and Their Significance">

          <ul>
            <li>
              <strong>Days of the ancestors:</strong> Certain days are set aside to honour
              and remember the ancestors. Families gather to pray, make offerings, and
              remember their loved ones who have passed on.
            </li>
            <li>
              <strong>Harvest festivals:</strong> These are days when the community gives
              thanks for a good harvest. They celebrate with feasting, dancing, and offering
              the first fruits to the ancestors.
            </li>
            <li>
              <strong>New Year celebrations:</strong> In some communities, there are
              traditional New Year celebrations that mark the beginning of the farming
              season or the start of a new cycle.
            </li>
            <li>
              <strong>Full moon days:</strong> Some ceremonies and rituals are held on
              full moon days. It is believed that the full moon has special spiritual power.
            </li>
            <li>
              <strong>Ceremonial days:</strong> Days when specific ceremonies are held,
              such as rainmaking ceremonies or initiation ceremonies. These are planned
              according to traditional calendars and the guidance of the elders.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">IR Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rites of passage:</strong> birth, initiation, marriage, death</li>
            <li><strong>Sacred attire:</strong> animal skins, beads, feathers, staffs</li>
            <li><strong>Sacred days:</strong> ancestor days, harvest festivals, new year</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'judaism',
      title: 'Judaism',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rites of Passage">

          <p>
            Jewish rites of passage mark important milestones in a person's life.
            They connect people to their faith, their family, and the community.
          </p>

          <h4 className="text-lg font-semibold mt-4">Birth and Naming</h4>
          <ul>
            <li>
              <strong>Brit Milah (Circumcision):</strong> For baby boys, circumcision is
              performed on the eighth day after birth. This is a sign of the covenant
              between God and Abraham.
            </li>
            <li>
              <strong>Simchat Bat (Naming ceremony):</strong> For baby girls, a naming
              ceremony is held. It is often done in the synagogue, and the girl receives
              her Hebrew name.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Bar Mitzvah and Bat Mitzvah</h4>
          <ul>
            <li>
              <strong>Bar Mitzvah:</strong> This is a ceremony for boys at the age of 13.
              It marks the transition to adult religious responsibilities. The boy reads
              from the Torah in the synagogue.
            </li>
            <li>
              <strong>Bat Mitzvah:</strong> This is a ceremony for girls at the age of 12.
              It marks the same transition to adult responsibilities. The girl may read
              from the Torah or lead part of the service.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Marriage</h4>
          <ul>
            <li>
              Marriage is a very important ceremony in Judaism. It is called a <strong>Kiddushin</strong>.
              The ceremony takes place under a canopy called a <strong>chuppah</strong>.
            </li>
            <li>
              The bride and groom exchange rings, and the groom breaks a glass to remember
              the destruction of the Temple in Jerusalem.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Death and Mourning</h4>
          <ul>
            <li>
              When a person dies, there are mourning rituals. The funeral is usually held
              within 24 hours of death. The body is buried in a simple wooden coffin.
            </li>
            <li>
              There are different stages of mourning: <strong>Shiva</strong> (seven days
              of intense mourning), <strong>Shloshim</strong> (thirty days), and the
              <strong>year of mourning</strong> for parents.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Attire">

          <ul>
            <li>
              <strong>Kippah (Yarmulke):</strong> A small cap worn by Jewish men as a sign
              of respect for God. It reminds them that God is always above them.
            </li>
            <li>
              <strong>Tallit (Prayer Shawl):</strong> A shawl with fringes (tzitzit) that
              is worn during prayer. The fringes remind people of the commandments.
            </li>
            <li>
              <strong>Tefillin (Phylacteries):</strong> Small boxes containing Torah verses
              that are worn on the forehead and arm during weekday morning prayers.
            </li>
            <li>
              <strong>Kittel:</strong> A white garment worn on Yom Kippur and during
              the Passover Seder. It is also used as a burial shroud.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Days and Their Significance">


          <h4 className="text-lg font-semibold mt-4">Shabbat (The Sabbath)</h4>
          <ul>
            <li>
              Shabbat is the most important sacred day in Judaism. It begins on Friday
              evening and ends on Saturday evening.
            </li>
            <li>
              It is a day of rest, family, and prayer. No work is done, and special meals
              are prepared. Candles are lit to mark the beginning of Shabbat.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Rosh Hashanah (Jewish New Year)</h4>
          <ul>
            <li>
              Rosh Hashanah is the Jewish New Year. It is a time for reflection and
              repentance. People pray for a good new year and ask for God's blessing.
            </li>
            <li>
              The shofar (ram's horn) is blown in the synagogue to call people to repentance.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Yom Kippur (Day of Atonement)</h4>
          <ul>
            <li>
              Yom Kippur is the holiest day of the Jewish year. It is a day of fasting,
              prayer, and asking for forgiveness for sins.
            </li>
            <li>
              People spend the day in the synagogue seeking reconciliation with God and
              with others.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Passover (Pesach)</h4>
          <ul>
            <li>
              Passover is a festival that remembers the Exodus from Egypt. It lasts for
              eight days (seven days in Israel).
            </li>
            <li>
              Jews eat unleavened bread (matzah) and hold a special meal called a Seder.
              The story of the Exodus is retold during the Seder.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Hanukkah</h4>
          <ul>
            <li>
              Hanukkah is a festival of lights that lasts for eight days. It celebrates
              the rededication of the Temple in Jerusalem.
            </li>
            <li>
              A menorah (candlestick) is lit each night with one candle added each day.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Sukkot (Festival of Tabernacles)</h4>
          <ul>
            <li>
              Sukkot is a festival that remembers the time when the Israelites lived in
              temporary shelters (sukkot) in the desert.
            </li>
            <li>
              People build temporary huts and eat meals in them. It is a time of joy and
              thanksgiving.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Judaism Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rites of passage:</strong> Brit Milah, Bar/Bat Mitzvah, Marriage</li>
            <li><strong>Sacred attire:</strong> Kippah, Tallit, Tefillin, Kittel</li>
            <li><strong>Sacred days:</strong> Shabbat, Rosh Hashanah, Yom Kippur, Passover</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'christianity',
      title: 'Christianity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rites of Passage">

          <p>
            Christian rites of passage mark important moments in a person's spiritual journey.
            They connect people to God, the church, and the community of believers.
          </p>

          <h4 className="text-lg font-semibold mt-4">Baptism</h4>
          <ul>
            <li>
              Baptism is the first rite of passage in Christianity. It is a ceremony where
              a person is initiated into the Christian faith.
            </li>
            <li>
              It often involves water being poured on the head or full immersion in water.
              It symbolises spiritual cleansing and being born again.
            </li>
            <li>
              For babies, it is called <strong>infant baptism</strong>. For adults who
              convert, it is called <strong>believer's baptism</strong>.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">First Communion (Eucharist)</h4>
          <ul>
            <li>
              This is a ceremony where children receive the Eucharist (bread and wine) for
              the first time. It usually happens around the age of 7 or 8 in Catholic churches.
            </li>
            <li>
              It is a significant moment because it marks the child's full participation in
              the sacrament of the Eucharist.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Confirmation</h4>
          <ul>
            <li>
              Confirmation is a ceremony where a person confirms their faith and becomes a
              full member of the church.
            </li>
            <li>
              It usually happens in the teenage years. The person receives the Holy Spirit
              and is strengthened in their faith.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Marriage</h4>
          <ul>
            <li>
              Christian marriage is a sacred ceremony where a man and woman are joined
              together as husband and wife in the presence of God.
            </li>
            <li>
              The ceremony includes prayers, blessings, and the exchange of vows and rings.
              It takes place in a church.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Ordination</h4>
          <ul>
            <li>
              This is a ceremony where a person is set apart to serve as a religious leader,
              such as a priest, pastor, or bishop.
            </li>
            <li>
              It involves a special service where the person is prayed over and given
              authority to lead and serve the church.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Death and Funeral</h4>
          <ul>
            <li>
              Christian funerals are a way to honour the deceased and to celebrate their
              life and faith.
            </li>
            <li>
              The service includes prayers, scripture readings, and hymns. The body is
              buried or cremated, and the soul is believed to go to heaven.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Days and Their Significance">


          <h4 className="text-lg font-semibold mt-4">Easter (Resurrection Sunday)</h4>
          <ul>
            <li>
              Easter is the most important Christian festival. It celebrates the resurrection
              of Jesus Christ from the dead.
            </li>
            <li>
              Easter Sunday is a day of great joy and celebration. It is preceded by
              <strong>Good Friday</strong> (the day Jesus was crucified) and <strong>Holy Week</strong>.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Christmas</h4>
          <ul>
            <li>
              Christmas celebrates the birth of Jesus Christ. It is a time of joy,
              gift‑giving, and family gatherings.
            </li>
            <li>
              It is celebrated on 25 December. Many churches hold special services on
              Christmas Eve and Christmas Day.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Lent</h4>
          <ul>
            <li>
              Lent is a period of 40 days of fasting, prayer, and repentance leading up to Easter.
            </li>
            <li>
              It is a time for Christians to reflect on their lives and to grow closer to God.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Pentecost</h4>
          <ul>
            <li>
              Pentecost is celebrated 50 days after Easter. It remembers the day when the
              Holy Spirit came to the disciples.
            </li>
            <li>
              It is known as the birthday of the Christian church.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Sundays</h4>
          <ul>
            <li>
              Sunday is the day of worship for Christians. It is called the Lord's Day
              because Jesus rose from the dead on a Sunday.
            </li>
            <li>
              Christians gather in churches to pray, sing, and listen to teachings.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">All Saints' Day</h4>
          <ul>
            <li>
              This is a day to honour all saints, both known and unknown. It is celebrated
              on 1 November in Western Christianity.
            </li>
            <li>
              It is a time to remember and give thanks for the lives of those who have
              lived holy lives.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Christianity Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rites of passage:</strong> Baptism, First Communion, Confirmation, Marriage</li>
            <li><strong>Sacred days:</strong> Easter, Christmas, Lent, Pentecost, Sundays</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'islam',
      title: 'Islam',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rites of Passage">

          <p>
            Islamic rites of passage mark important milestones in a Muslim's life.
            They connect people to Allah, the Prophet Muhammad, and the Muslim community.
          </p>

          <h4 className="text-lg font-semibold mt-4">Birth and Naming</h4>
          <ul>
            <li>
              When a child is born, the <strong>Adhan</strong> (call to prayer) is recited
              into the baby's ear. This is the first words the baby hears.
            </li>
            <li>
              The <strong>Aqiqah</strong> ceremony is held on the seventh day after birth.
              A sheep or goat is sacrificed, and the meat is shared with family and the poor.
            </li>
            <li>
              The baby is given a name, often a name with a good meaning, such as a name
              of a prophet or a righteous person.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Circumcision (Khitan)</h4>
          <ul>
            <li>
              Circumcision is performed on Muslim boys. It is a sign of belonging to the
              Muslim community and following the tradition of the Prophet Muhammad.
            </li>
            <li>
              It is usually done at a young age, often before the age of 13.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Marriage</h4>
          <ul>
            <li>
              Marriage is a very important ceremony in Islam. It is called <strong>Nikah</strong>.
            </li>
            <li>
              The ceremony includes the signing of a marriage contract and the payment of
              <strong>Mahr</strong> (a gift from the groom to the bride). The couple exchange
              vows, and the ceremony is often led by an Imam.
            </li>
            <li>
              The marriage is usually followed by a celebration (Walima) with family and friends.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Death and Funeral (Janazah)</h4>
          <ul>
            <li>
              When a Muslim dies, the body is washed and wrapped in a simple white cloth.
              The funeral prayer (Salat al‑Janazah) is said in congregation.
            </li>
            <li>
              The body is buried as soon as possible, usually within 24 hours. The face is
              turned towards Mecca.
            </li>
            <li>
              Mourning continues, but it is important to accept death as the will of Allah.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Attire and Regalia">

          <ul>
            <li>
              <strong>Hijab:</strong> A headscarf worn by many Muslim women. It is a sign
              of modesty and faith.
            </li>
            <li>
              <strong>Abaya:</strong> A long, loose outer garment worn by some Muslim women.
            </li>
            <li>
              <strong>Kufi:</strong> A short cap worn by Muslim men, especially during prayers.
            </li>
            <li>
              <strong>Thawb (Jalabiya):</strong> A long robe worn by men in many Muslim countries.
            </li>
            <li>
              <strong>Ihram:</strong> A special white garment worn by pilgrims during Hajj.
              It consists of two pieces of white cloth for men and loose clothing for women.
            </li>
            <li>
              <strong>Prayer rug:</strong> A mat used by Muslims during prayer. It provides
              a clean space for connecting with Allah.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Days and Their Significance">


          <h4 className="text-lg font-semibold mt-4">Friday (Jumu'ah)</h4>
          <ul>
            <li>
              Friday is the most important day of the week for Muslims. It is a day of
              communal prayer, called <strong>Jumu'ah</strong>.
            </li>
            <li>
              Muslims gather at the mosque for a special sermon (khutbah) and prayer.
              It is considered a day of blessing.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Ramadan</h4>
          <ul>
            <li>
              Ramadan is the ninth month of the Islamic calendar. It is a month of fasting,
              prayer, and spiritual reflection.
            </li>
            <li>
              Muslims fast from dawn to sunset, abstaining from food, drink, and other
              physical needs. The fast teaches self‑discipline and empathy for the poor.
            </li>
            <li>
              The month ends with <strong>Eid al‑Fitr</strong>, a day of celebration and feasting.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Eid al‑Fitr</h4>
          <ul>
            <li>
              Eid al‑Fitr marks the end of Ramadan. It is a day of joy and thanksgiving.
            </li>
            <li>
              Muslims go to the mosque for special prayers, give charity (Zakat al‑Fitr),
              and celebrate with family and friends.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Eid al‑Adha</h4>
          <ul>
            <li>
              Eid al‑Adha is the festival of sacrifice. It marks the end of the Hajj
              pilgrimage and remembers Abraham's willingness to sacrifice his son.
            </li>
            <li>
              Animals are sacrificed, and the meat is shared with family, friends, and the poor.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Hajj</h4>
          <ul>
            <li>
              The Hajj is the pilgrimage to Mecca. It is one of the Five Pillars of Islam.
            </li>
            <li>
              It takes place during the Islamic month of Dhul‑Hijjah. Muslims from all over
              the world gather in Mecca for rituals that remember the lives of Abraham and
              his family.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Laylat al‑Qadr (Night of Power)</h4>
          <ul>
            <li>
              This is the night when the first verses of the Quran were revealed to Muhammad.
            </li>
            <li>
              It falls during the last ten days of Ramadan and is considered the holiest
              night of the year. Muslims spend the night in prayer and devotion.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islamic New Year</h4>
          <ul>
            <li>
              The Islamic New Year marks the beginning of the Islamic lunar calendar.
              It commemorates the Hijra (migration of Muhammad from Mecca to Medina).
            </li>
            <li>
              It is a time for reflection on the Prophet's life and the importance of the
              Muslim community.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Islam Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rites of passage:</strong> Birth, Circumcision, Marriage, Funeral</li>
            <li><strong>Sacred attire:</strong> Hijab, Kufi, Ihram, Prayer rug</li>
            <li><strong>Sacred days:</strong> Friday, Ramadan, Eid al‑Fitr, Eid al‑Adha, Hajj</li>
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
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Religion</h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the global distribution of religions, and learn about the rites of passage,
            sacred attire, and sacred days of Indigenous Religion, Judaism, Christianity, and Islam.
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
                  <strong className="text-white">Global Distribution:</strong> Christianity (31%) is
                  largest, followed by Islam (24%), Hinduism (15%), Buddhism (7%), Indigenous (5%),
                  and Judaism (&lt;1%). Each religion is concentrated in different regions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Indigenous Religion:</strong> Rites of passage include
                  birth, initiation, marriage, and death; sacred attire includes animal skins, beads,
                  and feathers; sacred days include ancestor days and harvest festivals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Judaism:</strong> Rites of passage include Brit Milah,
                  Bar/Bat Mitzvah; sacred attire includes Kippah, Tallit, Tefillin; sacred days include
                  Shabbat, Rosh Hashanah, Yom Kippur, and Passover.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Christianity:</strong> Rites of passage include
                  Baptism, First Communion, Confirmation; sacred days include Easter, Christmas,
                  Lent, Pentecost, and Sundays.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Islam:</strong> Rites of passage include birth,
                  circumcision, marriage, and funeral; sacred attire includes Hijab, Kufi, Ihram;
                  sacred days include Friday, Ramadan, Eid al‑Fitr, Eid al‑Adha, and Hajj.
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
              <>Ready to move on to <span className="text-blue-600">Topic 2</span>?</>
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
                alert('Proceed to Topic 2 (not implemented in this demo)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Topic 2 →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default topic1;