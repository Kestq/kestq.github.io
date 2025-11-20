// Global state
let state = {
    selectedEvidences: [],
    selectedDifficulty: 'Amateur',
    excludedGhosts: new Set(),
    confirmedGhosts: new Set(),
    selectedGhost: null,
    filteredGhosts: GHOSTS,
    speedFilter: 'all',
    huntThresholdFilter: 'all',
    lineExcluded: new Set(),
    evidenceExcluded: new Set(),
    sidebarMode: 'filters',
    timerStates: {},
    bpmValue: 120,
    currentTheme: 'default-dark'
};

// Theme management
function initThemeSelector() {
    const themeBtn = document.getElementById('themeBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    const themePreview = document.getElementById('themePreview');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('phasmo-theme') || 'default-dark';
    state.currentTheme = savedTheme;
    setTheme(savedTheme);
    updateThemePreview();
    
    // Theme button click
    themeBtn.addEventListener('click', () => {
        themeDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
            themeDropdown.classList.remove('show');
        }
    });
    
    // Theme option clicks
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
            localStorage.setItem('phasmo-theme', theme);
            themeDropdown.classList.remove('show');
        });
    });
}

function setTheme(themeName) {
    // Remove existing theme classes
    document.body.className = document.body.className.replace(/default-\w+|purple-\w+|blue-\w+|green-\w+|red-\w+|orange-\w+|pink-\w+|teal-\w+|indigo-\w+|emerald-\w+|amber-\w+|violet-\w+|cyan-\w+|rose-\w+|lime-\w+|slate-\w+|zinc-\w+|stone-\w+|neutral-\w+|mauve-\w+/g, '');
    
    // Add new theme class
    document.body.classList.add(themeName);
    state.currentTheme = themeName;
    updateThemePreview();
}

function updateThemePreview() {
    const themePreview = document.getElementById('themePreview');
    const themeColors = {
        'default-dark': '#ffffff',
        'default-light': '#333333',
        'purple-aurora': '#a855f7',
        'blue-sunset': '#3b82f6',
        'green-forest': '#22c55e',
        'red-crimson': '#ef4444',
        'orange-sunset': '#f97316',
        'pink-rose': '#ec4899',
        'teal-ocean': '#14b8a6',
        'indigo-dream': '#6366f1',
        'emerald-forest': '#10b981',
        'amber-gold': '#f59e0b',
        'violet-magic': '#8b5cf6',
        'cyan-electric': '#06b6d4',
        'rose-gold': '#f43f5e',
        'lime-bright': '#84cc16',
        'slate-modern': '#64748b',
        'zinc-rain': '#71717a',
        'stone-earth': '#a8a29e',
        'neutral-warm': '#a3a3a3',
        'mauve-delicate': '#a855a8'
    };
    
    themePreview.style.background = themeColors[state.currentTheme] || '#8b5cf6';
}

// State management
function updateState() {
    const maxEvidence = getMaxEvidencesForDifficulty(state.selectedDifficulty);
    
    // Filter ghosts by selected and excluded evidences
    let possibleGhosts = filterGhostsByEvidences(state.selectedEvidences, Array.from(state.evidenceExcluded));
    
    // Separate possible and excluded/impossible ghosts
    const includedGhosts = possibleGhosts.filter(ghost => !state.excludedGhosts.has(ghost.id));
    const excludedGhosts = GHOSTS.filter(ghost =>
        state.excludedGhosts.has(ghost.id) || !possibleGhosts.includes(ghost)
    );
    
    // Sort: included ghosts first (by name), then excluded ghosts (by name)
    includedGhosts.sort((a, b) => a.name.localeCompare(b.name));
    excludedGhosts.sort((a, b) => a.name.localeCompare(b.name));
    
    state.filteredGhosts = [...includedGhosts, ...excludedGhosts];
    
    // Update UI
    updateEvidenceGrid();
    updateGhostList();
    updateStats();
    updateSelectedEvidence();
    updateSpeedScaler();
}

function getMaxEvidence() {
    return getMaxEvidencesForDifficulty(state.selectedDifficulty);
}

// Evidence management
function handleEvidenceCycle(evidence) {
    const isSelected = state.selectedEvidences.includes(evidence);
    const isExcluded = state.evidenceExcluded.has(evidence);
    const maxEvidence = getMaxEvidence();
    
    if (isExcluded) {
        // Excluded -> Unselected
        state.evidenceExcluded.delete(evidence);
    } else if (isSelected) {
        // Selected -> Excluded
        state.evidenceExcluded.add(evidence);
        state.selectedEvidences = state.selectedEvidences.filter(e => e !== evidence);
    } else {
        // Unselected -> Select (if under limit)
        if (state.selectedEvidences.length < maxEvidence) {
            state.selectedEvidences.push(evidence);
        }
    }
    
    updateState();
}

