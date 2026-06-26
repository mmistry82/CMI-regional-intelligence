import { useState, useMemo } from "react";

const CMI_PINK = "#d10074";
const CMI_PINK_LIGHT = "#fce8f3";
const CMI_PINK_MID = "#f4a0cc";

const ESTABLISHMENT_LEVELS = {
  established: { label: "Established", color: "#0f6e56", bg: "#e1f5ee", border: "#5dcaa5" },
  developing: { label: "Developing", color: "#854f0b", bg: "#faeeda", border: "#ef9f27" },
  emerging: { label: "Emerging", color: "#185fa5", bg: "#e6f1fb", border: "#85b7eb" },
  target: { label: "Target / Not yet active", color: "#993556", bg: "#fbeaf0", border: "#ed93b1" },
};

const FOCUS_AREAS = [
  { id: "diversity", label: "Diversity & inclusion", icon: "ti-users" },
  { id: "future_leaders", label: "Future leaders", icon: "ti-star" },
  { id: "public_sector", label: "Public sector", icon: "ti-building-bank" },
  { id: "sme", label: "SME & entrepreneurship", icon: "ti-briefcase" },
  { id: "he", label: "Higher education", icon: "ti-school" },
  { id: "apprenticeships", label: "Apprenticeships", icon: "ti-certificate" },
  { id: "sustainability", label: "Sustainability", icon: "ti-leaf" },
  { id: "digital", label: "Digital leadership", icon: "ti-cpu" },
];

