import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CMI_PINK = "#d10074";
const CMI_PINK_LIGHT = "#fce8f3";
const CMI_PINK_MID = "#f4a0cc";
const PAGE_BG = "#f4f4f2";
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

// Inject global font
const globalStyle = document.createElement("style");
globalStyle.textContent = `* { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif !important; box-sizing: border-box; }`;
document.head.appendChild(globalStyle);

const ESTABLISHMENT_LEVELS = {
  established: { label: "Established", color: "#0f6e56", bg: "#e1f5ee", border: "#5dcaa5" },
  developing:  { label: "Developing",  color: "#854f0b", bg: "#faeeda", border: "#ef9f27" },
  emerging:    { label: "Emerging",    color: "#185fa5", bg: "#e6f1fb", border: "#85b7eb" },
  target:      { label: "Target / Not yet active", color: "#993556", bg: "#fbeaf0", border: "#ed93b1" },
};

const FOCUS_AREAS = [
  { id: "diversity",       label: "Diversity & inclusion",   icon: "ti-users" },
  { id: "future_leaders",  label: "Future leaders",          icon: "ti-star" },
  { id: "public_sector",   label: "Public sector",           icon: "ti-building-bank" },
  { id: "sme",             label: "SME & entrepreneurship",  icon: "ti-briefcase" },
  { id: "he",              label: "Higher education",        icon: "ti-school" },
  { id: "apprenticeships", label: "Apprenticeships",         icon: "ti-certificate" },
  { id: "sustainability",  label: "Sustainability",          icon: "ti-leaf" },
  { id: "digital",         label: "Digital leadership",      icon: "ti-cpu" },
];