function updateEvidenceGrid() {
    const grid = document.getElementById('evidenceGrid');
    const limit = document.getElementById('evidenceLimit');
    const maxEvidence = getMaxEvidence();
    
    grid.innerHTML = '';
    
    EVIDENCES.forEach(evidence => {
        const isSelected = state.selectedEvidences.includes(evidence);
        const isExcluded = state.evidenceExcluded.has(evidence);
        const maxReached = state.selectedEvidences.length >= maxEvidence && !isSelected;
        
        const button = document.createElement('button');
        button.className = `evidence-btn ${isSelected ? 'selected' : ''} ${isExcluded ? 'excluded' : ''} ${maxReached ? 'max-reached' : ''}`;
        button.disabled = maxReached;
        
        button.innerHTML = `
            <span class="flex-1 text-left">${evidence}</span>
        `;
        
        button.addEventListener('click', () => handleEvidenceCycle(evidence));
        grid.appendChild(button);
    });
    
    limit.textContent = `Evidence limit: ${maxEvidence} (${state.selectedEvidences.length}/${maxEvidence} selected)`;
}

// Ghost management
function updateGhostList() {
    const container = document.getElementById('ghostsContainer');
    container.innerHTML = '';
    
    // Add class for new grid layout
    container.className = 'ghost-grid';
    
    state.filteredGhosts.forEach(ghost => {
        const card = createGhostCard(ghost);
        container.appendChild(card);
    });
    
    // Hide stats header if max evidence reached
    const statsHeader = document.getElementById('statsHeader');
    const isMaxEvidence = state.selectedEvidences.length >= getMaxEvidence();
    statsHeader.style.display = isMaxEvidence ? 'none' : 'block';
}

