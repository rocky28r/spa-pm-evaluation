// ADD CHART.JS PLUGIN REGISTRATION HERE IF YOU IMPLEMENT THE BACKGROUND PLUGIN
// e.g., Chart.register(radarBackgroundPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // Define skill categories INCLUDING SPACERS ("") where gaps are needed
    const skillCategories = [
        "", // 0 - Spacer 1 (Before Fluency / After QA)
        "Fluency with Data", "Voice of the Customer", "User Experience Design", // 1, 2, 3
        "", // 4 - Spacer 2 (After UX / Before Business)
        "Business Outcome Ownership", "Product Vision & Roadmapping", "Strategic Impact", // 5, 6, 7
        "", // 8 - Spacer 3 (After Strategic / Before Stakeholder)
        "Stakeholder Management", "Team Leadership", "Managing Up", // 9, 10, 11
        "", // 12 - Spacer 4 (After Managing Up / Before Feature Spec)
        "Feature Specification", "Product Delivery", "Quality Assurance" // 13, 14, 15
    ];

     // --- Define colors for Point Labels ---
    const colorOrange = '#F5821F';
    const colorYellow = '#EAAA00';
    const colorCyan = '#20BDBE';
    const colorBlue = '#0077C8';
    // const defaultColor = '#666'; // Use if needed

    const pointLabelColors = [
        null, colorYellow, colorYellow, colorYellow, null, colorCyan, colorCyan, colorCyan,
        null, colorBlue, colorBlue, colorBlue, null, colorOrange, colorOrange, colorOrange
    ];
    // --- End of color definitions ---


    // --- UPDATED: Define Core Role Expectations based on the screenshot (0-3 scale) ---
    // Order: [Fluency, VoC, UX, Business, Vision, Strategic, Stakeholder, Leadership, ManagingUp, FeatureSpec, Delivery, QA]
    const coreRoleExpectations = { /* ... Role data unchanged ... */
      "Jr Product Manager":     [1.5, 2.0, 1.5, 3.0, 0.5, 0.5, 1.0, 0.0, 0.5, 3.0, 1.0, 3.0],
      "Product Manager":        [2.5, 3.0, 2.0, 3.0, 1.0, 1.0, 1.5, 0.0, 1.0, 3.0, 3.0, 3.0],
      "Senior Product Manager": [3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 3.0, 0.5, 1.5, 3.0, 3.0, 3.0],
      "Principal Product Manager": [3.0, 3.0, 3.0, 3.0, 2.5, 1.5, 2.0, 0.5, 1.0, 2.5, 2.5, 2.0],
      "Senior Principal Product Manager": [3.0, 3.0, 3.0, 3.0, 2.5, 2.5, 2.0, 0.5, 1.0, 1.5, 2.0, 0.5],
      "Associate Group Product Manager": [3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 3.0, 1.0, 1.5, 3.0, 3.0, 3.0],
      "Group Product Manager":  [3.0, 3.0, 3.0, 3.0, 2.0, 1.5, 3.0, 2.0, 2.0, 2.5, 2.5, 2.0],
      "Product Director":       [3.0, 2.5, 2.0, 3.0, 2.5, 2.5, 3.0, 2.5, 2.5, 1.5, 2.0, 0.5],
      "VP Product":             [3.0, 2.0, 1.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 0.5, 1.0, 0.5],
      "SVP Product":            [3.0, 2.0, 0.5, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 0.5, 0.5, 0.5]
    };
    // --- End of updated role expectations ---

    // --- LocalStorage Key ---
    const LOCAL_STORAGE_KEY = 'pmSkillsAssessmentScores';

    // --- Helper function to transform 12 scores to 16 with null spacers ---
    function transformScores(scores12) { /* ... Function unchanged ... */
        if (!scores12 || scores12.length !== 12) { console.error("Invalid scores array provided for transformation:", scores12); return Array(16).fill(null); }
        scores12.forEach((s, i) => { if (typeof s !== 'number' || s < 0 || s > 3) { console.warn(`Score at index ${i} (${s}) is out of the expected 0-3 range or not a number.`); } });
        return [ null, scores12[0], scores12[1], scores12[2], null, scores12[3], scores12[4], scores12[5], null, scores12[6], scores12[7], scores12[8], null, scores12[9], scores12[10], scores12[11] ];
    }

    // --- Transform the core expectations to include nulls for spacers ---
    const roleExpectations = {};
    for (const roleName in coreRoleExpectations) {
        roleExpectations[roleName] = transformScores(coreRoleExpectations[roleName]);
    }

    const inputsContainer = document.querySelector('.assessment-inputs');
    const roleSelect = document.getElementById('roleSelect');
    const canvas = document.getElementById('skillsChart');
    let skillsChart = null;

    // --- Debounce utility function ---
    function debounce(func, wait) { /* ... Function unchanged ... */
        let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); };
    }

    // --- Dynamically Populate Role Selector Dropdown ---
    function populateRoleDropdown() { /* ... Function unchanged ... */
        const roleNames = Object.keys(roleExpectations); roleSelect.innerHTML = ''; roleNames.forEach(roleName => { const option = document.createElement('option'); option.value = roleName; option.textContent = roleName; roleSelect.appendChild(option); }); if (roleNames.includes("Product Manager")) { roleSelect.value = "Product Manager"; } else if (roleNames.length > 0) { roleSelect.value = roleNames[0]; }
    }

    // --- Create Input Fields and Role Value Placeholders ---
    function createInputFields() { /* ... Function unchanged ... */
         inputsContainer.innerHTML = ''; const header = document.createElement('div'); header.classList.add('input-header'); header.innerHTML = `<div class="category-title">Category</div><div>Own Assessment</div><div>Role Expectation</div>`; inputsContainer.appendChild(header); skillCategories.forEach((skillName, index) => { if (skillName !== "") { const row = document.createElement('div'); row.classList.add('input-row'); const label = document.createElement('label'); const skillNumber = skillCategories.slice(0, index + 1).filter(s => s !== "").length; label.textContent = `${skillNumber}. ${skillName}`; label.setAttribute('for', `own-score-${index}`); const ownInput = document.createElement('input'); ownInput.type = 'number'; ownInput.id = `own-score-${index}`; ownInput.min = 0; ownInput.max = 3; ownInput.step = "0.5"; ownInput.value = ''; ownInput.addEventListener('change', generateChart); const roleValueSpan = document.createElement('span'); roleValueSpan.classList.add('role-value'); roleValueSpan.id = `role-value-${index}`; roleValueSpan.textContent = '-'; row.appendChild(label); row.appendChild(ownInput); row.appendChild(roleValueSpan); inputsContainer.appendChild(row); } });
    }

    // --- Function to Update Role Expectation Display ---
    function updateRoleExpectationsDisplay(selectedRole) { /* ... Function unchanged ... */
        const expectations = roleExpectations[selectedRole]; if (!expectations) return; skillCategories.forEach((skillName, index) => { if (skillName !== "") { const span = document.getElementById(`role-value-${index}`); if (span) { span.textContent = (expectations[index] !== null && expectations[index] !== undefined) ? expectations[index] : '-'; } } });
    }

    // --- NEW: Function to Save Scores to localStorage ---
    function saveScores(scoresToSave) { /* ... Function unchanged ... */
        try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scoresToSave)); /* console.log("Scores saved."); */ } catch (e) { console.error("Error saving scores:", e); }
    }

    // --- NEW: Function to Load Scores from localStorage ---
    function loadScores() { /* ... Function unchanged ... */
        try { const savedData = localStorage.getItem(LOCAL_STORAGE_KEY); if (savedData) { const loadedScores = JSON.parse(savedData); /* console.log("Scores loaded:", loadedScores); */ for (const index in loadedScores) { const inputElement = document.getElementById(`own-score-${index}`); if (inputElement) { inputElement.value = loadedScores[index] || ''; } } return true; } } catch (e) { console.error("Error loading scores:", e); } return false;
    }


    // --- Chart Generation Function (MODIFIED for point label colors) ---
    function generateChart() {
        const isSmallScreen = window.innerWidth < 480;
        const isMediumScreen = window.innerWidth < 768;
        const pointLabelFontSize = isSmallScreen ? 8 : (isMediumScreen ? 10 : 11);
        const displayLegend = !isSmallScreen;

        const ownScoresForChart = [];
        const scoresToSave = {};
        const labels = skillCategories; // Use the global one
        const selectedRole = roleSelect.value;
        const roleScores = roleExpectations[selectedRole] || Array(skillCategories.length).fill(null);

        // --- Iterate and Collect/Process Scores ---
        skillCategories.forEach((skillName, index) => { /* ... Logic unchanged ... */
            if (skillName === "") { ownScoresForChart.push(null); } else { const inputElement = document.getElementById(`own-score-${index}`); if (inputElement) { const rawValue = inputElement.value; const ownValueFloat = parseFloat(rawValue); const clampedValue = isNaN(ownValueFloat) ? null : Math.max(0, Math.min(3, ownValueFloat)); ownScoresForChart.push(clampedValue); scoresToSave[index] = rawValue; } else { ownScoresForChart.push(null); } }
        });

        // --- Save the collected raw scores ---
        saveScores(scoresToSave);

        // --- Chart.js Data and Config ---
        const data = { labels: labels, datasets: [ /* Datasets unchanged */
             { label: 'Own assessment', data: ownScoresForChart, fill: true, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)', pointBackgroundColor: 'rgb(54, 162, 235)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(54, 162, 235)', spanGaps: true },
             { label: `${selectedRole} Expectation`, data: roleScores, fill: true, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderDash: [5, 5], pointBackgroundColor: 'rgb(255, 99, 132)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(255, 99, 132)', spanGaps: true }
         ]};

        const config = {
            type: 'radar',
            data: data,
            options: {
                animation: false,
                elements: { line: { borderWidth: 2 } },
                scales: {
                    r: { // The radial axis (values)
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 3, // Max scale value is 3
                        ticks: {
                            stepSize: 0.5 // Ticks at 0, 0.5, 1, 1.5, 2, 2.5, 3
                        },
                        pointLabels: {
                            callback: function(label, index) {
                                return labels[index] !== "" ? label : null; // Use global labels
                            },
                            font: { size: pointLabelFontSize },
                            // *** USE THE DEFINED COLOR ARRAY ***
                            color: pointLabelColors
                        }
                    }
                },
                plugins: {
                    tooltip: { filter: function(tooltipItem) { return tooltipItem.raw !== null; } },
                    legend: { position: 'top', display: displayLegend }
                },
                maintainAspectRatio: true,
                responsive: true
            }
        };

        // --- Destroy old chart and create new one ---
        if (skillsChart) { skillsChart.destroy(); }
        skillsChart = new Chart(canvas, config);
    }

    // --- Event Listener for Role Selection Change ---
    roleSelect.addEventListener('change', () => { /* ... Listener unchanged ... */
         const selectedRole = roleSelect.value; if (roleExpectations[selectedRole]) { updateRoleExpectationsDisplay(selectedRole); generateChart(); } else { console.error("Selected role not found:", selectedRole); }
    });

    // --- Debounced Resize Handler ---
    const handleResize = debounce(() => { generateChart(); }, 250);
    window.addEventListener('resize', handleResize);

    // --- Initial Setup on Page Load ---
    populateRoleDropdown();
    createInputFields();
    const scoresWereLoaded = loadScores();
    /* console.log("Scores loaded:", scoresWereLoaded); */
    const initialRole = roleSelect.value;
    if (roleExpectations[initialRole]) {
        updateRoleExpectationsDisplay(initialRole);
        generateChart();
    } else {
        console.error("Initial role not found:", initialRole);
    }

});