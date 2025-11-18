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
    
    state.filteredGhosts = filtered;
    
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
        <div class="ghost-content">
            <div class="ghost-left">
                <div class="ghost-header">
                    <h3 class="ghost-name clickable" data-ghost="${ghost.id}">${ghost.name}</h3>
                    <span class="ghost-difficulty">${matchScore.score}% match</span>
                </div>
                <div class="ghost-evidences">
                    ${ghost.evidences.map(evidence => {
                        const iconClass = evidence.toLowerCase().replace(/[.\s]/g, '');
                        return `
                            <span class="evidence-tag">
                                <img src="ASSETS/svg/${EVIDENCE_ICONS[evidence] || 'file.svg'}" alt="" class="evidence-icon ${iconClass}">
                                <span>${evidence}</span>
                            </span>
                        `;
                    }).join('')}
                </div>
                <div class="ghost-stats">
                    <span class="speed-display">
                        <span class="speed-text">${ghost.speed || '1.7 m/s'}</span>
                        <button class="speed-preview-btn" data-ghost="${ghost.id}" data-speed-file="${getSpeedAudioFile(ghost.speed)}" title="Preview Speed Sound">
                            🔊
                        </button>
                    </span>
                    <span>${ghost.huntThreshold || '50%'} sanity</span>
                </div>
                <div class="ghost-actions">
                    <button class="action-confirm" data-ghost="${ghost.id}">✓</button>
                    <button class="action-exclude" data-ghost="${ghost.id}">✕</button>
                </div>
            </div>
            <div class="ghost-right">
                <div class="ghost-details-scroll">
                    ${ghost.tells && ghost.tells.length > 0 ? `
                        <div class="detail-section">
                            <h4>Tells</h4>
                            <ul>
                                ${ghost.tells.map(tell => `<li>${tell}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${ghost.behaviors && ghost.behaviors.length > 0 ? `
                        <div class="detail-section">
                            <h4>Behaviors</h4>
                            <ul>
                                ${ghost.behaviors.map(behavior => `<li>${behavior}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${ghost.abilities && ghost.abilities.length > 0 ? `
                        <div class="detail-section">
                            <h4>Abilities</h4>
                            <ul>
                                ${ghost.abilities.map(ability => `<li>${ability}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${ghost.huntSpeed ? `
                        <div class="detail-section">
                            <h4>Hunt Speed</h4>
                            <div class="hunt-speed-display">
                                <div class="speed-preview">
                                    <span>${ghost.huntSpeed}</span>
                                    <button class="speed-preview-btn" data-ghost="${ghost.id}" data-speed-file="${getSpeedAudioFile(ghost.huntSpeed)}" title="Preview Hunt Speed Sound">
                                        🔊
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${ghost.guaranteedEvidence && ghost.guaranteedEvidence.length > 0 ? `
                        <div class="detail-section">
                            <h4>Guaranteed Evidence</h4>
                            <ul>
                                ${ghost.guaranteedEvidence.map(evidence => `<li>${evidence}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        // Only open modal when clicking on ghost name
        if (e.target.classList.contains('ghost-name')) {
            e.stopPropagation();
            showGhostModal(ghost);
        }
    });
    
    // Add data attribute for identification
    card.dataset.ghost = ghost.id;
    
    // Check if ghost is excluded for visual styling
    if (state.excludedGhosts.has(ghost.id)) {
        card.classList.add('excluded');
        card.querySelector('.action-exclude').textContent = '↶';
        card.querySelector('.action-exclude').title = 'Bring Back';
    }
    
    // Action buttons
    card.querySelector('.action-confirm').addEventListener('click', (e) => {
        e.stopPropagation();
        handleGhostConfirm(ghost.id, true);
    });
    
    card.querySelector('.action-exclude').addEventListener('click', (e) => {
        e.stopPropagation();
        handleGhostConfirm(ghost.id, false);
    });
    
    return card;
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