const REGIONS = [
  {
    id: "east_midlands",
    name: "East Midlands & Eastern",
    url: "https://www.managers.org.uk/community/regional-networks/east-midlands-and-eastern/",
    chair: "Manisha Bhatt CMgr FCMI",
    contact_email: "eastmidlands@managers.org.uk",
    counties: ["Derbyshire", "Leicestershire", "Northamptonshire", "Lincolnshire", "Cambridgeshire", "Norfolk", "Suffolk"],
    overall_status: "developing",
    summary: "A large and geographically diverse region spanning the East Midlands and East of England. Strong university presence and growing manufacturing and logistics sector engagement.",
    focus_strengths: ["he", "apprenticeships", "sme"],
    focus_targets: ["diversity", "digital", "sustainability"],
    board_members: [
      { name: "Manisha Bhatt CMgr FCMI", role: "Regional Chair", email: "eastmidlands@managers.org.uk" },
      { name: "James Cartwright MCMI", role: "Deputy Chair", email: "j.cartwright@placeholder.co.uk" },
      { name: "Priya Nair CMgr MCMI", role: "Board Member — HE Lead", email: "p.nair@placeholder.co.uk" },
      { name: "Tom Whitfield MCMI", role: "Board Member — Apprenticeships", email: "t.whitfield@placeholder.co.uk" },
      { name: "Sandra Osei MCMI", role: "Board Member — Diversity & Inclusion", email: "s.osei@placeholder.co.uk" },
    ],
    employers: [
      { name: "Rolls-Royce", sector: "Engineering", location: "Derby", status: "established", focus: ["digital", "apprenticeships"], contact: "Manisha Bhatt" },
      { name: "University of Leicester", sector: "Higher education", location: "Leicester", status: "established", focus: ["he", "future_leaders"], contact: "Manisha Bhatt" },
      { name: "DHL Supply Chain", sector: "Logistics", location: "Derby", status: "developing", focus: ["sme", "apprenticeships"], contact: "Manisha Bhatt" },
      { name: "Nottingham City Council", sector: "Public sector", location: "Nottingham", status: "developing", focus: ["public_sector", "diversity"], contact: "Manisha Bhatt" },
      { name: "Anglian Water", sector: "Utilities", location: "Huntingdon", status: "emerging", focus: ["sustainability", "digital"], contact: "Manisha Bhatt" },
      { name: "Norfolk & Norwich NHS", sector: "Healthcare", location: "Norwich", status: "target", focus: ["public_sector", "diversity"], contact: "Manisha Bhatt" },
      { name: "Peterborough City Council", sector: "Public sector", location: "Peterborough", status: "target", focus: ["public_sector"], contact: "Manisha Bhatt" },
    ],
  },
  {
    id: "london",
    name: "London",
    url: "https://www.managers.org.uk/community/regional-networks/london/",
    chair: "Katie Sherwood CMgr MCMI",
    contact_email: "london@managers.org.uk",
    counties: ["Central London", "East London", "West London", "North London", "South London"],
    overall_status: "established",
    summary: "CMI's most active UK region with deep roots across financial services, professional services, and public sector. Strong links with major London universities and the Civil Service.",
    focus_strengths: ["diversity", "future_leaders", "he", "public_sector"],
    focus_targets: ["sme", "digital"],
    board_members: [
      { name: "Katie Sherwood CMgr MCMI", role: "Regional Chair", email: "london@managers.org.uk" },
      { name: "Dominic Okafor FCMI", role: "Deputy Chair", email: "d.okafor@placeholder.co.uk" },
      { name: "Rachel Teng CMgr MCMI", role: "Board Member — Future Leaders", email: "r.teng@placeholder.co.uk" },
      { name: "Marcus Hall MCMI", role: "Board Member — Public Sector", email: "m.hall@placeholder.co.uk" },
      { name: "Aisha Patel CMgr MCMI", role: "Board Member — Diversity & Inclusion", email: "a.patel@placeholder.co.uk" },
      { name: "Chris Delaney MCMI", role: "Board Member — Financial Services", email: "c.delaney@placeholder.co.uk" },
    ],
    employers: [
      { name: "KPMG", sector: "Professional services", location: "Canary Wharf", status: "established", focus: ["future_leaders", "diversity"], contact: "Katie Sherwood" },
      { name: "Transport for London", sector: "Public sector", location: "Southwark", status: "established", focus: ["public_sector", "digital"], contact: "Katie Sherwood" },
      { name: "King's College London", sector: "Higher education", location: "London Bridge", status: "established", focus: ["he", "future_leaders"], contact: "Katie Sherwood" },
      { name: "NHS England", sector: "Healthcare", location: "City of London", status: "established", focus: ["public_sector", "diversity"], contact: "Katie Sherwood" },
      { name: "Barclays", sector: "Financial services", location: "Canary Wharf", status: "developing", focus: ["digital", "diversity"], contact: "Katie Sherwood" },
      { name: "Hackney Council", sector: "Public sector", location: "Hackney", status: "developing", focus: ["public_sector", "diversity"], contact: "Katie Sherwood" },
      { name: "Tech Nation (est. equivalent)", sector: "Tech / Digital", location: "Shoreditch", status: "target", focus: ["digital", "sme"], contact: "Katie Sherwood" },
    ],
  },
  {
    id: "north_east_yorks",
    name: "North East, Yorkshire & Humberside",
    url: "https://www.managers.org.uk/community/regional-networks/north-east-yorkshire-and-humberside/",
    chair: "Vacant (interim)",
    contact_email: "northeast@managers.org.uk",
    counties: ["County Durham", "Tyne & Wear", "Northumberland", "Teesside", "North Yorkshire", "West Yorkshire", "South Yorkshire", "East Riding", "Humberside"],
    overall_status: "developing",
    summary: "A region with significant industrial heritage and growing creative and digital economies. Leeds and Sheffield are key hubs. Leadership chair currently being recruited.",
    focus_strengths: ["apprenticeships", "public_sector"],
    focus_targets: ["digital", "diversity", "future_leaders", "sustainability"],
    board_members: [
      { name: "Vacancy — Regional Chair", role: "Regional Chair (being recruited)", email: "northeast@managers.org.uk" },
      { name: "Helen Bradshaw MCMI", role: "Interim Deputy Chair", email: "h.bradshaw@placeholder.co.uk" },
      { name: "Gareth Rees CMgr MCMI", role: "Board Member — Apprenticeships", email: "g.rees@placeholder.co.uk" },
      { name: "Fatima Hussain MCMI", role: "Board Member — Public Sector", email: "f.hussain@placeholder.co.uk" },
    ],
    employers: [
      { name: "Leeds City Council", sector: "Public sector", location: "Leeds", status: "established", focus: ["public_sector"], contact: "Interim contact" },
      { name: "Sheffield Hallam University", sector: "Higher education", location: "Sheffield", status: "established", focus: ["he", "future_leaders"], contact: "Interim contact" },
      { name: "NHS Yorkshire & Humber", sector: "Healthcare", location: "Leeds", status: "developing", focus: ["public_sector", "diversity"], contact: "Interim contact" },
      { name: "AMRC (Boeing / Univ. Sheffield)", sector: "Manufacturing", location: "Sheffield", status: "developing", focus: ["digital", "apprenticeships"], contact: "Interim contact" },
      { name: "Siemens Mobility", sector: "Engineering", location: "Goole", status: "emerging", focus: ["sustainability", "digital"], contact: "Interim contact" },
      { name: "Skipton Building Society", sector: "Financial services", location: "Skipton", status: "target", focus: ["sme", "diversity"], contact: "Interim contact" },
    ],
  },
  {
    id: "northern_ireland",
    name: "Northern Ireland",
    url: "https://www.managers.org.uk/community/regional-networks/northern-ireland/",
    chair: "Dr Claire Dickson CMgr FCMI",
    contact_email: "northernireland@managers.org.uk",
    counties: ["Belfast", "Antrim", "Armagh", "Down", "Fermanagh", "Londonderry", "Tyrone"],
    overall_status: "emerging",
    summary: "A compact and collaborative region with strong public sector and cross-border economic activity. Growing fintech and cyber sectors in Belfast offer significant development opportunity.",
    focus_strengths: ["public_sector", "he"],
    focus_targets: ["digital", "sme", "diversity"],
    board_members: [
      { name: "Dr Claire Dickson CMgr FCMI", role: "Regional Chair", email: "northernireland@managers.org.uk" },
      { name: "Niall McAlister MCMI", role: "Deputy Chair", email: "n.mcalister@placeholder.co.uk" },
      { name: "Siobhan Doherty CMgr MCMI", role: "Board Member — Public Sector", email: "s.doherty@placeholder.co.uk" },
      { name: "Patrick Lavery MCMI", role: "Board Member — SME & Digital", email: "p.lavery@placeholder.co.uk" },
    ],
    employers: [
      { name: "Ulster University", sector: "Higher education", location: "Belfast", status: "established", focus: ["he", "future_leaders"], contact: "Dr Claire Dickson" },
      { name: "Belfast City Council", sector: "Public sector", location: "Belfast", status: "developing", focus: ["public_sector"], contact: "Dr Claire Dickson" },
      { name: "Invest NI", sector: "Government agency", location: "Belfast", status: "developing", focus: ["sme", "digital"], contact: "Dr Claire Dickson" },
      { name: "Allstate NI", sector: "Technology", location: "Belfast", status: "target", focus: ["digital", "diversity"], contact: "Dr Claire Dickson" },
    ],
  },
  {
    id: "scotland",
    name: "Scotland",
    url: "https://www.managers.org.uk/community/regional-networks/scotland/",
    chair: "Lesley Mitchell CMgr CCMI",
    contact_email: "scotland@managers.org.uk",
    counties: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Highlands & Islands", "Fife", "Stirling"],
    overall_status: "established",
    summary: "A well-established board with strong presence across Scotland's key cities and sectors including energy, financial services, and higher education. A national devolved board with its own strategic priorities.",
    focus_strengths: ["public_sector", "he", "sustainability", "diversity"],
    focus_targets: ["digital", "future_leaders"],
    board_members: [
      { name: "Lesley Mitchell CMgr CCMI", role: "Regional Chair", email: "scotland@managers.org.uk" },
      { name: "Alasdair Fraser FCMI", role: "Deputy Chair", email: "a.fraser@placeholder.co.uk" },
      { name: "Catriona MacLeod CMgr MCMI", role: "Board Member — HE & Future Leaders", email: "c.macleod@placeholder.co.uk" },
      { name: "Ronan Gillespie MCMI", role: "Board Member — Energy & Sustainability", email: "r.gillespie@placeholder.co.uk" },
      { name: "Fiona Drummond CMgr MCMI", role: "Board Member — Public Sector", email: "f.drummond@placeholder.co.uk" },
      { name: "Tariq Bashir MCMI", role: "Board Member — Diversity & Inclusion", email: "t.bashir@placeholder.co.uk" },
    ],
    employers: [
      { name: "Scottish Government", sector: "Public sector", location: "Edinburgh", status: "established", focus: ["public_sector", "diversity"], contact: "Lesley Mitchell" },
      { name: "University of Edinburgh", sector: "Higher education", location: "Edinburgh", status: "established", focus: ["he", "future_leaders"], contact: "Lesley Mitchell" },
      { name: "BP (North Sea Transition)", sector: "Energy", location: "Aberdeen", status: "established", focus: ["sustainability", "digital"], contact: "Lesley Mitchell" },
      { name: "Royal Bank of Scotland", sector: "Financial services", location: "Edinburgh", status: "developing", focus: ["digital", "diversity"], contact: "Lesley Mitchell" },
      { name: "NHS Scotland", sector: "Healthcare", location: "Glasgow", status: "developing", focus: ["public_sector"], contact: "Lesley Mitchell" },
      { name: "Highlands & Islands Enterprise", sector: "Government agency", location: "Inverness", status: "emerging", focus: ["sme", "sustainability"], contact: "Lesley Mitchell" },
    ],
  },
  {
    id: "south_east",
    name: "South East",
    url: "https://www.managers.org.uk/community/regional-networks/south-east/",
    chair: "Sarah Furness CMgr FCMI",
    contact_email: "southeast@managers.org.uk",
    counties: ["Kent", "Surrey", "Sussex (East & West)", "Hampshire", "Berkshire", "Oxfordshire", "Buckinghamshire", "Essex"],
    overall_status: "developing",
    summary: "A large region with diverse economic activity from pharmaceuticals and aerospace in the west, to ports and logistics in the east. Strong commuter belt membership base.",
    focus_strengths: ["sme", "future_leaders"],
    focus_targets: ["public_sector", "sustainability", "diversity"],
    board_members: [
      { name: "Sarah Furness CMgr FCMI", role: "Regional Chair", email: "southeast@managers.org.uk" },
      { name: "Jonathan Blake MCMI", role: "Deputy Chair", email: "j.blake@placeholder.co.uk" },
      { name: "Mei-Lin Chang CMgr MCMI", role: "Board Member — SME & Entrepreneurship", email: "m.chang@placeholder.co.uk" },
      { name: "Oliver Watts MCMI", role: "Board Member — Future Leaders", email: "o.watts@placeholder.co.uk" },
      { name: "Deborah Simmons CMgr MCMI", role: "Board Member — Defence & Aerospace", email: "d.simmons@placeholder.co.uk" },
    ],
    employers: [
      { name: "BAE Systems", sector: "Defence & Aerospace", location: "Farnborough", status: "established", focus: ["digital", "apprenticeships"], contact: "Sarah Furness" },
      { name: "University of Southampton", sector: "Higher education", location: "Southampton", status: "established", focus: ["he", "sustainability"], contact: "Sarah Furness" },
      { name: "Surrey County Council", sector: "Public sector", location: "Guildford", status: "developing", focus: ["public_sector"], contact: "Sarah Furness" },
      { name: "Pfizer", sector: "Pharmaceutical", location: "Sandwich", status: "developing", focus: ["digital", "diversity"], contact: "Sarah Furness" },
      { name: "DP World (London Gateway)", sector: "Logistics", location: "Stanford-le-Hope", status: "emerging", focus: ["sme", "sustainability"], contact: "Sarah Furness" },
      { name: "Virgin Media O2", sector: "Technology", location: "Slough", status: "target", focus: ["digital", "future_leaders"], contact: "Sarah Furness" },
    ],
  },
  {
    id: "south_west",
    name: "South West",
    url: "https://www.managers.org.uk/community/regional-networks/south-west/",
    chair: "Martin Perry CMgr FCMI",
    contact_email: "southwest@managers.org.uk",
    counties: ["Bristol", "Somerset", "Devon", "Cornwall", "Dorset", "Wiltshire", "Gloucestershire"],
    overall_status: "developing",
    summary: "An expansive region anchored by Bristol's professional and creative economy. Significant defence, aerospace, and rural enterprise activity alongside growing digital and green energy sectors.",
    focus_strengths: ["sme", "sustainability", "he"],
    focus_targets: ["diversity", "digital", "public_sector"],
    board_members: [
      { name: "Martin Perry CMgr FCMI", role: "Regional Chair", email: "southwest@managers.org.uk" },
      { name: "Elaine Goodwin MCMI", role: "Deputy Chair", email: "e.goodwin@placeholder.co.uk" },
      { name: "Ben Truscott CMgr MCMI", role: "Board Member — Sustainability & Energy", email: "b.truscott@placeholder.co.uk" },
      { name: "Yemi Adeyemi MCMI", role: "Board Member — HE & Skills", email: "y.adeyemi@placeholder.co.uk" },
      { name: "Karen Pascoe MCMI", role: "Board Member — SME & Rural Enterprise", email: "k.pascoe@placeholder.co.uk" },
    ],
    employers: [
      { name: "Airbus UK", sector: "Aerospace", location: "Filton", status: "established", focus: ["digital", "apprenticeships"], contact: "Martin Perry" },
      { name: "University of Bristol", sector: "Higher education", location: "Bristol", status: "established", focus: ["he", "future_leaders"], contact: "Martin Perry" },
      { name: "Lloyds Bank (Bristol HQ)", sector: "Financial services", location: "Bristol", status: "developing", focus: ["diversity", "digital"], contact: "Martin Perry" },
      { name: "EDF Energy (Hinkley)", sector: "Energy", location: "Bridgwater", status: "developing", focus: ["sustainability"], contact: "Martin Perry" },
      { name: "Cornwall Council", sector: "Public sector", location: "Truro", status: "emerging", focus: ["public_sector", "sme"], contact: "Martin Perry" },
      { name: "Renishaw", sector: "Manufacturing", location: "Wotton-under-Edge", status: "target", focus: ["digital", "apprenticeships"], contact: "Martin Perry" },
    ],
  },
  {
    id: "wales",
    name: "Wales / Cymru",
    url: "https://www.managers.org.uk/community/regional-networks/wales/",
    chair: "Bethan Owen CMgr MCMI",
    contact_email: "wales@managers.org.uk",
    counties: ["Cardiff", "Swansea", "Newport", "Wrexham", "Rhondda Cynon Taf", "Gwynedd", "Pembrokeshire"],
    overall_status: "emerging",
    summary: "A devolved national board with bilingual engagement across Wales. Cardiff and Swansea are principal hubs. Strong public sector and growing digital economy offer strategic opportunity.",
    focus_strengths: ["public_sector", "he"],
    focus_targets: ["digital", "diversity", "sme", "future_leaders"],
    board_members: [
      { name: "Bethan Owen CMgr MCMI", role: "Regional Chair", email: "wales@managers.org.uk" },
      { name: "Rhys Griffiths MCMI", role: "Deputy Chair", email: "r.griffiths@placeholder.co.uk" },
      { name: "Sioned Parry CMgr MCMI", role: "Board Member — Public Sector", email: "s.parry@placeholder.co.uk" },
      { name: "Ceri Thomas MCMI", role: "Board Member — HE & Welsh Language", email: "c.thomas@placeholder.co.uk" },
      { name: "Imogen Davies MCMI", role: "Board Member — Digital & Future Leaders", email: "i.davies@placeholder.co.uk" },
    ],
    employers: [
      { name: "Welsh Government", sector: "Public sector", location: "Cardiff", status: "established", focus: ["public_sector", "diversity"], contact: "Bethan Owen" },
      { name: "Cardiff University", sector: "Higher education", location: "Cardiff", status: "established", focus: ["he", "future_leaders"], contact: "Bethan Owen" },
      { name: "DVLA", sector: "Public sector", location: "Swansea", status: "developing", focus: ["public_sector", "digital"], contact: "Bethan Owen" },
      { name: "Admiral Group", sector: "Financial services", location: "Cardiff", status: "emerging", focus: ["digital", "diversity"], contact: "Bethan Owen" },
      { name: "Arup", sector: "Professional services", location: "Cardiff", status: "target", focus: ["sustainability", "digital"], contact: "Bethan Owen" },
    ],
  },
  {
    id: "west_midlands_nw",
    name: "West Midlands & North West",
    url: "https://www.managers.org.uk/community/regional-networks/west-midlands-and-north-west/",
    chair: "Elizabeth Oni-Iyiola CMgr CCMI",
    contact_email: "westmidlands@managers.org.uk",
    counties: ["Birmingham", "Coventry", "Wolverhampton", "Manchester", "Liverpool", "Cheshire", "Lancashire", "Staffordshire", "Shropshire"],
    overall_status: "established",
    summary: "One of CMI's largest combined boards, covering the industrial heartlands of the Midlands alongside the Northern Powerhouse. Exceptional breadth from automotive to media, public sector to fintech.",
    focus_strengths: ["diversity", "apprenticeships", "future_leaders", "digital"],
    focus_targets: ["sustainability", "sme"],
    board_members: [
      { name: "Elizabeth Oni-Iyiola CMgr CCMI", role: "Regional Chair", email: "westmidlands@managers.org.uk" },
      { name: "Craig Mossop FCMI", role: "Deputy Chair", email: "c.mossop@placeholder.co.uk" },
      { name: "Nneka Obi CMgr MCMI", role: "Board Member — Diversity & Inclusion", email: "n.obi@placeholder.co.uk" },
      { name: "Will Ashton MCMI", role: "Board Member — Apprenticeships", email: "w.ashton@placeholder.co.uk" },
      { name: "Sameera Khan CMgr MCMI", role: "Board Member — Future Leaders", email: "s.khan@placeholder.co.uk" },
      { name: "David Lowe MCMI", role: "Board Member — Digital Leadership", email: "d.lowe@placeholder.co.uk" },
      { name: "Janet Corbett CMgr MCMI", role: "Board Member — Manufacturing & Automotive", email: "j.corbett@placeholder.co.uk" },
    ],
    employers: [
      { name: "Jaguar Land Rover", sector: "Automotive", location: "Coventry", status: "established", focus: ["digital", "apprenticeships"], contact: "Elizabeth Oni-Iyiola" },
      { name: "Manchester City Council", sector: "Public sector", location: "Manchester", status: "established", focus: ["public_sector", "diversity"], contact: "Elizabeth Oni-Iyiola" },
      { name: "BBC (Media City)", sector: "Media", location: "Salford", status: "established", focus: ["diversity", "future_leaders"], contact: "Elizabeth Oni-Iyiola" },
      { name: "Aston University", sector: "Higher education", location: "Birmingham", status: "established", focus: ["he", "diversity"], contact: "Elizabeth Oni-Iyiola" },
      { name: "Co-op Group", sector: "Retail", location: "Manchester", status: "developing", focus: ["sme", "sustainability"], contact: "Elizabeth Oni-Iyiola" },
      { name: "Keele University", sector: "Higher education", location: "Staffordshire", status: "developing", focus: ["he", "sustainability"], contact: "Elizabeth Oni-Iyiola" },
      { name: "Liverpool City Region Combined Authority", sector: "Public sector", location: "Liverpool", status: "developing", focus: ["public_sector", "digital"], contact: "Elizabeth Oni-Iyiola" },
      { name: "AstraZeneca (Macclesfield)", sector: "Pharmaceutical", location: "Macclesfield", status: "target", focus: ["sustainability", "digital"], contact: "Elizabeth Oni-Iyiola" },
    ],
  },
];

