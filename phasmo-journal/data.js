// Evidence types
const EVIDENCES = [
    'EMF Level 5',
    'D.O.T.S',
    'Freezing Temps',
    'Ghost Writing',
    'Ghost Orbs',
    'Spirit Box',
    'Ultraviolet',
];

// Difficulty levels
const DIFFICULTIES = ['Amateur', 'Intermediate', 'Professional', 'Nightmare', 'Insanity'];

// Ghost data
const GHOSTS = [
  {
    id: "spirit",
    name: "Spirit",
    evidences: ["EMF Level 5", "Spirit Box", "Ghost Writing"],
    strengths: ["None"],
    weaknesses: ["Smudge sticks stop it from attacking for 180 seconds"],
    abilities: ["Can roam freely"],
    notes: "The most common ghost type",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Smudge test"],
    behaviorTags: ["common"]
  },
  {
    id: "wraith",
    name: "Wraith",
    evidences: ["EMF Level 5", "Spirit Box", "D.O.T.S"],
    strengths: ["Almost never touches the ground, making it harder to track"],
    weaknesses: ["Salt will force it to walk on the ground"],
    abilities: ["Can teleport to players"],
    notes: "Teleports to players when hunting",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Salt test"],
    behaviorTags: ["teleport"]
  },
  {
    id: "phantom",
    name: "Phantom",
    evidences: ["Spirit Box", "Ultraviolet", "D.O.T.S"],
    strengths: ["Looking at the ghost will lower your sanity"],
    weaknesses: ["Taking a photo will make it disappear temporarily"],
    abilities: ["Can become invisible"],
    notes: "Disappears when you take its photo",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Photo test"],
    behaviorTags: ["invisible"]
  },
  {
    id: "poltergeist",
    name: "Poltergeist",
    evidences: ["Spirit Box", "Ultraviolet", "Ghost Writing"],
    strengths: ["Can throw multiple objects at once"],
    weaknesses: ["Empty rooms will prevent it from throwing objects"],
    abilities: ["Throws objects"],
    notes: "Throws objects when hunting",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Empty room test"],
    behaviorTags: ["throwing"]
  },
  {
    id: "banshee",
    name: "Banshee",
    evidences: ["Ultraviolet", "Ghost Orbs", "D.O.T.S"],
    strengths: ["Will target one player until they leave the building"],
    weaknesses: ["Crucifix will prevent it from hunting in the same room"],
    abilities: ["Targets one player"],
    notes: "Targets one player at a time",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Crucifix test"],
    behaviorTags: ["targeting"]
  },
  {
    id: "jinn",
    name: "Jinn",
    evidences: ["EMF Level 5", "Ultraviolet", "Freezing Temps"],
    strengths: ["Travels faster when chasing a player"],
    weaknesses: ["Turning off power will prevent it from using its ability"],
    abilities: ["Faster when chasing"],
    notes: "Faster when chasing players",
    speed: "1.7 m/s -> 3.0 m/s when chasing",
    huntThreshold: "50%",
    tests: ["Power test"],
    behaviorTags: ["fast"]
  },
  {
    id: "mare",
    name: "Mare",
    evidences: ["Spirit Box", "Ghost Orbs", "Ghost Writing"],
    strengths: ["Increased chance to attack in the dark"],
    weaknesses: ["Turning on lights will reduce its chance to attack"],
    abilities: ["Attacks in the dark"],
    notes: "Attacks more in the dark",
    speed: "1.7 m/s",
    huntThreshold: "60%",
    tests: ["Light test"],
    behaviorTags: ["dark"]
  },
  {
    id: "revenant",
    name: "Revenant",
    evidences: ["Ghost Orbs", "Ghost Writing", "Freezing Temps"],
    strengths: ["Travels very fast when hunting a player"],
    weaknesses: ["Hiding from it will make it move very slowly"],
    abilities: ["Very fast when hunting"],
    notes: "Very fast when hunting",
    speed: "1.7 m/s -> 3.0 m/s when hunting",
    huntThreshold: "50%",
    tests: ["Hide test"],
    behaviorTags: ["fast"]
  },
  {
    id: "shade",
    name: "Shade",
    evidences: ["EMF Level 5", "Ghost Writing", "Freezing Temps"],
    strengths: ["Shy, making it harder to find and trigger"],
    weaknesses: ["Will not hunt if players are grouped together"],
    abilities: ["Shy"],
    notes: "Shy ghost",
    speed: "1.7 m/s",
    huntThreshold: "35%",
    tests: ["Group test"],
    behaviorTags: ["shy"]
  },
  {
    id: "demon",
    name: "Demon",
    evidences: ["Ultraviolet", "Ghost Writing", "Freezing Temps"],
    strengths: ["Attacks more often than other ghosts"],
    weaknesses: ["Ouija board will not lower sanity as much"],
    abilities: ["Attacks frequently"],
    notes: "Attacks frequently",
    speed: "1.7 m/s",
    huntThreshold: "70%",
    tests: ["Ouija test"],
    behaviorTags: ["aggressive"]
  },
  {
    id: "yurei",
    name: "Yurei",
    evidences: ["Ghost Orbs", "Freezing Temps", "D.O.T.S"],
    strengths: ["Strong effect on sanity"],
    weaknesses: ["Smudge sticks will prevent it from wandering"],
    abilities: ["Drains sanity"],
    notes: "Drains sanity quickly",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Smudge test"],
    behaviorTags: ["sanity"]
  },
  {
    id: "oni",
    name: "Oni",
    evidences: ["EMF Level 5", "Freezing Temps", "D.O.T.S"],
    strengths: ["More active when players are nearby"],
    weaknesses: ["Being active makes it easier to identify"],
    abilities: ["More active"],
    notes: "More active when players are nearby",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Activity test"],
    behaviorTags: ["active"]
  },
  {
    id: "yokai",
    name: "Yokai",
    evidences: ["Spirit Box", "Ghost Orbs", "D.O.T.S"],
    strengths: ["Talking near it will anger it"],
    weaknesses: ["Only responds to voice when close"],
    abilities: ["Responds to voice"],
    notes: "Responds to voice when close",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Voice test"],
    behaviorTags: ["voice"]
  },
  {
    id: "hantu",
    name: "Hantu",
    evidences: ["Ultraviolet", "Ghost Orbs", "Freezing Temps"],
    strengths: ["Moves faster in cold areas"],
    weaknesses: ["Freezer will slow it down"],
    abilities: ["Faster in cold"],
    notes: "Faster in cold areas",
    speed: "1.7 m/s -> 2.8 m/s in cold",
    huntThreshold: "50%",
    tests: ["Freezer test"],
    behaviorTags: ["cold"]
  },
  {
    id: "goryo",
    name: "Goryo",
    evidences: ["EMF Level 5", "Ultraviolet", "D.O.T.S"],
    strengths: ["Only shows itself on camera when no one is nearby"],
    weaknesses: ["D.O.T.S will not work through walls"],
    abilities: ["Camera only"],
    notes: "Only shows on camera when alone",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Camera test"],
    behaviorTags: ["camera"]
  },
  {
    id: "myling",
    name: "Myling",
    evidences: ["EMF Level 5", "Ultraviolet", "Ghost Writing"],
    strengths: ["Makes more paranormal sounds"],
    weaknesses: ["Parabolic microphone will make it easier to track"],
    abilities: ["Noisy"],
    notes: "Makes more sounds",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Parabolic test"],
    behaviorTags: ["noisy"]
  },
  {
    id: "onryo",
    name: "Onryo",
    evidences: ["Spirit Box", "Ghost Orbs", "Freezing Temps"],
    strengths: ["Blows out fires to hunt"],
    weaknesses: ["Candles will prevent it from hunting"],
    abilities: ["Blows out fires"],
    notes: "Blows out fires to hunt",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Candle test"],
    behaviorTags: ["fire"]
  },
  {
    id: "the-twins",
    name: "The Twins",
    evidences: ["EMF Level 5", "Spirit Box", "Freezing Temps"],
    strengths: ["Either twin can hunt"],
    weaknesses: ["Interacting with one twin will make the other interact"],
    abilities: ["Two entities"],
    notes: "Two twins",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Twin test"],
    behaviorTags: ["twins"]
  },
  {
    id: "raiju",
    name: "Raiju",
    evidences: ["EMF Level 5", "Ghost Orbs", "D.O.T.S"],
    strengths: ["Disrupts electronics"],
    weaknesses: ["Electronic interference will make it hunt more"],
    abilities: ["Disrupts electronics"],
    notes: "Disrupts electronics",
    speed: "1.7 m/s -> 2.5 m/s near electronics",
    huntThreshold: "65%",
    tests: ["Electronic test"],
    behaviorTags: ["electronic"]
  },
  {
    id: "obake",
    name: "Obake",
    evidences: ["EMF Level 5", "Ultraviolet", "Ghost Orbs"],
    strengths: ["Rarely leaves UV evidence"],
    weaknesses: ["UV evidence changes shape"],
    abilities: ["Shape-shifting UV"],
    notes: "UV evidence changes shape",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["UV test"],
    behaviorTags: ["shape"]
  },
  {
    id: "the-mimic",
    name: "The Mimic",
    evidences: ["Spirit Box", "Ultraviolet", "Freezing Temps"],
    strengths: ["Can mimic other ghosts"],
    weaknesses: ["Will reveal itself when mimicking"],
    abilities: ["Mimics other ghosts"],
    notes: "Mimics other ghosts",
    speed: "1.7 m/s",
    huntThreshold: "50%",
    tests: ["Mimic test"],
    behaviorTags: ["mimic"]
  },
  {
    id: "moroi",
    name: "Moroi",
    evidences: ["Spirit Box", "Ghost Writing", "Freezing Temps"],
    strengths: ["Curses players"],
    weaknesses: ["Smudge sticks will weaken it"],
    abilities: ["Curses players"],
    notes: "Curses players",
    speed: "1.7 m/s -> 3.7 m/s when cursed",
    huntThreshold: "50%",
    tests: ["Curse test"],
    behaviorTags: ["curse"]
  },
  {
    id: "deogen",
    name: "Deogen",
    evidences: ["Spirit Box", "Ghost Writing", "D.O.T.S"],
    strengths: ["Always knows where players are"],
    weaknesses: ["Breathing heavily when close"],
    abilities: ["Knows player location"],
    notes: "Always knows where players are",
    speed: "0.4 m/s -> 3.0 m/s",
    huntThreshold: "40%",
    tests: ["Breathing test"],
    behaviorTags: ["breathing"]
  },
  {
    id: "thaye",
    name: "Thaye",
    evidences: ["Ghost Orbs", "Ghost Writing", "D.O.T.S"],
    strengths: ["Ages over time"],
    weaknesses: ["Becomes more active as it ages"],
    abilities: ["Ages"],
    notes: "Ages over time",
    speed: "2.8 m/s -> 1.0 m/s as it ages",
    huntThreshold: "75% -> 15%",
    tests: ["Age test"],
    behaviorTags: ["aging"]
  }
];

