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
    abilities: ["Can roam freely", "Basic ghost behavior"],
    tells: ["Often the first ghost encountered", "Standard paranormal activity", "Regular ghost orb appearances"],
    behaviors: ["Normal interaction patterns", "Standard EMF readings", "Typical spirit box responses"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences common in amateur difficulty"],
    notes: "The most common ghost type",
    speed: "1.7 m/s",
    tests: ["Smudge test"],
    behaviorTags: ["common"]
  },
  {
    id: "wraith",
    name: "Wraith",
    evidences: ["EMF Level 5", "Spirit Box", "D.O.T.S"],
    strengths: ["Almost never touches the ground, making it harder to track"],
    weaknesses: ["Salt will force it to walk on the ground"],
    abilities: ["Can teleport to players", "Flight ability"],
    tells: ["EMF spikes without corresponding activity", "Spirit box responds without ghost visible", "DOTS visible but no footsteps"],
    behaviors: ["Teleports to nearest player during hunts", "Avoids salt areas completely", "Can phase through walls"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences available"],
    notes: "Teleports to players when hunting",
    speed: "1.7 m/s",
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
    tells: ["Sanity drains faster when looking at it", "Disappears after photo", "Often appears and disappears"],
    behaviors: ["Becomes invisible during ghost events", "Less likely to show during hunts", "Sensitive to camera flashes"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences common"],
    notes: "Disappears when you take its photo",
    speed: "1.7 m/s",
    tests: ["Photo test"],
    behaviorTags: ["invisible"]
  },
  {
    id: "poltergeist",
    name: "Poltergeist",
    evidences: ["Spirit Box", "Ultraviolet", "Ghost Writing"],
    strengths: ["Can throw multiple objects at once"],
    weaknesses: ["Empty rooms will prevent it from throwing objects"],
    abilities: ["Throws objects", "Heavy object throwing"],
    tells: ["Multiple objects thrown simultaneously", "Objects thrown with great force", "Can throw heavy furniture"],
    behaviors: ["Most active during ghost events", "Throws objects frequently", "Loves to throw things at players"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Throws objects when hunting",
    speed: "1.7 m/s",
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
    tells: ["Sings before hunting", "Targets single player", "Musical sounds often heard"],
    behaviors: ["Focused on one target player", "Less active when target is not present", "Crucifix protects against hunts in same room"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences possible"],
    notes: "Targets one player at a time",
    speed: "1.7 m/s",
    tests: ["Crucifix test"],
    behaviorTags: ["targeting"]
  },
  {
    id: "jinn",
    name: "Jinn",
    evidences: ["EMF Level 5", "Ultraviolet", "Freezing Temps"],
    strengths: ["Travels faster when chasing a player"],
    weaknesses: ["Turning off power will prevent it from using its ability"],
    abilities: ["Faster when chasing", "Power drain ability"],
    tells: ["Travels at full speed when chasing", "Power turns off during activity", "EMF spikes near electrical equipment"],
    behaviors: ["Normal speed when roaming", "Very fast during hunts", "Dramatic speed increase when chasing specific player"],
    huntSpeed: "3.0 m/s when chasing",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences likely"],
    notes: "Faster when chasing players",
    speed: "1.7 m/s -> 3.0 m/s when chasing",
    tests: ["Power test"],
    behaviorTags: ["fast"]
  },
  {
    id: "mare",
    name: "Mare",
    evidences: ["Spirit Box", "Ghost Orbs", "Ghost Writing"],
    strengths: ["Increased chance to attack in the dark"],
    weaknesses: ["Turning on lights will reduce its chance to attack"],
    abilities: ["Attacks in the dark", "Light breaking"],
    tells: ["More active in dark areas", "Breaks lights frequently", "Prefers dark environments"],
    behaviors: ["Reluctant to turn on lights", "More aggressive in darkness", "Often found near broken lights"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "60%",
    guaranteedEvidence: ["All three evidences possible"],
    notes: "Attacks more in the dark",
    speed: "1.7 m/s",
    tests: ["Light test"],
    behaviorTags: ["dark"]
  },
  {
    id: "revenant",
    name: "Revenant",
    evidences: ["Ghost Orbs", "Ghost Writing", "Freezing Temps"],
    strengths: ["Travels very fast when hunting a player"],
    weaknesses: ["Hiding from it will make it move very slowly"],
    abilities: ["Very fast when hunting", "Slow when searching"],
    tells: ["Moves very slowly when searching for hidden players", "Explosive speed when it finds someone", "Long hunting phases"],
    behaviors: ["Very slow when searching", "Instantly becomes fast when target located", "Patrols rooms systematically"],
    huntSpeed: "3.0 m/s when hunting",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Very fast when hunting",
    speed: "1.7 m/s -> 3.0 m/s when hunting",
    tests: ["Hide test"],
    behaviorTags: ["fast"]
  },
  {
    id: "shade",
    name: "Shade",
    evidences: ["EMF Level 5", "Ghost Writing", "Freezing Temps"],
    strengths: ["Shy, making it harder to find and trigger"],
    weaknesses: ["Will not hunt if players are grouped together"],
    abilities: ["Shy", "Avoids large groups"],
    tells: ["Harder to locate during investigations", "Less active when multiple players present", "Subtle evidence appearance"],
    behaviors: ["Avoids crowded rooms", "Shy during ghost events", "More active when players are alone or in pairs"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "35%",
    guaranteedEvidence: ["All three evidences possible but subtle"],
    notes: "Shy ghost",
    speed: "1.7 m/s",
    tests: ["Group test"],
    behaviorTags: ["shy"]
  },
  {
    id: "demon",
    name: "Demon",
    evidences: ["Ultraviolet", "Ghost Writing", "Freezing Temps"],
    strengths: ["Attacks more often than other ghosts"],
    weaknesses: ["Ouija board will not lower sanity as much"],
    abilities: ["Attacks frequently", "Aggressive behavior"],
    tells: ["Frequent hunt attempts", "Aggressive supernatural activity", "High hunt frequency"],
    behaviors: ["Most aggressive ghost type", "Hunts frequently", "Responds quickly to provocations"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "70%",
    guaranteedEvidence: ["All three evidences common"],
    notes: "Attacks frequently",
    speed: "1.7 m/s",
    tests: ["Ouija test"],
    behaviorTags: ["aggressive"]
  },
  {
    id: "yurei",
    name: "Yurei",
    evidences: ["Ghost Orbs", "Freezing Temps", "D.O.T.S"],
    strengths: ["Strong effect on sanity"],
    weaknesses: ["Smudge sticks will prevent it from wandering"],
    abilities: ["Drains sanity", "Door slamming"],
    tells: ["Rapid sanity drain", "Frequent door slamming", "Strong cold spots"],
    behaviors: ["Dramatic sanity drain effects", "Active door slamming", "Wanders after smudging"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Drains sanity quickly",
    speed: "1.7 m/s",
    tests: ["Smudge test"],
    behaviorTags: ["sanity"]
  },
  {
    id: "oni",
    name: "Oni",
    evidences: ["EMF Level 5", "Freezing Temps", "D.O.T.S"],
    strengths: ["More active when players are nearby"],
    weaknesses: ["Being active makes it easier to identify"],
    abilities: ["More active", "Duplicate appearance"],
    tells: ["Very active when players present", "Sometimes appears as double", "Strong physical manifestations"],
    behaviors: ["Highly visible during activity", "Strong EMF readings", "Very active ghost"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences likely"],
    notes: "More active when players are nearby",
    speed: "1.7 m/s",
    tests: ["Activity test"],
    behaviorTags: ["active"]
  },
  {
    id: "yokai",
    name: "Yokai",
    evidences: ["Spirit Box", "Ghost Orbs", "D.O.T.S"],
    strengths: ["Talking near it will anger it"],
    weaknesses: ["Only responds to voice when close"],
    abilities: ["Responds to voice", "Anger from talking"],
    tells: ["Angry when players talk nearby", "Responds to voices within short range", "Increased activity when talking"],
    behaviors: ["Aggressive to talkers", "Responds only to nearby voices", "Calm when players are quiet"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences possible"],
    notes: "Responds to voice when close",
    speed: "1.7 m/s",
    tests: ["Voice test"],
    behaviorTags: ["voice"]
  },
  {
    id: "hantu",
    name: "Hantu",
    evidences: ["Ultraviolet", "Ghost Orbs", "Freezing Temps"],
    strengths: ["Moves faster in cold areas"],
    weaknesses: ["Freezer will slow it down"],
    abilities: ["Faster in cold", "Cold area preference"],
    tells: ["Moves faster in cold rooms", "Slower in heated areas", "Prefers cold environments"],
    behaviors: ["Speed varies with temperature", "Moves normal speed in warm areas", "Very fast in cold rooms"],
    huntSpeed: "2.8 m/s in cold, 1.7 m/s in warm",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Faster in cold areas",
    speed: "1.7 m/s -> 2.8 m/s in cold",
    tests: ["Freezer test"],
    behaviorTags: ["cold"]
  },
  {
    id: "goryo",
    name: "Goryo",
    evidences: ["EMF Level 5", "Ultraviolet", "D.O.T.S"],
    strengths: ["Only shows itself on camera when no one is nearby"],
    weaknesses: ["D.O.T.S will not work through walls"],
    abilities: ["Camera only", "Avoids people"],
    tells: ["DOTS only visible through camera", "Rarely seen directly", "Avoids rooms with players"],
    behaviors: ["Only appears on camera when alone", "Very elusive in person", "Strong EMF patterns"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences available"],
    notes: "Only shows on camera when alone",
    speed: "1.7 m/s",
    tests: ["Camera test"],
    behaviorTags: ["camera"]
  },
  {
    id: "myling",
    name: "Myling",
    evidences: ["EMF Level 5", "Ultraviolet", "Ghost Writing"],
    strengths: ["Makes more paranormal sounds"],
    weaknesses: ["Parabolic microphone will make it easier to track"],
    abilities: ["Noisy", "Hidden footsteps"],
    tells: ["More frequent paranormal sounds", "Quieter than average during hunts", "Footsteps heard through parabolic mic"],
    behaviors: ["Very vocal during activity", "Quiet during hunts", "Parabolic mic picks up clear audio"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences possible"],
    notes: "Makes more sounds",
    speed: "1.7 m/s",
    tests: ["Parabolic test"],
    behaviorTags: ["noisy"]
  },
  {
    id: "onryo",
    name: "Onryo",
    evidences: ["Spirit Box", "Ghost Orbs", "Freezing Temps"],
    strengths: ["Blows out fires to hunt"],
    weaknesses: ["Candles will prevent it from hunting"],
    abilities: ["Blows out fires", "Candle protection"],
    tells: ["Blows out flames to initiate hunts", "Candles prevent hunting attempts", "Fire-related activity"],
    behaviors: ["Blows out flames to hunt", "Cannot hunt while candles are burning", "Strong connection to fire"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences likely"],
    notes: "Blows out fires to hunt",
    speed: "1.7 m/s",
    tests: ["Candle test"],
    behaviorTags: ["fire"]
  },
  {
    id: "the-twins",
    name: "The Twins",
    evidences: ["EMF Level 5", "Spirit Box", "Freezing Temps"],
    strengths: ["Either twin can hunt"],
    weaknesses: ["Interacting with one twin will make the other interact"],
    abilities: ["Two entities", "Coordinate activity"],
    tells: ["Two different types of activity", "Coordinated ghost events", "EMF from multiple sources"],
    behaviors: ["Two separate entities", "Coordinate their activities", "Either can initiate hunts"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Two twins",
    speed: "1.7 m/s",
    tests: ["Twin test"],
    behaviorTags: ["twins"]
  },
  {
    id: "raiju",
    name: "Raiju",
    evidences: ["EMF Level 5", "Ghost Orbs", "D.O.T.S"],
    strengths: ["Disrupts electronics"],
    weaknesses: ["Electronic interference will make it hunt more"],
    abilities: ["Disrupts electronics", "Electronic aggression"],
    tells: ["Strong electronic interference", "Frequent equipment malfunctions", "Hunts more when electronics are active"],
    behaviors: ["Aggressive to electronic devices", "More active around electronics", "Hunts triggered by interference"],
    huntSpeed: "2.5 m/s near electronics",
    huntThreshold: "65%",
    guaranteedEvidence: ["All three evidences possible"],
    notes: "Disrupts electronics",
    speed: "1.7 m/s -> 2.5 m/s near electronics",
    tests: ["Electronic test"],
    behaviorTags: ["electronic"]
  },
  {
    id: "obake",
    name: "Obake",
    evidences: ["EMF Level 5", "Ultraviolet", "Ghost Orbs"],
    strengths: ["Rarely leaves UV evidence"],
    weaknesses: ["UV evidence changes shape"],
    abilities: ["Shape-shifting UV", "Unique evidence"],
    tells: ["UV evidence changes shape or pattern", "Sometimes doesn't leave UV evidence", "Unusual fingerprint patterns"],
    behaviors: ["Shape-shifting abilities", "Inconsistent UV evidence", "Can alter evidence appearance"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["UV evidence may be inconsistent"],
    notes: "UV evidence changes shape",
    speed: "1.7 m/s",
    tests: ["UV test"],
    behaviorTags: ["shape"]
  },
  {
    id: "the-mimic",
    name: "The Mimic",
    evidences: ["Spirit Box", "Ultraviolet", "Freezing Temps"],
    strengths: ["Can mimic other ghosts"],
    weaknesses: ["Will reveal itself when mimicking"],
    abilities: ["Mimics other ghosts", "Variable evidence"],
    tells: ["Copies other ghost behaviors", "Evidence varies like other ghosts", "Eventually reveals true nature"],
    behaviors: ["Mimics random ghost types", "Copies behaviors and evidence", "Eventually shows true form"],
    huntSpeed: "1.7 m/s",
    huntThreshold: "50%",
    guaranteedEvidence: ["Always shows Freezing Temps"],
    notes: "Mimics other ghosts",
    speed: "1.7 m/s",
    tests: ["Mimic test"],
    behaviorTags: ["mimic"]
  },
  {
    id: "moroi",
    name: "Moroi",
    evidences: ["Spirit Box", "Ghost Writing", "Freezing Temps"],
    strengths: ["Curses players"],
    weaknesses: ["Smudge sticks will weaken it"],
    abilities: ["Curses players", "Curse immunity"],
    tells: ["Players become cursed", "Cursed players show unique effects", "Immune to smudging effects"],
    behaviors: ["Curses players directly", "Cursed players affected during hunts", "Smudge sticks less effective"],
    huntSpeed: "3.7 m/s when cursed",
    huntThreshold: "50%",
    guaranteedEvidence: ["All three evidences expected"],
    notes: "Curses players",
    speed: "1.7 m/s -> 3.7 m/s when cursed",
    tests: ["Curse test"],
    behaviorTags: ["curse"]
  },
  {
    id: "deogen",
    name: "Deogen",
    evidences: ["Spirit Box", "Ghost Writing", "D.O.T.S"],
    strengths: ["Always knows where players are"],
    weaknesses: ["Breathing heavily when close"],
    abilities: ["Knows player location", "Player tracking"],
    tells: ["Always finds hiding players quickly", "Heavy breathing when close", "Never loses track of player locations"],
    behaviors: ["Instant player location awareness", "Very fast when approaching players", "Breathing gets louder as it gets closer"],
    huntSpeed: "3.0 m/s",
    huntThreshold: "40%",
    guaranteedEvidence: ["All three evidences available"],
    notes: "Always knows where players are",
    speed: "0.4 m/s -> 3.0 m/s",
    tests: ["Breathing test"],
    behaviorTags: ["breathing"]
  },
  {
    id: "thaye",
    name: "Thaye",
    evidences: ["Ghost Orbs", "Ghost Writing", "D.O.T.S"],
    strengths: ["Ages over time"],
    weaknesses: ["Becomes more active as it ages"],
    abilities: ["Ages", "Progressive activity"],
    tells: ["Starts less active and ages over time", "Evidence changes as it ages", "Progressive speed increase"],
    behaviors: ["Ages throughout the investigation", "Becomes more aggressive over time", "Speed and activity increase with age"],
    huntSpeed: "1.0 m/s when aged, 2.8 m/s when young",
    huntThreshold: "15% when aged, 75% when young",
    guaranteedEvidence: ["All three evidences, but may disappear as it ages"],
    notes: "Ages over time",
    speed: "2.8 m/s -> 1.0 m/s as it ages",
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

function filterGhostsByEvidences(selectedEvidences, excludedEvidences = [], difficulty = null) {
    if (selectedEvidences.length === 0 && excludedEvidences.length === 0) return GHOSTS;

    if (difficulty) {
        const maxEvidences = getMaxEvidencesForDifficulty(difficulty);
        if (selectedEvidences.length > maxEvidences) {
            console.warn(`Difficulty ${difficulty} only allows ${maxEvidences} evidence, but ${selectedEvidences.length} were selected`);
        }
    }

    return GHOSTS.filter(ghost => {
        // Must have all selected evidences
        const hasAllSelected = selectedEvidences.every(evidence => ghost.evidences.includes(evidence));
        
        // Must NOT have any excluded evidences
        const hasNoExcluded = excludedEvidences.every(excluded => !ghost.evidences.includes(excluded));
        
        return hasAllSelected && hasNoExcluded;
    });
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

function getDifficultySpecificGhosts(difficulty, selectedEvidences = [], excludedEvidences = []) {
    const maxEvidences = getMaxEvidencesForDifficulty(difficulty);
    
    switch (difficulty) {
        case 'Nightmare':
            return GHOSTS.filter(ghost => {
                const isObvious = ghost.name.toLowerCase().includes('spirit') ||
                                 ghost.name.toLowerCase().includes('wraith') ||
                                 ghost.name.toLowerCase().includes('phantom');
                return !isObvious && excludedEvidences.every(excluded => !ghost.evidences.includes(excluded));
            });
            
        case 'Insanity':
            return GHOSTS.filter(ghost => {
                const challengingGhosts = ['deogen', 'moroi', 'myling', 'twins', 'obake'];
                return challengingGhosts.includes(ghost.id) && excludedEvidences.every(excluded => !ghost.evidences.includes(excluded));
            });
            
        default:
            return filterGhostsByEvidences(selectedEvidences, excludedEvidences);
    }
}

// Evidence icons mapping
const EVIDENCE_ICONS = {
    'EMF Level 5': 'emf.svg',
    'D.O.T.S': 'dots.svg',
    'Freezing Temps': 'tempgun.svg',
    'Ghost Writing': 'book.svg',
    'Ghost Orbs': 'orbs.svg',
    'Spirit Box': 'spiritbox.svg',
    'Ultraviolet': 'UV.svg'
};

// Speed audio mapping
const SPEED_AUDIO_MAP = {
    '0.4': '0.4speed.mp3',
    '0.5': '1speed.mp3',
    '0.6': '1speed.mp3',
    '0.7': '1speed.mp3',
    '0.8': '1speed.mp3',
    '0.9': '1speed.mp3',
    '1.0': '1speed.mp3',
    '1.1': '1.4speed.mp3',
    '1.2': '1.4speed.mp3',
    '1.3': '1.4speed.mp3',
    '1.4': '1.4speed.mp3',
    '1.5': '1.5speed.mp3',
    '1.6': '1.7speed.mp3',
    '1.7': '1.7speed.mp3',
    '1.8': '1.9speed.mp3',
    '1.9': '1.9speed.mp3',
    '2.0': '2.25speed.mp3',
    '2.1': '2.25speed.mp3',
    '2.2': '2.25speed.mp3',
    '2.3': '2.25speed.mp3',
    '2.4': '2.5speed.mp3',
    '2.5': '2.5speed.mp3',
    '2.6': '2.7speed.mp3',
    '2.7': '2.7speed.mp3',
    '2.8': '2.75speed.mp3',
    '2.9': '3speed.mp3',
    '3.0': '3speed.mp3',
    '3.1': '3speed.mp3',
    '3.2': '3speed.mp3',
    '3.3': '3speed.mp3',
    '3.4': '3speed.mp3',
    '3.5': '3speed.mp3',
    '3.6': '3speed.mp3',
    '3.7': '3.71speed.mp3',
    '3.8': '3.71speed.mp3',
    '3.9': '3.71speed.mp3',
    '4.0': '3.71speed.mp3'
};

// Utility function to extract base speed and map to audio file
function getSpeedAudioFile(speedString) {
    if (!speedString) return '1.7speed.mp3';
    
    // Extract the first speed number from strings like "1.7 m/s -> 3.0 m/s when chasing"
    const speedMatch = speedString.match(/(\d+\.?\d*)/);
    if (!speedMatch) return '1.7speed.mp3';
    
    const baseSpeed = parseFloat(speedMatch[1]);
    
    // Find the closest available speed audio
    for (let i = 0.4; i <= 4.0; i += 0.1) {
        const roundedSpeed = (Math.round(i * 10) / 10).toFixed(1);
        const diff = Math.abs(baseSpeed - parseFloat(roundedSpeed));
        if (diff <= 0.05 && SPEED_AUDIO_MAP[roundedSpeed]) {
            return SPEED_AUDIO_MAP[roundedSpeed];
        }
    }
    
    // Find exact match in mapping
    return SPEED_AUDIO_MAP[baseSpeed.toFixed(1)] || '1.7speed.mp3';
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EVIDENCES,
        DIFFICULTIES,
        GHOSTS,
        EVIDENCE_ICONS,
        SPEED_AUDIO_MAP,
        getMaxEvidencesForDifficulty,
        getEligibleEvidencesForDifficulty,
        filterGhostsByEvidences,
        getGhostMatchScore,
        getDifficultySpecificGhosts,
        getSpeedAudioFile
    };
}