const INTL_REGIONS = [
  { id: "hong_kong", name: "Hong Kong", status: "established", url: "https://www.managers.org.uk/community/regional-networks/hong-kong/" },
  { id: "malaysia", name: "Malaysia", status: "established", url: "https://www.managers.org.uk/community/regional-networks/malaysia/" },
  { id: "sri_lanka", name: "Sri Lanka", status: "developing", url: "https://www.managers.org.uk/community/regional-networks/sri-lanka/" },
  { id: "singapore", name: "Singapore", status: "emerging", url: "https://www.managers.org.uk/community/regional-networks/singapore/" },
  { id: "middle_east", name: "Middle East", status: "emerging", url: "https://www.managers.org.uk/community/regional-networks/middle-east/" },
];

function StatusBadge({ status, small }) {
  const s = ESTABLISHMENT_LEVELS[status] || ESTABLISHMENT_LEVELS.target;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 20, padding: small ? "2px 8px" : "4px 10px",
      fontSize: small ? 11 : 12, fontWeight: 500, whiteSpace: "nowrap"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function FocusPill({ focusId, active, onClick }) {
  const f = FOCUS_AREAS.find(x => x.id === focusId);
  if (!f) return null;
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: active ? CMI_PINK : "transparent",
      color: active ? "#fff" : "var(--text-secondary)",
      border: `1px solid ${active ? CMI_PINK : "var(--border-strong)"}`,
      borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 500,
      cursor: "pointer", transition: "all 0.15s"
    }}>
      <i className={`ti ${f.icon}`} style={{ fontSize: 13 }} aria-hidden="true" />
      {f.label}
    </button>
  );
}