const REGIONS = [
  {
    id: "east_midlands",
    name: "East Midlands & Eastern",
    url: "https://www.managers.org.uk/community/regional-networks/east-midlands-and-eastern/",
    chair: "Jessica Robins CMgr FCMI",
    contact_email: "eastmidlands@managers.org.uk",
    counties: ["Derbyshire","Leicestershire","Northamptonshire","Lincolnshire","Cambridgeshire","Norfolk","Suffolk"],
    overall_status: "developing",
    summary: "A large and geographically diverse region spanning the East Midlands and East of England. Strong university presence and growing manufacturing and logistics sector engagement.",
    focus_strengths: ["he","apprenticeships","sme"],
    focus_targets: ["diversity","digital","sustainability"],
    top_employers: [
      { name: "Rolls-Royce", sector: "Engineering" },
      { name: "University of Leicester", sector: "Higher Education" },
      { name: "DHL Supply Chain", sector: "Logistics" },
      { name: "Nottingham City Council", sector: "Public Sector" },
      { name: "Anglian Water", sector: "Utilities" },
    ],
    sme_context: "Over 98,000 SMEs operate across the East Midlands and Eastern region, representing the backbone of the local economy — particularly strong in food & drink, engineering, and creative industries.",
    board_members: [
      { name: "Jessica Robins CMgr FCMI", role: "Regional Chair",                      email: "eastmidlands@managers.org.uk",       skills: ["Strategic leadership", "Stakeholder engagement", "Organisational development"],  sectors: ["Manufacturing", "Engineering", "Professional services"] },
      { name: "James Cartwright MCMI",    role: "Deputy Chair",                        email: "j.cartwright@placeholder.co.uk",     skills: ["Change management", "Commercial strategy", "Team leadership"],                    sectors: ["Logistics", "Retail", "Supply chain"] },
      { name: "Priya Nair CMgr MCMI",     role: "Board Member — HE Lead",              email: "p.nair@placeholder.co.uk",           skills: ["Curriculum development", "Research leadership", "Partnership building"],           sectors: ["Higher education", "Research", "Public sector"] },
      { name: "Tom Whitfield MCMI",       role: "Board Member — Apprenticeships",      email: "t.whitfield@placeholder.co.uk",      skills: ["Apprenticeship frameworks", "Skills development", "Employer engagement"],          sectors: ["Engineering", "Construction", "Advanced manufacturing"] },
      { name: "Sandra Osei MCMI",         role: "Board Member — Diversity & Inclusion",email: "s.osei@placeholder.co.uk",           skills: ["Inclusive leadership", "Culture change", "Employee engagement"],                   sectors: ["Healthcare", "Charity & third sector", "Public sector"] },
    ],
    employers: [
      { name: "Rolls-Royce",             sector: "Engineering",    location: "Derby",        status: "established", focus: ["digital","apprenticeships"], contact: "Jessica Robins" },
      { name: "University of Leicester", sector: "Higher education",location: "Leicester",   status: "established", focus: ["he","future_leaders"],       contact: "Jessica Robins" },
      { name: "DHL Supply Chain",        sector: "Logistics",      location: "Derby",        status: "developing",  focus: ["sme","apprenticeships"],      contact: "Jessica Robins" },
      { name: "Nottingham City Council", sector: "Public sector",  location: "Nottingham",   status: "developing",  focus: ["public_sector","diversity"],  contact: "Jessica Robins" },
      { name: "Anglian Water",           sector: "Utilities",      location: "Huntingdon",   status: "emerging",    focus: ["sustainability","digital"],   contact: "Jessica Robins" },
      { name: "Norfolk & Norwich NHS",   sector: "Healthcare",     location: "Norwich",      status: "target",      focus: ["public_sector","diversity"],  contact: "Jessica Robins" },
      { name: "Peterborough City Council",sector:"Public sector",  location: "Peterborough", status: "target",      focus: ["public_sector"],              contact: "Jessica Robins" },
    ],
  },
  {
    id: "london",
    name: "London",
    url: "https://www.managers.org.uk/community/regional-networks/london/",
    chair: "Katie Sherwood CMgr MCMI",
    contact_email: "london@managers.org.uk",
    counties: ["Central London","East London","West London","North London","South London"],
    overall_status: "established",
    summary: "CMI's most active UK region with deep roots across financial services, professional services, and public sector. Strong links with major London universities and the Civil Service.",
    focus_strengths: ["diversity","future_leaders","he","public_sector"],
    focus_targets: ["sme","digital"],
    top_employers: [
      { name: "KPMG",                  sector: "Professional Services" },
      { name: "Transport for London",  sector: "Public Sector" },
      { name: "King's College London", sector: "Higher Education" },
      { name: "NHS England",           sector: "Healthcare" },
      { name: "Barclays",              sector: "Financial Services" },
    ],
    sme_context: "London hosts over 400,000 SMEs, making it the UK's largest SME ecosystem. Strong concentration in tech, creative industries, and professional services.",
    board_members: [
      { name: "Katie Sherwood CMgr MCMI", role: "Regional Chair",                      email: "london@managers.org.uk",         skills: ["Executive leadership", "Financial services strategy", "Board governance"],          sectors: ["Financial services", "Professional services", "FinTech"] },
      { name: "Dominic Okafor FCMI",      role: "Deputy Chair",                        email: "d.okafor@placeholder.co.uk",     skills: ["Operations management", "Digital transformation", "Risk management"],             sectors: ["Banking", "Insurance", "Technology"] },
      { name: "Rachel Teng CMgr MCMI",    role: "Board Member — Future Leaders",       email: "r.teng@placeholder.co.uk",       skills: ["Coaching & mentoring", "Talent development", "Leadership programmes"],             sectors: ["Media", "Creative industries", "Higher education"] },
      { name: "Marcus Hall MCMI",         role: "Board Member — Public Sector",        email: "m.hall@placeholder.co.uk",       skills: ["Public policy", "Programme delivery", "Ministerial engagement"],                   sectors: ["Central government", "Local authority", "NHS"] },
      { name: "Aisha Patel CMgr MCMI",    role: "Board Member — Diversity & Inclusion",email: "a.patel@placeholder.co.uk",      skills: ["Equity strategy", "Community engagement", "Organisational culture"],              sectors: ["Charity & third sector", "Retail", "Education"] },
      { name: "Chris Delaney MCMI",       role: "Board Member — Financial Services",   email: "c.delaney@placeholder.co.uk",    skills: ["Investment management", "Regulatory compliance", "Strategic planning"],            sectors: ["Asset management", "Banking", "Consulting"] },
    ],
    employers: [
      { name: "KPMG",                       sector: "Professional services", location: "Canary Wharf",   status: "established", focus: ["future_leaders","diversity"],  contact: "Katie Sherwood" },
      { name: "Transport for London",       sector: "Public sector",         location: "Southwark",      status: "established", focus: ["public_sector","digital"],     contact: "Katie Sherwood" },
      { name: "King's College London",      sector: "Higher education",      location: "London Bridge",  status: "established", focus: ["he","future_leaders"],         contact: "Katie Sherwood" },
      { name: "NHS England",                sector: "Healthcare",            location: "City of London", status: "established", focus: ["public_sector","diversity"],   contact: "Katie Sherwood" },
      { name: "Barclays",                   sector: "Financial services",    location: "Canary Wharf",   status: "developing",  focus: ["digital","diversity"],        contact: "Katie Sherwood" },
      { name: "Hackney Council",            sector: "Public sector",         location: "Hackney",        status: "developing",  focus: ["public_sector","diversity"],   contact: "Katie Sherwood" },
      { name: "Tech Nation (est. equiv.)",  sector: "Tech / Digital",        location: "Shoreditch",     status: "target",      focus: ["digital","sme"],              contact: "Katie Sherwood" },
    ],
  },
  {
    id: "north_east_yorks",
    name: "North East, Yorkshire & Humberside",
    url: "https://www.managers.org.uk/community/regional-networks/north-east-yorkshire-and-humberside/",
    chair: "Vacant (interim)",
    contact_email: "northeast@managers.org.uk",
    counties: ["County Durham","Tyne & Wear","Northumberland","Teesside","North Yorkshire","West Yorkshire","South Yorkshire","East Riding","Humberside"],
    overall_status: "developing",
    summary: "A region with significant industrial heritage and growing creative and digital economies. Leeds and Sheffield are key hubs. Leadership chair currently being recruited.",
    focus_strengths: ["apprenticeships","public_sector"],
    focus_targets: ["digital","diversity","future_leaders","sustainability"],
    top_employers: [
      { name: "Leeds City Council",        sector: "Public Sector" },
      { name: "Sheffield Hallam University",sector: "Higher Education" },
      { name: "NHS Yorkshire & Humber",    sector: "Healthcare" },
      { name: "AMRC (Boeing / Sheffield)", sector: "Manufacturing" },
      { name: "Siemens Mobility",          sector: "Engineering" },
    ],
    sme_context: "Over 230,000 SMEs operate across the region, with a strong base in manufacturing, food production, and the growing digital and creative sectors in Leeds and Sheffield.",
    board_members: [
      { name: "Vacancy — Regional Chair", role: "Regional Chair (being recruited)",  email: "northeast@managers.org.uk",       skills: ["TBC", "TBC", "TBC"],                                                               sectors: ["TBC", "TBC", "TBC"] },
      { name: "Helen Bradshaw MCMI",      role: "Interim Deputy Chair",              email: "h.bradshaw@placeholder.co.uk",   skills: ["Interim leadership", "Stakeholder management", "Strategic communications"],          sectors: ["Public sector", "Healthcare", "Education"] },
      { name: "Gareth Rees CMgr MCMI",   role: "Board Member — Apprenticeships",    email: "g.rees@placeholder.co.uk",       skills: ["Apprenticeship delivery", "Employer partnerships", "Skills policy"],                sectors: ["Manufacturing", "Engineering", "Further education"] },
      { name: "Fatima Hussain MCMI",      role: "Board Member — Public Sector",      email: "f.hussain@placeholder.co.uk",    skills: ["Service transformation", "Community leadership", "Policy implementation"],          sectors: ["Local government", "Social housing", "Charity"] },
    ],
    employers: [
      { name: "Leeds City Council",           sector: "Public sector",   location: "Leeds",    status: "established", focus: ["public_sector"],              contact: "Interim contact" },
      { name: "Sheffield Hallam University",  sector: "Higher education",location: "Sheffield",status: "established", focus: ["he","future_leaders"],         contact: "Interim contact" },
      { name: "NHS Yorkshire & Humber",       sector: "Healthcare",      location: "Leeds",    status: "developing",  focus: ["public_sector","diversity"],   contact: "Interim contact" },
      { name: "AMRC (Boeing / Univ. Sheff.)", sector: "Manufacturing",   location: "Sheffield",status: "developing",  focus: ["digital","apprenticeships"],   contact: "Interim contact" },
      { name: "Siemens Mobility",             sector: "Engineering",     location: "Goole",    status: "emerging",    focus: ["sustainability","digital"],    contact: "Interim contact" },
      { name: "Skipton Building Society",     sector: "Financial services",location:"Skipton", status: "target",      focus: ["sme","diversity"],             contact: "Interim contact" },
    ],
  },
  {
    id: "northern_ireland",
    name: "Northern Ireland",
    url: "https://www.managers.org.uk/community/regional-networks/northern-ireland/",
    chair: "Dr Claire Dickson CMgr FCMI",
    contact_email: "northernireland@managers.org.uk",
    counties: ["Belfast","Antrim","Armagh","Down","Fermanagh","Londonderry","Tyrone"],
    overall_status: "emerging",
    summary: "A compact and collaborative region with strong public sector and cross-border economic activity. Growing fintech and cyber sectors in Belfast offer significant development opportunity.",
    focus_strengths: ["public_sector","he"],
    focus_targets: ["digital","sme","diversity"],
    top_employers: [
      { name: "Ulster University",    sector: "Higher Education" },
      { name: "Belfast City Council", sector: "Public Sector" },
      { name: "Invest NI",            sector: "Government Agency" },
      { name: "Allstate NI",          sector: "Technology" },
      { name: "Concentrix",           sector: "Business Services" },
    ],
    sme_context: "Northern Ireland has approximately 75,000 SMEs, with growing clusters in fintech, cybersecurity, and agri-food, supported by Invest NI and cross-border all-island economic activity.",
    board_members: [
      { name: "Dr Claire Dickson CMgr FCMI", role: "Regional Chair",               email: "northernireland@managers.org.uk", skills: ["Academic leadership", "Research & innovation", "Cross-border collaboration"],       sectors: ["Higher education", "Research", "Public sector"] },
      { name: "Niall McAlister MCMI",        role: "Deputy Chair",                 email: "n.mcalister@placeholder.co.uk",  skills: ["Business development", "SME growth", "Financial planning"],                        sectors: ["Professional services", "FinTech", "Agri-food"] },
      { name: "Siobhan Doherty CMgr MCMI",   role: "Board Member — Public Sector", email: "s.doherty@placeholder.co.uk",    skills: ["Policy development", "Public administration", "Service reform"],                   sectors: ["Civil service", "Local government", "Healthcare"] },
      { name: "Patrick Lavery MCMI",         role: "Board Member — SME & Digital", email: "p.lavery@placeholder.co.uk",     skills: ["Digital strategy", "Entrepreneurship", "Product development"],                     sectors: ["Technology", "Cybersecurity", "Start-ups"] },
    ],
    employers: [
      { name: "Ulster University",    sector: "Higher education",  location: "Belfast", status: "established", focus: ["he","future_leaders"],  contact: "Dr Claire Dickson" },
      { name: "Belfast City Council", sector: "Public sector",     location: "Belfast", status: "developing",  focus: ["public_sector"],        contact: "Dr Claire Dickson" },
      { name: "Invest NI",            sector: "Government agency", location: "Belfast", status: "developing",  focus: ["sme","digital"],        contact: "Dr Claire Dickson" },
      { name: "Allstate NI",          sector: "Technology",        location: "Belfast", status: "target",      focus: ["digital","diversity"],  contact: "Dr Claire Dickson" },
    ],
  },
  {
    id: "scotland",
    name: "Scotland",
    url: "https://www.managers.org.uk/community/regional-networks/scotland/",
    chair: "Lesley Mitchell CMgr CCMI",
    contact_email: "scotland@managers.org.uk",
    counties: ["Edinburgh","Glasgow","Aberdeen","Dundee","Highlands & Islands","Fife","Stirling"],
    overall_status: "established",
    summary: "A well-established board with strong presence across Scotland's key cities and sectors including energy, financial services, and higher education. A national devolved board with its own strategic priorities.",
    focus_strengths: ["public_sector","he","sustainability","diversity"],
    focus_targets: ["digital","future_leaders"],
    top_employers: [
      { name: "Scottish Government",     sector: "Public Sector" },
      { name: "University of Edinburgh", sector: "Higher Education" },
      { name: "BP (North Sea)",          sector: "Energy" },
      { name: "Royal Bank of Scotland",  sector: "Financial Services" },
      { name: "NHS Scotland",            sector: "Healthcare" },
    ],
    sme_context: "Scotland has around 340,000 SMEs, with notable strength in food & drink, renewables, tourism, and the growing tech corridor between Edinburgh and Glasgow.",
    board_members: [
      { name: "Lesley Mitchell CMgr CCMI",  role: "Regional Chair",                        email: "scotland@managers.org.uk",       skills: ["Executive leadership", "Devolved policy", "Strategic partnerships"],              sectors: ["Financial services", "Public sector", "Professional services"] },
      { name: "Alasdair Fraser FCMI",        role: "Deputy Chair",                          email: "a.fraser@placeholder.co.uk",     skills: ["Corporate governance", "Business strategy", "Investor relations"],               sectors: ["Energy", "Natural resources", "Consulting"] },
      { name: "Catriona MacLeod CMgr MCMI", role: "Board Member — HE & Future Leaders",    email: "c.macleod@placeholder.co.uk",    skills: ["Leadership development", "Academic management", "Student engagement"],           sectors: ["Higher education", "Skills & training", "Charity"] },
      { name: "Ronan Gillespie MCMI",        role: "Board Member — Energy & Sustainability",email: "r.gillespie@placeholder.co.uk",  skills: ["Net zero strategy", "Project management", "Regulatory affairs"],                 sectors: ["Oil & gas", "Renewable energy", "Engineering"] },
      { name: "Fiona Drummond CMgr MCMI",   role: "Board Member — Public Sector",          email: "f.drummond@placeholder.co.uk",   skills: ["Public service reform", "Performance management", "People strategy"],            sectors: ["Scottish Government", "NHS Scotland", "Local authorities"] },
      { name: "Tariq Bashir MCMI",           role: "Board Member — Diversity & Inclusion",  email: "t.bashir@placeholder.co.uk",     skills: ["Cultural intelligence", "Anti-racism strategy", "Community development"],       sectors: ["Housing", "Social enterprise", "Education"] },
    ],
    employers: [
      { name: "Scottish Government",          sector: "Public sector",     location: "Edinburgh", status: "established", focus: ["public_sector","diversity"],  contact: "Lesley Mitchell" },
      { name: "University of Edinburgh",      sector: "Higher education",  location: "Edinburgh", status: "established", focus: ["he","future_leaders"],         contact: "Lesley Mitchell" },
      { name: "BP (North Sea Transition)",    sector: "Energy",            location: "Aberdeen",  status: "established", focus: ["sustainability","digital"],    contact: "Lesley Mitchell" },
      { name: "Royal Bank of Scotland",       sector: "Financial services",location: "Edinburgh", status: "developing",  focus: ["digital","diversity"],        contact: "Lesley Mitchell" },
      { name: "NHS Scotland",                 sector: "Healthcare",        location: "Glasgow",   status: "developing",  focus: ["public_sector"],              contact: "Lesley Mitchell" },
      { name: "Highlands & Islands Enterprise",sector:"Government agency", location: "Inverness", status: "emerging",    focus: ["sme","sustainability"],       contact: "Lesley Mitchell" },
    ],
  },
  {
    id: "south_east",
    name: "South East",
    url: "https://www.managers.org.uk/community/regional-networks/south-east/",
    chair: "Sarah Furness CMgr FCMI",
    contact_email: "southeast@managers.org.uk",
    counties: ["Kent","Surrey","Sussex (East & West)","Hampshire","Berkshire","Oxfordshire","Buckinghamshire","Essex"],
    overall_status: "developing",
    summary: "A large region with diverse economic activity from pharmaceuticals and aerospace in the west, to ports and logistics in the east. Strong commuter belt membership base.",
    focus_strengths: ["sme","future_leaders"],
    focus_targets: ["public_sector","sustainability","diversity"],
    top_employers: [
      { name: "BAE Systems",             sector: "Defence & Aerospace" },
      { name: "University of Southampton",sector: "Higher Education" },
      { name: "Surrey County Council",   sector: "Public Sector" },
      { name: "Pfizer",                  sector: "Pharmaceutical" },
      { name: "DP World",                sector: "Logistics" },
    ],
    sme_context: "The South East has one of the UK's highest concentrations of SMEs — over 420,000 — driven by strong professional services, technology, and life sciences clusters.",
    board_members: [
      { name: "Sarah Furness CMgr FCMI",   role: "Regional Chair",                        email: "southeast@managers.org.uk",      skills: ["Strategic leadership", "Business growth", "Networking & partnerships"],           sectors: ["Aerospace & defence", "Professional services", "Technology"] },
      { name: "Jonathan Blake MCMI",        role: "Deputy Chair",                          email: "j.blake@placeholder.co.uk",      skills: ["Commercial leadership", "M&A strategy", "Operational excellence"],               sectors: ["Pharmaceutical", "Life sciences", "Consulting"] },
      { name: "Mei-Lin Chang CMgr MCMI",   role: "Board Member — SME & Entrepreneurship", email: "m.chang@placeholder.co.uk",      skills: ["Start-up growth", "Innovation strategy", "Venture development"],                 sectors: ["Technology", "E-commerce", "Creative industries"] },
      { name: "Oliver Watts MCMI",          role: "Board Member — Future Leaders",         email: "o.watts@placeholder.co.uk",      skills: ["Graduate development", "Coaching", "Leadership assessment"],                     sectors: ["Financial services", "Retail", "FMCG"] },
      { name: "Deborah Simmons CMgr MCMI", role: "Board Member — Defence & Aerospace",    email: "d.simmons@placeholder.co.uk",    skills: ["Programme management", "Defence procurement", "STEM engagement"],               sectors: ["Defence", "Aerospace", "Engineering"] },
    ],
    employers: [
      { name: "BAE Systems",              sector: "Defence & Aerospace", location: "Farnborough",     status: "established", focus: ["digital","apprenticeships"],  contact: "Sarah Furness" },
      { name: "University of Southampton",sector: "Higher education",    location: "Southampton",     status: "established", focus: ["he","sustainability"],        contact: "Sarah Furness" },
      { name: "Surrey County Council",    sector: "Public sector",       location: "Guildford",       status: "developing",  focus: ["public_sector"],             contact: "Sarah Furness" },
      { name: "Pfizer",                   sector: "Pharmaceutical",      location: "Sandwich",        status: "developing",  focus: ["digital","diversity"],       contact: "Sarah Furness" },
      { name: "DP World (London Gateway)",sector: "Logistics",           location: "Stanford-le-Hope",status: "emerging",    focus: ["sme","sustainability"],      contact: "Sarah Furness" },
      { name: "Virgin Media O2",          sector: "Technology",          location: "Slough",          status: "target",      focus: ["digital","future_leaders"],  contact: "Sarah Furness" },
    ],
  },
  {
    id: "south_west",
    name: "South West",
    url: "https://www.managers.org.uk/community/regional-networks/south-west/",
    chair: "Martin Perry CMgr FCMI",
    contact_email: "southwest@managers.org.uk",
    counties: ["Bristol","Somerset","Devon","Cornwall","Dorset","Wiltshire","Gloucestershire"],
    overall_status: "developing",
    summary: "An expansive region anchored by Bristol's professional and creative economy. Significant defence, aerospace, and rural enterprise activity alongside growing digital and green energy sectors.",
    focus_strengths: ["sme","sustainability","he"],
    focus_targets: ["diversity","digital","public_sector"],
    top_employers: [
      { name: "Airbus UK",            sector: "Aerospace" },
      { name: "University of Bristol",sector: "Higher Education" },
      { name: "Lloyds Bank",          sector: "Financial Services" },
      { name: "EDF Energy (Hinkley)", sector: "Energy" },
      { name: "Cornwall Council",     sector: "Public Sector" },
    ],
    sme_context: "Around 245,000 SMEs call the South West home, with particular strength in agri-food, tourism, marine industries, and a rapidly growing green energy and tech sector centred on Bristol.",
    board_members: [
      { name: "Martin Perry CMgr FCMI", role: "Regional Chair",                       email: "southwest@managers.org.uk",      skills: ["Regional economic strategy", "Infrastructure leadership", "Business advocacy"],    sectors: ["Aerospace", "Ports & logistics", "Property"] },
      { name: "Elaine Goodwin MCMI",    role: "Deputy Chair",                         email: "e.goodwin@placeholder.co.uk",    skills: ["Financial management", "Governance", "Risk & compliance"],                        sectors: ["Financial services", "Professional services", "Education"] },
      { name: "Ben Truscott CMgr MCMI", role: "Board Member — Sustainability & Energy",email: "b.truscott@placeholder.co.uk", skills: ["Carbon reduction strategy", "Energy systems", "Environmental management"],        sectors: ["Renewable energy", "Environmental consultancy", "Engineering"] },
      { name: "Yemi Adeyemi MCMI",      role: "Board Member — HE & Skills",           email: "y.adeyemi@placeholder.co.uk",    skills: ["Curriculum strategy", "Student outcomes", "Widening participation"],              sectors: ["Higher education", "Further education", "Skills"] },
      { name: "Karen Pascoe MCMI",      role: "Board Member — SME & Rural Enterprise",email: "k.pascoe@placeholder.co.uk",    skills: ["Rural business development", "Agri-food sector", "Community enterprise"],         sectors: ["Agriculture", "Food & drink", "Tourism"] },
    ],
    employers: [
      { name: "Airbus UK",              sector: "Aerospace",          location: "Filton",           status: "established", focus: ["digital","apprenticeships"],  contact: "Martin Perry" },
      { name: "University of Bristol",  sector: "Higher education",   location: "Bristol",          status: "established", focus: ["he","future_leaders"],        contact: "Martin Perry" },
      { name: "Lloyds Bank (Bristol)",  sector: "Financial services", location: "Bristol",          status: "developing",  focus: ["diversity","digital"],        contact: "Martin Perry" },
      { name: "EDF Energy (Hinkley)",   sector: "Energy",             location: "Bridgwater",       status: "developing",  focus: ["sustainability"],             contact: "Martin Perry" },
      { name: "Cornwall Council",       sector: "Public sector",      location: "Truro",            status: "emerging",    focus: ["public_sector","sme"],        contact: "Martin Perry" },
      { name: "Renishaw",               sector: "Manufacturing",      location: "Wotton-under-Edge",status: "target",      focus: ["digital","apprenticeships"],  contact: "Martin Perry" },
    ],
  },
  {
    id: "wales",
    name: "Wales / Cymru",
    url: "https://www.managers.org.uk/community/regional-networks/wales/",
    chair: "Bethan Owen CMgr MCMI",
    contact_email: "wales@managers.org.uk",
    counties: ["Cardiff","Swansea","Newport","Wrexham","Rhondda Cynon Taf","Gwynedd","Pembrokeshire"],
    overall_status: "emerging",
    summary: "A devolved national board with bilingual engagement across Wales. Cardiff and Swansea are principal hubs. Strong public sector and growing digital economy offer strategic opportunity.",
    focus_strengths: ["public_sector","he"],
    focus_targets: ["digital","diversity","sme","future_leaders"],
    top_employers: [
      { name: "Welsh Government",  sector: "Public Sector" },
      { name: "Cardiff University",sector: "Higher Education" },
      { name: "DVLA",              sector: "Public Sector" },
      { name: "Admiral Group",     sector: "Financial Services" },
      { name: "Arup",              sector: "Professional Services" },
    ],
    sme_context: "Wales has approximately 140,000 SMEs, with clusters in agri-food, advanced manufacturing, and a growing tech scene in Cardiff. Welsh Government support programmes play a significant enabling role.",
    board_members: [
      { name: "Bethan Owen CMgr MCMI", role: "Regional Chair",                          email: "wales@managers.org.uk",          skills: ["Bilingual leadership", "Welsh public policy", "Stakeholder engagement"],           sectors: ["Public sector", "Welsh Government", "Professional services"] },
      { name: "Rhys Griffiths MCMI",   role: "Deputy Chair",                            email: "r.griffiths@placeholder.co.uk",  skills: ["Commercial strategy", "Business transformation", "P&L management"],             sectors: ["Financial services", "Insurance", "Technology"] },
      { name: "Sioned Parry CMgr MCMI",role: "Board Member — Public Sector",            email: "s.parry@placeholder.co.uk",      skills: ["Policy implementation", "Equalities", "Service design"],                        sectors: ["Local government", "NHS Wales", "Education"] },
      { name: "Ceri Thomas MCMI",      role: "Board Member — HE & Welsh Language",      email: "c.thomas@placeholder.co.uk",     skills: ["Welsh medium education", "Academic leadership", "Cultural engagement"],          sectors: ["Higher education", "Further education", "Arts & culture"] },
      { name: "Imogen Davies MCMI",    role: "Board Member — Digital & Future Leaders", email: "i.davies@placeholder.co.uk",     skills: ["Digital product management", "Youth leadership", "Agile delivery"],              sectors: ["Technology", "Start-ups", "Media"] },
    ],
    employers: [
      { name: "Welsh Government",  sector: "Public sector",       location: "Cardiff", status: "established", focus: ["public_sector","diversity"],  contact: "Bethan Owen" },
      { name: "Cardiff University",sector: "Higher education",    location: "Cardiff", status: "established", focus: ["he","future_leaders"],        contact: "Bethan Owen" },
      { name: "DVLA",              sector: "Public sector",       location: "Swansea", status: "developing",  focus: ["public_sector","digital"],    contact: "Bethan Owen" },
      { name: "Admiral Group",     sector: "Financial services",  location: "Cardiff", status: "emerging",    focus: ["digital","diversity"],        contact: "Bethan Owen" },
      { name: "Arup",              sector: "Professional services",location: "Cardiff", status: "target",     focus: ["sustainability","digital"],   contact: "Bethan Owen" },
    ],
  },
  {
    id: "west_midlands_nw",
    name: "West Midlands & North West",
    url: "https://www.managers.org.uk/community/regional-networks/west-midlands-and-north-west/",
    chair: "Elizabeth Oni-Iyiola CMgr CCMI",
    contact_email: "westmidlands@managers.org.uk",
    counties: ["Birmingham","Coventry","Wolverhampton","Manchester","Liverpool","Cheshire","Lancashire","Staffordshire","Shropshire"],
    overall_status: "established",
    summary: "One of CMI's largest combined boards, covering the industrial heartlands of the Midlands alongside the Northern Powerhouse. Exceptional breadth from automotive to media, public sector to fintech.",
    focus_strengths: ["diversity","apprenticeships","future_leaders","digital"],
    focus_targets: ["sustainability","sme"],
    top_employers: [
      { name: "Jaguar Land Rover",     sector: "Automotive" },
      { name: "Manchester City Council",sector: "Public Sector" },
      { name: "BBC (Media City)",       sector: "Media" },
      { name: "Aston University",       sector: "Higher Education" },
      { name: "Co-op Group",            sector: "Retail" },
    ],
    sme_context: "The combined region is home to over 380,000 SMEs — one of the UK's largest — spanning advanced manufacturing, logistics, the visitor economy, and a rapidly expanding fintech sector in Manchester.",
    board_members: [
      { name: "Elizabeth Oni-Iyiola CMgr CCMI", role: "Regional Chair",                           email: "westmidlands@managers.org.uk",   skills: ["Inclusive leadership", "Board-level strategy", "Organisational transformation"],   sectors: ["Financial services", "Professional services", "Education"] },
      { name: "Craig Mossop FCMI",               role: "Deputy Chair",                             email: "c.mossop@placeholder.co.uk",     skills: ["Operations strategy", "Supply chain", "Business improvement"],                    sectors: ["Automotive", "Manufacturing", "Logistics"] },
      { name: "Nneka Obi CMgr MCMI",             role: "Board Member — Diversity & Inclusion",     email: "n.obi@placeholder.co.uk",        skills: ["Equity, diversity & inclusion", "Allyship programmes", "Culture change"],         sectors: ["Media", "Retail", "Charity"] },
      { name: "Will Ashton MCMI",                role: "Board Member — Apprenticeships",           email: "w.ashton@placeholder.co.uk",     skills: ["Apprenticeship levy strategy", "Workforce planning", "Skills ecosystems"],        sectors: ["Engineering", "Advanced manufacturing", "Further education"] },
      { name: "Sameera Khan CMgr MCMI",          role: "Board Member — Future Leaders",            email: "s.khan@placeholder.co.uk",       skills: ["Talent management", "Mentoring", "Graduate programmes"],                         sectors: ["Technology", "Consulting", "Higher education"] },
      { name: "David Lowe MCMI",                 role: "Board Member — Digital Leadership",        email: "d.lowe@placeholder.co.uk",       skills: ["Digital transformation", "Data strategy", "Cyber resilience"],                   sectors: ["Technology", "Financial services", "Public sector"] },
      { name: "Janet Corbett CMgr MCMI",         role: "Board Member — Manufacturing & Automotive",email: "j.corbett@placeholder.co.uk",   skills: ["Lean manufacturing", "Quality management", "International supply chains"],       sectors: ["Automotive", "Aerospace", "Industrial engineering"] },
    ],
    employers: [
      { name: "Jaguar Land Rover",                 sector: "Automotive",      location: "Coventry",    status: "established", focus: ["digital","apprenticeships"],   contact: "Elizabeth Oni-Iyiola" },
      { name: "Manchester City Council",           sector: "Public sector",   location: "Manchester",  status: "established", focus: ["public_sector","diversity"],   contact: "Elizabeth Oni-Iyiola" },
      { name: "BBC (Media City)",                  sector: "Media",           location: "Salford",     status: "established", focus: ["diversity","future_leaders"],  contact: "Elizabeth Oni-Iyiola" },
      { name: "Aston University",                  sector: "Higher education",location: "Birmingham",  status: "established", focus: ["he","diversity"],             contact: "Elizabeth Oni-Iyiola" },
      { name: "Co-op Group",                       sector: "Retail",          location: "Manchester",  status: "developing",  focus: ["sme","sustainability"],       contact: "Elizabeth Oni-Iyiola" },
      { name: "Keele University",                  sector: "Higher education",location: "Staffordshire",status:"developing",  focus: ["he","sustainability"],        contact: "Elizabeth Oni-Iyiola" },
      { name: "Liverpool City Region CA",          sector: "Public sector",   location: "Liverpool",   status: "developing",  focus: ["public_sector","digital"],    contact: "Elizabeth Oni-Iyiola" },
      { name: "AstraZeneca (Macclesfield)",        sector: "Pharmaceutical",  location: "Macclesfield",status: "target",      focus: ["sustainability","digital"],   contact: "Elizabeth Oni-Iyiola" },
    ],
  },
];