function createGhostCard(ghost) {
    const card = document.createElement('div');
    card.className = 'ghost-card';
    
    const matchScore = getGhostMatchScore(ghost, state.selectedEvidences);
    const isPossible = filterGhostsByEvidences(state.selectedEvidences, Array.from(state.evidenceExcluded)).includes(ghost);
    const isExcluded = state.excludedGhosts.has(ghost.id) || !isPossible;
    
    card.innerHTML = `
        <!-- Ghost Header -->
        <div class="ghost-header">
            <h3 class="ghost-name clickable" data-ghost="${ghost.id}">${ghost.name}</h3>
        </div>

        <!-- Ghost Body - Two Column Layout -->
        <div class="ghost-body">
            <!-- Left Column - Stats & Evidence -->
            <div class="ghost-left">
                <!-- Hunt Sanity Row -->
                <div class="ghost-hunt-row">
                    <div class="ghost-hunt">
                        <div class="ghost-hunt-icon"></div>
                        <div class="ghost-hunt-values">
                            <div class="ghost-hunt-main">${ghost.huntThreshold || '50%'}</div>
                            <div class="ghost-hunt-label">Hunt sanity</div>
                        </div>
                    </div>
                </div>

                <!-- Speed Row -->
                <div class="ghost-speed-row">
                    <button class="ghost-los-chip">
                        👁️ LOS + Footsteps
                    </button>
                    <span class="ghost-speed-main">${getSpeedText(ghost)}</span>
                    ${getSpeedButtons(ghost)}
                </div>

                <!-- Evidence Row -->
                <div class="ghost-evidence-row">
                    ${ghost.evidences.map(evidence => {
                        const chipClass = evidence.toLowerCase().replace(/[.\s]/g, '');
                        const isSelected = state.selectedEvidences.includes(evidence);
                        const iconFile = EVIDENCE_ICONS[evidence] || 'file.svg';
                        return `
                            <span class="evidence-chip evidence-chip--${chipClass} ${isSelected ? 'selected' : ''}">
                                <img src="ASSETS/svg/${iconFile}" alt="${evidence}" />
                                ${evidence}
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Right Column - Tabs -->
            <div class="ghost-right">
                <!-- Tab Buttons -->
                <div class="ghost-tab-buttons">
                    <button class="tab-btn tab-btn--active" data-tab="tests">Tests</button>
                    <button class="tab-btn" data-tab="behavior">Behavior</button>
                    <button class="tab-btn" data-tab="stats">Stats</button>
                </div>

                <!-- Tab Content Box -->
                <div class="ghost-tab-box">
                    <!-- Tests Panel -->
                    <div class="ghost-tab-panel ghost-tab-panel--active" data-tab="tests">
                        <div class="ghost-tab-label">Tests</div>
                        <ul class="ghost-tab-list">
                            ${getDetailedTests(ghost).map(test => `<li>${test}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Behavior Panel -->
                    <div class="ghost-tab-panel" data-tab="behavior">
                        <div class="ghost-tab-label">Behavior</div>
                        <ul class="ghost-tab-list">
                            ${getDetailedBehaviors(ghost).map(behavior => `<li>${behavior}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Stats Panel -->
                    <div class="ghost-tab-panel" data-tab="stats">
                        <div class="ghost-tab-label">Stats</div>
                        <ul class="ghost-tab-list">
                            <li><strong>Speed:</strong> ${ghost.speed || '1.7 m/s'}</li>
                            ${ghost.huntSpeed ? `<li><strong>Hunt Speed:</strong> ${ghost.huntSpeed}</li>` : ''}
                            <li><strong>Hunt Threshold:</strong> ${ghost.huntThreshold || '50%'}</li>
                            ${ghost.guaranteedEvidence ? `<li><strong>Guaranteed Evidence:</strong> ${ghost.guaranteedEvidence.join(', ')}</li>` : ''}
                            ${ghost.strengths && ghost.strengths[0] !== "None" ? `<li><strong>Strength:</strong> ${ghost.strengths[0]}</li>` : ''}
                            ${ghost.weaknesses ? `<li><strong>Weakness:</strong> ${ghost.weaknesses[0]}</li>` : ''}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ghost Footer -->
        <div class="ghost-footer">
            <div class="ghost-footer-summary">
                ${ghost.name} · ${ghost.evidences.join(' / ')}
            </div>
            <div class="ghost-footer-actions">
                <button class="icon-btn icon-btn--select" data-ghost="${ghost.id}" title="Mark as possible">
                    ✓
                </button>
                <button class="icon-btn icon-btn--exclude" data-ghost="${ghost.id}" title="Mark as not">
                    ✕
                </button>
            </div>
        </div>
    `;
    
    // Remove JavaScript inline styles that override CSS - let CSS handle layout
    // card.style.height = '135px';  // REMOVED - causes layout issues
    // card.style.maxHeight = '135px';  // REMOVED - causes overflow
    // card.style.minHeight = '135px';  // REMOVED - prevents natural sizing
    // card.style.border = '1px solid var(--border)';  // REMOVED - CSS handles this
    // card.style.borderRadius = '12px';  // REMOVED - CSS handles this
    // card.style.background = 'var(--card)';  // REMOVED - CSS handles this
    // card.style.backdropFilter = 'none';  // REMOVED - CSS handles this
    // card.style.webkitBackdropFilter = 'none';  // REMOVED - CSS handles this
    
    card.addEventListener('click', (e) => {
        // Only open modal when clicking on ghost name
        if (e.target.classList.contains('ghost-name')) {
            e.stopPropagation();
            showGhostModal(ghost);
        }
    });
    
    // Add data attribute for identification (single assignment)
    card.dataset.ghost = ghost.id;
    
    // Check if ghost is excluded or impossible for visual styling
    if (isExcluded) {
        card.classList.add('excluded');
        const excludeBtn = card.querySelector('.icon-btn--exclude');
        if (excludeBtn) {
            excludeBtn.title = state.excludedGhosts.has(ghost.id) ? 'Bring Back' : 'Not Possible';
        }
    }
    
    // Tab functionality - scoped to this card only
    card.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tab = btn.dataset.tab;
            activateTab(card, tab);
        });
    });
    
    // Action buttons
    const selectBtn = card.querySelector('.icon-btn--select');
    const excludeBtn = card.querySelector('.icon-btn--exclude');
    
    if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleGhostConfirm(ghost.id, true);
        });
    }
    
    if (excludeBtn) {
        excludeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleGhostConfirm(ghost.id, false);
        });
    }
    
    // Speed sound buttons (multiple if ghost has variable speeds)
    const speedSoundBtns = card.querySelectorAll('.ghost-speed-sound');
    speedSoundBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const speedFile = e.target.getAttribute('data-speed-file');
            if (speedFile) {
                previewSpeedSound(speedFile, e.target);
            }
        });
    });
    
    return card;
}

// Helper functions
function getGhostTag(ghost) {
    if (ghost.behaviorTags && ghost.behaviorTags.includes('common')) return 'Base Ghost';
    if (ghost.behaviorTags && ghost.behaviorTags.includes('aggressive')) return 'Aggressive';
    if (ghost.behaviorTags && ghost.behaviorTags.includes('fast')) return 'Fast';
    if (ghost.behaviorTags && ghost.behaviorTags.includes('electronic')) return 'Electronic';
    return 'Special Ghost';
}

function getSpeedText(ghost) {
    if (ghost.speed && ghost.speed.includes('->')) {
        return ghost.speed.replace('->', ' / ');
    }
    
    // Display multiple speeds based on ghost capabilities
    if (ghost.huntSpeed && ghost.huntSpeed.includes('->')) {
        return `Roam: ${ghost.speed || '1.7 m/s'} / Hunt: ${ghost.huntSpeed.replace('->', ' / ')}`;
    }
    
    // Handle specific ghost speed variations
    const speedVariations = {
        'jinn': 'Roam: 1.7 m/s / Chase: 3.0 m/s',
        'hantu': 'Warm: 1.7 m/s / Cold: 2.8 m/s',
        'revenant': 'Search: 1.7 m/s / Hunt: 3.0 m/s',
        'moroi': 'Normal: 1.7 m/s / Cursed: 3.7 m/s',
        'deogen': 'Search: 1.6 m/s / Hunt: 3.0 m/s',
        'raiju': 'Normal: 1.7 m/s / Electronics: 2.5 m/s'
    };
    
    if (speedVariations[ghost.id]) {
        return speedVariations[ghost.id];
    }
    
    return ghost.speed || '1.7 m/s';
}

function getSpeedButtons(ghost) {
    const speeds = [];
    
    // Handle ghosts with multiple speeds
    if (ghost.id === 'jinn') {
        speeds.push({ label: '1.7', file: '1.7speed.mp3' });
        speeds.push({ label: '2.5', file: '2.5speed.mp3' });
    } else if (ghost.id === 'hantu') {
        speeds.push({ label: '1.7', file: '1.7speed.mp3' });
        speeds.push({ label: '2.7', file: '2.7speed.mp3' });
    } else if (ghost.id === 'revenant') {
        speeds.push({ label: '1.0', file: '1speed.mp3' });
        speeds.push({ label: '3.0', file: '3speed.mp3' });
    } else if (ghost.id === 'moroi') {
        speeds.push({ label: '1.5', file: '1.5speed.mp3' });
        speeds.push({ label: '2.25', file: '2.25speed.mp3' });
        speeds.push({ label: '3.71', file: '3.71speed.mp3' });
    } else if (ghost.id === 'deogen') {
        speeds.push({ label: '0.4', file: '0.4speed.mp3' });
        speeds.push({ label: '3.0', file: '3speed.mp3' });
    } else if (ghost.id === 'raiju') {
        speeds.push({ label: '1.7', file: '1.7speed.mp3' });
        speeds.push({ label: '2.5', file: '2.5speed.mp3' });
    } else if (ghost.id === 'thaye') {
        speeds.push({ label: '1.0', file: '1speed.mp3' });
        speeds.push({ label: '2.75', file: '2.75speed.mp3' });
    } else {
        // Default single speed
        const speedFile = getSpeedAudioFile(ghost.speed);
        speeds.push({ label: '🔊', file: speedFile });
    }
    
    return speeds.map(speed =>
        `<button class="ghost-speed-sound" data-speed-file="${speed.file}" title="Preview ${speed.file.replace('.mp3', '')} speed">
            ${speed.label}
        </button>`
    ).join('');
}

function getDetailedTests(ghost) {
    const tests = [];
    
    switch (ghost.id) {
        case 'spirit':
            tests.push('Smudge the ghost during a hunt - it will prevent hunting for 180 seconds (90s longer than normal)');
            tests.push('Monitor hunt cooldown timer after smudging');
            tests.push('Standard EMF 5 readings expected in ghost room');
            break;
        case 'wraith':
            tests.push('Place salt in high-traffic areas - Wraith will NEVER step in salt or leave UV footprints in it');
            tests.push('Watch for sudden EMF 5 spikes far from ghost room (indicates teleport to random player)');
            tests.push('Wraith can teleport within 3 meters of any player, causing EMF 2');
            tests.push('No footstep sounds or UV footprints after stepping in salt');
            break;
        case 'phantom':
            tests.push('Take a photo during a ghost event - Phantom will immediately disappear if photographed');
            tests.push('Monitor sanity drain - looking at Phantom drains sanity twice as fast');
            tests.push('During hunts, Phantom blinks/flickers much less frequently (every 1-2 seconds vs 0.3-1 second)');
            tests.push('Phantom can walk to a random player and cause an EMF 2 reading');
            break;
        case 'poltergeist':
            tests.push('Place multiple objects in a room and observe - can throw multiple items simultaneously');
            tests.push('Poltergeist can throw objects with much greater force than other ghosts');
            tests.push('Each thrown object decreases nearby player sanity by 2%');
            tests.push('In empty rooms with no throwable objects, Poltergeist is much less active');
            break;
        case 'banshee':
            tests.push('Use parabolic microphone to listen for unique scream/wail sound (different from normal ghost sounds)');
            tests.push('Observe that Banshee targets only ONE specific player until they leave the building');
            tests.push('Crucifix range is 5 meters (vs normal 3 meters) when placed in ghost room');
            tests.push('Banshee hunts based ONLY on target player\'s sanity, ignoring others');
            break;
        case 'jinn':
            tests.push('Turn OFF the breaker - Jinn cannot use its speed ability with power off');
            tests.push('With power ON and player in line of sight, Jinn moves at 2.5 m/s (much faster)');
            tests.push('Jinn will NEVER turn off the breaker itself');
            tests.push('Can drop player sanity by 25% if within 3 meters with power on');
            break;
        case 'mare':
            tests.push('Turn ON all lights in the building - Mare is much less likely to hunt with lights on');
            tests.push('Mare prefers to turn OFF lights and will do so more frequently');
            tests.push('Hunt threshold is 60% with lights OFF, but only 40% with lights ON');
            tests.push('Cannot turn on lights during a hunt');
            break;
        case 'revenant':
            tests.push('During hunt, break line of sight and hide - Revenant slows to 1.0 m/s when not chasing');
            tests.push('When chasing in line of sight, moves at 3.0 m/s (extremely fast)');
            tests.push('Listen for speed changes - very distinctive slow/fast pattern');
            break;
        case 'shade':
            tests.push('Investigate ALONE or in small groups - Shade is very shy and less active with multiple people');
            tests.push('Will not hunt if multiple people are in same room');
            tests.push('Will not perform ghost events if player is in same room');
            tests.push('Most active when players are alone');
            break;
        case 'demon':
            tests.push('Demon can hunt at ANY sanity level, even 100%');
            tests.push('Minimum hunt cooldown is only 20 seconds (vs normal 25 seconds)');
            tests.push('Crucifix range is reduced to 3 meters (vs normal 5 meters for most ghosts)');
            tests.push('Ouija Board drains 0% sanity instead of normal 40%');
            break;
        case 'yurei':
            tests.push('Smudging the Yurei traps it in ghost room for 90 seconds');
            tests.push('Yurei can close doors fully and drain 15% sanity from nearby players');
            tests.push('Watch for doors closing completely (not just moving)');
            break;
        case 'oni':
            tests.push('Oni is MORE active with multiple people nearby');
            tests.push('Cannot perform "airball" ghost event (mist ball)');
            tests.push('Throws objects with much more force than other ghosts');
            tests.push('Very visible during hunts - blinks/flickers more frequently');
            break;
        case 'yokai':
            tests.push('Talk near the ghost - Yokai is more active when players are talking nearby');
            tests.push('Can hunt at 80% sanity if players are talking within 2 meters');
            tests.push('During hunt, can only hear electronics/voices within 2 meters (vs normal 7.5 meters)');
            tests.push('Stay silent to reduce hunt range');
            break;
        case 'hantu':
            tests.push('Turn OFF breaker - Hantu moves faster in cold (up to 2.7 m/s) and slower in warm (1.4 m/s)');
            tests.push('Hantu will NEVER turn ON the breaker');
            tests.push('Visible freezing breath during hunts in ANY room temperature');
            tests.push('Speed increases as room gets colder');
            break;
        case 'goryo':
            tests.push('Set up DOTS projector and video camera - Goryo DOTS only visible through camera');
            tests.push('Goryo will NOT show DOTS if any player is in the same room');
            tests.push('Cannot change favorite room and will not roam far');
            tests.push('Watch camera feed remotely for DOTS evidence');
            break;
        case 'myling':
            tests.push('Use parabolic microphone - Myling is more vocal and creates more paranormal sounds');
            tests.push('During hunts, footsteps can only be heard within 12 meters (vs normal 20 meters)');
            tests.push('Very quiet during hunts - harder to track by sound');
            break;
        case 'onryo':
            tests.push('Light candles near the ghost - Onryo is less likely to hunt with lit candles nearby');
            tests.push('Blowing out a third flame can trigger a hunt at any sanity');
            tests.push('Each flame blown out increases hunt chance');
            tests.push('Crucifix range is 4 meters (vs normal 3 meters)');
            break;
        case 'the-twins':
            tests.push('Observe interactions from two different locations simultaneously');
            tests.push('One twin moves 10% faster (1.9 m/s), other moves 10% slower (1.5 m/s)');
            tests.push('Can interact with environment from two places at once');
            tests.push('Either twin can initiate a hunt');
            break;
        case 'raiju':
            tests.push('Turn on electronics near ghost - Raiju moves faster (2.5 m/s) near active electronics');
            tests.push('Can hunt at 65% sanity when near active electronics');
            tests.push('Disrupts electronics from further away (15 meters vs normal 10 meters)');
            tests.push('Turn off all electronics to slow it down');
            break;
        case 'obake':
            tests.push('Check UV fingerprints carefully - Obake can leave 6-fingered prints');
            tests.push('Fingerprints disappear after 60 seconds (vs normal 120 seconds)');
            tests.push('Has 25% chance to NOT leave fingerprints when touching something');
            tests.push('Can shapeshift and change ghost model during hunts');
            break;
        case 'the-mimic':
            tests.push('Mimic will show Ghost Orbs as a 4th evidence (always present)');
            tests.push('Changes behavior every 30-120 seconds to mimic another ghost type');
            tests.push('Can display abilities of ANY ghost type');
            tests.push('Ghost Orbs are the key identifier - always present even if not in evidence list');
            break;
        case 'moroi':
            tests.push('Use Spirit Box or Parabolic Mic to get cursed - increases Moroi speed');
            tests.push('Cursed players move at 1.5 m/s base, up to 2.25 m/s, max 3.71 m/s as sanity drops');
            tests.push('Smudging blinds Moroi for 12 seconds (vs normal 6 seconds)');
            tests.push('Taking sanity pills removes curse and slows Moroi down');
            break;
        case 'deogen':
            tests.push('Deogen ALWAYS knows where all players are - cannot hide from it');
            tests.push('Moves very fast when far (3.0 m/s) but very slow when close (0.4 m/s)');
            tests.push('Heavy breathing sounds during hunts, audible through doors');
            tests.push('Best strategy: loop around objects when it gets close');
            break;
        case 'thaye':
            tests.push('Thaye "ages" over time - becomes slower and less active');
            tests.push('Starts very active and fast, can hunt at 75% sanity when young');
            tests.push('Each "age" reduces speed and hunt threshold');
            tests.push('After aging fully, hunts at 15% sanity and moves at 1.0 m/s');
            tests.push('Ages faster when players are nearby');
            break;
        default:
            tests.push('Use standard testing methods for this ghost');
            tests.push('Observe behavior patterns carefully');
            tests.push('Document all evidence found');
            break;
    }
    
    return tests;
}

function activateTab(card, tabName) {
    // Update tab buttons
    card.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-btn--active');
    });
    card.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('tab-btn--active');
    
    // Update tab panels
    card.querySelectorAll('.ghost-tab-panel').forEach(panel => {
        panel.classList.remove('ghost-tab-panel--active');
    });
    card.querySelector(`.ghost-tab-panel[data-tab="${tabName}"]`).classList.add('ghost-tab-panel--active');
}

function handleGhostConfirm(ghostId, confirmed) {
    if (confirmed) {
        state.confirmedGhosts.add(ghostId);
    } else {
        state.excludedGhosts.add(ghostId);
    }
    updateState();
}

// Modal management
function showGhostModal(ghost) {
    const modal = document.getElementById('ghostModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = ghost.name;
    
    body.innerHTML = `
        <div class="ghost-details">
            <h3>Evidence Required</h3>
            <div class="evidence-list">
                ${ghost.evidences.map(evidence => `
                    <div class="evidence-item">
                        <img src="ASSETS/svg/${EVIDENCE_ICONS[evidence] || 'file.svg'}" alt="" class="evidence-icon">
                        <span>${evidence}</span>
                    </div>
                `).join('')}
            </div>
            
            <h3>Strengths</h3>
            <ul>
                ${ghost.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
            
            <h3>Weaknesses</h3>
            <ul>
                ${ghost.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
            </ul>
            
            ${ghost.abilities ? `
                <h3>Abilities</h3>
                <ul>
                    ${ghost.abilities.map(ability => `<li>${ability}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${ghost.notes ? `
                <h3>Notes</h3>
                <p>${ghost.notes}</p>
            ` : ''}
            
            <div class="ghost-meta">
                <div class="speed-display">
                    <span><strong>Speed:</strong> ${ghost.speed || '1.7 m/s'}</span>
                    <button class="speed-preview-btn" data-ghost="${ghost.id}" data-speed-file="${getSpeedAudioFile(ghost.speed)}" title="Preview Speed Sound">
                        🔊
                    </button>
                </div>
                <div><strong>Hunt Threshold:</strong> ${ghost.huntThreshold || '50%'}</div>
                ${ghost.tests ? `<div><strong>Tests:</strong> ${ghost.tests.join(', ')}</div>` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeGhostModal() {
    document.getElementById('ghostModal').classList.add('hidden');
}

// UI Updates
function updateStats() {
    const remainingGhosts = state.filteredGhosts.length;
    const totalGhosts = GHOSTS.length - state.excludedGhosts.size;
    const maxEvidence = getMaxEvidence();
    
    document.getElementById('statGhosts').textContent = remainingGhosts;
    document.getElementById('statConfirm').textContent = state.confirmedGhosts.size;
    document.getElementById('statEvidence').textContent = `${state.selectedEvidences.length}/${maxEvidence}`;
    
    document.getElementById('statsCount').textContent = `${remainingGhosts}/${totalGhosts}`;
}

function updateSelectedEvidence() {
    const container = document.getElementById('selectedEvidence');
    container.innerHTML = '';
    
    if (state.selectedEvidences.length > 0) {
        const evidenceList = document.createElement('div');
        evidenceList.className = 'flex space-x-1';
        
        state.selectedEvidences.forEach(evidence => {
            const badge = document.createElement('div');
            badge.className = 'evidence-badge';
            badge.innerHTML = `
                <img src="ASSETS/svg/${EVIDENCE_ICONS[evidence] || 'file.svg'}" alt="" class="evidence-icon">
                <span>${evidence.split(' ')[0]}</span>
            `;
            evidenceList.appendChild(badge);
        });
        
        container.appendChild(evidenceList);
    }
}

function updateSpeedScaler() {
    const current = document.getElementById('speedCurrent');
    const details = document.getElementById('speedDetails');
    
    current.textContent = `${state.selectedDifficulty} • Max: ${getMaxEvidence()}`;
    details.innerHTML = `
        <div>Amateur: 100% • Inter: 110%</div>
        <div>Prof: 120% • Night: 130%</div>
        <div>Insanity: 140%</div>
    `;
}

// Event handlers
function initEventHandlers() {
    // Difficulty change
    document.getElementById('difficultySelect').addEventListener('change', (e) => {
        state.selectedDifficulty = e.target.value;
        state.selectedEvidences = [];
        state.excludedGhosts.clear();
        state.confirmedGhosts.clear();
        state.evidenceExcluded.clear();
        state.lineExcluded.clear();
        updateState();
    });
    
    // Speed filter
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.speedFilter = e.target.dataset.speed;
        });
    });
    
    // Hunt threshold filter
    document.querySelectorAll('.hunt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.hunt-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.huntThresholdFilter = e.target.dataset.hunt;
        });
    });
    
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('.sidebar-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(e.target.dataset.mode + 'Mode').classList.remove('hidden');
        });
    });
    
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', () => {
        state.selectedEvidences = [];
        state.excludedGhosts.clear();
        state.lineExcluded.clear();
        state.evidenceExcluded.clear();
        state.speedFilter = 'all';
        state.huntThresholdFilter = 'all';
        state.confirmedGhosts.clear();
        
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.speed-btn[data-speed="all"]').classList.add('active');
        document.querySelectorAll('.hunt-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.hunt-btn[data-hunt="all"]').classList.add('active');
        
        updateState();
    });
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        state.excludedGhosts.clear();
        state.lineExcluded.clear();
        state.evidenceExcluded.clear();
        state.confirmedGhosts.clear();
        updateState();
    });
    
    // Timer buttons
    document.querySelectorAll('.timer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const timer = e.target.dataset.timer;
            state.timerStates[timer] = !state.timerStates[timer];
            e.target.classList.toggle('active');
            e.target.classList.toggle(timer);
        });
    });
    
    // BPM input
    document.getElementById('bpmInput').addEventListener('input', (e) => {
        state.bpmValue = parseInt(e.target.value) || 120;
        updateBPMResult();
    });
    
    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeGhostModal);
    document.getElementById('ghostModal').addEventListener('click', (e) => {
        if (e.target.id === 'ghostModal') {
            closeGhostModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGhostModal();
        }
    });
    
    // Speed preview button events
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('speed-preview-btn')) {
            const speedFile = e.target.dataset.speedFile;
            const button = e.target;
            previewSpeedSound(speedFile, button);
        }
    });
}

