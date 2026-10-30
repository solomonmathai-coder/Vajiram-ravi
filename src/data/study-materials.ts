/** Free study material: the current affairs articles of each exam stage, and the other free resources. */

export type Article = { title: string; href: string };

export type StudyStage = {
  id: "prelims" | "mains" | "quest";
  label: string;
  /** The first article is the featured card; the rest make the numbered list beside it. */
  articles: Article[];
  /** "View more" under the list. */
  moreHref: string;
};

/**
 * The design only shows the Mains articles. The Prelims and Quest titles carry over from the
 * previous homepage until the client supplies the pieces for those tabs.
 */
export const studyStages: StudyStage[] = [
  {
    id: "prelims",
    label: "Prelims",
    moreHref: "#",
    articles: [
      { title: "United Kingdom Maritime Trade Operations (UKMTO)", href: "#" },
      { title: "Mauritius", href: "#" },
      { title: "Narwhals", href: "#" },
      { title: "Thiksey Monastery", href: "#" },
      { title: "Long Tailed Marmot", href: "#" },
      { title: "Squint Eye", href: "#" },
    ],
  },
  {
    id: "mains",
    label: "Mains",
    moreHref: "#",
    articles: [
      { title: "Mobile Phone Manufacturing Scheme (MPMS) – From Assembly Hub to Indian-Owned Brands", href: "#" },
      { title: "US–India Trade Tensions: The Great Transhipment Scam and Tariff Allegations", href: "#" },
      { title: "U.S.–India Electoral Systems: Trump’s Voting ID Rules and the SAVE America Act", href: "#" },
      { title: "NITI Aayog Report Flags Large Gap Between Education and Employment for Indian Youth", href: "#" },
      { title: "India’s Sugar Price Hike: Causes, Government Response and the Ethanol Debate", href: "#" },
      { title: "Census 2027 Questionnaire – New Questions, NPR Link and Concerns Over Data Collection", href: "#" },
    ],
  },
  {
    id: "quest",
    label: "Quest",
    moreHref: "#",
    articles: [
      { title: "UN Reforms, Need, Security Council, General Assembly, Challenges", href: "#" },
      { title: "World Meteorological Organization (WMO), Headquarters, Members", href: "#" },
      { title: "Article 21, Rights, Doctrines, Challenges, Case Laws, Way Forward", href: "#" },
      { title: "Reserve Bank of India (RBI), Governor, Structure, Functions", href: "#" },
      { title: "Federalism in Indian Polity, Significance, Features", href: "#" },
      { title: "Muslim League, Background, Formation, Objectives, Impacts", href: "#" },
    ],
  },
];

/** Mains opens first: it carries the Current Affairs pieces. */
export const defaultStage: StudyStage["id"] = "mains";

/** Which little cover illustration a resource tile draws. */
export type ResourceArt = "magazine" | "yojana" | "papers" | "answer-sheet" | "essay";

export type FreeResource = { label: string; href: string; art: ResourceArt };

export const otherResources: FreeResource[] = [
  { label: "Monthly magazine", href: "#", art: "magazine" },
  { label: "Yojana & Kurukshetra", href: "#", art: "yojana" },
  { label: "Previous year papers", href: "#", art: "papers" },
  { label: "Toppers’ answer sheets", href: "#", art: "answer-sheet" },
  { label: "Essay practice", href: "#", art: "essay" },
];
