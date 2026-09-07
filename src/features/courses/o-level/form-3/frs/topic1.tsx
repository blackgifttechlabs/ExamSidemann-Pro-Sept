import React, { useState, useRef } from 'react';

/**
 * Topic 1: Religion in Zimbabwe – Rituals, Practitioners and Sacred Places
 * Full component with sticky navigation, aside cards, and auto‑scroll + double‑highlight on heading.
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
      title: 'Concept of Religion – Distribution and Membership',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Geographical and National Distribution of Religions in Zimbabwe">

          <p>
            Zimbabwe is a country with a rich diversity of religious beliefs and practices.
            Different religions are found in different parts of the country, and their distribution
            is influenced by history, migration, and culture. Understanding where people practice
            certain religions helps us see how faith shapes communities.
          </p>

          <h4 className="text-lg font-semibold mt-4">Christianity</h4>
          <ul>
            <li>
              Christianity is the most widely practised religion in Zimbabwe. It is found in all
              provinces and in both urban and rural areas.
            </li>
            <li>
              In urban areas like Harare, Bulawayo, and Mutare, there are many large churches,
              including Roman Catholic, Anglican, Methodist, and Pentecostal denominations.
            </li>
            <li>
              In rural areas, Christianity is also common, often mixed with Indigenous beliefs.
              African Independent Churches (AICs) are particularly strong in rural communities.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Indigenous Religion (African Traditional Religion)</h4>
          <ul>
            <li>
              Indigenous Religion is practised throughout Zimbabwe, but it is especially strong
              in rural areas where traditional customs and ways of life are still preserved.
            </li>
            <li>
              In many rural communities, people follow both Indigenous Religion and Christianity.
              They may go to church on Sunday and also participate in traditional ceremonies.
            </li>
            <li>
              Areas like Masvingo, Matabeleland South, and Manicaland have strong traditional practices.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Islam</h4>
          <ul>
            <li>
              Islam is practised by a smaller but significant number of people in Zimbabwe.
              Muslim communities are found mainly in urban areas.
            </li>
            <li>
              Harare, Bulawayo, and Mutare have Muslim communities with mosques and Islamic schools.
              There are also Muslim communities in towns like Kwekwe and Gweru.
            </li>
            <li>
              Many Muslims in Zimbabwe are of South Asian, Malawian, or Mozambican descent.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Judaism</h4>
          <ul>
            <li>
              Judaism is practised by a very small community in Zimbabwe. The Jewish community
              has historical roots dating back to the early 20th century.
            </li>
            <li>
              Most Jewish people in Zimbabwe live in Harare and Bulawayo, where there are synagogues
              and community centres.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Hinduism and Other Religions</h4>
          <ul>
            <li>
              Hinduism is practised by a small community, mainly of South Asian origin.
              They are mostly found in Harare and Bulawayo, where there are Hindu temples.
            </li>
            <li>
              There are also small communities of Baha'is, Buddhists, and other religious groups in Zimbabwe.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Membership Statistics and Trends">

          <p>
            According to recent estimates, the religious composition of Zimbabwe is roughly as follows:
          </p>
          <ul>
            <li>
              <strong>Christianity:</strong> About 80% – 85% of the population identifies as Christian.
              This includes Roman Catholic, Protestant (Anglican, Methodist, Presbyterian, etc.),
              Pentecostal, and African Independent Churches.
            </li>
            <li>
              <strong>Indigenous Religion:</strong> About 5% – 10% of the population primarily follows
              Indigenous Religion, although many Christians also practise traditional customs.
            </li>
            <li>
              <strong>Islam:</strong> About 1% – 2% of the population is Muslim.
            </li>
            <li>
              <strong>Other religions:</strong> Judaism, Hinduism, Buddhism, and Baha'i make up about 1% – 2%.
            </li>
            <li>
              <strong>No religion:</strong> A small percentage of people (about 1% – 3%) say they have no religion.
            </li>
          </ul>
          <p>
            <strong>Trends:</strong>
          </p>
          <ul>
            <li>
              Pentecostal and charismatic churches are growing rapidly in Zimbabwe,
              especially in urban areas. They attract many young people.
            </li>
            <li>
              African Independent Churches continue to be strong in rural areas.
            </li>
            <li>
              Many people combine Christianity with Indigenous beliefs and practices.
            </li>
            <li>
              There is a growing interest in traditional culture and spirituality among young people.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Distribution Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Christianity:</strong> 80‑85% – all provinces</li>
            <li><strong>IR:</strong> 5‑10% – strong in rural areas</li>
            <li><strong>Islam:</strong> 1‑2% – mainly urban</li>
            <li><strong>Judaism:</strong> small – Harare, Bulawayo</li>
            <li><strong>Trends:</strong> Pentecostal growth, mixing of beliefs</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'indigenous',
      title: 'Indigenous Religion (IR)',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rituals and Myths">


          <h4 className="text-lg font-semibold mt-4">Rituals</h4>
          <p>
            Rituals are ceremonies or actions that people do to connect with the spiritual world.
            In Indigenous Religion, rituals are very important. They help people communicate with
            ancestors and spirits, and they bring the community together.
          </p>
          <ul>
            <li>
              <strong>Kurova Guva (Bringing home the spirit):</strong> This is a ceremony that takes
              place some time after a person has died. It is believed that the spirit of the dead person
              needs to be brought home and welcomed back into the family. The ceremony involves
              offering food and drink to the ancestors and asking them to accept the new spirit.
            </li>
            <li>
              <strong>Bira (Ceremony for ancestors):</strong> A bira is a ceremony to honour the ancestors.
              It involves singing, dancing, drumming, and making offerings of beer and food.
              The purpose is to ask the ancestors for help, protection, or blessings.
            </li>
            <li>
              <strong>Mutoro (Rainmaking ceremony):</strong> This is a ceremony to ask for rain.
              It is especially important in areas where there is drought. The community gathers
              at a sacred place, and traditional leaders pray for rain.
            </li>
            <li>
              <strong>Initiation ceremonies:</strong> Young people are taught about their roles and
              responsibilities in the community. They learn about relationships, marriage, and traditions.
              These ceremonies mark the transition from childhood to adulthood.
            </li>
            <li>
              <strong>Healing rituals:</strong> Traditional healers perform rituals to heal people
              who are sick. These rituals may involve herbs, prayers, and offerings to the ancestors.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Myths</h4>
          <ul>
            <li>
              Myths are traditional stories that explain important things about life and the world.
              They are passed down from generation to generation.
            </li>
            <li>
              <strong>Creation myths:</strong> These stories explain how the world and people were created.
              For example, some myths say that Mwari (the Supreme Being) created the first man and woman.
            </li>
            <li>
              <strong>Myths about ancestors:</strong> Stories about the great deeds of ancestors are
              told to inspire people and teach them values.
            </li>
            <li>
              <strong>Myths about spirits:</strong> Stories about spirits that live in rivers,
              mountains, or trees help explain natural events and teach people to respect nature.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Practitioners and Their Roles">


          <h4 className="text-lg font-semibold mt-4">Spirit Mediums</h4>
          <ul>
            <li>
              Spirit mediums are people who can communicate with the spirits of ancestors.
              They are often chosen by the ancestors themselves.
            </li>
            <li>
              <strong>Role:</strong> They speak on behalf of the ancestors and give guidance to the community.
              They help people understand the cause of problems and suggest solutions.
            </li>
            <li>
              <strong>Famous examples:</strong> Mbuya Nehanda and Sekuru Kaguvi were spirit mediums
              who led the First Chimurenga.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Traditional Healers (N'anga / Sinyanga)</h4>
          <ul>
            <li>
              Traditional healers are people who use herbs, rituals, and spiritual knowledge to heal people.
            </li>
            <li>
              <strong>Role:</strong> They diagnose and treat illnesses, both physical and spiritual.
              They may use plants, animal parts, and minerals to make medicines.
              They also perform rituals to drive away evil spirits.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Chiefs and Elders</h4>
          <ul>
            <li>
              Chiefs and elders are respected leaders in the community. They are the custodians of tradition.
            </li>
            <li>
              <strong>Role:</strong> They preside over important ceremonies and rituals.
              They settle disputes and make decisions for the community.
              They are responsible for preserving the customs and ensuring that people follow the traditions.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Rainmakers</h4>
          <ul>
            <li>
              Rainmakers are people who have special powers to bring rain.
              They are often elders or spirit mediums with deep knowledge of the land and the ancestors.
            </li>
            <li>
              <strong>Role:</strong> They perform rituals to ask the ancestors for rain.
              They are important in areas where rain is needed for farming.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Places and Their Importance">

          <ul>
            <li>
              <strong>Mountains and hills:</strong> Many mountains are considered sacred.
              They are seen as places where ancestors and spirits live. People go to these places
              to pray and make offerings.
              <br />
              <strong>Importance:</strong> They connect people to the spiritual world and remind
              them of their ancestors.
            </li>
            <li>
              <strong>Rivers and water sources:</strong> Rivers are often seen as sacred.
              Water is used for purification and cleansing rituals.
              <br />
              <strong>Importance:</strong> They provide life and are associated with spirits.
            </li>
            <li>
              <strong>Sacred trees:</strong> Trees like the baobab and the mutiti are considered sacred.
              They are believed to be homes to spirits.
              <br />
              <strong>Importance:</strong> They are protected and are places of prayer and offerings.
            </li>
            <li>
              <strong>Graves and burial sites:</strong> The graves of ancestors are sacred places.
              Families visit these places to honour their ancestors.
              <br />
              <strong>Importance:</strong> They connect people to their ancestors and family history.
            </li>
            <li>
              <strong>Shrines:</strong> These are special places where people go to worship and make offerings.
              They may be small structures or just marked areas in nature.
              <br />
              <strong>Importance:</strong> They are the focus of religious ceremonies and community gatherings.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">IR Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rituals:</strong> Kurova Guva, Bira, rainmaking, initiations</li>
            <li><strong>Practitioners:</strong> spirit mediums, healers, chiefs, rainmakers</li>
            <li><strong>Sacred places:</strong> mountains, rivers, trees, graves, shrines</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'judaism',
      title: 'Judaism',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rituals of Judaism">

          <p>
            Jewish rituals are an important part of religious life. They help people connect with God,
            remember their history, and express their faith. Here are some key rituals:
          </p>
          <ul>
            <li>
              <strong>Shabbat (Sabbath):</strong> This is the day of rest, from Friday evening to Saturday evening.
              It is a time for family, prayer, and rest. No work is done on Shabbat.
              Special meals are prepared, and candles are lit.
            </li>
            <li>
              <strong>Passover (Pesach):</strong> This is a festival that remembers the Exodus from Egypt.
              Jews eat unleavened bread (matzah) and hold a special meal called a Seder.
            </li>
            <li>
              <strong>Rosh Hashanah:</strong> This is the Jewish New Year. It is a time for reflection
              and repentance. The shofar (ram's horn) is blown in the synagogue.
            </li>
            <li>
              <strong>Yom Kippur:</strong> This is the Day of Atonement. It is the holiest day of the year.
              Jews fast and pray for forgiveness for their sins.
            </li>
            <li>
              <strong>Bar Mitzvah and Bat Mitzvah:</strong> These are ceremonies that mark when a Jewish boy
              (at age 13) or girl (at age 12) becomes an adult in the religious community.
              They read from the Torah for the first time.
            </li>
            <li>
              <strong>Circumcision (Bris):</strong> A ceremony where a baby boy is circumcised on the eighth day
              after birth, as a sign of the covenant with Abraham.
            </li>
            <li>
              <strong>Marriage:</strong> A wedding ceremony that includes the signing of a marriage contract
              (ketubah) and the breaking of a glass.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Practitioners and Their Roles">


          <h4 className="text-lg font-semibold mt-4">Rabbi</h4>
          <ul>
            <li>
              A rabbi is a teacher and leader of a Jewish community. The word "rabbi" means "my teacher".
            </li>
            <li>
              <strong>Role:</strong> They lead services in the synagogue, teach about Jewish law and tradition,
              and provide guidance to the community. They also perform ceremonies like weddings and funerals.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Cantor (Hazzan)</h4>
          <ul>
            <li>
              A cantor is a person who leads the congregation in prayer through singing and chanting.
            </li>
            <li>
              <strong>Role:</strong> They lead the musical parts of the service and help people to pray.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Gabbai</h4>
          <ul>
            <li>
              A gabbai is a person who assists in the running of the synagogue.
            </li>
            <li>
              <strong>Role:</strong> They help organise services, call people up to read the Torah,
              and help keep order in the congregation.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Mohel</h4>
          <ul>
            <li>
              A mohel is a person trained in the practice of circumcision.
            </li>
            <li>
              <strong>Role:</strong> They perform the circumcision ceremony (bris) on the eighth day
              after a baby boy is born.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Places">

          <ul>
            <li>
              <strong>Synagogue:</strong> This is the Jewish place of worship. It is a place for prayer,
              study, and community gatherings. It usually contains an Ark where the Torah scrolls are kept.
              <br />
              <strong>Importance:</strong> It is the centre of Jewish community life.
            </li>
            <li>
              <strong>Temple:</strong> In ancient times, the Temple in Jerusalem was the most sacred place
              for Jews. It was destroyed twice. Today, the Western Wall (Kotel) in Jerusalem is a very
              sacred site where people come to pray.
              <br />
              <strong>Importance:</strong> It is a symbol of God's presence and a connection to Jewish history.
            </li>
            <li>
              <strong>Home:</strong> The home is considered a sacred place in Judaism. Many rituals,
              like the Shabbat meal and Passover Seder, are celebrated at home.
              <br />
              <strong>Importance:</strong> It is where family and faith come together.
            </li>
            <li>
              <strong>Western Wall:</strong> A retaining wall of the ancient Temple in Jerusalem.
              It is the holiest place where Jews are allowed to pray.
              <br />
              <strong>Importance:</strong> It is a symbol of Jewish survival and a place of pilgrimage.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Judaism Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rituals:</strong> Shabbat, Passover, Yom Kippur, Bar/Bat Mitzvah</li>
            <li><strong>Practitioners:</strong> Rabbi, Cantor, Gabbai, Mohel</li>
            <li><strong>Sacred places:</strong> Synagogue, Western Wall, home</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'christianity',
      title: 'Christianity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rituals of Christianity">

          <p>
            Christian rituals help believers express their faith and remember important events.
            There are two main types of rituals: the sacraments and other practices.
          </p>

          <h4 className="text-lg font-semibold mt-4">Sacraments</h4>
          <ul>
            <li>
              <strong>Baptism:</strong> This is a ceremony where a person is initiated into the Christian faith.
              It usually involves water being poured on the head or full immersion in water.
              It symbolises spiritual cleansing and being born again.
            </li>
            <li>
              <strong>Eucharist (Holy Communion):</strong> This is a ceremony where Christians eat bread
              and drink wine (or grape juice) in remembrance of Jesus' last supper.
              The bread represents Jesus' body, and the wine represents His blood.
            </li>
            <li>
              <strong>Confirmation:</strong> This is a ceremony where a person confirms their faith
              and becomes a full member of the church.
            </li>
            <li>
              <strong>Marriage:</strong> A ceremony where a man and woman are joined together as husband and wife.
            </li>
            <li>
              <strong>Confession (Reconciliation):</strong> A ceremony where a person confesses their sins
              to God and receives forgiveness.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Other Rituals</h4>
          <ul>
            <li>
              <strong>Prayer:</strong> Christians pray to God to give thanks, ask for help, and seek guidance.
              Prayer can be done individually or in groups.
            </li>
            <li>
              <strong>Worship services:</strong> These are gatherings where Christians sing hymns,
              listen to sermons, pray, and take communion.
            </li>
            <li>
              <strong>Fasting:</strong> Some Christians fast (abstain from food) for spiritual reasons,
              especially during Lent.
            </li>
            <li>
              <strong>Easter:</strong> The most important Christian festival, celebrating the resurrection of Jesus.
            </li>
            <li>
              <strong>Christmas:</strong> The festival celebrating the birth of Jesus.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Practitioners and Their Roles">


          <h4 className="text-lg font-semibold mt-4">Priest / Pastor</h4>
          <ul>
            <li>
              A priest or pastor is a religious leader who leads a church. The term "pastor" is often used
              in Protestant churches, while "priest" is used in Catholic and Orthodox churches.
            </li>
            <li>
              <strong>Role:</strong> They lead worship services, preach sermons, and provide spiritual
              guidance to their congregation. They also perform ceremonies like baptisms, weddings,
              and funerals.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Bishop</h4>
          <ul>
            <li>
              A bishop is a senior leader who oversees a group of churches (a diocese) in some Christian traditions.
            </li>
            <li>
              <strong>Role:</strong> They lead the church, ordain priests, and guide the church's teachings.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Deacon</h4>
          <ul>
            <li>
              A deacon is a person who serves the church in practical ways, helping the priest or pastor.
            </li>
            <li>
              <strong>Role:</strong> They assist with worship services, visit the sick, and help with
              church administration and charity work.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Elder</h4>
          <ul>
            <li>
              An elder is a leader in some Protestant churches, helping to guide the church spiritually
              and practically.
            </li>
            <li>
              <strong>Role:</strong> They share leadership with the pastor, help make decisions for the church,
              and provide pastoral care.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Prophet / Evangelist</h4>
          <ul>
            <li>
              These are people who have special gifts of preaching, teaching, or prophecy.
            </li>
            <li>
              <strong>Role:</strong> They spread the Christian message and encourage believers.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Places">

          <ul>
            <li>
              <strong>Church:</strong> This is the main place of worship for Christians. It is where services
              are held, prayers are offered, and believers gather.
              <br />
              <strong>Importance:</strong> It is a sacred space for worship, fellowship, and community.
            </li>
            <li>
              <strong>Cathedral:</strong> A large church that is the seat of a bishop.
              <br />
              <strong>Importance:</strong> It is a centre of religious authority and a place of pilgrimage.
            </li>
            <li>
              <strong>Jerusalem:</strong> This is a sacred city for Christians because it is where Jesus
              lived, died, and rose from the dead.
              <br />
              <strong>Importance:</strong> It is a holy place of pilgrimage.
            </li>
            <li>
              <strong>Bethlehem:</strong> The town where Jesus was born.
              <br />
              <strong>Importance:</strong> It is a place of pilgrimage, especially at Christmas.
            </li>
            <li>
              <strong>Home:</strong> For many Christians, the home is also a place of prayer and worship,
              where families pray together.
              <br />
              <strong>Importance:</strong> It is where faith is lived daily.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Christianity Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rituals:</strong> Baptism, Eucharist, Prayer, Easter, Christmas</li>
            <li><strong>Practitioners:</strong> Pastor/Priest, Bishop, Deacon, Elder</li>
            <li><strong>Sacred places:</strong> Church, Cathedral, Jerusalem, Bethlehem</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'islam',
      title: 'Islam',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rituals of Islam">

          <p>
            Islamic rituals are acts of worship that help Muslims express their submission to Allah.
            The most important rituals are known as the Five Pillars of Islam.
          </p>

          <h4 className="text-lg font-semibold mt-4">The Five Pillars of Islam</h4>
          <ul>
            <li>
              <strong>Shahada (Declaration of faith):</strong> This is the statement that "There is no god
              but Allah, and Muhammad is His messenger." This is the most important ritual, as it marks
              a person's acceptance of Islam.
            </li>
            <li>
              <strong>Salah (Prayer):</strong> Muslims pray five times a day – at dawn, noon, afternoon,
              sunset, and night. They face Mecca and recite verses from the Quran. Prayer can be done
              alone or in a mosque.
            </li>
            <li>
              <strong>Zakat (Charity):</strong> Muslims give a portion of their wealth to those in need.
              This is usually 2.5% of their savings. It is a way of purifying wealth and helping the poor.
            </li>
            <li>
              <strong>Sawm (Fasting during Ramadan):</strong> During the month of Ramadan, Muslims fast
              from dawn to sunset. They do not eat, drink, or engage in certain activities. Fasting is
              a time for spiritual reflection and self‑discipline.
            </li>
            <li>
              <strong>Hajj (Pilgrimage to Mecca):</strong> Every Muslim who is physically and financially
              able is expected to make a pilgrimage to Mecca at least once in their lifetime.
              The Hajj takes place during the Islamic month of Dhul‑Hijjah.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Other Rituals</h4>
          <ul>
            <li>
              <strong>Eid al‑Fitr:</strong> This is the festival that marks the end of Ramadan. It is a day
              of celebration with prayer, feasting, and giving gifts.
            </li>
            <li>
              <strong>Eid al‑Adha:</strong> This is the festival that marks the end of the Hajj.
              It commemorates Abraham's willingness to sacrifice his son. Animals are slaughtered,
              and the meat is shared with the poor.
            </li>
            <li>
              <strong>Jumu'ah (Friday prayer):</strong> This is a special prayer that takes place on
              Friday afternoons. Muslims gather at the mosque to listen to a sermon and pray together.
            </li>
            <li>
              <strong>Dua (Personal prayer):</strong> Muslims can make personal prayers to Allah at any time,
              asking for help, forgiveness, or guidance.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Religious Practitioners and Their Roles">


          <h4 className="text-lg font-semibold mt-4">Imam</h4>
          <ul>
            <li>
              An imam is a prayer leader in a mosque. The word "imam" means "leader".
            </li>
            <li>
              <strong>Role:</strong> They lead the prayers, give sermons (khutbah) on Fridays,
              and provide spiritual guidance to the community. They may also teach the Quran and
              Islamic studies.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Mufti</h4>
          <ul>
            <li>
              A mufti is a scholar who is qualified to give legal opinions (fatwas) on Islamic law.
            </li>
            <li>
              <strong>Role:</strong> They interpret Islamic law and give rulings on issues that Muslims
              face in daily life.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Qadi (Judge)</h4>
          <ul>
            <li>
              A qadi is a judge who presides over Islamic courts.
            </li>
            <li>
              <strong>Role:</strong> They settle disputes according to Islamic law.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Muezzin</h4>
          <ul>
            <li>
              A muezzin is the person who calls the faithful to prayer (adhan).
            </li>
            <li>
              <strong>Role:</strong> They recite the call to prayer from the mosque's minaret.
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">Scholar (Alim)</h4>
          <ul>
            <li>
              A scholar is a person who has studied Islamic religion and law.
            </li>
            <li>
              <strong>Role:</strong> They teach the community about Islam and help people understand
              religious teachings.
            </li>
          </ul>

          
          </SubtopicCard>

          <SubtopicCard title="Sacred Places">

          <ul>
            <li>
              <strong>Mosque (Masjid):</strong> This is the Islamic place of worship. It is a place
              for prayer, study, and community gatherings.
              <br />
              <strong>Importance:</strong> It is a sacred space where Muslims connect with Allah and
              with each other.
            </li>
            <li>
              <strong>The Kaaba:</strong> This is a cube‑shaped building in the centre of the Great Mosque
              in Mecca. It is the most sacred site in Islam. Muslims face the Kaaba during their prayers.
              <br />
              <strong>Importance:</strong> It is the house of Allah and the spiritual centre of Islam.
            </li>
            <li>
              <strong>Medina:</strong> This is the second holiest city in Islam. It is where Muhammad
              migrated and where he is buried.
              <br />
              <strong>Importance:</strong> It is a place of pilgrimage and a centre of Islamic learning.
            </li>
            <li>
              <strong>Jerusalem:</strong> This city is also sacred for Muslims, particularly the Al‑Aqsa Mosque,
              which is the third holiest site in Islam.
              <br />
              <strong>Importance:</strong> It is associated with important events in Islamic history.
            </li>
          </ul>
        
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-blue-700">Islam Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rituals:</strong> Five Pillars – Shahada, Salah, Zakat, Sawm, Hajj</li>
            <li><strong>Practitioners:</strong> Imam, Mufti, Qadi, Muezzin, Scholar</li>
            <li><strong>Sacred places:</strong> Mosque, Kaaba, Medina, Jerusalem</li>
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
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Religion in Zimbabwe – Rituals, Practitioners and Sacred Places</h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the geographical distribution of religions in Zimbabwe, their rituals,
            religious practitioners and their roles, and the sacred places that are important
            to each faith.
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
                  <strong className="text-white">Distribution:</strong> Christianity is the largest religion (80‑85%),
                  followed by Indigenous Religion (5‑10%), Islam (1‑2%), and small communities of Judaism,
                  Hinduism, and others.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Indigenous Religion:</strong> Rituals include Kurova Guva,
                  Bira, and rainmaking; practitioners include spirit mediums, healers, chiefs, and rainmakers;
                  sacred places include mountains, rivers, and sacred trees.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Judaism:</strong> Rituals include Shabbat, Passover, Yom Kippur,
                  and Bar/Bat Mitzvah; practitioners include rabbis, cantors, and mohels;
                  sacred places include the synagogue, Western Wall, and home.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Christianity:</strong> Rituals include Baptism, Eucharist,
                  prayer, Easter, and Christmas; practitioners include pastors/priests, bishops, deacons,
                  and elders; sacred places include churches, cathedrals, Jerusalem, and Bethlehem.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Islam:</strong> Rituals include the Five Pillars (Shahada,
                  Salah, Zakat, Sawm, Hajj), Eid celebrations, and Friday prayers; practitioners include imams,
                  muftis, qadis, and muezzins; sacred places include mosques, the Kaaba, Medina, and Jerusalem.
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
              <>Ready to move on to <span className="text-blue-600">Topic 5</span>?</>
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
                alert('Proceed to Topic 5 (not implemented in this demo)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Topic 5 →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default topic1;