const INTL_REGIONS = [
  { id: "hong_kong",    name: "Hong Kong",   status: "established", url: "https://www.managers.org.uk/community/regional-networks/hong-kong/" },
  { id: "malaysia",     name: "Malaysia",    status: "established", url: "https://www.managers.org.uk/community/regional-networks/malaysia/" },
  { id: "sri_lanka",    name: "Sri Lanka",   status: "developing",  url: "https://www.managers.org.uk/community/regional-networks/sri-lanka/" },
  { id: "singapore",    name: "Singapore",   status: "emerging",    url: "https://www.managers.org.uk/community/regional-networks/singapore/" },
  { id: "middle_east",  name: "Middle East", status: "emerging",    url: "https://www.managers.org.uk/community/regional-networks/middle-east/" },
];

// ── Shared site header ─────────────────────────────────────────────────────

function SiteHeader({ children }) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: `3px solid ${CMI_PINK}`,
      padding: "0 1.5rem",
      marginBottom: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, minHeight: 64,
      }}>
        {/* Logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, background: CMI_PINK, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {/* Logo placeholder — swap src for real CMI logo URL */}
            <i className="ti ti-chart-network" style={{ fontSize: 24, color: "#fff" }} aria-hidden="true" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: CMI_PINK, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Chartered Management Institute
            </p>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
              Regional Board Intelligence Dashboard
            </h1>
          </div>
        </div>
        {/* Right-side slot for nav controls */}
        {children && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{children}</div>}
      </div>
    </div>
  );
}

