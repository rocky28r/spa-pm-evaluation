// ADD CHART.JS PLUGIN REGISTRATION HERE IF YOU IMPLEMENT THE BACKGROUND PLUGIN
// e.g., Chart.register(radarBackgroundPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // --- Data Definitions (skillCategories, skillDescriptions, colors, coreRoleExpectations) ---
    const skillCategories = [
        "", // 0 - Spacer 1
        "Fluency with Data", "Voice of the Customer", "User Experience Design", // 1, 2, 3
        "", // 4 - Spacer 2
        "Business Outcome Ownership", "Product Vision & Roadmapping", "Strategic Impact", // 5, 6, 7
        "", // 8 - Spacer 3
        "Stakeholder Management", "Team Leadership", "Managing Up", // 9, 10, 11
        "", // 12 - Spacer 4
        "Feature Specification", "Product Delivery", "Quality Assurance" // 13, 14, 15
    ];
    const skillDescriptions = {
        "Feature Specification": "PRODUCT EXECUTION: Feature Specification\nThe ability for a PM to gather requirements, define functionality, and set goals in a clear, actionable format that can be used to communicate with the team and drive product delivery.",
        "Product Delivery": "PRODUCT EXECUTION: Product Delivery\nThe ability to work closely with one’s immediate team (engineering, design, etc.) to iteratively and quickly deliver product functionality that accomplishes pre-defined goals.",
        "Quality Assurance": "PRODUCT EXECUTION: Product Quality Assurance\nThe ability to identify, prioritize, and resolve technical, functional, and business quality issues across all devices, points of sale, and use cases that are applicable to the product.",
        "Fluency with Data": "CUSTOMER INSIGHT: Fluency with Data\nThe ability to use data to generate actionable insights, to leverage those insights to achieve goals set for the product, and to connect those quantified goals to meaningful outcomes for the business.",
        "Voice of the Customer": "CUSTOMER INSIGHT: Voice of the Customer\nThe ability to leverage user feedback in all its forms (from casual conversations to formal studies) to understand how users engage with the product, make better decisions, and drive meaningful outcomes for the business.",
        "User Experience Design": "CUSTOMER INSIGHT: User Experience Design\nThe ability, both as an individual and working with the design team, to define requirements and deliver UX designs that are easy to use, leverage UX best practices, and dovetail with the predominant UX patterns present in the product.",
        "Business Outcome Ownership": "PRODUCT STRATEGY: Business Outcome Ownership\nThe ability to drive meaningful outcomes for the business by connecting product functionality and goals to the strategic objectives of the PM’s team and the company overall.",
        "Product Vision & Roadmapping": "PRODUCT STRATEGY: Product Vision & Roadmapping\nThe ability to define an overall vision for the PM’s area of the product that connects to the strategy for the team and the company. The ability to define a clear roadmap of highly prioritized features and initiatives that deliver against that vision.",
        "Strategic Impact": "PRODUCT STRATEGY: Strategic Impact\nThe ability to understand and contribute to the business strategy for a PM’s team and the company overall. The ability to bring strategy to fruition through the consistent delivery of business outcomes.",
        "Stakeholder Management": "INFLUENCING PEOPLE: Stakeholder Management\nThe ability to proactively identify stakeholders impacted by the PM’s area of ownership and to work with those stakeholders to factor their requirements into product decisions.",
        "Team Leadership": "INFLUENCING PEOPLE: Team Leadership\nThe ability to manage and mentor direct reports with the goal of enabling them to successfully deliver on their product areas, continuously improve against these competencies, deliver meaningful business outcomes, and achieve their career objectives.",
        "Managing Up": "INFLUENCING PEOPLE: Managing Up\nThe ability to leverage senior managers and executives in the organization to help achieve goals, deliver meaningful business outcomes and positively influence the strategic direction of the PM’s team and the company overall."
    };
    const colorOrange = '#F5821F'; const colorYellow = '#EAAA00'; const colorCyan = '#20BDBE'; const colorBlue = '#0077C8';
    const pointLabelColors = [null, colorYellow, colorYellow, colorYellow, null, colorCyan, colorCyan, colorCyan, null, colorBlue, colorBlue, colorBlue, null, colorOrange, colorOrange, colorOrange];
    const coreRoleExpectations = { /* ... Role data unchanged ... */
      "Jr Product Manager":           [1.5, 2.0, 1.5, 3.0, 0.5, 0.5, 1.0, 0.0, 0.5, 3.0, 1.0, 3.0],
      "Product Manager":              [2.5, 3.0, 2.0, 3.0, 1.0, 1.0, 1.5, 0.0, 1.0, 3.0, 3.0, 3.0],
      "Senior Product Manager":       [3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 3.0, 0.5, 1.5, 3.0, 3.0, 3.0],
      "Principal Product Manager":    [3.0, 3.0, 3.0, 3.0, 2.5, 1.5, 2.0, 0.5, 1.0, 2.5, 2.5, 2.0],
      "Senior Principal Product Manager": [3.0, 3.0, 3.0, 3.0, 2.5, 2.5, 2.0, 0.5, 1.0, 1.5, 2.0, 0.5],
      "Associate Group Product Manager": [3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 3.0, 1.0, 1.5, 3.0, 3.0, 3.0],
      "Group Product Manager":        [3.0, 3.0, 3.0, 3.0, 2.0, 1.5, 3.0, 2.0, 2.0, 2.5, 2.5, 2.0],
      "Product Director":             [3.0, 2.5, 2.0, 3.0, 2.5, 2.5, 3.0, 2.5, 2.5, 1.5, 2.0, 0.5],
      "VP Product":                   [3.0, 2.0, 1.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 0.5, 1.0, 0.5],
      "SVP Product":                  [3.0, 2.0, 0.5, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 0.5, 0.5, 0.5]
    };
    const LOCAL_STORAGE_KEY = 'pmSkillsAssessmentScores';
    // --- End Data Definitions ---

    // --- Helper Functions (transformScores, debounce) ---
    function transformScores(scores12) { /* ... Function unchanged ... */
        if (!scores12 || scores12.length !== 12) { console.error("Invalid scores array provided for transformation:", scores12); return Array(16).fill(null); }
        scores12.forEach((s, i) => { if (typeof s !== 'number' || s < 0 || s > 3) { /* console.warn(`Score at index ${i} (${s}) is out of range.`); */ } });
        return [ null, scores12[0], scores12[1], scores12[2], null, scores12[3], scores12[4], scores12[5], null, scores12[6], scores12[7], scores12[8], null, scores12[9], scores12[10], scores12[11] ];
    }
    function debounce(func, wait) { /* ... Function unchanged ... */
        let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); };
    }
    // --- End Helper Functions ---

    // --- Transform role expectations ---
    const roleExpectations = {};
    for (const roleName in coreRoleExpectations) {
        roleExpectations[roleName] = transformScores(coreRoleExpectations[roleName]);
    }

    // --- DOM Element Selection ---
    const inputsContainer = document.querySelector('.assessment-inputs');
    const roleSelect = document.getElementById('roleSelect');
    const canvas = document.getElementById('skillsChart');
    const copyFixedLinkBtn = document.getElementById('copyFixedLinkBtn'); // NEW: Fixed button selector
    // REMOVED: generateLinkBtn, shareLinkInput, copyLinkBtn selectors
    let skillsChart = null;
    // --- End DOM Element Selection ---

    // --- UI Setup Functions (populateRoleDropdown, createInputFields, updateRoleExpectationsDisplay) ---
    function populateRoleDropdown() { /* ... Function unchanged ... */
        const roleNames = Object.keys(roleExpectations); roleSelect.innerHTML = ''; roleNames.forEach(roleName => { const option = document.createElement('option'); option.value = roleName; option.textContent = roleName; roleSelect.appendChild(option); }); if (roleNames.includes("Product Manager")) { roleSelect.value = "Product Manager"; } else if (roleNames.length > 0) { roleSelect.value = roleNames[0]; }
    }
    function createInputFields() { /* ... Function unchanged ... */
        inputsContainer.innerHTML = ''; const header = document.createElement('div'); header.classList.add('input-header'); header.innerHTML = `<div class="category-title">Category</div><div>Own Assessment</div><div>Role Expectation</div>`; inputsContainer.appendChild(header); skillCategories.forEach((skillName, index) => { if (skillName !== "") { const row = document.createElement('div'); row.classList.add('input-row'); const label = document.createElement('label'); label.setAttribute('for', `own-score-${index}`); const skillNumber = skillCategories.slice(0, index + 1).filter(s => s !== "").length; label.textContent = `${skillNumber}. ${skillName} `; const description = skillDescriptions[skillName]; if (description) { const tooltipIcon = document.createElement('span'); tooltipIcon.classList.add('tooltip-icon'); tooltipIcon.textContent = '?'; tooltipIcon.setAttribute('data-tooltip', description); label.appendChild(tooltipIcon); } const ownInput = document.createElement('input'); ownInput.type = 'number'; ownInput.id = `own-score-${index}`; ownInput.min = 0; ownInput.max = 3; ownInput.step = "0.5"; ownInput.value = ''; ownInput.addEventListener('change', generateChart); const roleValueSpan = document.createElement('span'); roleValueSpan.classList.add('role-value'); roleValueSpan.id = `role-value-${index}`; roleValueSpan.textContent = '-'; row.appendChild(label); row.appendChild(ownInput); row.appendChild(roleValueSpan); inputsContainer.appendChild(row); } });
    }
    function updateRoleExpectationsDisplay(selectedRole) { /* ... Function unchanged ... */
        const expectations = roleExpectations[selectedRole]; if (!expectations) return; skillCategories.forEach((skillName, index) => { if (skillName !== "") { const span = document.getElementById(`role-value-${index}`); if (span) { span.textContent = (expectations[index] !== null && expectations[index] !== undefined) ? expectations[index].toFixed(1) : '-'; } } });
    }
    // --- End UI Setup Functions ---

    // --- State Management (Save/Load LocalStorage, Load URL Params) ---
    function saveScores(scoresToSave) { /* ... Function unchanged ... */
        try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scoresToSave)); /* console.log("Scores saved."); */ } catch (e) { console.error("Error saving scores:", e); }
    }
    function loadScoresFromLocalStorage() { /* ... Function unchanged ... */
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                const loadedScores = JSON.parse(savedData);
                // console.log("Scores loaded from localStorage:", loadedScores);
                skillCategories.forEach((skillName, index) => {
                     if (skillName !== "") {
                         const inputElement = document.getElementById(`own-score-${index}`);
                         if (inputElement && loadedScores[index] !== undefined) {
                             inputElement.value = loadedScores[index] || '';
                         } else if (inputElement) {
                             inputElement.value = ''; // Clear if not in saved data
                         }
                     }
                });
                return true; // Indicate scores were loaded
            }
        } catch (e) {
            console.error("Error loading scores from localStorage:", e);
        }
        return false; // Indicate scores were not loaded
    }
    function loadStateFromUrlParams() { /* ... Function unchanged ... */
        const params = new URLSearchParams(window.location.search);
        const roleFromUrl = params.get('role');
        let loadedFromUrl = false;

        if (roleFromUrl && roleExpectations[roleFromUrl]) {
            roleSelect.value = roleFromUrl;
            loadedFromUrl = true;
        } else if (roleFromUrl) {
            console.warn(`Role '${roleFromUrl}' from URL not found. Using default.`);
        }

        let scoresLoadedFromUrl = false;
        skillCategories.forEach((skillName, index) => {
            if (skillName !== "") {
                const scoreKey = `s${index}`;
                if (params.has(scoreKey)) {
                    const scoreValue = params.get(scoreKey);
                    const inputElement = document.getElementById(`own-score-${index}`);
                    if (inputElement) {
                        inputElement.value = scoreValue;
                        scoresLoadedFromUrl = true;
                    }
                }
            }
        });

         if (scoresLoadedFromUrl) {
             loadedFromUrl = true;
         }

        if (loadedFromUrl && window.history.replaceState) {
             window.history.replaceState(null, '', window.location.pathname);
        }
        return loadedFromUrl;
    }
    // --- End State Management ---


    // --- Chart Generation Function ---
    function generateChart() { /* ... Function unchanged ... */
        const isSmallScreen = window.innerWidth < 480;
        const isMediumScreen = window.innerWidth < 768;
        const pointLabelFontSize = isSmallScreen ? 8 : (isMediumScreen ? 10 : 11);
        const displayLegend = !isSmallScreen;

        const ownScoresForChart = [];
        const scoresToSave = {};
        const labels = skillCategories;
        const selectedRole = roleSelect.value;
        const roleScores = roleExpectations[selectedRole] || Array(skillCategories.length).fill(null);

        skillCategories.forEach((skillName, index) => {
            if (skillName === "") {
                ownScoresForChart.push(null);
            } else {
                const inputElement = document.getElementById(`own-score-${index}`);
                if (inputElement) {
                    const rawValue = inputElement.value;
                    const ownValueFloat = parseFloat(rawValue);
                    const clampedValue = isNaN(ownValueFloat) ? null : Math.max(0, Math.min(3, ownValueFloat));
                    ownScoresForChart.push(clampedValue);
                    scoresToSave[index] = rawValue;
                } else {
                    ownScoresForChart.push(null);
                }
            }
        });

        saveScores(scoresToSave);

        const data = { labels: labels, datasets: [
             { label: 'Own assessment', data: ownScoresForChart, fill: true, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)', pointBackgroundColor: 'rgb(54, 162, 235)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(54, 162, 235)', spanGaps: true },
             { label: `${selectedRole} Expectation`, data: roleScores, fill: true, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderDash: [5, 5], pointBackgroundColor: 'rgb(255, 99, 132)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(255, 99, 132)', spanGaps: true }
         ]};
        const config = {
             type: 'radar', data: data, options: { animation: false, elements: { line: { borderWidth: 2 } }, scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 3, ticks: { stepSize: 0.5, backdropColor: 'rgba(255, 255, 255, 0.75)' }, pointLabels: { callback: function(label, index) { return labels[index] !== "" ? label : null; }, font: { size: pointLabelFontSize }, color: pointLabelColors } } }, plugins: { tooltip: { filter: function(tooltipItem) { return tooltipItem.raw !== null; } }, legend: { position: 'top', display: displayLegend } }, maintainAspectRatio: true, responsive: true }
        };

        if (skillsChart) { skillsChart.destroy(); }
        try {
           skillsChart = new Chart(canvas, config);
        } catch (error) {
            console.error("Error creating chart:", error);
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                 // Simple text fallback
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText('Error rendering chart.', canvas.width / 2, canvas.height / 2);
            }
        }
    }
    // --- End Chart Generation ---


    // --- NEW: Share Link Handler ---
    function handleCopyLink() {
        const baseUrl = window.location.origin + window.location.pathname;
        const selectedRole = roleSelect.value;
        const params = new URLSearchParams();

        params.set('role', selectedRole);

        // Get current scores directly from inputs
        skillCategories.forEach((skillName, index) => {
            if (skillName !== "") {
                const inputElement = document.getElementById(`own-score-${index}`);
                if (inputElement && inputElement.value !== '') { // Only include non-empty scores
                    params.set(`s${index}`, inputElement.value);
                }
            }
        });

        const shareUrl = `${baseUrl}?${params.toString()}`;
        const originalText = copyFixedLinkBtn.textContent;
        copyFixedLinkBtn.disabled = true; // Disable button during operation

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                // console.log("Link copied to clipboard:", shareUrl);
                copyFixedLinkBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyFixedLinkBtn.textContent = originalText;
                    copyFixedLinkBtn.disabled = false; // Re-enable button
                }, 1800); // Increased duration slightly
            })
            .catch(err => {
                console.error('Failed to copy link using navigator.clipboard: ', err);
                alert('Could not automatically copy the link. Your browser might not support this feature or permissions might be denied.');
                // Restore button state immediately on error
                copyFixedLinkBtn.textContent = originalText;
                copyFixedLinkBtn.disabled = false;
            });
    }
    // --- End Share Link Handler ---


    // --- Event Listeners ---
    roleSelect.addEventListener('change', () => {
        const selectedRole = roleSelect.value;
        if (roleExpectations[selectedRole]) {
            updateRoleExpectationsDisplay(selectedRole);
            generateChart();
        } else {
            console.error("Selected role not found:", selectedRole);
        }
        // No need to clear share link input anymore
    });

    const handleResize = debounce(() => { generateChart(); }, 250);
    window.addEventListener('resize', handleResize);

    // NEW: Listener for the fixed copy button
    copyFixedLinkBtn.addEventListener('click', handleCopyLink);

    // REMOVED: Listeners for generateLinkBtn and copyLinkBtn
    // --- End Event Listeners ---


    // --- Initial Setup on Page Load ---
    populateRoleDropdown();
    createInputFields();

    const loadedFromUrl = loadStateFromUrlParams();

    if (!loadedFromUrl) {
        loadScoresFromLocalStorage();
    }

    const initialRole = roleSelect.value;

    if (roleExpectations[initialRole]) {
        updateRoleExpectationsDisplay(initialRole);
        generateChart();
    } else {
        console.error("Initial role setup failed:", initialRole);
        if (Object.keys(roleExpectations).length > 0) {
            roleSelect.value = Object.keys(roleExpectations)[0];
            updateRoleExpectationsDisplay(roleSelect.value);
            generateChart();
        }
    }
    // --- End Initial Setup ---

}); // End DOMContentLoaded