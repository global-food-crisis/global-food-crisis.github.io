// English dictionary — all user-facing copy for the Global Food Crisis site.
// The shape of this object defines the Dictionary type; zh-TW must match it.

export const en = {
  meta: {
    htmlLang: "en",
    siteTitle: "Global Food Crisis — Chapter 01: The World Has Food. Why Does Hunger Persist?",
    siteDescription:
      "An open, evidence-based interactive story about global hunger: its scale, geography, causes, trends and what one person can do. Data from FAO, WFP, IPC and UNEP.",
  },
  nav: {
    skipToContent: "Skip to main content",
    wordmarkTop: "Global Food Crisis",
    wordmarkBottom: "Chapter 01",
    chapters: [
      "The Question",
      "The Scale",
      "The Geography",
      "The Causes",
      "The Trend",
      "The Action",
    ],
    chapterLabels: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"],
    langSwitchLabel: "Language",
    langCurrent: "English",
    langOther: "繁體中文",
    langSwitchAria: "Switch language",
    navAria: "Chapter navigation",
    navScrollPrev: "Scroll to earlier chapters",
    navScrollNext: "Scroll to later chapters",
  },
  common: {
    sourceLabel: "Source",
    yearLabel: "Year",
    refYear: "reference year",
    retrievedLabel: "Data retrieved",
    retrievedDate: "2026-10-15",
    learnMore: "Learn more",
    expand: "Show methodology and limitations",
    collapse: "Hide methodology and limitations",
    loadingChart: "Loading data…",
    loadingMap: "Loading map…",
    errorTitle: "Could not load data",
    errorBody: "This visualization could not be loaded. Your connection may be offline, or the data file may be unavailable.",
    retry: "Try again",
    noData: "No data",
    chartAriaFallback: "Interactive chart. A data table is available below.",
    // Interaction-hint verbs — chosen at runtime by input modality
    // (touch → tap, mouse → hover, hybrid → both).
    hintVerbTap: "Tap",
    hintVerbHover: "Hover over",
    hintVerbBoth: "Tap or hover over",
    millionPeople: "million people",
    hundredMillionPeople: "hundred million people",
    tenThousandPeople: "ten thousand people",
    countriesUnit: "countries",
  },
  ch1: {
    kicker: "An open, evidence-based data story",
    title: "The World Has Food. Why Does Hunger Persist?",
    lede:
      "The world grows more calories than its people need — yet hundreds of millions still go hungry. This is not primarily a story of scarcity. It is a story of access: of conflict, poverty, climate shocks and prices that stand between food and the people who need it — and global average abundance can coexist with severe local shortages.",
    heroStatValue: "645 million",
    heroStatUnit: "people",
    heroStatDetail: "faced hunger in 2025 — an estimated 7.8% of the world's population (FAO range: 608–696 million; the latest-year estimate includes nowcasting)",
    heroStatSource: "FAO, IFAD, UNICEF, WFP & WHO — The State of Food Security and Nutrition in the World 2026 (SOFI 2026)",
    heroStatNote:
      "Three consecutive years of improvement, and still roughly one person in thirteen. Nearly 14 million fewer people than in 2024; 43 million fewer than at the 2022 peak.",
    fact2Value: "3,016 kcal",
    fact2Unit: "per person, per day",
    fact2Detail:
      "average dietary energy available in the world's food supply in 2023 — more than enough, on paper, for everyone",
    fact2Source: "FAO Food Balance Sheets",
    p1Title: "Food exists. Access does not.",
    p1:
      "Dietary energy supply measures what reaches a country's markets and households, before waste and before the question of who can afford it. Averaged across the planet it has passed 3,000 kilocalories per person per day. Yet averages hide distribution, and availability is not affordability. A market can be full while a family's pockets are empty.",
    p2:
      "Hunger in the 2020s is rarely caused by the world running out of food. It is caused by war that blocks farms and aid, by incomes too small to buy what is on sale, by droughts and floods that erase harvests, and by price spikes that price the poorest out first. Those causes can be measured, understood and addressed — which is why this story exists.",
    p3:
      "This is Chapter 01 of an open project. It walks through four questions: how large hunger is, where it lives, why it persists, and whether the world is making progress — ending with what one person can realistically do. Every statistic on this page carries its source, its reference year and its caveats.",
    scrollCue: "Scroll to explore",
  },
  ch2: {
    kicker: "Chapter 2 — The Scale",
    title: "How many people are affected — and what are we counting?",
    lede:
      "'Hunger' is one word hiding several different measurements. Confusing them leads to double counting and bad comparisons. These four indicators answer different questions, use different methods and cover different populations.",
    indicators: [
      {
        id: "chronic",
        name: "Hunger / undernourishment",
        shortDef: "Not enough calories, habitually, for an active and healthy life.",
        value: "645 million",
        unit: "people, 2025 (7.8% of the world population)",
        sourceName: "SOFI 2026 (FAO et al.)",
        sourceUrl: "https://www.fao.org/newsroom/detail/sofi-2026--hunger-not-inevitable--fao-says-as-global-hunger-report-shows-progress/en",
        definition:
          "The formal UN measure of 'hunger' is the prevalence of undernourishment (SDG indicator 2.1.1): the share of people whose habitual food consumption does not provide enough dietary energy for a normal, active, healthy life.",
        methodology:
          "A modeled estimate. FAO combines national food supply data (Food Balance Sheets) with information on food distribution and population to estimate the distribution of dietary energy intake. Because it depends on annual supply statistics, the estimate lags by about a year and is revised each year as new data arrive.",
        limitations:
          "Counts dietary energy only — not the quality or diversity of diets. A country can show low undernourishment while micronutrient deficiencies ('hidden hunger') remain widespread. For many countries with very low prevalence, FAO simply reports 'below 2.5%'.",
      },
      {
        id: "fies",
        name: "Moderate or severe food insecurity",
        shortDef: "People reporting limited, uncertain or inadequate access to food.",
        value: "2.1 billion",
        unit: "people, 2025 (about one in four worldwide)",
        sourceName: "SOFI 2026 (FIES-based estimate)",
        sourceUrl: "https://www.fao.org/newsroom/detail/sofi-2026--hunger-not-inevitable--fao-says-as-global-hunger-report-shows-progress/en",
        definition:
          "For the annual SDG estimate, the Food Insecurity Experience Scale (SDG indicator 2.1.2) measures resource-related difficulties in accessing food over the previous 12 months, using eight questions and a calibrated severity scale. Moderate food insecurity involves compromises in diet quality and/or quantity; severe food insecurity can include running out of food and going a whole day without eating. A single answer does not determine a person's classification.",
        methodology:
          "Derived from survey interviews (via the Gallup World Poll and national surveys) in more than 150 countries, then scaled into national prevalence estimates using statistical models.",
        limitations:
          "Self-reported experience, so it captures dimensions that supply data miss — but it is a survey estimate with sampling uncertainty, and the 'severe' end overlaps, without being identical to, undernourishment. Roughly 86 million fewer people than in 2024.",
      },
      {
        id: "acute",
        name: "Acute food insecurity (IPC/CH Phase 3+)",
        shortDef: "People facing acute food insecurity at each context's assessed 2025 peak — 47 countries/territories, not a simultaneous global count.",
        value: "266 million",
        unit: "people, 2025 — in 47 monitored food-crisis countries (22.9% of their analysed populations)",
        sourceName: "Global Report on Food Crises 2026 (GNAFC)",
        sourceUrl: "https://www.fightfoodcrises.net/global-report-food-crises",
        definition:
          "A different lens: not a person's chronic condition but a population's current crisis. IPC Phase 3 (Crisis) includes households with food consumption gaps, or households able to meet minimum food needs only by depleting essential livelihood assets or using crisis coping strategies. Phase 4 (Emergency) reflects still larger gaps and acute malnutrition. Household Phase 5 is Catastrophe; area-level Famine requires additional evidence on malnutrition and mortality.",
        methodology:
          "Consensus country assessments under the IPC / Cadre Harmonisé frameworks, compiled by 18 partner organizations. In 2025 this included 39.1 million people in Phase 4 (Emergency) and 1.4 million in Phase 5 (Catastrophe).",
        limitations:
          "Only food-crisis countries are assessed — so this number is NOT a world total and must never be added to the 645 million chronic measure. Coverage changes year to year: 47 countries had comparable data in 2025, the lowest in a decade, partly because the crises themselves disrupt data collection.",
      },
      {
        id: "famine",
        name: "Famine (IPC Phase 5)",
        shortDef: "The most severe classification — starvation and death already evident.",
        value: "2",
        unit: "area-level Famine classifications in 2025 — parts of the Sudan and Gaza Governorate (Gaza Strip); the first time two contexts were affected in one year in the GRFC's ten-year reporting history — not entire countries or territories",
        sourceName: "IPC Famine Facts",
        sourceUrl: "https://www.ipcinfo.org/famine-facts/en",
        definition:
          "Famine is an area-level IPC Phase 5 classification, based on converging evidence of extreme food deprivation, acute malnutrition and excess mortality. The applicable malnutrition thresholds depend on the measurement method, and all Famine classifications are reviewed by the IPC Famine Review Committee. Household Phase 5 (Catastrophe) does not by itself establish area-level Famine; 'risk of Famine' is a separate assessment.",
        methodology:
          "A Famine Review Committee of independent experts must validate the evidence before Famine is declared. Since 2010, famine has been confirmed on six occasions: Somalia (2011), South Sudan (2017 and 2020), the Sudan (2024 and 2025) and the Gaza Strip (2025).",
        limitations:
          "The bar is deliberately high, which means recognition often comes late — and the places where evidence is hardest to gather (active war zones) are precisely where famine is most likely to occur.",
      },
    ],
    neverAddTitle: "Why these numbers must never be added together",
    defLabel: "Definition",
    metLabel: "How it is measured",
    limLabel: "Limitations",
    neverAddBody:
      "The 645 million, the 2.1 billion and the 266 million measure different things, in different places, with different methods — and the same person can be counted in more than one of them. These are population estimates, not named registers: their totals cannot show how many people are counted twice, and no one measure is a strict subset of another. Adding them together double-counts and mixes incompatible definitions. Each number answers its own question — and each question matters.",
    diagramTitle: "Two different yardsticks",
    diagramChronicAxis: "PoU & FIES — habitual deficiency and experienced access",
    diagramAcuteAxis: "Acute — how populations are hit by shocks",
    diagramChronicDesc:
      "Undernourishment (PoU) models habitual dietary-energy deficiency; FIES measures experienced access to food (12-month reference period in the annual estimate). Both cover the whole world, every year.",
    diagramAcuteDesc:
      "IPC/CH phases track current crisis severity, only in assessed food-crisis countries, and change with each shock.",
    popNote:
      "In 2025, an estimated 35.5 million children aged 6–59 months were acutely malnourished across 23 countries/territories classified as nutrition crises, including 9.7 million with severe acute malnutrition. This is a separate measurement again — focused on children's nutrition rather than food access.",
    popNoteSource: "GRFC 2026",
    popNoteSourceUrl:
      "https://www.fightfoodcrises.net/global-report-food-crises",
  },
  ch3: {
    kicker: "Chapter 3 — The Geography",
    title: "Hunger is not equally distributed",
    lede:
      "The global average of 7.8% conceals a world of extremes. Africa now carries more undernourished people than any other continent: about 309 million in 2025, surpassing Asia's 292 million for the first time. One continent's crisis is not another's trend.",
    mapTitle: "Prevalence of undernourishment, share of population",
    mapSubtitle: "Archived FAO/OWID country estimates (downloaded 15 October 2026) — most rows carry the 2023 label; country values are three-year averages",
    chartsIntro:
      "The charts in this story are interactive — {verb} any point, bar or country to read its exact values. Start with the map below.",
    mapHint:
      "{verb} a country to see its latest value; click or tap a country to pin its details in the panel below.",
    legendTitle: "Share of population undernourished",
    searchLabel: "Find a country",
    searchPlaceholder: "Type a country name…",
    searchNoResults: "No matching country with data.",
    selectedPanelTitle: "Selected",
    tooltipIndicator: "Prevalence of undernourishment",
    tooltipBelow: "below 2.5% — FAO's reporting floor for very low values, not an exact measurement",
    tooltipNoData: "No recent assessment",
    tooltipStale: "Latest assessment: {year} — too old to display on the map",
    tooltipSource: "FAO (SDG 2.1.1) via Our World in Data",
    clearSelection: "Clear selection",
    panelBelow: "<2.5%",
    panelStaleArchived:
      "Archived estimate: {value} in {year} — too old to display as a current value",
    regionTitle: "The regional picture (2025)",
    regionAfrica: "Africa",
    regionAfricaValue: "309 million people — 20.0% of the population",
    regionAfricaNote:
      "Prevalence fell for the first time since 2017 (from 20.3% in 2024), but population growth keeps the absolute number near record levels.",
    regionAsia: "Asia",
    regionAsiaValue: "292 million people — 6.0% of the population (2025, SOFI 2026)",
    regionAsiaNote:
      "Asia drove most of the world's recent improvement, especially Southern Asia; its prevalence is now well under half of Africa's.",
    regionWorld: "World",
    regionWorldValue: "645 million people — 7.8%",
    tableCaption: "All countries with data — the accessible alternative to the map",
    tableCountry: "Country",
    tableValue: "Undernourished (%)",
    tableYear: "Year",
    tableStaleNote: "No recent assessment (latest: {year})",
    tableBelow: "below 2.5%",
    tableSearchPlaceholder: "Filter countries…",
    sortByValue: "Sort by value",
    sortByName: "Sort by name",
    tableArchivedNote:
      "† Archived estimate — too old to be read as current conditions; kept in this table for transparency and not colored on the map as a current value.",
    notesTitle: "Reading this map honestly",
    notes: [
      "Map area is not people. A large country shaded lightly can hold more undernourished people than a small one shaded dark. The table above shows country values — the 2025 regional totals come from SOFI 2026.",
      "Some countries are too small to draw at this map resolution (Barbados, Macao, Malta, Seychelles). They carry data and appear in the table, just not as visible shapes.",
      "Grey means 'no recent assessment', not 'no hunger'. The Sudan's latest chronic estimate (11.0% in 2021, from the archived series) predates the April 2023 war, so the map shows it as 'no recent assessment' rather than a current value; its current crisis appears in the acute-food-insecurity figures of Chapters 2 and 4 (see the separately dated IPC assessments).",
      "Most country values carry the 2023 label of the archived FAO/OWID series (downloaded 15 October 2026; OWID republishes the FAO 2025 edition, updated 2026-02-25). Country estimates are three-year averages — unlike the annual global and regional estimates — and the download date is not the statistical reference period. The world and regional figures quoted elsewhere refer to 2025 (SOFI 2026); different vintages are labeled, never mixed.",
    ],
  },
  ch4: {
    fpiSourceName: "FAO — World Food Situation, Food Price Index",
    fpiSourceUrl: "https://www.fao.org/worldfoodsituation/FoodPricesIndex/en",
    kicker: "Chapter 4 — The Causes",
    title: "Why does hunger persist?",
    lede:
      "No single cause explains hunger. Households are pushed into food insecurity by overlapping shocks — war, weather, prices, poverty — sitting on structural weaknesses: thin markets, weak infrastructure, few safety nets. The Global Report on Food Crises attributes one primary driver per country; in reality, drivers compound each other.",
    driversChartTitle: "What drove acute food insecurity in 2025?",
    driversHint: "{verb} a bar to see the people affected and the country count.",
    driversChartNote:
      "These figures group crisis populations by the primary driver assigned to each country context. They sum to 264.7 million, slightly below the 265.7 million overall total: GRFC excludes separately assessed displaced groups from this breakdown when their primary driver differs, to avoid double counting. The categories describe country-level attribution, not exclusive individual causes — drivers co-occur, and 31 countries reported economic shocks as an additional driver. Primary-driver populations must not be added to other indicators.",
    causes: [
      {
        id: "conflict",
        title: "Conflict and insecurity",
        headline: "147.4 million people — the primary driver in 19 countries",
        body1:
          "Conflict remained the largest single driver of acute food insecurity in 2025: 19 countries and territories, home to 147.4 million acutely food-insecure people — over half of the total GRFC reports for the assessed crisis contexts. Six of the ten largest food crises were conflict-driven, and conflict was the primary driver for almost every population in Catastrophe (IPC Phase 5).",
        body2:
          "War causes hunger without food disappearing: farms are abandoned, markets are cut off, currencies collapse, aid convoys are blocked, and people flee. 'Hunger is increasingly being used as a weapon of war,' the UN Secretary-General wrote in the foreword to the 2026 Global Report on Food Crises — which recorded, for the first time, outright famine emerging in two conflict-affected areas in the same year.",
        caseTitle: "Case: Sudan — famine amid a forgotten war",
        caseBody:
          "Since civil war broke out in April 2023, Sudan has become one of the largest food crises in the world. By May 2025, more than half the population — around 25 million people — faced Crisis or worse (IPC Phase 3+). In September 2025 the IPC confirmed Famine in the besieged towns of El Fasher and Kadugli, with a risk of further spread across Darfur and Kordofan.",
        caseSource: "GRFC 2026; IPC Famine Review Committee",
        case2Title: "Case: Gaza — famine confirmed, then pushed back",
        case2Body:
          "In August 2025, after 22 months of siege and displacement, the IPC confirmed Famine in the Gaza Governorate. A ceasefire and scaled-up aid allowed that classification to be pushed back by December 2025 — a reminder that famine is man-made and reversible, but also how quickly it returns when access is denied.",
        case2Source: "IPC Global Initiative; WHO (Dec 2025)",
        caveat:
          "Correlation is not causation: not every conflict produces famine, and the mechanism runs through measurable channels — displacement, destroyed supply routes, blockaded aid. Where those channels are absent, food usually still reaches markets. Where they operate, even abundant local production may not protect a population.",
        sources: [
          { name: "GRFC 2026 — full report (PDF)", url: "https://www.fightfoodcrises.net/global-report-food-crises" },
          { name: "IPC — Famine Facts", url: "https://www.ipcinfo.org/famine-facts/en" },
        ],
      },
      {
        id: "poverty",
        title: "Poverty and food affordability",
        headline: "About 2.7 billion people could not afford a healthy diet in 2025",
        body1:
          "The world does not merely need calories to exist — people need to be able to buy them. Nearly one in three people on Earth could not afford a healthy diet in 2025: the fruits, vegetables, dairy, eggs and protein that make up adequate nutrition, not just enough staple calories.",
        body2:
          "A healthy diet costs far more than its raw staples because costs accumulate after the farm gate: storage, cold chains, processing, transport and retail all add margin. Where infrastructure is weak — unreliable electricity, bad roads, fragmented markets — nutritious food becomes a luxury precisely where incomes are lowest. This is why SOFI 2026 is subtitled 'Understanding and addressing the high cost of a healthy diet'.",
        caseTitle: "The poverty trap in one paragraph",
        caseBody:
          "Poor households spend half or more of their income on food, so any price rise or income shock bites them first. When budgets tighten, households may cut diet quality, meal sizes or other spending — often the nutritious foods first. This is why hunger and obesity can coexist in the same households, and why poverty drives malnutrition even where markets are full.",
        caseSource: "SOFI 2026; World Bank Food Prices for Nutrition",
        caveat:
          "Affordability is measured against the cost of a healthy diet basket, an estimate that varies with local prices and methodology — it indicates constrained access, not a guaranteed outcome for every individual.",
        sources: [
          { name: "SOFI 2026 §2.2 — Cost and affordability of a healthy diet", url: "https://openknowledge.fao.org/3/cd8306en/online/state-food-security-and-nutrition-2026/cost-affordability-healthy-diet.html" },
          { name: "World Bank — Food Prices for Nutrition DataHub", url: "https://www.worldbank.org/en/brief/2022/03/01/foodpricesfornutrition" },
        ],
      },
      {
        id: "climate",
        title: "Climate extremes and environmental shocks",
        headline: "87.5 million people — the primary driver in 16 countries",
        body1:
          "Weather extremes were the primary driver of acute food insecurity in 16 countries in 2025, affecting 87.5 million people — a roughly five-fold increase from 15.7 million people in 2020. Much of the rise traces to the 2023–24 El Niño, one of the strongest on record, which devastated harvests across Southern Africa, and to La Niña-induced drought that hit the Horn of Africa at the end of 2025.",
        body2:
          "For farming households, a failed season is not one bad year: it eats the seed stock, forces livestock sales at distressed prices and borrows against the next harvest. Droughts and floods also degrade the land itself, so each shock lowers the starting point of the next one — a slow ratchet that turns weather variability into structural poverty.",
        caseTitle: "Case: The Horn of Africa's drought and floods",
        caseBody:
          "UNDRR's forensic analysis records severe drought across the eastern Horn of Africa in 2020–2023, followed by flooding in 2023–2024. More than 30 million people in Ethiopia, Kenya and Somalia faced drought-related food insecurity over 2020–2022. When the rains returned in 2023, they arrived as floods, compounding the destruction.",
        caseSource: "UNDRR — Horn of Africa floods and drought, forensic analysis (2024)",
        case2Title: "Case: Syria's 2025 harvest failure",
        case2Body:
          "In 2025, Syria recorded one of its worst droughts in more than 30 years: wheat and barley harvests came in about 60% below average, deepening the food crisis of a country already shattered by more than a decade of war. Climate shocks rarely act alone — they land hardest on countries whose buffers are already gone.",
        case2Source: "GRFC 2026",
        caveat:
          "Single events cannot be attributed to climate change without formal attribution studies, and the GRFC classifies 'weather extremes', not 'climate change'. The weather-driver totals are not a climate-attribution study: they reflect coverage, exposure and vulnerability as well as hazards, and they moved with changing coverage — 15.7 million in 2020, 96.6 million in 2024, 87.5 million in 2025. Weather shocks compound, rather than replace, the other drivers.",
        sources: [
          { name: "GRFC 2026 — Box 7, Weather extremes", url: "https://www.fightfoodcrises.net/global-report-food-crises" },
          { name: "UNDRR — Horn of Africa drought, forensic analysis", url: "https://www.undrr.org/resource/horn-africa-floods-and-drought-2020-2023-forensic-analysis" },
        ],
      },
      {
        id: "economic",
        title: "Economic instability and food price shocks",
        headline: "Food prices transmit global shocks to kitchen tables",
        body1:
          "In 2025, economic shocks were the primary driver of acute food insecurity in 12 countries, home to 29.8 million people — down from their 2022 peak, but still reported as an additional driver in 31 countries. Currency depreciation, debt distress and high import bills price food out of reach long before any shortage appears.",
        body2:
          "World food prices have swung violently twice in a generation. The 2007–08 crisis put the FAO Food Price Index at a then-record annual average of 117.7. The 2022 peak — an annual average of 144.5, monthly 160.3 in March 2022, the highest since the index began in 1990 — coincided with disruptions to grain, energy and fertilizer markets after Russia's invasion of Ukraine. Countries that import most of their food, and households that spend most of their income on it, absorb those shocks first and recover last.",
        chartTitle: "FAO Food Price Index",
        chartSubtitle: "Annual nominal index points (2014–2016 = 100) · the vertical axis starts at 40 — read values and changes in index points, not filled area",
          chartHint: "{verb} any year to read its index value.",
        chartExplainer:
          "The FAO Food Price Index tracks the international prices of a basket of globally traded food commodities — cereals, vegetable oils, dairy, meat and sugar, weighted by their export shares. It is not a measure of supermarket prices or of what any household spends on food, but international price swings do reach local markets through trade, exchange rates and supply chains. The 2014–2016 average is set to 100, so an index of 125 sits about 25% above that baseline — not 25% higher than the previous year.",
        chartNote:
          "Each point is the average of that year’s twelve monthly values — so the 2022 annual value of 144.5 is the highest annual average of the modern series, while the monthly index peaked higher still at 160.3 in March 2022. After easing through 2023–24, the index rose again to 127.2 in 2025 and averaged 136.0 in September 2026.",
        caseTitle: "The quiet driver: shrinking aid",
        caseBody:
          "Just as needs peaked, support contracted. As projected in September 2026, net official development assistance from major donors could fall to its lowest level since 2014; humanitarian aid was projected to decline by 40.3% between 2024 and 2026, and food aid by 44.5%. Emergency food security monitoring is being cut in the same countries where hunger is growing — which is also why some recent declines in measured hunger partly reflect lost data, not only relief.",
        caseSource: "GRFC 2026 Mid-Year Update; JRC (Sept 2026)",
        caveat:
          "Correlation is not causation: price spikes coincide with wars, energy shocks and export bans, and countries absorb them differently depending on reserves, subsidies and social protection. The index measures world export prices, not what any household pays at its local market.",
        sources: [
          { name: "FAO — World Food Situation, Food Price Index", url: "https://www.fao.org/worldfoodsituation/FoodPricesIndex/en" },
          { name: "GRFC 2026 — Mid-Year Update", url: "https://www.fightfoodcrises.net/global-report-food-crises" },
        ],
      },
    ],
  },
  ch5: {
    kicker: "Chapter 5 — The Trend",
    title: "Is the world making progress?",
    lede:
      "The honest answer: progress happened, then reversed, then partially returned. The share of humanity that is undernourished fell from 12.7% in 2000 to about 7.5% by the mid-2010s — a long decline that included interruptions — then rose again through the pandemic and the wars of the early 2020s, and has fallen for three consecutive years since 2022. The line drawn here is an archived FAO series; the newest SOFI 2026 estimates are marked separately, and the two vintages are not interchangeable.",
    chartTitle: "Global hunger over time",
    trendHint:
      "{verb} the chart to read any year's values; the buttons above switch views and regions.",
    viewPercent: "Share of population (%)",
    viewNumber: "Number of people (millions)",
    regionWorld: "World",
    regionAfrica: "Africa",
    regionAsia: "Asia",
    regionAmericas: "Americas",
    regionEurope: "Europe",
    regionOceania: "Oceania",
    regionHint: "Select regions to compare (share view)",
    floorLabel: "<2.5%",
    floorNote:
      "Europe's flat line: FAO reports any prevalence below 2.5% as “<2.5%” — the measurement floor — so the dashed European line marks that reporting floor, not an exact 2.5% every year.",
    sofiMarker: "SOFI 2026: 7.8% (2025)",
    sofiMarkerNumber: "SOFI 2026: 645 million (2025)",
    numberSourceNote:
      "Number series: FAO via the World Bank's Health Nutrition and Population Statistics (SN.ITK.DEFC, through 2023). The SOFI 2026 point marks the newest vintage: 645 million in 2025. The share and number series come from different publication channels and vintages — do not divide one by the other to estimate populations.",
    percentVsNumberTitle: "Percent or people — watch both",
    percentVsNumberBody:
      "The percentage of the world that is hungry has fallen much further than the number of hungry people, because the world's population grew by about two billion over the same period. Africa illustrates the tension sharply: its prevalence fell in 2025 for the first time since 2017, yet population growth meant the continent still passed Asia in absolute numbers of hungry people. Percentage progress can coexist with record headcounts — both statements are true, and each is incomplete alone.",
    vintageNote:
      "FAO revises these series every year. The line here reproduces the archived FAO/OWID series (retrieved October 2026); within 2020–2024 its highest prevalence is 8.8% in 2021. SOFI 2026 uses a revised series — it reports 8.6% for 2022 and 7.8% for 2025 — so the two vintages should not be used to calculate continuous year-to-year changes. The marked point is the newest SOFI 2026 estimate. Small differences between vintages are normal and are documented in the methodology notes.",
    contextTitle: "What moved the curve",
    context: [
      "2000–2014 — the long improvement: economic growth in Asia and Latin America, expanded social protection and agricultural investment pushed prevalence down by more than a third.",
      "2015–2019 — the plateau: progress slowed to a halt; conflicts in the Sahel, Yemen and Syria began pushing numbers up again.",
      "2020–2022 — the reversal: the COVID-19 pandemic and its economic fallout, then the war in Ukraine's price shock, pushed prevalence up to 8.8% in 2021 — the highest of the 2020–2024 span in the archived series drawn here (SOFI 2026's revised series reports 8.6% for 2022).",
      "2023–2025 — three years of recovery: easing prices, post-pandemic normalization and targeted policy pushed the share down to 7.8% — still above the mid-2010s best. FAO projects about 520 million people may still face hunger in 2030, far off track for the SDG Zero Hunger target.",
    ],
    acuteTitle: "The acute view: food crises since 2016",
    acuteChartTitle: "People in food crisis (IPC/CH Phase 3+), 2016–2025",
    acuteHint:
      "{verb} any year to see the people in food crisis and that year's country coverage.",
    acuteNote:
      "Across the GRFC's decade, acute food insecurity grew about two-and-a-half-fold — 105.3 million in 2016, 265.7 million in 2025 — but check each year's country coverage (printed under each bar on wide screens, and in the chart tooltip): the 2026 edition assessed only 47 countries with comparable data, the lowest in a decade, and 18 selected contexts lacked estimates meeting GRFC requirements, including some with no available data. The 2024→2025 decline partly reflects that lost coverage, not only real improvement. This series must never be compared with, or added to, the chronic-hunger line above.",
    downloadLabel: "Download the data (CSV)",
    downloadNote:
      "Contains the two world series shown in the table above — share of population and number of people — with sources and reference years. Regional and acute-food-insecurity series are not included. Open it in any spreadsheet application.",
    tableTitle: "Behind the chart: the numbers",
    tableYear: "Year",
    tablePercent: "World share (%)",
    tableNumber: "World number (millions)",
    tableSofi: "SOFI 2026 note",
  },
  ch6: {
    kicker: "Chapter 6 — The Action",
    title: "What can one person do?",
    lede:
      "Global hunger is not solved by a single gesture — but it is not beyond individual action either. The evidence in this chapter supports realistic, non-magical choices: learn how the numbers actually work, give effectively, volunteer locally, waste less, and push for the policies the data says matter. Pick what fits your life.",
    selectorLabel: "What do you want to do?",
    selectorHint: "Choose an interest — recommendations adapt below.",
    interests: [
      { id: "learn", label: "I want to learn" },
      { id: "donate", label: "I want to donate" },
      { id: "volunteer", label: "I want to volunteer" },
      { id: "waste", label: "I want to waste less food" },
      { id: "advocate", label: "I want to push for policy" },
      { id: "share", label: "I want to share this site" },
    ],
    actions: [
      {
        id: "learn",
        title: "Learn how hunger is actually measured",
        body:
          "Misleading hunger statistics usually come from mixing up indicators — quoting the acute-crisis number as if it were the world total, or summing measures that overlap. Reading the indicator definitions in the primary sources helps you spot those comparisons and explain the numbers more accurately to others.",
        caveat: "Reading is not the same as doing — but informed people are the transmission system every other action needs.",
        resources: [
          { name: "Our World in Data — Hunger and Undernourishment", url: "https://ourworldindata.org/hunger-and-undernourishment", note: "Charts, methods and downloadable data" },
          { name: "SOFI 2026 — the annual flagship report", url: "https://www.fao.org/publications/fao-flagship-publications/the-state-of-food-security-and-nutrition-in-the-world/en", note: "The primary source for chronic hunger figures" },
          { name: "Global Report on Food Crises 2026", url: "https://www.fightfoodcrises.net/global-report-food-crises", note: "The primary source for acute food insecurity" },
          { name: "IPC — Famine Facts", url: "https://www.ipcinfo.org/famine-facts/en", note: "What famine classification actually requires" },
        ],
      },
      {
        id: "donate",
        title: "Give to organizations with verified reach",
        body:
          "Money is what food agencies need most: it gives them flexibility to buy food locally where possible, provide cash assistance, or move supplies where local markets cannot meet needs. The World Food Programme assisted over 100 million people in recent years and received the 2020 Nobel Peace Prize for its work; food banking networks rescue food that markets would discard.",
        caveat: "Give deliberately: recurring donations help agencies plan, and you should verify any organization before giving — the links here are official entry points.",
        resources: [
          { name: "World Food Programme — Donate", url: "https://www.wfp.org/donate", note: "The world's largest humanitarian food agency" },
          { name: "ShareTheMeal", url: "https://sharethemeal.org", note: "WFP's donation app — what a donation funds, and its cost, depend on the current programme" },
          { name: "The Global FoodBanking Network", url: "https://www.foodbanking.org", note: "Food banks in 50+ countries" },
          { name: "UNICEF — Nutrition", url: "https://www.unicef.org/nutrition", note: "Treats child malnutrition at scale" },
        ],
      },
      {
        id: "volunteer",
        title: "Volunteer where hunger is local",
        body:
          "Hunger is not only a distant problem: food insecurity exists in nearly every country, and local food banks, community kitchens and school-meal programs run substantially on volunteers. Ask a local organization about available roles and the time they need.",
        caveat: "Choose roles that fit your skills — organizations commonly need help with sorting, driving, translating, accounting and web tasks.",
        resources: [
          { name: "The Global FoodBanking Network — Our Global Reach", url: "https://www.foodbanking.org/global-reach/", note: "Find a member food bank by country" },
        ],
      },
      {
        id: "waste",
        title: "Waste less food at home — with honest expectations",
        body:
          "UNEP estimates that households generated about 60% of the food waste measured across households, food service and retail in 2022 — about 631 million tonnes, or 79 kg per person per year, including inedible parts — and separately estimates over one billion meals wasted daily. This measure excludes earlier supply-chain food losses. Cutting household waste still matters: it shrinks the land, water, fertilizer and emissions used to produce food that no one eats, and it usually saves a household money.",
        caveat: "Honesty first: wasting less does NOT directly deliver food to people facing hunger — the surplus is rarely where the hunger is. Both problems are real; they are different problems. Claiming your leftovers feed the hungry is exactly the overselling this site exists to avoid.",
        resources: [
          { name: "UNEP Food Waste Index Report 2024", url: "https://www.unep.org/resources/publication/food-waste-index-report-2024", note: "The global evidence base" },
          { name: "UNEP — Seven ways to cut your food waste", url: "https://www.unep.org/news-and-stories/story/seven-ways-cut-your-food-waste-and-support-planet", note: "Everyday actions, officially curated" },
          { name: "FAO — Food loss and food waste", url: "https://www.fao.org/policy-support/policy-themes/food-loss-and-food-waste", note: "Where loss happens along the chain" },
        ],
      },
      {
        id: "advocate",
        title: "Push for the policies the data supports",
        body:
          "The SOFI 2026 policy chapter is unusually concrete: keep food and input markets open and avoid export restrictions; strengthen targeted social protection for the vulnerable; and invest in the infrastructure — storage, cold chains, transport, irrigation, early-warning — that makes nutritious food affordable. These are FAO's recommended priorities; their effect depends on implementation and context.",
        caveat: "Advocacy works best when it is specific: a named program, a budget line, a decision with a date. Vague support for 'ending hunger' is easy to ignore.",
        resources: [
          { name: "SOFI 2026 — policy priorities (press release)", url: "https://www.fao.org/newsroom/detail/sofi-2026--hunger-not-inevitable--fao-says-as-global-hunger-report-shows-progress/en", note: "What FAO's member states are being asked to do" },
          { name: "UN SDG 2 — Zero Hunger", url: "https://sdgs.un.org/goals/goal2", note: "The framework and its targets" },
        ],
      },
      {
        id: "share",
        title: "Pass it on — the contribution anyone can make",
        body:
          "You don't need to write code to help this project. Sharing is what keeps it alive: send the link to someone who argues about hunger numbers, use a chart in a class, a talk or an article, or recommend it where misinformation about hunger spreads. Independent, evidence-first work travels only as far as its readers carry it.",
        caveat:
          "Reuse with care: this site's code and documentation are MIT-licensed, but the data behind every figure belongs to its publishers — FAO, WFP, UNEP, IPC and others — and third-party material keeps its own terms. Cite the original publisher when you quote numbers; link back here when you reuse the explanations and charts.",
        resources: [],
      },
    ],
    closingTitle: "One honest sentence",
    closingBody:
      "645 million people facing hunger is neither fate nor fiction — it is the measurable result of choices about war, markets, infrastructure and care. Three years of improvement prove it can move. What happens in the fourth year depends on decisions not yet made — including, in small but real ways, yours.",
    copyNote:
      "One tap copies the site's canonical link — no share buttons, no trackers; nothing leaves your device.",
    copyLink: "Copy website link",
    copied: "Link copied",
    copyFailed: "Copy is not available in this browser — select and copy the link manually:",
  },
  footer: {
    title: "Global Food Crisis — Chapter 01",
    independence:
      "This is an independent, non-commercial educational project. It is not affiliated with, endorsed by, or an official publication of the United Nations, FAO, WFP, IPC, UNEP or any other organization referenced. All names and data belong to their respective owners and are cited with attribution.",
    sourcesTitle: "Primary data sources",
    sources: [
      "FAO et al., The State of Food Security and Nutrition in the World 2026 (SOFI 2026)",
      "Global Network Against Food Crises, Global Report on Food Crises 2026 (GRFC 2026)",
      "FAO, Prevalence of undernourishment (SDG 2.1.1), via Our World in Data",
      "World Bank (Health Nutrition and Population Statistics), People undernourished (SN.ITK.DEFC)",
      "FAO, Food Price Index and Food Balance Sheets",
      "UNEP, Food Waste Index Report 2024",
      "Integrated Food Security Phase Classification (IPC)",
    ],
    sourcesLink: "Full source list, methodology and limitations",
    sourcesUrl: "https://github.com/",
    licenseNote: "Code: MIT. Data: attributed per dataset — reuse terms vary by publication (CC BY 4.0, public domain, or publisher terms), see the repository's source notes.",
    retrievedNote: "All datasets retrieved 2026-10-15.",
    builtNote: "Built as a static site — no tracking, no analytics, no cookies.",
    furtherTitle: "Further reading",
    furtherText:
      "Remember to Prevent is a separate, independent educational project — not a data source for this site — that examines the two world wars and reflects on how such tragedies might be prevented. Conflict is among the drivers of hunger traced in Chapter 4; both projects follow the human cost of war with the same evidence-first approach.",
    backToTop: "Back to top",
  },
};

export type Dictionary = typeof en;
