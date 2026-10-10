// ============================================
// ADD YOUR CONSPIRACY THEORIES HERE
// ============================================
// Copy the template below and fill it in:
//
//   {
//     title: "Theory Name",
//     category: "government",       // pick one: government, space, technology, history, science, other
//     summary: "A short one-liner about the theory.",
//     details: "The full write-up. Use as much text as you want.",
//     evidence: [
//       "First piece of evidence or talking point",
//       "Second piece of evidence",
//     ],
//     status: "unproven",           // pick one: unproven, debunked, plausible, confirmed
//     dateAdded: "2026-10-10",
//   },
//
// Then save the file and push to GitHub — the site updates automatically.
// ============================================

const theories = [
  {
    title: "Area 51 and Alien Technology",
    category: "government",
    summary: "The US government is hiding extraterrestrial spacecraft and alien remains at a secret base in Nevada.",
    details: "Area 51, officially known as Groom Lake or Homey Airport, is a highly classified United States Air Force facility in Nevada. For decades, conspiracy theorists have claimed the site houses recovered alien spacecraft and even extraterrestrial biological entities. The secrecy surrounding the base, combined with numerous UFO sightings in the area, has fueled speculation that the government is reverse-engineering alien technology. In 2013, the CIA officially acknowledged the base's existence for the first time, but many believe the full truth remains hidden.",
    evidence: [
      "The US government denied the base existed for decades until 2013",
      "Bob Lazar claimed to have worked on alien spacecraft there in 1989",
      "Numerous UFO sightings reported near the facility",
      "Extreme security measures including restricted airspace",
    ],
    status: "unproven",
    dateAdded: "2026-10-10",
  },
  {
    title: "The Moon Landing Hoax",
    category: "space",
    summary: "NASA faked the Apollo moon landings in a film studio to win the Space Race.",
    details: "One of the most well-known conspiracy theories claims that the six crewed Apollo moon landings between 1969 and 1972 were elaborate hoaxes staged by NASA. Proponents point to alleged anomalies in photographs and footage, such as the waving flag, lack of stars in photos, and identical backgrounds in different images. However, multiple independent lines of evidence confirm the landings occurred, including lunar samples, retroreflectors left on the Moon's surface, and independent tracking by multiple countries including the Soviet Union.",
    evidence: [
      "The American flag appears to wave despite no atmosphere on the Moon",
      "No stars visible in any of the lunar surface photographs",
      "Stanley Kubrick allegedly directed the fake footage",
      "Multiple photos show identical backgrounds at supposedly different locations",
    ],
    status: "debunked",
    dateAdded: "2026-10-10",
  },
  {
    title: "MKUltra Mind Control",
    category: "government",
    summary: "The CIA ran illegal mind control experiments on unwitting US and Canadian citizens.",
    details: "Project MKUltra was a real CIA program that ran from 1953 to 1973. It involved illegal experiments on human subjects designed to develop procedures and identify drugs that could be used in interrogations to weaken individuals and force confessions through brainwashing and psychological torture. The program used numerous methods including the covert administration of LSD and other chemicals, electroshock therapy, hypnosis, sensory deprivation, and psychological abuse. Most MKUltra records were destroyed in 1973 on orders from CIA Director Richard Helms, making a full investigation impossible.",
    evidence: [
      "Declassified CIA documents confirm the program existed",
      "Congressional hearings in 1977 (Church Committee) investigated the program",
      "Thousands of unwitting subjects including prisoners and mental patients were used",
      "CIA Director Richard Helms ordered most files destroyed in 1973",
    ],
    status: "confirmed",
    dateAdded: "2026-10-10",
  },
];