function previewSpeedSound(speedFile, button) {
    // Stop any currently playing audio
    stopAllSpeedAudio();
    
    if (!speedFile) return;
    
    try {
        const audio = new Audio(`ASSETS/speeds/${speedFile}`);
        audio.volume = 0.3; // Set reasonable volume
        
        // Visual feedback
        button.classList.add('playing');
        button.title = 'Playing speed sound';
        
        // Audio event handlers
        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
            button.title = 'Preview Speed Sound';
        });
        
        audio.addEventListener('error', () => {
            button.classList.remove('playing');
            button.title = 'Preview Speed Sound';

function getDetailedBehaviors(ghost) {
    const behaviors = [];
    
    switch (ghost.id) {
        case 'spirit':
            behaviors.push('Most common ghost type with no special abilities');
            behaviors.push('Smudge stick prevents hunting for 180 seconds (90s longer than normal)');
            behaviors.push('Standard interaction patterns and hunt behavior');
            break;
        case 'wraith':
            behaviors.push('Can teleport to random players within 3 meters, causing EMF 2');
            behaviors.push('Never steps in salt and leaves no UV footprints in salt');
            behaviors.push('Can walk through walls and doors during hunts');
            break;
        case 'phantom':
            behaviors.push('Looking at Phantom drains sanity twice as fast');
            behaviors.push('Disappears immediately when photographed during ghost event');
            behaviors.push('Blinks much less frequently during hunts (harder to see)');
            behaviors.push('Can walk to random player location and cause EMF 2');
            break;
        case 'poltergeist':
            behaviors.push('Can throw multiple objects simultaneously');
            behaviors.push('Each thrown object decreases nearby player sanity by 2%');
            behaviors.push('Throws objects with greater force than other ghosts');
            behaviors.push('Much less active in empty rooms with no throwable items');
            break;
        case 'banshee':
            behaviors.push('Targets ONE specific player until they leave the building');
            behaviors.push('Hunts based only on target player\'s sanity, ignoring others');
            behaviors.push('Unique scream/wail sound detectable with parabolic microphone');
            behaviors.push('Crucifix has 5 meter range (vs normal 3 meters)');
            break;
        case 'jinn':
            behaviors.push('Moves at 2.5 m/s when chasing player in line of sight (power must be ON)');
            behaviors.push('Cannot use speed ability if breaker is OFF');
            behaviors.push('Will never turn off the breaker');
            behaviors.push('Can drop player sanity by 25% if within 3 meters (power ON)');
            break;
        case 'mare':
            behaviors.push('Prefers to turn OFF lights frequently');
            behaviors.push('Hunt threshold: 60% with lights OFF, 40% with lights ON');
            behaviors.push('Cannot turn lights ON during hunts');
            behaviors.push('More active in darkness');
            break;
        case 'revenant':
            behaviors.push('Moves at 3.0 m/s when chasing player in line of sight');
            behaviors.push('Slows to 1.0 m/s when not chasing or line of sight broken');
            behaviors.push('Very distinctive slow/fast movement pattern');
            break;
        case 'shade':
            behaviors.push('Very shy - less active with multiple people nearby');
            behaviors.push('Will not hunt if multiple people in same room');
            behaviors.push('Will not perform ghost events if player in same room');
            behaviors.push('Most active when players are alone');
            break;
        case 'demon':
            behaviors.push('Can hunt at ANY sanity level, even 100%');
            behaviors.push('Minimum hunt cooldown: 20 seconds (vs normal 25 seconds)');
            behaviors.push('Ouija Board drains 0% sanity (vs normal 40%)');
            behaviors.push('Crucifix range reduced to 3 meters');
            break;
        case 'yurei':
            behaviors.push('Can close doors fully and drain 15% sanity from nearby players');
            behaviors.push('Smudging traps it in ghost room for 90 seconds');
            behaviors.push('Doors close completely, not just move');
            break;
        case 'oni':
            behaviors.push('MORE active with multiple people nearby');
            behaviors.push('Cannot perform "airball" mist ghost event');
            behaviors.push('Throws objects with much more force');
            behaviors.push('Very visible during hunts - blinks more frequently');
            break;
        case 'yokai':
            behaviors.push('More active when players talk nearby');
            behaviors.push('Can hunt at 80% sanity if players talking within 2 meters');
            behaviors.push('During hunt, only hears electronics/voices within 2 meters');
            break;
        case 'hantu':
            behaviors.push('Speed increases in cold (up to 2.7 m/s), decreases in warm (1.4 m/s)');
            behaviors.push('Never turns ON the breaker');
            behaviors.push('Visible freezing breath during hunts in any temperature');
            break;
        case 'goryo':
            behaviors.push('DOTS only visible through video camera');
            behaviors.push('Will not show DOTS if player in same room');
            behaviors.push('Cannot change favorite room - stays in one area');
            break;
        case 'myling':
            behaviors.push('More vocal - creates more paranormal sounds');
            behaviors.push('Footsteps only audible within 12 meters during hunts');
            behaviors.push('Very quiet during hunts - hard to track by sound');
            break;
        case 'onryo':
            behaviors.push('Less likely to hunt with lit candles nearby');
            behaviors.push('Blowing out third flame can trigger hunt at any sanity');
            behaviors.push('Crucifix range: 4 meters (vs normal 3 meters)');
            break;
        case 'the-twins':
            behaviors.push('Can interact from two locations simultaneously');
            behaviors.push('Fast twin: 1.9 m/s, Slow twin: 1.5 m/s');
            behaviors.push('Either twin can initiate hunts');
            break;
        case 'raiju':
            behaviors.push('Moves faster (2.5 m/s) near active electronics');
            behaviors.push('Can hunt at 65% sanity near active electronics');
            behaviors.push('Disrupts electronics from 15 meters away');
            break;
        case 'obake':
            behaviors.push('Can leave 6-fingered UV prints (rare)');
            behaviors.push('Fingerprints disappear after 60 seconds');
            behaviors.push('25% chance to not leave fingerprints');
            behaviors.push('Can shapeshift during hunts');
            break;
        case 'the-mimic':
            behaviors.push('Always shows Ghost Orbs as 4th evidence');
            behaviors.push('Changes behavior every 30-120 seconds');
            behaviors.push('Can mimic ANY ghost type abilities');
            break;
        case 'moroi':
            behaviors.push('Cursed players increase Moroi speed over time');
            behaviors.push('Speed: 1.5 m/s base, 2.25 m/s mid, 3.71 m/s max');
            behaviors.push('Smudging blinds for 12 seconds (vs normal 6)');
            behaviors.push('Sanity pills remove curse');
            break;
        case 'deogen':
            behaviors.push('Always knows all player locations');
            behaviors.push('Fast when far (3.0 m/s), slow when close (0.4 m/s)');
            behaviors.push('Heavy breathing audible through doors');
            behaviors.push('Best counter: loop around objects');
            break;
        case 'thaye':
            behaviors.push('Ages over time - becomes slower and less active');
            behaviors.push('Young: 75% hunt threshold, very fast and active');
            behaviors.push('Old: 15% hunt threshold, 1.0 m/s speed');
            behaviors.push('Ages faster when players nearby');
            break;
        default:
            behaviors.push('Standard ghost behavior patterns');
            behaviors.push('Normal interaction frequency');
            behaviors.push('Regular hunt mechanics');
            break;
    }
    
    return behaviors;
}
            console.warn('Could not load speed audio:', speedFile);
        });
        
        // Store audio reference for cleanup
        button._audioRef = audio;
        
        // Play the audio
        audio.play().catch(error => {
            console.warn('Could not play speed audio:', error);
            button.classList.remove('playing');
            button.title = 'Preview Speed Sound';
        });
        
    } catch (error) {
        console.warn('Error creating speed audio:', error);
    }
}

function stopAllSpeedAudio() {
    // Stop all currently playing speed audio and remove visual states
    const speedButtons = document.querySelectorAll('.speed-preview-btn, .ghost-speed-sound');
    speedButtons.forEach(button => {
        if (button._audioRef) {
            button._audioRef.pause();
            button._audioRef = null;
        }
        button.classList.remove('playing');
        button.title = 'Preview Speed Sound';
    });
}

function updateBPMResult() {
    const result = document.getElementById('bpmResult');
    result.textContent = `${(60 / state.bpmValue).toFixed(2)}s per beat`;
}

// Initialization
function init() {
    initThemeSelector();
    initEventHandlers();
    updateEvidenceGrid();
    updateGhostList();
    updateStats();
    updateSpeedScaler();
    updateBPMResult();
    
    // Set initial active states
    document.querySelector('.mode-btn[data-mode="filters"]').classList.add('active');
    document.querySelector('.speed-btn[data-speed="all"]').classList.add('active');
    document.querySelector('.hunt-btn[data-hunt="all"]').classList.add('active');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);