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
    let filtered = filterGhostsByEvidences(state.selectedEvidences, Array.from(state.evidenceExcluded));
    filtered = filtered.filter(ghost => !state.excludedGhosts.has(ghost.id));
    
    // Separate included and excluded ghosts
    const includedGhosts = filtered.filter(ghost => !state.excludedGhosts.has(ghost.id));
    const excludedGhosts = GHOSTS.filter(ghost => state.excludedGhosts.has(ghost.id));
    
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
    
    card.innerHTML = `
        <!-- Ghost Header -->
        <div class="ghost-header">
            <h3 class="ghost-name clickable" data-ghost="${ghost.id}">${ghost.name}</h3>
            <span class="ghost-tag">${getGhostTag(ghost)}</span>
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
                    <button class="ghost-speed-sound" data-ghost="${ghost.id}" data-speed-file="${getSpeedAudioFile(ghost.speed)}" title="Preview Speed Sound">
                        🔊
                    </button>
                </div>

                <!-- Evidence Row -->
                <div class="ghost-evidence-row">
                    ${ghost.evidences.map(evidence => {
                        const chipClass = evidence.toLowerCase().replace(/[.\s]/g, '');
                        const shortName = evidence.split(' ')[0];
                        return `
                            <span class="evidence-chip evidence-chip--${chipClass}">
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
                            ${ghost.tests ? ghost.tests.map(test => `<li>${test}</li>`).join('') : '<li>Use standard testing methods</li>'}
                            ${getGhostSpecificTests(ghost).map(test => `<li>${test}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Behavior Panel -->
                    <div class="ghost-tab-panel" data-tab="behavior">
                        <div class="ghost-tab-label">Behavior</div>
                        <ul class="ghost-tab-list">
                            ${ghost.behaviors ? ghost.behaviors.map(behavior => `<li>${behavior}</li>`).join('') : '<li>Standard ghost behavior</li>'}
                            ${ghost.abilities ? ghost.abilities.map(ability => `<li>${ability}</li>`).join('') : ''}
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
    
    // Check if ghost is excluded for visual styling
    if (state.excludedGhosts.has(ghost.id)) {
        card.classList.add('excluded');
        card.querySelector('.icon-btn--exclude').title = 'Bring Back';
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
    
    // Speed sound button
    const speedSoundBtn = card.querySelector('.ghost-speed-sound');
    if (speedSoundBtn) {
        speedSoundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const speedFile = e.target.getAttribute('data-speed-file');
            if (speedFile) {
                previewSpeedSound(speedFile, e.target);
            }
        });
    }
    
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

function getGhostSpecificTests(ghost) {
    const tests = [];
    
    switch (ghost.id) {
        case 'spirit':
            tests.push('Use smudge stick during hunt');
            tests.push('Watch for 180-second protection');
            break;
        case 'wraith':
            tests.push('Place salt on floor');
            tests.push('Check for teleport activity');
            break;
        case 'phantom':
            tests.push('Take photo during ghost event');
            tests.push('Observe sanity drain while looking');
            break;
        case 'poltergeist':
            tests.push('Find empty room');
            tests.push('Test object throwing frequency');
            break;
        case 'banshee':
            tests.push('Place crucifix in suspected room');
            tests.push('Listen for singing before hunts');
            break;
        case 'jinn':
            tests.push('Turn off breaker');
            tests.push('Observe speed change when chasing');
            break;
        case 'mare':
            tests.push('Turn on all lights');
            tests.push('Check aggression in darkness');
            break;
        case 'revenant':
            tests.push('Hide from ghost during hunt');
            tests.push('Observe speed change');
            break;
        case 'shade':
            tests.push('Investigate in groups');
            tests.push('Check activity with multiple people');
            break;
        case 'demon':
            tests.push('Use Ouija board');
            tests.push('Observe sanity drop');
            break;
        case 'yurei':
            tests.push('Smudge in rooms');
            tests.push('Check door slamming');
            break;
        case 'oni':
            tests.push('Investigate with multiple people');
            tests.push('Observe visible activity');
            break;
        case 'yokai':
            tests.push('Talk near ghost');
            tests.push('Stay silent for calm hunting');
            break;
        case 'hantu':
            tests.push('Turn on freezer');
            tests.push('Observe speed in cold vs warm');
            break;
        case 'goryo':
            tests.push('Use DOTS with camera alone');
            tests.push('Avoid being in same room');
            break;
        case 'myling':
            tests.push('Use parabolic microphone');
            tests.push('Listen for paranormal sounds');
            break;
        case 'onryo':
            tests.push('Light all candles');
            tests.push('Blow out flames to trigger hunt');
            break;
        case 'the-twins':
            tests.push('Interact with both twins');
            tests.push('Observe coordinated activity');
            break;
        case 'raiju':
            tests.push('Turn off all electronics');
            tests.push('Use electronics near ghost');
            break;
        case 'obake':
            tests.push('Look for UV shape changes');
            tests.push('Check evidence consistency');
            break;
        case 'the-mimic':
            tests.push('Wait for true form reveal');
            tests.push('Observe evidence changes');
            break;
        case 'moroi':
            tests.push('Smudge during curse');
            tests.push('Check speed when cursed');
            break;
        case 'deogen':
            tests.push('Hide and listen for breathing');
            tests.push('Test player location awareness');
            break;
        case 'thaye':
            tests.push('Observe aging process');
            tests.push('Check activity changes over time');
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
    const speedButtons = document.querySelectorAll('.speed-preview-btn');
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