// ── Shared components ──────────────────────────────────────────────────────

function StatusBadge({ status, small }) {
  const s = ESTABLISHMENT_LEVELS[status] || ESTABLISHMENT_LEVELS.target;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 20, padding: small ? "2px 8px" : "4px 10px",
      fontSize: small ? 11 : 12, fontWeight: 600, whiteSpace: "nowrap"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function FilterPill({ label, active, color, bg, border, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: active ? (color || CMI_PINK) : "#e8e8e6",
      color: active ? "#fff" : "#555",
      border: `1.5px solid ${active ? (border || CMI_PINK) : "#d4d4d0"}`,
      borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600,
      cursor: "pointer", transition: "all 0.15s",
    }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize: 12 }} aria-hidden="true" />}
      {label}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      margin: "0 0 8px", fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.07em", color: "#888"
    }}>{children}</p>
  );
}

// ── Employer pipeline pie chart ────────────────────────────────────────────

function PipelinePie({ employers }) {
  const counts = {};
  employers.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });
  const data = Object.entries(counts).map(([k, v]) => ({
    name: ESTABLISHMENT_LEVELS[k].label,
    value: v,
    color: ESTABLISHMENT_LEVELS[k].color,
  }));

  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
            dataKey="value" paddingAngle={3}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [v + " employer" + (v !== 1 ? "s" : ""), n]} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Region card (home page) ────────────────────────────────────────────────

