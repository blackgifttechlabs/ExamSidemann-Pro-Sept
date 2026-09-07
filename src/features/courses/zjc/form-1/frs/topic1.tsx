import React, { useState, useRef } from 'react';

/**
 * Topic 1: Religion – Full component with sticky navigation,
 * aside cards, and auto‑scroll + double‑highlight on heading.
 */
export const topic1: React.FC = () => {
  // ---------- CSS keyframes for the double highlight ----------
  // (added inline as a style tag – you can also move to global CSS)
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
      id: 'concept',
      title: 'Concept of Religion',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Religion">

          <p>
            Religion is a system of beliefs and practices that people follow to connect with a higher power or spiritual being.
            It gives people a sense of meaning and purpose in life. It also provides moral rules that guide how people should
            behave towards one another.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Types of Religion">

          <p>
            To understand how religions work, it is helpful to look at the different types.
            Religions are often grouped by what they believe about God or gods.
            These groups help us understand the main ways that people worship and think about the universe.
            The three main types are monotheistic, polytheistic, and non‑theistic religions.
          </p>
          <ul>
            <li>
              <strong>Monotheistic religions:</strong> People in this group believe in only one God.
              They worship that one God and follow His commandments.
              For example, Judaism, Christianity, and Islam all belong to this group.
              They teach that this one God is the creator of everything and is all‑powerful.
            </li>
            <li>
              <strong>Polytheistic religions:</strong> People in this group believe in many gods.
              Each god may control a different part of life, such as rain, war, farming, or love.
              For example, Hinduism and the ancient religions of Greece and Rome belong to this group.
              Followers may pray to different gods for different needs.
            </li>
            <li>
              <strong>Non‑theistic religions:</strong> People in this group do not believe in a personal creator‑God.
              Instead, they follow a path of spiritual growth, wisdom, and moral living.
              They focus on inner peace and right actions.
              For example, Buddhism and Jainism belong to this group.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Characteristics of Religion">

          <p>
            All religions share some common features. These features help us understand what religion looks like in practice.
            While each religion is unique, they all have certain elements that make them recognisable as religions.
            Here are the main characteristics:
          </p>
          <ol>
            <li>
              <strong>Belief in a supernatural power:</strong> They believe in a spirit, God, or gods that are greater than humans.
              This power is often seen as the creator or ruler of the universe.
            </li>
            <li>
              <strong>Moral rules and ethics:</strong> They follow a set of rules that guide how to treat other people.
              These rules teach what is right and what is wrong in daily life.
            </li>
            <li>
              <strong>Acts of worship:</strong> They take part in acts of worship such as prayer, singing, chanting, or meditation.
              These acts help them connect with the divine.
            </li>
            <li>
              <strong>A community of believers:</strong> They gather with other people who share the same beliefs.
              This community gives support and helps people keep their faith strong.
            </li>
            <li>
              <strong>Sacred writings or teachings:</strong> They have holy books or oral traditions that tell them how to live.
              These writings contain the main stories, laws, and teachings of the religion.
            </li>
            <li>
              <strong>Special places of worship:</strong> They have sacred places where they go to worship, such as temples,
              churches, synagogues, mosques, or shrines. These places are set apart for religious activities.
            </li>
            <li>
              <strong>Religious symbols:</strong> They use symbols to represent their faith.
              Examples include the cross for Christianity, the crescent for Islam, and the Star of David for Judaism.
              These symbols carry deep meaning.
            </li>
            <li>
              <strong>Festivals and celebrations:</strong> They celebrate holy days or festivals at certain times of the year.
              These celebrations often remember important events in the religion's history.
            </li>
            <li>
              <strong>Belief in life after death:</strong> Many religions teach that life continues after death.
              This may be in the form of heaven, hell, reincarnation, or a spiritual realm.
            </li>
            <li>
              <strong>A creation story:</strong> They have a story that explains how the world and human beings began.
              This story gives meaning to the universe and explains where people came from.
            </li>
          </ol>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Religion</strong> – a system of beliefs and practices</li>
            <li><strong>Monotheism</strong> – belief in one God</li>
            <li><strong>Polytheism</strong> – belief in many gods</li>
            <li><strong>Non‑theism</strong> – no personal god</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'indigenous',
      title: 'Indigenous Religion',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Indigenous Religion">

          <p>
            Indigenous religion refers to the original or traditional beliefs and practices of a particular ethnic group.
            These religions are often passed down by word of mouth from grandparents to children.
            They are deeply connected to the land, nature, and the ancestors of the community.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Historical Background and Development">

          <p>
            Indigenous religions are the oldest forms of religious practice in the world.
            They began in ancient times when early humans lived in small communities and depended on nature for survival.
            These people observed natural events like thunderstorms, droughts, rain, and the changing seasons.
            They could not explain these events using science, so they believed that powerful spirits caused them.
            They saw spirits in things around them, such as rivers, trees, mountains, and animals.
          </p>
          <p>
            Over time, these beliefs became more organised. People started to create rituals and ceremonies to please the spirits.
            They made offerings to ensure good harvests, health, and protection from danger.
            Ancestors became very important in these religions. People believed that the spirits of dead relatives could help the living.
            They often spoke to their ancestors through prayers and offerings.
          </p>
          <p>
            Because these people did not have written languages at first, they passed their beliefs down through oral traditions.
            This meant that stories, myths, and songs were told from one generation to the next.
            Each community or tribe developed its own unique set of gods, spirits, and customs.
            Even today, many indigenous groups around the world continue to practise these ancient religions.
            However, they are sometimes threatened by modernisation and the spread of other larger religions.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Names of the Supreme Being">

          <p>
            In African Indigenous Religion, the Supreme Being is known by different names in different languages.
            Each culture has a special name that describes the greatness of God.
            Here are some of those names:
          </p>
          <ul>
            <li>
              <strong>Olodumare</strong> – This name is used among the Yoruba people of Nigeria.
              It means the Almighty or the Supreme One.
            </li>
            <li>
              <strong>Nyame</strong> – This name is used among the Akan people of Ghana.
              It refers to the all‑knowing and all‑powerful God who is the source of life.
            </li>
            <li>
              <strong>Mulungu</strong> – This name is used among many Bantu‑speaking groups in East and Southern Africa.
              It means the supreme creator.
            </li>
            <li>
              <strong>Ngai</strong> – This name is used among the Kikuyu people of Kenya.
              Ngai is seen as the provider and protector of the people.
            </li>
            <li>
              <strong>Mawu</strong> – This name is used among the Ewe people of Ghana and Togo.
              Mawu is the creator God and is often seen as a female or dual‑gender deity.
            </li>
            <li>
              <strong>Leza</strong> – This name is used among the Bemba and other groups in Zambia.
              Leza is the giver of rain and the one who controls all things.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Attributes of the Supreme Being">

          <p>
            In Indigenous religions, the Supreme Being has many special qualities.
            These attributes show how people understand God's nature and power.
            They believe that God is:
          </p>
          <ul>
            <li><strong>Omnipotent</strong> – all‑powerful.</li>
            <li><strong>Omniscient</strong> – all‑knowing.</li>
            <li><strong>Omnipresent</strong> – everywhere at the same time.</li>
            <li><strong>Eternal</strong> – no beginning or end.</li>
            <li><strong>Creator</strong> – made the world and everything in it.</li>
            <li><strong>Just</strong> – fair and righteous.</li>
            <li><strong>Merciful</strong> – kind and forgiving.</li>
            <li><strong>Provider</strong> – supplies all needs.</li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Supreme Being Names</h3>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>Yoruba: <strong>Olodumare</strong></li>
            <li>Akan: <strong>Nyame</strong></li>
            <li>Bantu: <strong>Mulungu</strong></li>
            <li>Kikuyu: <strong>Ngai</strong></li>
            <li>Ewe: <strong>Mawu</strong></li>
            <li>Bemba: <strong>Leza</strong></li>
          </ul>
        </div>
      ),
    },
    {
      id: 'judaism',
      title: 'Judaism',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Judaism">

          <p>
            Judaism is the religion of the Jewish people. It is a monotheistic faith, which means that Jews believe in only one God.
            This religion is based on a special agreement, or covenant, that God made with Abraham.
            Jews follow the teachings found in the Torah, which is their most important holy book.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Historical Background and Development">

          <p>
            Judaism is one of the oldest religions in the world. It began about 4,000 years ago in the Middle East,
            in a region that is now called Israel and Palestine.
            The story of Judaism starts with a man named Abraham. According to Jewish tradition, God called Abraham
            to leave his home and travel to a new land called Canaan. God promised Abraham that he would make his
            descendants into a great nation. Abraham agreed to follow God, and this promise became the foundation of the faith.
          </p>
          <p>
            Abraham had a grandson named Jacob, who was also called Israel. Jacob's twelve sons became the ancestors of
            the twelve tribes of Israel. Later, a severe famine forced the Israelites to move to Egypt. At first,
            they lived well in Egypt, but later they became slaves to the Egyptian pharaohs. The people suffered for many years.
            God sent a great leader named Moses to rescue them. Moses demanded that the pharaoh let the people go.
            When the pharaoh refused, God sent ten terrible plagues upon Egypt. Finally, the pharaoh allowed the Israelites to leave.
            This journey out of Egypt is called the Exodus. It is one of the most important events in Jewish history.
          </p>
          <p>
            After leaving Egypt, the Israelites wandered in the desert for forty years. During this time, God gave Moses
            the Ten Commandments on Mount Sinai. The Ten Commandments became the basis of Jewish law and morality.
            The Israelites eventually entered Canaan, the Promised Land. Over time, they established a kingdom.
            King David made Jerusalem the capital city, and his son Solomon built the first great Temple in Jerusalem.
            This Temple became the centre of Jewish worship.
          </p>
          <p>
            After Solomon died, the kingdom split into two parts. The northern kingdom was called Israel, and the southern
            kingdom was called Judah. The Assyrians conquered the northern kingdom, and later the Babylonians conquered Judah.
            In 586 BCE, the Babylonians destroyed the Temple and forced many Jews into exile in Babylon. This event is called
            the Babylonian Exile. After about fifty years, the Persians conquered Babylon and allowed the Jews to return
            to Jerusalem. They rebuilt the Temple, which was called the Second Temple.
          </p>
          <p>
            In 70 CE, the Romans destroyed the Second Temple. This was a terrible disaster for the Jewish people.
            With the Temple gone, many Jews were forced to scatter to different parts of the world.
            This scattering is known as the diaspora. For centuries, Jews lived in many countries, often facing persecution.
            Despite these hardships, they preserved their faith by studying their scriptures, praying, and keeping
            their community traditions alive. Today, there are Jewish communities in many countries,
            and the State of Israel was re‑established in 1948 as a homeland for the Jewish people.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Names of the Supreme Being">

          <p>
            In Judaism, God has many names. Each name reveals a different aspect of God's nature.
            Some of these names are considered very holy and are not spoken casually. Here are the main names:
          </p>
          <ul>
            <li><strong>Yahweh (YHWH):</strong> The most sacred personal name, often translated as "I AM WHO I AM".</li>
            <li><strong>Elohim:</strong> A title emphasising God's power and majesty.</li>
            <li><strong>Adonai:</strong> Means "Lord", used in reading scripture.</li>
            <li><strong>HaShem:</strong> Literally "The Name", used in everyday speech.</li>
            <li><strong>Jehovah:</strong> A Christian pronunciation, not used in Jewish practice.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Attributes of the Supreme Being">

          <ul>
            <li><strong>One:</strong> There is only one God.</li>
            <li><strong>Eternal:</strong> God has always existed.</li>
            <li><strong>All‑powerful:</strong> God can do anything.</li>
            <li><strong>All‑knowing:</strong> God knows everything.</li>
            <li><strong>Just:</strong> God is fair and rewards good, punishes evil.</li>
            <li><strong>Merciful:</strong> God is compassionate and forgives.</li>
            <li><strong>Holy:</strong> God is pure and separate from sin.</li>
            <li><strong>Creator:</strong> God made the universe.</li>
            <li><strong>Deliverer:</strong> God rescued the Israelites from Egypt.</li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Judaism Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Founder:</strong> Abraham</li>
            <li><strong>Holy Book:</strong> Torah</li>
            <li><strong>Key Event:</strong> Exodus from Egypt</li>
            <li><strong>Place of Worship:</strong> Synagogue</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'christianity',
      title: 'Christianity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Christianity">

          <p>
            Christianity is a monotheistic religion that is based on the life and teachings of Jesus Christ.
            Christians believe that Jesus is the Son of God and the Messiah, which means the promised saviour.
            They believe that Jesus died on the cross to save people from their sins and that he rose from the dead.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Historical Background and Development">

          <p>
            Christianity began about 2,000 years ago in Judea, which is now part of Israel and Palestine.
            At that time, Judea was ruled by the Roman Empire. The founder of Christianity is Jesus of Nazareth.
            Jesus was born a Jew and grew up in the town of Nazareth. When he was about 30 years old, he began to travel
            and preach to the people. He taught about the kingdom of God, love, forgiveness, and peace.
            He spoke to crowds and performed many miracles. He healed sick people, gave sight to the blind,
            and even raised the dead, according to the gospels.
          </p>
          <p>
            Many people were attracted to Jesus' message. However, the religious leaders of the time felt threatened by him.
            They accused him of blasphemy, which means speaking against God. They handed him over to the Roman governor,
            Pontius Pilate. Pilate sentenced Jesus to death by crucifixion, which was a common Roman punishment.
            Jesus died on a cross. His followers were very sad and lost all hope.
          </p>
          <p>
            However, three days after his death, something amazing happened. According to Christian belief, Jesus rose from the dead.
            This event is called the resurrection. The resurrection is the most important event in Christianity.
            It proved to his followers that Jesus was truly the Son of God. After his resurrection, Jesus appeared to many
            of his disciples and taught them for forty more days before ascending into heaven.
          </p>
          <p>
            After Jesus left, his disciples began to spread his message. A man named Peter became a leader of the church in Jerusalem.
            Another very important person was Paul. Paul had originally persecuted Christians, but he had a vision of Jesus
            on the road to Damascus and he changed his life. Paul became a great missionary. He travelled all over the
            Roman Empire, planting churches and writing letters to encourage the believers.
            Many of these letters later became part of the New Testament.
          </p>
          <p>
            In the early days, Christians were often persecuted by the Roman authorities. They were arrested, tortured,
            and killed for their faith. Despite this, the religion grew rapidly. In 313 CE, Emperor Constantine legalised
            Christianity with the Edict of Milan. A few decades later, it became the official religion of the Roman Empire.
            This made Christianity a very powerful force in Europe.
          </p>
          <p>
            Over time, Christianity developed into different branches. In 1054, the Church split into the Roman Catholic Church
            in the West and the Eastern Orthodox Church in the East. This is called the Great Schism.
            Later, in the 1500s, a movement called the Reformation led to the creation of many Protestant churches.
            Today, Christianity is the world's largest religion, with followers in almost every country.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Names of the Supreme Being">

          <ul>
            <li><strong>God:</strong> The most common name.</li>
            <li><strong>Father:</strong> Shows a loving relationship.</li>
            <li><strong>Lord:</strong> Means master or ruler.</li>
            <li><strong>Jehovah:</strong> Used in some Bible translations.</li>
            <li><strong>Yahweh:</strong> The sacred name from Hebrew.</li>
            <li><strong>Trinity:</strong> Three‑in‑one: Father, Son, Holy Spirit.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Attributes of the Supreme Being">

          <ul>
            <li><strong>Omnipotent:</strong> All‑powerful.</li>
            <li><strong>Omniscient:</strong> All‑knowing.</li>
            <li><strong>Omnipresent:</strong> Present everywhere.</li>
            <li><strong>Love:</strong> God is love itself.</li>
            <li><strong>Mercy:</strong> Compassionate and forgiving.</li>
            <li><strong>Justice:</strong> Perfectly fair.</li>
            <li><strong>Holiness:</strong> Completely pure and good.</li>
            <li><strong>Eternal:</strong> No beginning or end.</li>
            <li><strong>Creator:</strong> Made everything.</li>
            <li><strong>Redeemer:</strong> Saves people through Jesus.</li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Christianity Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Founder:</strong> Jesus Christ</li>
            <li><strong>Holy Book:</strong> Bible</li>
            <li><strong>Key Event:</strong> Resurrection</li>
            <li><strong>Place of Worship:</strong> Church</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'islam',
      title: 'Islam',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Islam">

          <p>
            Islam is a monotheistic religion that believes in one God, whose name is Allah in Arabic.
            The word "Islam" means submission to the will of God. Muslims are the followers of Islam.
            They believe that Muhammad is the last and final messenger of God, sent to teach humanity how to live.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Historical Background and Development">

          <p>
            Islam began in the 7th century CE on the Arabian Peninsula, in the city of Mecca.
            At that time, most people in Arabia worshipped many gods and idols.
            The founder of Islam is a man named Muhammad. Muhammad was born in Mecca around 570 CE.
            He worked as a trader and was known for his honesty.
            He often went to a cave on Mount Hira to meditate and think about the world.
          </p>
          <p>
            When Muhammad was about 40 years old, something life‑changing happened.
            According to Islamic belief, the Angel Gabriel appeared to him in the cave and gave him the first words of the Quran.
            The Quran is the holy book of Islam. Muhammad was told that there is only one God, Allah, and that he was chosen
            to be a prophet. Muhammad began to preach this message to the people of Mecca. He told them to worship only Allah
            and to give up their idols. He also told them to be kind to the poor and to treat everyone fairly.
          </p>
          <p>
            Many people in Mecca opposed Muhammad. They did not want to give up their old gods. They also feared that
            his teachings would disrupt their business. They made life very difficult for Muhammad and his followers.
            They were insulted, beaten, and even threatened with death. In 622 CE, Muhammad and his followers were forced
            to leave Mecca. They moved to a city about 400 kilometres away called Yathrib, which later became known as Medina.
            This journey is called the Hijra. The Hijra is so important that it marks the beginning of the Islamic calendar.
          </p>
          <p>
            In Medina, Muhammad built a strong and peaceful Muslim community. He became a leader of the city.
            Over time, the community grew stronger. They had several battles with the people of Mecca, but eventually,
            in 630 CE, Muhammad and his followers returned to Mecca peacefully. He entered the city and cleared the Kaaba
            (a sacred building) of all idols. He dedicated the Kaaba to the worship of Allah.
          </p>
          <p>
            Muhammad died in 632 CE. After his death, his followers continued to spread the message of Islam.
            They conquered many lands and took the religion to Syria, Persia, North Africa, and even Spain.
            Within a hundred years, Islam had become a major world power.
            However, after Muhammad's death, a disagreement arose about who should lead the Muslim community.
            This disagreement eventually caused Islam to split into two main groups: the Sunnis and the Shias.
            Today, Islam is the second‑largest religion in the world, with millions of followers across the globe.
          </p>

          
          </SubtopicCard>

          <SubtopicCard title="Names of the Supreme Being">

          <p>
            In Islam, the Supreme Being is known as <strong>Allah</strong>.
            Muslims also use many other beautiful names, called the 99 Names of Allah. Some important ones:
          </p>
          <ul>
            <li><strong>Al‑Rahman</strong> – The Most Gracious.</li>
            <li><strong>Al‑Rahim</strong> – The Most Merciful.</li>
            <li><strong>Al‑Malik</strong> – The King.</li>
            <li><strong>Al‑Quddus</strong> – The Holy.</li>
            <li><strong>Al‑Jabbar</strong> – The Compeller.</li>
            <li><strong>Al‑Aziz</strong> – The Almighty.</li>
            <li><strong>Al‑Ghaffar</strong> – The Forgiving.</li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Attributes of the Supreme Being">

          <ul>
            <li><strong>One:</strong> Absolutely one, no partners.</li>
            <li><strong>Eternal:</strong> Always existed, never dies.</li>
            <li><strong>All‑powerful:</strong> Has power over all things.</li>
            <li><strong>All‑knowing:</strong> Knows everything.</li>
            <li><strong>Most Gracious:</strong> Kind to everyone.</li>
            <li><strong>Most Merciful:</strong> Compassionate and forgiving.</li>
            <li><strong>Creator:</strong> Made the heavens and earth.</li>
            <li><strong>Sustainer:</strong> Provides for all.</li>
            <li><strong>Judge:</strong> Will judge everyone on the Day of Judgment.</li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Islam Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Founder:</strong> Muhammad</li>
            <li><strong>Holy Book:</strong> Quran</li>
            <li><strong>Key Event:</strong> Hijra (migration to Medina)</li>
            <li><strong>Place of Worship:</strong> Mosque</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'revision',
      title: 'Quick Revision Summary',
      content: (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📚</span>
              <h4 className="text-lg font-bold text-blue-700">Concept</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Religion = beliefs &amp; practices</li>
              <li>Types: Monotheistic, Polytheistic, Non‑theistic</li>
              <li>10 characteristics (beliefs, morals, worship, etc.)</li>
            </ul>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌍</span>
              <h4 className="text-lg font-bold text-blue-700">Indigenous</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Oldest religions, oral traditions</li>
              <li>Supreme Being: Olodumare, Nyame, etc.</li>
              <li>Attributes: omnipotent, omniscient, etc.</li>
            </ul>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✡️</span>
              <h4 className="text-lg font-bold text-blue-700">Judaism</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Monotheistic, Abrahamic covenant</li>
              <li>Names: Yahweh, Elohim, Adonai</li>
              <li>Attributes: One, eternal, just, merciful</li>
            </ul>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✝️</span>
              <h4 className="text-lg font-bold text-blue-700">Christianity</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Jesus Christ, resurrection</li>
              <li>Names: God, Father, Lord</li>
              <li>Attributes: love, mercy, justice, holiness</li>
            </ul>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☪️</span>
              <h4 className="text-lg font-bold text-blue-700">Islam</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Muhammad, Quran, submission to Allah</li>
              <li>Names: Allah, Al‑Rahman, Al‑Rahim</li>
              <li>Attributes: One, eternal, most gracious</li>
            </ul>
          </div>
        </div>
      ),
      // no aside for revision
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
        // Remove any existing highlight class to restart the animation
        heading.classList.remove('highlight-heading');
        // Force reflow so the animation plays again
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
      {/* Inline styles for highlight animation */}
      <style>{highlightStyles}</style>

      {/* Header */}
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            FAMILY AND RELIGIOUS STUDIES
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Religion</h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the concept of religion, its types and characteristics, and study the major world religions:
            Indigenous, Judaism, Christianity, and Islam.
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

        {/* Footer - Key Takeaways (only on last section) */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Concept:</strong> Religion is a system of beliefs and practices;
                  types include monotheistic, polytheistic, non‑theistic; 10 common characteristics.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Indigenous:</strong> Oldest religions, oral traditions;
                  Supreme Being known by many names (Olodumare, Nyame, etc.);
                  attributes: omnipotent, omniscient, etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Judaism:</strong> Monotheistic, covenant with Abraham;
                  names: Yahweh, Elohim; attributes: one, eternal, just.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Christianity:</strong> Jesus Christ, resurrection;
                  names: God, Father; attributes: love, mercy, justice.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Islam:</strong> Muhammad, Quran;
                  names: Allah, Al‑Rahman; attributes: one, eternal, most gracious.
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