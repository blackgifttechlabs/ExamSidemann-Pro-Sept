// ISO numeric-to-alpha2 dictionary (Runs offline without local server CORS issues)
export const ISO_MAP: Record<string, string> = {
  "004": "af", "008": "al", "012": "dz", "016": "as", "020": "ad", "024": "ao", "028": "ag", "032": "ar",
  "051": "am", "036": "au", "040": "at", "031": "az", "044": "bs", "048": "bh", "050": "bd", "052": "bb",
  "112": "by", "056": "be", "084": "bz", "204": "bj", "064": "bt", "068": "bo", "070": "ba", "072": "bw",
  "076": "br", "096": "bn", "100": "bg", "854": "bf", "108": "bi", "116": "kh", "120": "cm", "124": "ca",
  "140": "cf", "148": "td", "152": "cl", "156": "cn", "170": "co", "174": "km", "178": "cg", "180": "cd",
  "188": "cr", "384": "ci", "191": "hr", "192": "cu", "196": "cy", "203": "cz", "208": "dk", "262": "dj",
  "212": "dm", "214": "do", "218": "ec", "818": "eg", "222": "sv", "226": "gq", "232": "er", "233": "ee",
  "231": "et", "242": "fj", "246": "fi", "250": "fr", "266": "ga", "270": "gm", "268": "ge", "276": "de",
  "288": "gh", "300": "gr", "308": "gd", "320": "gt", "324": "gn", "624": "gw", "328": "gy", "332": "ht",
  "340": "hn", "348": "hu", "352": "is", "356": "in", "360": "id", "364": "ir", "368": "iq", "372": "ie",
  "376": "il", "380": "it", "388": "jm", "392": "jp", "400": "jo", "398": "kz", "404": "ke", "296": "ki",
  "408": "kp", "410": "kr", "414": "kw", "417": "kg", "418": "la", "428": "lv", "422": "lb", "426": "ls",
  "430": "lr", "434": "ly", "438": "li", "440": "lt", "442": "lu", "807": "mk", "450": "mg", "454": "mw",
  "458": "my", "462": "mv", "466": "ml", "470": "mt", "584": "mh", "478": "mr", "480": "mu", "484": "mx",
  "583": "fm", "498": "md", "492": "mc", "496": "mn", "499": "me", "504": "ma", "508": "mz", "104": "mm",
  "516": "na", "520": "nr", "524": "np", "528": "nl", "554": "nz", "558": "ni", "562": "ne", "566": "ng",
  "578": "no", "512": "om", "586": "pk", "585": "pw", "591": "pa", "598": "pg", "600": "py", "604": "pe",
  "608": "ph", "616": "pl", "620": "pt", "634": "qa", "642": "ro", "643": "ru", "646": "rw", "659": "kn",
  "662": "lc", "670": "vc", "882": "ws", "674": "sm", "678": "st", "682": "sa", "686": "sn", "688": "rs",
  "690": "sc", "694": "sl", "702": "sg", "703": "sk", "705": "si", "090": "sb", "706": "so", "710": "za",
  "728": "ss", "724": "es", "144": "lk", "729": "sd", "740": "sr", "748": "sz", "752": "se", "756": "ch",
  "760": "sy", "762": "tj", "834": "tz", "764": "th", "626": "tl", "768": "tg", "776": "to", "780": "tt",
  "788": "tn", "792": "tr", "795": "tm", "798": "tv", "800": "ug", "804": "ua", "784": "ae", "826": "gb",
  "840": "us", "858": "uy", "860": "uz", "548": "vu", "862": "ve", "704": "vn", "887": "ye", "894": "zm", "716": "zw"
};

export interface Monument {
  name: string;
  hint: string;
}

export const MONUMENTS_MAP: Record<string, Monument> = {
  "840": { name: "Statue of Liberty", hint: "Iconic neoclassical copper sculpture on Liberty Island in New York Harbor." },
  "250": { name: "Eiffel Tower", hint: "Wrought-iron lattice tower on the Champ de Mars in Paris." },
  "356": { name: "Taj Mahal", hint: "Ivory-white marble mausoleum on the right bank of the river Yamuna in Agra." },
  "156": { name: "Great Wall of China", hint: "Series of fortifications built along the historical northern borders." },
  "076": { name: "Christ the Redeemer", hint: "Art Deco statue of Jesus Christ overlooking Rio de Janeiro from Mount Corcovado." },
  "818": { name: "Great Pyramid of Giza", hint: "The oldest of the Seven Wonders of the Ancient World, situated on the Giza plateau." },
  "392": { name: "Mount Fuji & Torii Gate", hint: "Sacred active volcano and traditional Shinto gate symbolizing Japan." },
  "380": { name: "Colosseum", hint: "Immense oval amphitheatre situated right in the center of Rome." },
  "036": { name: "Sydney Opera House", hint: "Multi-venue performing arts centre celebrated for its sail-shaped design in Sydney Harbour." },
  "724": { name: "Sagrada Família", hint: "Masterpiece unfinished basilica designed by Antoni Gaudí in Barcelona." },
  "716": { name: "Great Zimbabwe & Victoria Falls", hint: "Ancient stone city ruins and the majestic 'Smoke that Thunders' waterfall." },
  "826": { name: "Big Ben & Stonehenge", hint: "Legendary neo-Gothic clock tower in London and prehistoric stone circle in Wiltshire." },
  "400": { name: "Petra (The Rose City)", hint: "Historical rock-cut city renowned for its water conduit system." },
  "604": { name: "Machu Picchu", hint: "15th-century Inca citadel set high in the Andes Mountains above the Urubamba Valley." },
  "300": { name: "Acropolis of Athens", hint: "Ancient citadel located on a rocky outcrop containing the monumental Parthenon." },
  "710": { name: "Table Mountain", hint: "Flat-topped mountain forming a prominent landmark overlooking Cape Town." },
  "360": { name: "Borobudur", hint: "9th-century Mahayana Buddhist temple in Magelang, Central Java." },
  "792": { name: "Hagia Sophia", hint: "Historic Byzantine and Ottoman wonder with a colossal dome in Istanbul." },
  "764": { name: "Wat Arun (Temple of Dawn)", hint: "Riverside Buddhist temple situated in Bangkok Yai district." },
  "528": { name: "Kinderdijk Windmills", hint: "Famous group of 19 monumental windmills built to keep low-lying areas dry." },
  "756": { name: "Matterhorn", hint: "Iconic near-symmetrical pyramidal peak in the Pennine Alps." },
  "124": { name: "CN Tower & Banff", hint: "Iconic communications tower in Toronto and breathtaking turquoise glacial lakes in Alberta." },
  "484": { name: "Chichen Itza (El Castillo)", hint: "Pre-Columbian step-pyramid built by the Maya civilization in Yucatan." },
  "032": { name: "Iguazu Falls & Perito Moreno", hint: "Breathtaking monumental waterfalls and massive advancing glacier in Patagonia." }
};