// Utility functions
function getMaxEvidencesForDifficulty(difficulty) {
    switch (difficulty) {
        case 'Amateur':
        case 'Intermediate':
        case 'Professional':
            return 3;
        case 'Nightmare':
            return 2;
        case 'Insanity':
            return 1;
        default:
            return 3;
    }
}

function getEligibleEvidencesForDifficulty(difficulty) {
    const maxEvidences = getMaxEvidencesForDifficulty(difficulty);
    if (maxEvidences >= 3) {
        return EVIDENCES;
    }
    return EVIDENCES;
}

function filterGhostsByEvidences(selectedEvidences, difficulty = null) {
    if (selectedEvidences.length === 0) return GHOSTS;

    if (difficulty) {
        const maxEvidences = getMaxEvidencesForDifficulty(difficulty);
        if (selectedEvidences.length > maxEvidences) {
            console.warn(`Difficulty ${difficulty} only allows ${maxEvidences} evidence, but ${selectedEvidences.length} were selected`);
        }
    }

    return GHOSTS.filter(ghost =>
        selectedEvidences.every(evidence => ghost.evidences.includes(evidence))
    );
}

function getGhostMatchScore(ghost, selectedEvidences) {
    if (selectedEvidences.length === 0) {
        return { score: 0, matches: [], missing: [] };
    }

    const matches = selectedEvidences.filter(evidence => ghost.evidences.includes(evidence));
    const missing = selectedEvidences.filter(evidence => !ghost.evidences.includes(evidence));
    const score = (matches.length / selectedEvidences.length) * 100;

    return { score, matches, missing };
}