function RegionCard({ region, onClick, activeFocusFilters }) {
  const s = ESTABLISHMENT_LEVELS[region.overall_status];
  const matchesFilter = activeFocusFilters.length === 0 ||
    activeFocusFilters.some(f => region.focus_strengths.includes(f) || region.focus_targets.includes(f));

  if (!matchesFilter) return null;

  const employerCounts = { established: 0, developing: 0, emerging: 0, target: 0 };
  region.employers.forEach(e => { employerCounts[e.status] = (employerCounts[e.status] || 0) + 1; });

  return (
    <div onClick={() => onClick(region)} style={{
      background: "var(--surface-2)", border: `1.5px solid ${s.border}`,
      borderRadius: 12, padding: "1rem 1.25rem", cursor: "pointer",
      transition: "box-shadow 0.15s", position: "relative", overflow: "hidden"
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, bottom: 0, background: s.color, borderRadius: "12px 0 0 12px" }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0, color: "var(--text-primary)" }}>{region.name}</p>
          <StatusBadge status={region.overall_status} small />
        </div>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.5 }}>
          {region.counties.slice(0, 3).join(", ")}{region.counties.length > 3 ? ` +${region.counties.length - 3} more` : ""}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {region.focus_strengths.map(f => {
            const fa = FOCUS_AREAS.find(x => x.id === f);
            return fa ? (
              <span key={f} style={{ fontSize: 11, background: CMI_PINK_LIGHT, color: CMI_PINK, padding: "2px 7px", borderRadius: 10, fontWeight: 500 }}>
                {fa.label}
              </span>
            ) : null;
          })}
        </div>
        <div style={{ display: "flex", gap: 10, borderTop: "0.5px solid var(--border)", paddingTop: 10 }}>
          {Object.entries(employerCounts).filter(([, v]) => v > 0).map(([k, v]) => (
            <span key={k} style={{ fontSize: 11, color: ESTABLISHMENT_LEVELS[k].color }}>
              {v} {ESTABLISHMENT_LEVELS[k].label.split(" ")[0].toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployerRow({ emp, activeFocusFilters }) {
  const matches = activeFocusFilters.length === 0 || activeFocusFilters.some(f => emp.focus.includes(f));
  if (!matches) return null;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto auto",
      alignItems: "center", gap: 12,
      padding: "10px 0", borderBottom: "0.5px solid var(--border)"
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>{emp.name}</p>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{emp.sector} · {emp.location}</p>
        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
          {emp.focus.map(f => {
            const fa = FOCUS_AREAS.find(x => x.id === f);
            return fa ? (
              <span key={f} style={{ fontSize: 10, background: "var(--surface-1)", border: "0.5px solid var(--border)", color: "var(--text-secondary)", padding: "1px 6px", borderRadius: 8 }}>
                {fa.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
      <StatusBadge status={emp.status} small />
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Contact</p>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{emp.contact}</p>
      </div>
    </div>
  );
}

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
    { id: "overview", label: "Overview" },
    { id: "board", label: `Board (${region.board_members.length})` },
    { id: "employers", label: `Employers (${filteredEmployers.length})` },
    { id: "focus", label: "Focus areas" },
  ];

  return (
    <div>
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "transparent", border: "none", color: "var(--text-secondary)",
        fontSize: 13, cursor: "pointer", padding: "0 0 16px", fontWeight: 500
      }}>
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />
        All regions
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{region.name}</h2>
        <StatusBadge status={region.overall_status} />
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 4px" }}>
        Chair: <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{region.chair}</strong>
      </p>
      <a href={`mailto:${region.contact_email}`} style={{ fontSize: 13, color: CMI_PINK, textDecoration: "none" }}>
        <i className="ti ti-mail" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />
        {region.contact_email}
      </a>
      <a href={region.url} target="_blank" rel="noopener noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 12, color: "var(--text-secondary)", marginLeft: 12, textDecoration: "none"
      }}>
        <i className="ti ti-external-link" style={{ fontSize: 12 }} aria-hidden="true" />
        CMI page
      </a>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", margin: "16px 0 0" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === t.id ? CMI_PINK : "transparent"}`,
            color: activeTab === t.id ? CMI_PINK : "var(--text-secondary)",
            fontWeight: activeTab === t.id ? 500 : 400,
            fontSize: 13, cursor: "pointer", padding: "8px 16px", marginBottom: -1, transition: "all 0.15s"
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ paddingTop: 16 }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)", marginBottom: 20 }}>{region.summary}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "var(--surface-1)", borderRadius: 8, padding: "1rem" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Geography</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {region.counties.map(c => (
                  <span key={c} style={{ fontSize: 12, background: "var(--surface-2)", border: "0.5px solid var(--border)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: 10 }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--surface-1)", borderRadius: 8, padding: "1rem" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Employer pipeline</p>
              {Object.entries(ESTABLISHMENT_LEVELS).map(([k, v]) => {
                const count = region.employers.filter(e => e.status === k).length;
                return count > 0 ? (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: v.color, marginLeft: "auto" }}>{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div style={{ background: CMI_PINK_LIGHT, border: `1px solid ${CMI_PINK_MID}`, borderRadius: 8, padding: "1rem" }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: CMI_PINK, fontWeight: 500 }}>
              <i className="ti ti-target" style={{ marginRight: 6 }} aria-hidden="true" />
              Strategic focus targets
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {region.focus_targets.map(f => {
                const fa = FOCUS_AREAS.find(x => x.id === f);
                return fa ? (
                  <span key={f} style={{ fontSize: 12, background: "#fff", color: CMI_PINK, border: `1px solid ${CMI_PINK}`, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
                    {fa.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "board" && (
        <div style={{ paddingTop: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 14px" }}>
            {region.board_members.length} member{region.board_members.length !== 1 ? "s" : ""} · all contact details are illustrative placeholders for demo purposes
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {region.board_members.map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                background: "var(--surface-1)", borderRadius: 8, padding: "0.875rem 1rem",
                border: i === 0 ? `1px solid ${CMI_PINK_MID}` : "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? CMI_PINK : "var(--surface-2)",
                    border: `1.5px solid ${i === 0 ? CMI_PINK : "var(--border-strong)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="ti ti-user" style={{ fontSize: 15, color: i === 0 ? "#fff" : "var(--text-muted)" }} aria-hidden="true" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>{m.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: i === 0 ? CMI_PINK : "var(--text-secondary)" }}>{m.role}</p>
                  </div>
                </div>
                <a href={`mailto:${m.email}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12, color: CMI_PINK, textDecoration: "none",
                  background: CMI_PINK_LIGHT, border: `1px solid ${CMI_PINK_MID}`,
                  borderRadius: 20, padding: "4px 10px", whiteSpace: "nowrap", flexShrink: 0
                }}>
                  <i className="ti ti-mail" style={{ fontSize: 12 }} aria-hidden="true" />
                  Email
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "employers" && (
        <div style={{ paddingTop: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {FOCUS_AREAS.map(f => (
              <FocusPill
                key={f.id}
                focusId={f.id}
                active={activeFocusFilters.includes(f.id)}
                onClick={() => setActiveFocusFilters(prev =>
                  prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id]
                )}
              />
            ))}
          </div>

          {Object.entries(ESTABLISHMENT_LEVELS).map(([status, meta]) => {
            const emps = (empByStatus[status] || []);
            if (emps.length === 0) return null;
            return (
              <div key={status} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: meta.color }}>{meta.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({emps.length})</span>
                </div>
                {emps.map((e, i) => <EmployerRow key={i} emp={e} activeFocusFilters={activeFocusFilters} />)}
              </div>
            );
          })}

          {filteredEmployers.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>No employers match the selected filters.</p>
          )}

          <div style={{ background: "var(--surface-1)", borderRadius: 8, padding: "0.75rem 1rem", marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
              <i className="ti ti-info-circle" style={{ marginRight: 6 }} aria-hidden="true" />
              Have a lead? Contact <strong style={{ color: "var(--text-primary)" }}>{region.chair}</strong> at{" "}
              <a href={`mailto:${region.contact_email}`} style={{ color: CMI_PINK }}>{region.contact_email}</a>
            </p>
          </div>
        </div>
      )}

      {activeTab === "focus" && (
        <div style={{ paddingTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {FOCUS_AREAS.map(f => {
              const isStrength = region.focus_strengths.includes(f.id);
              const isTarget = region.focus_targets.includes(f.id);
              const relevantEmps = region.employers.filter(e => e.focus.includes(f.id));
              return (
                <div key={f.id} style={{
                  background: isStrength ? "#e1f5ee" : isTarget ? CMI_PINK_LIGHT : "var(--surface-1)",
                  border: `1px solid ${isStrength ? "#5dcaa5" : isTarget ? CMI_PINK_MID : "var(--border)"}`,
                  borderRadius: 8, padding: "0.75rem 1rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <i className={`ti ${f.icon}`} style={{ fontSize: 15, color: isStrength ? "#0f6e56" : isTarget ? CMI_PINK : "var(--text-muted)" }} aria-hidden="true" />
                    <span style={{ fontSize: 13, fontWeight: 500, color: isStrength ? "#0f6e56" : isTarget ? CMI_PINK : "var(--text-primary)" }}>{f.label}</span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: isStrength ? "#085041" : isTarget ? "#993556" : "var(--text-muted)" }}>
                    {isStrength ? "Strength area" : isTarget ? "Target / growth area" : "Not a current priority"}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{relevantEmps.length} employer{relevantEmps.length !== 1 ? "s" : ""} in pipeline</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div style={{ padding: "1rem 1rem 2rem" }}>
        <RegionDetail
          region={selectedRegion}
          onBack={() => setSelectedRegion(null)}
          activeFocusFilters={activeFocusFilters}
          setActiveFocusFilters={setActiveFocusFilters}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem 1rem 2rem" }}>
      <h2 className="sr-only">CMI regional intelligence dashboard</h2>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <div style={{ width: 28, height: 28, background: CMI_PINK, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-map-2" style={{ fontSize: 15, color: "#fff" }} aria-hidden="true" />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Regional intelligence</h2>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>CMI regional boards · engagement & reach overview</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setView("uk")} style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 6,
            background: view === "uk" ? CMI_PINK : "transparent",
            color: view === "uk" ? "#fff" : "var(--text-secondary)",
            border: `1px solid ${view === "uk" ? CMI_PINK : "var(--border-strong)"}`,
            cursor: "pointer", fontWeight: 500
          }}>UK</button>
          <button onClick={() => setView("intl")} style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 6,
            background: view === "intl" ? CMI_PINK : "transparent",
            color: view === "intl" ? "#fff" : "var(--text-secondary)",
            border: `1px solid ${view === "intl" ? CMI_PINK : "var(--border-strong)"}`,
            cursor: "pointer", fontWeight: 500
          }}>International</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { label: "UK regions", value: REGIONS.length, icon: "ti-map" },
          { label: "Established", value: establishedCount, icon: "ti-circle-check", color: "#0f6e56" },
          { label: "Employers tracked", value: totalEmployers, icon: "ti-building" },
          { label: "Intl boards", value: INTL_REGIONS.length, icon: "ti-world" },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--surface-1)", borderRadius: 8, padding: "0.75rem" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--text-muted)" }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: m.color || "var(--text-primary)" }}>{m.value}</p>
          </div>
        ))}
      </div>

      {view === "uk" && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Status:</span>
              {[["all", "All regions"], ...Object.entries(ESTABLISHMENT_LEVELS).map(([k, v]) => [k, v.label])].map(([k, label]) => (
                <button key={k} onClick={() => setStatusFilter(k)} style={{
                  fontSize: 12, padding: "3px 10px", borderRadius: 20,
                  background: statusFilter === k ? (k === "all" ? "var(--text-primary)" : ESTABLISHMENT_LEVELS[k]?.bg || "var(--surface-1)") : "transparent",
                  color: statusFilter === k ? (k === "all" ? "var(--surface-2)" : ESTABLISHMENT_LEVELS[k]?.color || "var(--text-primary)") : "var(--text-secondary)",
                  border: `1px solid ${statusFilter === k ? (k === "all" ? "var(--text-primary)" : ESTABLISHMENT_LEVELS[k]?.border || "var(--border)") : "var(--border-strong)"}`,
                  cursor: "pointer", fontWeight: statusFilter === k ? 500 : 400
                }}>{label}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Focus area:</span>
              {FOCUS_AREAS.map(f => (
                <FocusPill
                  key={f.id}
                  focusId={f.id}
                  active={activeFocusFilters.includes(f.id)}
                  onClick={() => setActiveFocusFilters(prev =>
                    prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id]
                  )}
                />
              ))}
              {activeFocusFilters.length > 0 && (
                <button onClick={() => setActiveFocusFilters([])} style={{
                  fontSize: 12, color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", padding: "4px 6px"
                }}>
                  <i className="ti ti-x" style={{ fontSize: 12 }} aria-hidden="true" /> Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
            {filteredRegions.map(r => (
              <RegionCard key={r.id} region={r} onClick={setSelectedRegion} activeFocusFilters={activeFocusFilters} />
            ))}
          </div>

          {filteredRegions.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              No regions match the selected filters. <button onClick={() => { setStatusFilter("all"); setActiveFocusFilters([]); }} style={{ color: CMI_PINK, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Reset filters</button>
            </p>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(ESTABLISHMENT_LEVELS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "intl" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            CMI has active regional boards across the Asia-Pacific and Middle East. Click through to the CMI website for full board details.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {INTL_REGIONS.map(r => {
              const s = ESTABLISHMENT_LEVELS[r.status];
              return (
                <div key={r.id} style={{
                  background: "var(--surface-2)", border: `1.5px solid ${s.border}`,
                  borderRadius: 12, padding: "1rem 1.25rem", position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, bottom: 0, background: s.color, borderRadius: "12px 0 0 12px" }} />
                  <div style={{ paddingLeft: 8 }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 500, fontSize: 14 }}>{r.name}</p>
                    <StatusBadge status={r.status} small />
                    <div style={{ marginTop: 10 }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 12, color: CMI_PINK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4
                      }}>
                        <i className="ti ti-external-link" style={{ fontSize: 12 }} aria-hidden="true" />
                        View board
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, background: "var(--surface-1)", borderRadius: 8, padding: "0.75rem 1rem" }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
              <i className="ti ti-info-circle" style={{ marginRight: 6 }} aria-hidden="true" />
              Full international board details and contacts are available at{" "}
              <a href="https://www.managers.org.uk/community/cmi-internationally/" target="_blank" rel="noopener noreferrer" style={{ color: CMI_PINK }}>
                managers.org.uk/community/cmi-internationally
              </a>
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, borderTop: "0.5px solid var(--border)", paddingTop: 12 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
          Data sourced from publicly available CMI information at{" "}
          <a href="https://www.managers.org.uk/community/regional-networks/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)" }}>
            managers.org.uk
          </a>
          . Employer data is illustrative for demonstration purposes. Contact details should be verified before use.
        </p>
      </div>
    </div>
  );
}
