// ============================================================
// FarmVest Blog Articles Database
// Rich data for all 12 blog insights articles
// ============================================================

export const articles = [
  {
    id: 1,
    slug: 'sustainable-farm-cofunding-2026',
    title: 'Why Sustainable Farm Co-Funding Is Outperforming Traditional Asset Classes in 2026',
    category: 'agronomy',
    categoryName: 'Agronomy Tech',
    date: 'Aug 03, 2026',
    readTime: '5 min read',
    image: '/images/about-vision-rice.png',
    imageAlt: 'Smart Farming & Rice Cultivation',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Agronomist at FarmVest',
      avatar: '/images/logo-mark-white.svg',
      bio: 'Dr. Thorne holds a PhD in Sustainable Agriculture Systems from UC Davis and has led commercial farming operations across four continents. He specializes in precision agriculture, soil telemetry, and high-yield crop optimization for fintech-backed investment pools.'
    },
    lead: 'Discover how global food security demands, satellite telemetry monitoring, and automated yield cycles are creating inflation-protected, high-yielding portfolios for modern investors seeking alternatives to volatile traditional markets.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">The Shift Away from Traditional Assets</h2>
      <p class="text-muted">Institutional and retail investors alike are re-evaluating portfolio allocations in 2026. With bond yields compressed, equity volatility elevated, and inflation eroding real returns, alternative asset classes have gained unprecedented attention. Among these alternatives, agriculture-backed investment pools stand out for their unique combination of yield stability, inflation hedge, and ESG alignment.</p>
      <p class="text-muted">Unlike speculative crypto markets or overleveraged real estate, farm co-funding platforms like FarmVest provide direct exposure to real-world food production cycles. Every dollar invested translates into tangible agricultural inputs—seeds, irrigation, organic fertilizer—that mature into harvest revenues distributed back to co-funders with transparent, contractual returns.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Food Security as a Macro Tailwind</h2>
      <p class="text-muted">Global population growth and shifting dietary patterns are driving structural demand for food commodities. The UN Food and Agriculture Organization projects a 50% increase in food production requirements by 2050. This isn't a cyclical trend—it's a multi-decade megatrend creating sustained tailwinds for agricultural asset performance.</p>
      <p class="text-muted">FarmVest pools tap into this demand by financing commercial farms with pre-negotiated off-take contracts. Before a single seed is planted, harvest buyers—ranging from regional food processors to multinational exporters—commit to purchase volumes at fixed minimum prices. This contract-backed structure dramatically reduces market risk while locking in investor yields.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"Agricultural co-funding platforms are democratizing access to an asset class historically reserved for institutional investors and ultra-high-net-worth families. The combination of real asset backing, insurance protection, and tech-enabled transparency is reshaping how retail investors think about portfolio diversification."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— Dr. Aris Thorne, Chief Agronomist, FarmVest</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Telemetry & Risk Mitigation</h2>
      <p class="text-muted">Traditional agriculture investment carried opaque risk profiles—investors had limited visibility into daily farm operations, soil health, or weather impacts. Modern agri-fintech platforms have transformed this equation through satellite telemetry and IoT sensor networks.</p>
      <p class="text-muted">Every FarmVest pool integrates real-time field monitoring: soil moisture sensors, temperature logs, drone-captured crop health indices, and satellite NDVI tracking. Co-funders access a live dashboard showing their farm's growth stages, predicted harvest timing, and yield forecasts updated bi-weekly by on-site agronomists.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Insurance-Backed Principal Protection</h2>
      <p class="text-muted">One of the most compelling features separating modern farm co-funding from legacy agricultural investments is comprehensive multi-peril insurance. FarmVest requires 100% insurance coverage on all listed pools, protecting co-funders against drought, flood, pest infestations, and yield shortfalls.</p>
      <p class="text-muted">Underwritten by globally-rated agricultural insurers, these policies ensure that even in catastrophic scenarios, investor principal capital remains protected. This insurance layer effectively transforms agricultural pools into yield-generating fixed-income alternatives with downside protection absent in traditional bond markets.</p>
    `
  },
  {
    id: 2,
    slug: 'satellite-iot-soil-moisture-sensors',
    title: 'How Satellite & IoT Soil Moisture Sensors Boost Crop Yields by 40%',
    category: 'telemetry',
    categoryName: 'Field Telemetry',
    date: 'Jul 28, 2026',
    readTime: '6 min read',
    image: '/images/farm-telemetry.png',
    imageAlt: 'IoT Soil Sensors and Telemetry',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Agritech Hardware',
      avatar: '/images/team-elena.png',
      bio: 'Elena specializes in micro-sensor networks and satellite spectral imaging, with over 12 years experience deploying IoT telemetry across commercial farms globally.'
    },
    lead: 'Precision agriculture tools give agronomists real-time visibility into moisture, temperature, and nutrient levels across every hectare, transforming how water and fertilizers are allocated.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">The Micro-Climate Challenge in Modern Farming</h2>
      <p class="text-muted">Traditional farming relied heavily on standardized watering schedules across large acreage fields. However, soil composition, elevation, and sun exposure vary dramatically even within a single 50-hectare plot. Over-watering leads to root rot and wasted water resources, while under-watering stunts plant development and degrades crop quality.</p>
      <p class="text-muted">By deploying dense networks of IoT soil moisture probes coupled with orbital synthetic aperture radar (SAR), modern agronomists monitor soil matric potential at root depths in real-time. This dynamic telemetry eliminates guesswork, providing plants with precision micro-doses of water exactly when required.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Integrating Multispectral Orbitals with IoT Probes</h2>
      <p class="text-muted">While ground probes deliver sub-surface moisture and EC (electrical conductivity) readings, satellite constellations provide wide-area spectral imagery. Combined, these technologies generate volumetric soil moisture maps with sub-meter spatial resolution.</p>
      <p class="text-muted">FarmVest's telemetry dashboard aggregates these data streams into automated fertigation triggers. When root-zone water potential drops below optimal thresholds, solar-powered valve manifolds open autonomously, delivering targeted water and organic liquid nutrients.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"By optimizing water delivery to the exact transpiration demand of crops, our partner farms reduce water consumption by 35% while increasing total harvest biomass by up to 40% per acre."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— Elena Rostova, Head of Agritech Hardware</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Financial Return Impacts for Co-Funders</h2>
      <p class="text-muted">Higher crop yields and reduced resource inputs translate directly into improved net margins for asset pools. Reduced diesel fuel for tractor-mounted sprayers, lower water utility costs, and higher percentage of premium-grade produce boost overall pool performance.</p>
      <p class="text-muted">Investors in FarmVest's telemetry-monitored pools enjoy higher net annual yield payouts and total transparency. Live telemetry feeds are displayed directly inside the investor portal, allowing co-funders to trace the growth trajectory of their funded acreage from seeding through harvest.</p>
    `
  },
  {
    id: 3,
    slug: 'evaluating-risk-return-livestock-grain-pools',
    title: 'Evaluating Risk & Return Profiles Across Organic Livestock & Grain Pools',
    category: 'market',
    categoryName: 'Market Analysis',
    date: 'Jul 20, 2026',
    readTime: '7 min read',
    image: '/images/pool-cattle.png',
    imageAlt: 'Grass-Fed Livestock Field',
    author: {
      name: 'Marcus Vance',
      role: 'VP of Quantitative Risk',
      avatar: '/images/team-marcus.png',
      bio: 'Marcus leads agricultural risk modeling at FarmVest, drawing from 15 years in commodity futures and hedge fund portfolio risk management.'
    },
    lead: 'A data-driven look at how diversified agricultural pools balance seasonal commodity volatility against consistent, insured yields to maximize risk-adjusted investor returns.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Understanding Asset Characteristics: Grain vs. Livestock</h2>
      <p class="text-muted">Agricultural asset classes differ fundamentally in cycle duration, capital outlay, market liquidity, and margin structure. Annual grain crops (such as wheat, corn, and soy) feature shorter 4 to 6-month investment cycles with high liquidity via global futures markets. Conversely, organic livestock (such as grass-fed Angus cattle) operate on 14 to 18-month cycles, offering higher profit margins driven by premium organic consumer pricing.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Correlation Matrix & Portfolio Diversification</h2>
      <p class="text-muted">One of the primary benefits of co-funding a basket of farm pools is negative correlation across different agricultural sectors. Weather factors that negatively impact grain harvest often coincide with favorable conditions for pasture growth. Furthermore, grain price declines lower feed costs for livestock operations, creating a natural internal hedge across a diversified portfolio.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"Constructing an agricultural portfolio across short-cycle grains and long-cycle organic livestock offers an ideal balance of quarterly liquidity and high compound annual growth."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— Marcus Vance, VP of Quantitative Risk</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Stress Testing & Insurance Mitigants</h2>
      <p class="text-muted">FarmVest subjects every proposed asset pool to historical stress testing against 50-year climate events, disease outbreaks, and trade tariff shifts. Only pools backed by multi-peril insurance policies and guaranteed off-take contracts are approved for retail and institutional co-funding.</p>
    `
  },
  {
    id: 4,
    slug: 'commercial-hydroponic-greenhouses',
    title: 'Commercial Hydroponic Greenhouses: Accelerated Cycles & Multi-Harvest Yields',
    category: 'greenhouse',
    categoryName: 'Greenhouse Tech',
    date: 'Jul 12, 2026',
    readTime: '5 min read',
    image: '/images/organic-greenhouse.png',
    imageAlt: 'Hydroponic Greenhouse Facilities',
    author: {
      name: 'Sarah Jenkins',
      role: 'Director of Controlled Environment Ag',
      avatar: '/images/team-sarah.png',
      bio: 'Sarah has engineered over 200,000 sq. ft. of automated glasshouse facilities optimizing light spectrums and nutrient dosing.'
    },
    lead: 'Climate-controlled greenhouses compress growing seasons and eliminate weather dependence, unlocking up to four harvest cycles per year for premium produce.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Decoupling Farming from Seasonal Constraints</h2>
      <p class="text-muted">Outdoor agriculture remains inherently vulnerable to unseasonal frosts, heatwaves, and erratic rainfall. Commercial hydroponic glasshouses create an artificial micro-climate where ambient temperature, humidity, CO2 levels, and PAR (photosynthetically active radiation) are precisely controlled 24/7.</p>
      <p class="text-muted">By growing crops in sterile substrate channels with recycled nutrient solutions, hydroponic facilities achieve growth rates up to 50% faster than traditional soil farming. Crops such as vine tomatoes, bell peppers, and gourmet berries yield up to 10 times more produce per square meter.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Zero Pesticides and Closed-Loop Water Recycling</h2>
      <p class="text-muted">Closed-environment agriculture prevents pest entrance natively, eliminating the need for synthetic chemical pesticides. Water and dissolved mineral nutrients circulate in closed loops, capturing and re-filtering 95% of runoff water that would otherwise be lost to evaporation or deep percolation.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"Controlled-environment greenhouses represent the pinnacle of resource efficiency—delivering high yield density with 95% less water consumption."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— Sarah Jenkins, Director of Controlled Environment Ag</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Frequent Quarterly Investor Distributions</h2>
      <p class="text-muted">Because indoor hydroponic crops produce multiple continuous harvests throughout the year, co-funders in greenhouse pools enjoy predictable quarterly distribution payments rather than waiting for annual harvest windows.</p>
    `
  },
  {
    id: 5,
    slug: 'inside-grass-fed-angus-cattle-pool',
    title: 'Inside a Grass-Fed Angus Cattle Pool: From Pasture to Payout',
    category: 'livestock',
    categoryName: 'Livestock',
    date: 'Jul 05, 2026',
    readTime: '6 min read',
    image: '/images/pool-tomato.png',
    imageAlt: 'Pasture and Livestock Operations',
    author: {
      name: 'David Sterling',
      role: 'Senior Livestock Agronomist',
      avatar: '/images/team-david.png',
      bio: 'David manages cattle genetics, rotational grazing telemetry, and veterinary protocols across FarmVest\'s partner ranches.'
    },
    lead: 'We break down the full 18-month lifecycle of a livestock pool, including rotational grazing, RFID telemetry, health insurance, and off-take supply agreements.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Rotational Grazing & Soil Health Renewal</h2>
      <p class="text-muted">Modern livestock pool operations go far beyond traditional ranching. FarmVest partner ranches utilize intensive rotational grazing protocols where cattle are moved daily across fenced paddocks. This allows pastures adequate rest cycles to regenerate root structures, sequestering soil carbon and maintaining dense nutrient-rich grasses.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">RFID Ear Tags & Automated Biometric Telemetry</h2>
      <p class="text-muted">Every animal in the pool is tagged with solar UHF RFID ear sensors that track daily movement, grazing activity, water intake, and weight gain trajectories. Early disease detection algorithms alert ranch managers if an individual animal shows reduced movement or elevated temperature, allowing targeted veterinary treatment before health declines.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"Combining natural grass-fed pasture management with biometric tracking produces healthier livestock, premium beef pricing, and exceptional returns for our pool members."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— David Sterling, Senior Livestock Agronomist</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Off-Take Contracts with Premium Grocers</h2>
      <p class="text-muted">At the conclusion of the 18-month growth cycle, cattle are processed under certified organic standards. Pre-arranged off-take contracts with national organic supermarket chains lock in premium pricing per pound, providing co-funders with guaranteed capital return plus profit share.</p>
    `
  },
  {
    id: 6,
    slug: 'regenerative-agriculture-esg-case',
    title: 'Regenerative Agriculture: The ESG Case for Zero-Chemical Soil Rejuvenation',
    category: 'sustainability',
    categoryName: 'Sustainability',
    date: 'Jun 29, 2026',
    readTime: '5 min read',
    image: '/images/farmer-green-harvest.png',
    imageAlt: 'Regenerative Farming Field',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Agronomist at FarmVest',
      avatar: '/images/logo-mark-white.svg',
      bio: 'Dr. Thorne leads sustainable agricultural frameworks and carbon credit verifications across all FarmVest projects.'
    },
    lead: 'How regenerative practices build organic topsoil matter, improve water retention, and create verifiable carbon offset credits that boost pool yields.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Restoring Depleted Topsoil Ecosystems</h2>
      <p class="text-muted">Decades of synthetic chemical fertilizations and aggressive tilling have depleted topsoil organic matter across conventional agricultural land. Regenerative agriculture restores natural soil biology through cover cropping, zero-tillage, biochar amendments, and organic compost teas.</p>
      <p class="text-muted">Every 1% increase in topsoil organic matter allows farmland to hold an additional 20,000 gallons of water per acre, dramatically boosting drought resilience and reducing irrigation expenses.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Verifiable Soil Carbon Sequestration</h2>
      <p class="text-muted">Healthy, un-tilled soil acts as one of the Earth's most powerful carbon sinks. FarmVest utilizes satellite radar and core soil sampling to quantify net carbon sequestered in regenerative farmland annually.</p>

      <div class="bg-light border-start border-4 border-success p-4 my-5 rounded-3 shadow-sm">
        <p class="mb-0 fst-italic text-dark fs-6" style="line-height: 1.6;">"Regenerative agriculture proves that ecological restoration and high financial returns can work in perfect harmony."</p>
        <p class="mb-0 mt-3 text-sm fw-bold text-success">— Dr. Aris Thorne, Chief Agronomist</p>
      </div>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Secondary Yields from Carbon Credits</h2>
      <p class="text-muted">Verified carbon offsets earned through soil restoration are sold on global voluntary carbon markets. The revenue generated is distributed directly back to co-funders as a secondary bonus yield on top of harvest returns.</p>
    `
  },
  {
    id: 7,
    slug: 'solar-powered-drip-irrigation',
    title: 'Solar-Powered Drip Irrigation: Reducing Operational Overhead by 35%',
    category: 'agronomy',
    categoryName: 'Agronomy Tech',
    date: 'Jun 21, 2026',
    readTime: '4 min read',
    image: '/images/pool-citrus.png',
    imageAlt: 'Solar Irrigation Systems',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Agritech Hardware',
      avatar: '/images/team-elena.png',
      bio: 'Elena specializes in off-grid solar energy systems and smart irrigation controllers for agricultural projects.'
    },
    lead: 'Autonomous solar pump arrays deliver target hydration directly to root zones, eliminating fuel expenses and maximizing water efficiency.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Cutting Diesel Dependency in Remote Farming</h2>
      <p class="text-muted">In traditional agricultural operations, irrigation pumps driven by diesel generators consume up to 25% of total seasonal operating budgets. Rising diesel prices and fuel logistics represent constant margin volatility for farm operators.</p>
      <p class="text-muted">Solar photovoltaic arrays coupled with variable-frequency drive (VFD) water pumps convert direct sunlight into high-efficiency water delivery without a single drop of fossil fuel.</p>

      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Precision Sub-Surface Drip Systems</h2>
      <p class="text-muted">Rather than spraying water into the air where up to 40% evaporates before reaching plants, solar drip systems inject water and nutrients directly into the root zone beneath the soil surface. Pressure-compensating emitters ensure equal water distribution across hilly terrain.</p>
    `
  },
  {
    id: 8,
    slug: 'ai-yield-predictions-export-grain-markets',
    title: 'AI Yield Predictions for Export Grain Markets: Hedging Against Weather Shifts',
    category: 'market',
    categoryName: 'Market Analysis',
    date: 'Jun 14, 2026',
    readTime: '6 min read',
    image: '/images/pool-wheat.png',
    imageAlt: 'Wheat Fields and Harvest',
    author: {
      name: 'Marcus Vance',
      role: 'VP of Quantitative Risk',
      avatar: '/images/team-marcus.png',
      bio: 'Marcus models commodity market movements and yield analytics using machine learning.'
    },
    lead: 'Machine learning models analyze historical weather data and orbital vegetation indices to lock in wholesale off-take pricing months before harvest.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Predictive AI Models in Commodity Trading</h2>
      <p class="text-muted">Predicting global grain yields with high precision provides a decisive advantage when negotiating forward supply contracts with international buyers. FarmVest's neural network algorithms aggregate global satellite weather models, surface temperature data, and historical crop yields across 30 years.</p>
      <p class="text-muted">By forecasting regional harvest volumes months in advance, farm operators can execute optimal hedging strategies on commodity exchanges, securing peak pricing for co-funded harvests.</p>
    `
  },
  {
    id: 9,
    slug: 'multispectral-drone-surveys-soil-nitrogen',
    title: 'Multispectral Drone Surveys: Detecting Soil Nitrogen Deficiencies Early',
    category: 'telemetry',
    categoryName: 'Field Telemetry',
    date: 'Jun 08, 2026',
    readTime: '5 min read',
    image: '/images/pool-berry.png',
    imageAlt: 'Drone Surveying Fields',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Agritech Hardware',
      avatar: '/images/team-elena.png',
      bio: 'Elena leads drone telemetry mapping initiatives for high-yield fruit and berry acreage.'
    },
    lead: 'Automated drone flights generate NIR heatmaps identifying plant stress and nitrogen shortfalls days before visual signs appear on the ground.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Near-Infrared Spectrum Crop Health Mapping</h2>
      <p class="text-muted">Plants undergoing nutrient stress or disease exhibit subtle reflectance changes in the near-infrared light spectrum long before human eyes can detect yellowing leaves. Multispectral cameras mounted on autonomous survey drones map fields at 2cm per pixel resolution.</p>
      <p class="text-muted">These flight heatmaps allow farm crews to apply organic nitrogen supplements exclusively to affected plant clusters, saving input costs and preventing crop loss.</p>
    `
  },
  {
    id: 10,
    slug: 'indoor-vertical-vanilla-cultivation',
    title: 'Indoor Vertical Vanilla Cultivation: High-Value Exotic Crop Economics',
    category: 'greenhouse',
    categoryName: 'Greenhouse Tech',
    date: 'Jun 01, 2026',
    readTime: '6 min read',
    image: '/images/pool-vanilla.png',
    imageAlt: 'Vanilla Greenhouse Farming',
    author: {
      name: 'Sarah Jenkins',
      role: 'Director of Controlled Environment Ag',
      avatar: '/images/team-sarah.png',
      bio: 'Sarah specializes in exotic high-value botanical crops and indoor climate optimization.'
    },
    lead: 'Climate-controlled solar glasshouses make high-grade vanilla orchid farming predictable and highly profitable.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">The Economics of Gourmet Vanilla Beans</h2>
      <p class="text-muted">Vanilla is the second most expensive spice in the world, traditionally vulnerable to tropical cyclones and manual pollination challenges in outdoor plantations. By bringing vanilla orchid vines into automated vertical glasshouses, FarmVest creates ideal tropical humidity and temperature conditions year-round.</p>
      <p class="text-muted">Precision climate control speeds flower maturation and ensures high natural pollination success rates, producing grade-A bourbon vanilla pods valued at over $400 per kilogram.</p>
    `
  },
  {
    id: 11,
    slug: 'organic-poultry-feed-telemetry-growth-tracking',
    title: 'Organic Poultry Feed Telemetry & Growth Tracking for Co-Funders',
    category: 'livestock',
    categoryName: 'Livestock',
    date: 'May 25, 2026',
    readTime: '5 min read',
    image: '/images/pool-poultry.png',
    imageAlt: 'Organic Poultry Operations',
    author: {
      name: 'David Sterling',
      role: 'Senior Livestock Agronomist',
      avatar: '/images/team-david.png',
      bio: 'David oversees automated feeding systems and free-range poultry welfare metrics.'
    },
    lead: 'Real-time IoT sensors monitor poultry health, feed conversion ratios, and welfare standards on modern farms.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Automated Feed Conversion Ratio (FCR) Telemetry</h2>
      <p class="text-muted">In poultry farming, the Feed Conversion Ratio (FCR) is the single most critical indicator of operational efficiency. FarmVest's automated silo weight sensors and bird scale platforms monitor daily feed consumption against weight gain with sub-gram precision.</p>
      <p class="text-muted">Free-range organic environments with outdoor pasture access foster healthier birds with zero antibiotic usage, meeting certified organic retail specifications for premium profit margins.</p>
    `
  },
  {
    id: 12,
    slug: 'monetizing-carbon-credits-commercial-farming',
    title: 'Monetizing Carbon Credits in Commercial Farming Asset Pools',
    category: 'sustainability',
    categoryName: 'Sustainability',
    date: 'May 18, 2026',
    readTime: '5 min read',
    image: '/images/pool-coffee.png',
    imageAlt: 'Sustainable Farm Coffee Plantation',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Agronomist at FarmVest',
      avatar: '/images/logo-mark-white.svg',
      bio: 'Dr. Thorne advises global environmental asset exchanges on agricultural carbon credit standards.'
    },
    lead: 'How certified carbon offset credits generate secondary yield streams for sustainable agriculture investors.',
    content: `
      <h2 class="h3 font-serif fw-bold text-dark mt-5 mb-3">Unlocking Secondary Asset Values in Farmland</h2>
      <p class="text-muted">Farmland co-funding provides dual returns: crop harvest revenues and carbon sequestration credits. Through agroforestry, cover cropping, and reduced tillage, accredited FarmVest farms lock atmospheric carbon into permanent soil organic structures.</p>
      <p class="text-muted">Third-party verifiers issue registry-listed carbon credits that are sold directly to corporate ESG buyers. The proceeds are distributed to pool participants as extra dividend distributions.</p>
    `
  }
];

export function getArticleById(id) {
  const numericId = parseInt(id, 10);
  return articles.find((a) => a.id === numericId) || articles[0];
}

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug) || articles[0];
}