function getDifficultySpecificGhosts(difficulty, selectedEvidences = []) {
    const maxEvidences = getMaxEvidencesForDifficulty(difficulty);
    
    switch (difficulty) {
        case 'Nightmare':
            return GHOSTS.filter(ghost => {
                const isObvious = ghost.name.toLowerCase().includes('spirit') ||
                                 ghost.name.toLowerCase().includes('wraith') ||
                                 ghost.name.toLowerCase().includes('phantom');
                return !isObvious;
            });
            
        case 'Insanity':
            return GHOSTS.filter(ghost => {
                const challengingGhosts = ['deogen', 'moroi', 'myling', 'twins', 'obake'];
                return challengingGhosts.includes(ghost.id);
            });
            
        default:
            return filterGhostsByEvidences(selectedEvidences);
    }
}

// Evidence icons mapping
const EVIDENCE_ICONS = {
    'EMF Level 5': 'emf.svg',
    'D.O.T.S': 'dots.svg',
    'Freezing Temps': 'temp.svg',
    'Ghost Writing': 'book.svg',
    'Ghost Orbs': 'orbs.svg',
    'Spirit Box': 'spiritbox.svg',
    'Ultraviolet': 'uv.svg'
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EVIDENCES,
        DIFFICULTIES,
        GHOSTS,
        EVIDENCE_ICONS,
        getMaxEvidencesForDifficulty,
        getEligibleEvidencesForDifficulty,
        filterGhostsByEvidences,
        getGhostMatchScore,
        getDifficultySpecificGhosts
    };
}