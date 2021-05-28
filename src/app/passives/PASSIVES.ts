export function wikiLink(name: string) {
  return `https://pathofexile.gamepedia.com/${encodeURI(name)}`;
}

export default [
  {
    id: 0,
    name: 'The Dweller of the Deep',
    points: 1,
    act: 1,
    objective: 'Kill dweller of the Deep in Flooded Depths',
  },
  {
    id: 1,
    name: 'The Marooned Mariner',
    points: 1,
    act: 1,
    objective: 'Find Allflame in the Ship Graveyard Cave, talk to Fairgraves',
  },
  {
    id: 2,
    name: 'The Way Forward',
    points: 1,
    act: 1,
    objective:
      'Kill Arteri in Western Forest (a2), pick up Thaumetic Emblem and click on Thaumetic Seal',
  },
  {
    id: 3,
    name: 'Deal with the Bandits',
    points: 2,
    act: 2,
    objective:
      'Kill 2 or all of the bandits. Killing all bandits gives 2 passive points',
  },
  {
    id: 4,
    name: "Piety's Pets",
    points: 1,
    act: 3,
    objective: 'Kill Piety in Lunaris Temple Level 2',
  },
  {
    id: 5,
    name: "Victario's Secrets",
    points: 1,
    act: 3,
    objective: 'Find 3 platinum busts in The Sewers',
  },
  {
    id: 6,
    name: 'An Indomitable Spirit',
    points: 1,
    act: 4,
    objective: "Free Deshret's spirit in the Mines Level 2",
  },
  {
    id: 7,
    name: 'In Service to Science',
    points: 1,
    act: 5,
    objective: 'Find the Miasmeter in Control Blocks',
  },
  {
    id: 8,
    name: "Kitava's Torments",
    points: 1,
    act: 5,
    objective:
      'Find three artefacts in the Reliquary (near the corners of the map)',
  },
  {
    id: 9,
    name: 'The Cloven One',
    points: 1,
    act: 6,
    objective:
      "Kill Abberath in the Valley of the Fire Drinker (entrance in Prisoner's Gate)",
  },
  {
    id: 10,
    name: 'The Father of War',
    points: 1,
    act: 6,
    objective:
      "Kill Tukohama in Tukohama's Keep (entrance in the Karui Fortress)",
  },
  {
    id: 11,
    name: 'The Puppet Mistress',
    points: 1,
    act: 6,
    objective:
      'Kill the Puppet Mistress in The Spawning Grounds (entrance in The Wetlands)',
  },
  {
    id: 12,
    name: "Kishara's Star",
    points: 1,
    act: 7,
    objective: "Find Kishara's Star in Causeway (near the end)",
  },
  {
    id: 13,
    name: 'Queen of Despair',
    points: 1,
    act: 7,
    objective:
      'Kill Gruthkul in the Den of Despair (entrance in The Dread Thicket)',
  },
  {
    id: 14,
    name: 'The Master of a Million Faces',
    points: 1,
    act: 7,
    objective: 'Kill Ralakesh (entrance in the Ashen Fields)',
  },
  {
    id: 15,
    name: 'Love is Dead',
    points: 1,
    act: 8,
    objective:
      'Find Ankh of Eternity at Quay, go to the Arena (opposite end of the map) and talk to Clarissa.',
  },
  {
    id: 16,
    name: 'Reflection of Terror',
    points: 1,
    act: 8,
    objective:
      'Kill Yugul in The Pools of Terror (entrance in The High Gardens)',
  },
  {
    id: 17,
    name: 'The Gemling Legion',
    points: 1,
    act: 8,
    objective: 'Kill the Gemling Legionnaires at the Grain Gate',
  },
  {
    id: 18,
    name: 'The Ruler of Highgate',
    points: 1,
    act: 9,
    objective:
      'Kill Garukhan in the Arena (entrance in The Quarry, left from waypoint)',
  },
  {
    id: 19,
    name: 'Queen of the Sands',
    points: 1,
    act: 9,
    prerequisite:
      'The Storm Blade (Find the Storm Blade in The Vastiri Desert and kill the waves of mobs)',
    objective: 'Kill Shakari in The Sand Pit (entrance in The Oasis)',
  },
  {
    id: 20,
    name: 'An End to Hunger',
    points: 2,
    act: 10,
    objective: 'Kill Kitava in the Feeding Trough',
  },
  {
    id: 21,
    name: 'Vilenta\'s Vengeance',
    points: 1,
    act: 10,
    objective: 'Kill Vilenta in The Control Blocks (entrance on the south side of The Ravaged Square)',
  }
]