function RegionCard({ region, onClick, activeFocusFilters, statusFilter }) {
  const s = ESTABLISHMENT_LEVELS[region.overall_status];
  const statusMatch = statusFilter === "all" || region.overall_status === statusFilter;
  const focusMatch = activeFocusFilters.length === 0 ||
    activeFocusFilters.some(f => region.focus_strengths.includes(f) || region.focus_targets.includes(f));
  if (!statusMatch || !focusMatch) return null;

  return (
    <div onClick={() => onClick(region)} style={{
      background: "#fff", border: `1.5px solid ${s.border}`,
      borderRadius: 12, padding: "1rem 1.25rem", cursor: "pointer",
      transition: "box-shadow 0.15s, transform 0.1s",
      position: "relative", overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 5, bottom: 0, background: s.color, borderRadius: "12px 0 0 12px" }} />
      <div style={{ paddingLeft: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: "#1a1a1a" }}>{region.name}</p>
          <StatusBadge status={region.overall_status} small />
        </div>
        <p style={{ fontSize: 12, color: "#666", margin: "0 0 10px", lineHeight: 1.5 }}>
          {region.counties.slice(0, 3).join(", ")}{region.counties.length > 3 ? ` +${region.counties.length - 3} more` : ""}
        </p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          {region.focus_strengths.map(f => {
            const fa = FOCUS_AREAS.find(x => x.id === f);
            return fa ? (
              <span key={f} style={{ fontSize: 11, background: CMI_PINK_LIGHT, color: CMI_PINK, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                {fa.label}
              </span>
            ) : null;
          })}
        </div>
        <div style={{ display: "flex", gap: 10, borderTop: "1px solid #f0f0ee", paddingTop: 8 }}>
          {Object.entries({ established: 0, developing: 0, emerging: 0, target: 0 }).map(([k]) => {
            const count = region.employers.filter(e => e.status === k).length;
            return count > 0 ? (
              <span key={k} style={{ fontSize: 11, color: ESTABLISHMENT_LEVELS[k].color, fontWeight: 600 }}>
                {count} {ESTABLISHMENT_LEVELS[k].label.split(" ")[0].toLowerCase()}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

// ── Employer row (detail page) ─────────────────────────────────────────────

function EmployerRow({ emp, activeFocusFilters }) {
  const matches = activeFocusFilters.length === 0 || activeFocusFilters.some(f => emp.focus.includes(f));
  if (!matches) return null;
  return (
    <div style={{
      background: "#fff", borderRadius: 8, padding: "10px 14px",
      display: "grid", gridTemplateColumns: "1fr auto auto",
      alignItems: "center", gap: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>{emp.name}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{emp.sector} · {emp.location}</p>
        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
          {emp.focus.map(f => {
            const fa = FOCUS_AREAS.find(x => x.id === f);
            return fa ? (
              <span key={f} style={{ fontSize: 10, background: "#f0f0ee", color: "#555", padding: "1px 6px", borderRadius: 8, fontWeight: 500 }}>
                {fa.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
      <StatusBadge status={emp.status} small />
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Contact</p>
        <p style={{ margin: 0, fontSize: 12, color: "#444", fontWeight: 600 }}>{emp.contact}</p>
      </div>
    </div>
  );
}

// ── Region detail page ─────────────────────────────────────────────────────

function RegionDetail({ region, onBack, activeFocusFilters, setActiveFocusFilters }) {
  const [activeTab, setActiveTab] = useState("overview");
  const s = ESTABLISHMENT_LEVELS[region.overall_status];

  const filteredEmployers = region.employers.filter(e =>
    activeFocusFilters.length === 0 || activeFocusFilters.some(f => e.focus.includes(f))
  );
  const empByStatus = {};
  filteredEmployers.forEach(e => {
    if (!empByStatus[e.status]) empByStatus[e.status] = [];
    empByStatus[e.status].push(e);
  });

  const TABS = [
    { id: "overview",  label: "Overview" },
    { id: "board",     label: `Board (${region.board_members.length})` },
    { id: "employers", label: `Employers (${filteredEmployers.length})` },
    { id: "focus",     label: "Focus areas" },
  ];

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh" }}>
      <SiteHeader>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#fff", border: `1.5px solid ${CMI_PINK}`,
          borderRadius: 8, color: CMI_PINK,
          fontSize: 13, cursor: "pointer", padding: "6px 14px", fontWeight: 700
        }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 13 }} aria-hidden="true" />
          All regions
        </button>
      </SiteHeader>

      <div style={{ padding: "0 1rem 2rem" }}>

      {/* Header card */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: `5px solid ${s.color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{region.name}</h2>
          <StatusBadge status={region.overall_status} />
        </div>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 6px" }}>
          Chair: <strong style={{ color: "#1a1a1a" }}>{region.chair}</strong>
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href={`mailto:${region.contact_email}`} style={{ fontSize: 13, color: CMI_PINK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <i className="ti ti-mail" style={{ fontSize: 13 }} aria-hidden="true" />{region.contact_email}
          </a>
          <a href={region.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#777", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <i className="ti ti-external-link" style={{ fontSize: 12 }} aria-hidden="true" />CMI page
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "2px solid #f0f0ee", padding: "0 1rem" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: "transparent", border: "none",
              borderBottom: `3px solid ${activeTab === t.id ? CMI_PINK : "transparent"}`,
              color: activeTab === t.id ? CMI_PINK : "#777",
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: 13, cursor: "pointer", padding: "14px 18px", marginBottom: -2,
              transition: "all 0.15s"
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.25rem 1.5rem" }}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#333", marginBottom: 20 }}>{region.summary}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ background: PAGE_BG, borderRadius: 10, padding: "1rem" }}>
                  <SectionLabel>Geography</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {region.counties.map(c => (
                      <span key={c} style={{ fontSize: 12, background: "#fff", border: "1px solid #ddd", color: "#555", padding: "3px 9px", borderRadius: 10 }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: PAGE_BG, borderRadius: 10, padding: "1rem" }}>
                  <SectionLabel>Employer pipeline</SectionLabel>
                  <PipelinePie employers={region.employers} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ background: PAGE_BG, borderRadius: 10, padding: "1rem" }}>
                  <SectionLabel>Top 5 employers in region</SectionLabel>
                  {region.top_employers.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: CMI_PINK, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{e.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#777" }}>{e.sector}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: PAGE_BG, borderRadius: 10, padding: "1rem" }}>
                  <SectionLabel>SME landscape</SectionLabel>
                  <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>{region.sme_context}</p>
                </div>
              </div>

              <div style={{ background: CMI_PINK_LIGHT, border: `1px solid ${CMI_PINK_MID}`, borderRadius: 10, padding: "1rem" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: CMI_PINK, fontWeight: 700 }}>
                  <i className="ti ti-target" style={{ marginRight: 6 }} aria-hidden="true" />
                  Strategic focus targets
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {region.focus_targets.map(f => {
                    const fa = FOCUS_AREAS.find(x => x.id === f);
                    return fa ? (
                      <span key={f} style={{ fontSize: 12, background: "#fff", color: CMI_PINK, border: `1px solid ${CMI_PINK}`, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{fa.label}</span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BOARD */}
          {activeTab === "board" && (
            <div>
              <p style={{ fontSize: 13, color: "#777", margin: "0 0 14px" }}>
                {region.board_members.length} member{region.board_members.length !== 1 ? "s" : ""} · contact details and profile data are illustrative placeholders for demo purposes
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {region.board_members.map((m, i) => (
                  <div key={i} style={{
                    background: i === 0 ? CMI_PINK_LIGHT : PAGE_BG,
                    borderRadius: 10, padding: "1rem 1.1rem",
                    border: i === 0 ? `1.5px solid ${CMI_PINK_MID}` : "1.5px solid #e4e4e0",
                  }}>
                    {/* Top row — avatar, name, role, email */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                          background: i === 0 ? CMI_PINK : "#ccc",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i className="ti ti-user" style={{ fontSize: 16, color: "#fff" }} aria-hidden="true" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{m.name}</p>
                          <p style={{ margin: 0, fontSize: 12, color: i === 0 ? CMI_PINK : "#666" }}>{m.role}</p>
                        </div>
                      </div>
                      <a href={`mailto:${m.email}`} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 12, color: CMI_PINK, textDecoration: "none",
                        background: "#fff", border: `1.5px solid ${CMI_PINK_MID}`,
                        borderRadius: 20, padding: "5px 12px", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600
                      }}>
                        <i className="ti ti-mail" style={{ fontSize: 12 }} aria-hidden="true" />
                        Email
                      </a>
                    </div>
                    {/* Skills & sectors */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "0.7rem 0.9rem" }}>
                        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#999" }}>Key skills</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {m.skills.map((s, si) => (
                            <div key={si} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: CMI_PINK, flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: "#333" }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "0.7rem 0.9rem" }}>
                        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#999" }}>Main sector experience</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {m.sectors.map((s, si) => (
                            <span key={si} style={{
                              fontSize: 11, background: CMI_PINK_LIGHT, color: CMI_PINK,
                              border: `1px solid ${CMI_PINK_MID}`, borderRadius: 20,
                              padding: "2px 9px", fontWeight: 600
                            }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMPLOYERS */}
          {activeTab === "employers" && (
            <div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                {FOCUS_AREAS.map(f => (
                  <FilterPill
                    key={f.id}
                    label={f.label}
                    icon={f.icon}
                    active={activeFocusFilters.includes(f.id)}
                    onClick={() => setActiveFocusFilters(prev =>
                      prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id]
                    )}
                  />
                ))}
                {activeFocusFilters.length > 0 && (
                  <button onClick={() => setActiveFocusFilters([])} style={{ fontSize: 12, color: "#888", background: "transparent", border: "none", cursor: "pointer" }}>
                    <i className="ti ti-x" style={{ fontSize: 12 }} /> Clear
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(ESTABLISHMENT_LEVELS).map(([status, meta]) => {
                  const emps = empByStatus[status] || [];
                  if (emps.length === 0) return null;
                  return (
                    <div key={status}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: meta.color }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                        <span style={{ fontSize: 12, color: "#999" }}>({emps.length})</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {emps.map((e, i) => <EmployerRow key={i} emp={e} activeFocusFilters={activeFocusFilters} />)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredEmployers.length === 0 && (
                <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "2rem 0" }}>No employers match the selected filters.</p>
              )}

              <div style={{ background: PAGE_BG, borderRadius: 8, padding: "0.75rem 1rem", marginTop: 16, border: "1px solid #e4e4e0" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
                  <i className="ti ti-info-circle" style={{ marginRight: 5 }} aria-hidden="true" />
                  Have a lead? Contact <strong style={{ color: "#1a1a1a" }}>{region.chair}</strong> at{" "}
                  <a href={`mailto:${region.contact_email}`} style={{ color: CMI_PINK }}>{region.contact_email}</a>
                </p>
              </div>
            </div>
          )}

          {/* FOCUS AREAS */}
          {activeTab === "focus" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FOCUS_AREAS.map(f => {
                const isStrength = region.focus_strengths.includes(f.id);
                const isTarget = region.focus_targets.includes(f.id);
                const relevantEmps = region.employers.filter(e => e.focus.includes(f.id));
                return (
                  <div key={f.id} style={{
                    background: isStrength ? "#e1f5ee" : isTarget ? CMI_PINK_LIGHT : PAGE_BG,
                    border: `1.5px solid ${isStrength ? "#5dcaa5" : isTarget ? CMI_PINK_MID : "#e0e0dc"}`,
                    borderRadius: 10, padding: "0.875rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <i className={`ti ${f.icon}`} style={{ fontSize: 15, color: isStrength ? "#0f6e56" : isTarget ? CMI_PINK : "#aaa" }} aria-hidden="true" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: isStrength ? "#0f6e56" : isTarget ? CMI_PINK : "#333" }}>{f.label}</span>
                    </div>
                    <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 600, color: isStrength ? "#085041" : isTarget ? "#993556" : "#999" }}>
                      {isStrength ? "Strength area" : isTarget ? "Target / growth area" : "Not a current priority"}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{relevantEmps.length} employer{relevantEmps.length !== 1 ? "s" : ""} in pipeline</p>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
    </div>
  );
}

// ── Home page ──────────────────────────────────────────────────────────────

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeFocusFilters, setActiveFocusFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("uk");

  const filteredRegions = useMemo(() => {
    return REGIONS.filter(r => {
      if (statusFilter !== "all" && r.overall_status !== statusFilter) return false;
      if (activeFocusFilters.length > 0) {
        return activeFocusFilters.some(f => r.focus_strengths.includes(f) || r.focus_targets.includes(f));
      }
      return true;
    });
  }, [statusFilter, activeFocusFilters]);

  const totalEmployers = REGIONS.reduce((sum, r) => sum + r.employers.length, 0);
  const establishedCount = REGIONS.filter(r => r.overall_status === "established").length;

  if (selectedRegion) {
    return (
      <RegionDetail
        region={selectedRegion}
        onBack={() => setSelectedRegion(null)}
        activeFocusFilters={activeFocusFilters}
        setActiveFocusFilters={setActiveFocusFilters}
      />
    );
  }

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh" }}>
      <SiteHeader>
        <div style={{ display: "flex", gap: 5 }}>
          {["uk", "intl"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              fontSize: 12, padding: "6px 14px", borderRadius: 7,
              background: view === v ? CMI_PINK : "#fff",
              color: view === v ? "#fff" : "#555",
              border: `1.5px solid ${view === v ? CMI_PINK : "#ccc"}`,
              cursor: "pointer", fontWeight: 700
            }}>{v === "uk" ? "UK" : "International"}</button>
          ))}
        </div>
      </SiteHeader>

      <div style={{ padding: "0 1rem 2rem" }}>

      {/* Stat boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "UK regions",       value: REGIONS.length,      icon: "ti-map" },
          { label: "Established",      value: establishedCount,    icon: "ti-circle-check", color: "#0f6e56" },
          { label: "Employers tracked",value: totalEmployers,      icon: "ti-building" },
          { label: "Intl boards",      value: INTL_REGIONS.length, icon: "ti-world" },
        ].map(m => (
          <div key={m.label} style={{
            background: "#fff", borderRadius: 10, padding: "1rem 1.1rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 4
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 14, color: m.color || CMI_PINK }} aria-hidden="true" />
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</p>
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: m.color || "#1a1a1a" }}>{m.value}</p>
          </div>
        ))}
      </div>

      {view === "uk" && (
        <>
          {/* Filter panel */}
          <div style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Filter by status</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <FilterPill label="All regions" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                {Object.entries(ESTABLISHMENT_LEVELS).map(([k, v]) => (
                  <FilterPill
                    key={k}
                    label={v.label}
                    active={statusFilter === k}
                    color={v.color}
                    bg={v.bg}
                    border={v.border}
                    onClick={() => setStatusFilter(k)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Filter by focus area</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {FOCUS_AREAS.map(f => (
                  <FilterPill
                    key={f.id}
                    label={f.label}
                    icon={f.icon}
                    active={activeFocusFilters.includes(f.id)}
                    onClick={() => setActiveFocusFilters(prev =>
                      prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id]
                    )}
                  />
                ))}
                {activeFocusFilters.length > 0 && (
                  <button onClick={() => setActiveFocusFilters([])} style={{ fontSize: 12, color: "#888", background: "transparent", border: "none", cursor: "pointer", fontWeight: 500 }}>
                    <i className="ti ti-x" style={{ fontSize: 12 }} /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Region cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {filteredRegions.map(r => (
              <RegionCard key={r.id} region={r} onClick={setSelectedRegion}
                activeFocusFilters={activeFocusFilters} statusFilter={statusFilter} />
            ))}
          </div>

          {filteredRegions.length === 0 && (
            <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "2rem 0" }}>
              No regions match.{" "}
              <button onClick={() => { setStatusFilter("all"); setActiveFocusFilters([]); }}
                style={{ color: CMI_PINK, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Reset filters
              </button>
            </p>
          )}

          {/* Legend */}
          <div style={{ marginTop: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
            {Object.entries(ESTABLISHMENT_LEVELS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: v.color }} />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>{v.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "intl" && (
        <div>
          <p style={{ fontSize: 13, color: "#777", marginBottom: 16 }}>
            CMI has active regional boards across Asia-Pacific and the Middle East.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {INTL_REGIONS.map(r => {
              const s = ESTABLISHMENT_LEVELS[r.status];
              return (
                <div key={r.id} style={{
                  background: "#fff", border: `1.5px solid ${s.border}`,
                  borderRadius: 12, padding: "1rem 1.25rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 5, bottom: 0, background: s.color, borderRadius: "12px 0 0 12px" }} />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{r.name}</p>
                    <StatusBadge status={r.status} small />
                    <div style={{ marginTop: 10 }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: CMI_PINK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                        <i className="ti ti-external-link" style={{ fontSize: 12 }} aria-hidden="true" />View board
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 8, padding: "0.75rem 1rem", border: "1px solid #e4e4e0" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
              <i className="ti ti-info-circle" style={{ marginRight: 5 }} aria-hidden="true" />
              Full details at{" "}
              <a href="https://www.managers.org.uk/community/cmi-internationally/" target="_blank" rel="noopener noreferrer" style={{ color: CMI_PINK }}>
                managers.org.uk/community/cmi-internationally
              </a>
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, borderTop: "1px solid #e4e4e0", paddingTop: 12 }}>
        <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
          Data sourced from publicly available CMI information. Employer data is illustrative for demonstration purposes.{" "}
          <a href="https://www.managers.org.uk/community/regional-networks/" target="_blank" rel="noopener noreferrer" style={{ color: "#aaa" }}>managers.org.uk</a>
        </p>
      </div>
      </div>
    </div>
  );
}
