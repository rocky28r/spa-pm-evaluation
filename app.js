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

    // --- Define Core Role Expectations (12 scores per role) ---
    const coreRoleExpectations = {
      "Jr Product Manager":     [3, 3, 3, 2, 2, 1, 3, 1, 2, 5, 5, 3],
      "Product Manager":        [4, 4, 4, 4, 4, 3, 4, 2, 4, 5, 5, 2],
      "Senior Product Manager": [5, 5, 5, 5, 5, 5, 5, 4, 5, 4, 4, 1],
      "Principal Product Manager": [6, 5, 5, 6, 6, 6, 6, 5, 6, 3, 3, 1],
      "Senior Principal Product Manager": [6, 5, 4, 6, 6, 6, 6, 6, 6, 2, 2, 0],
      "Associate Group Product Manager": [5, 4, 4, 5, 5, 5, 5, 5, 5, 3, 3, 1],
      "Group Product Manager":  [5, 4, 4, 6, 6, 6, 6, 6, 6, 2, 2, 0],
      "Product Director":       [5, 4, 3, 6, 6, 6, 6, 6, 6, 1, 1, 0],
      "VP Product":             [5, 5, 3, 6, 6, 6, 6, 6, 6, 0, 0, 0],
      "SVP Product":            [4, 5, 2, 6, 6, 6, 6, 6, 6, 0, 0, 0]
    };

    // --- Helper function to transform 12 scores to 16 with null spacers ---
    function transformScores(scores12) {
        if (!scores12 || scores12.length !== 12) {
            console.error("Invalid scores array provided for transformation:", scores12);
            return Array(16).fill(null);
        }
        return [
            null, scores12[0], scores12[1], scores12[2], null, scores12[3], scores12[4], scores12[5],
            null, scores12[6], scores12[7], scores12[8], null, scores12[9], scores12[10], scores12[11]
        ];
    }

    // --- Transform the core expectations to include nulls for spacers ---
    const roleExpectations = {};
    for (const roleName in coreRoleExpectations) {
        roleExpectations[roleName] = transformScores(coreRoleExpectations[roleName]);
    }

    const inputsContainer = document.querySelector('.assessment-inputs');
    const roleSelect = document.getElementById('roleSelect');
    const canvas = document.getElementById('skillsChart');
    let skillsChart = null; // Keep track of the chart instance

    // --- NEW: Debounce utility function ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Dynamically Populate Role Selector Dropdown ---
    function populateRoleDropdown() {
        const roleNames = Object.keys(roleExpectations);
        roleSelect.innerHTML = '';
        roleNames.forEach(roleName => {
            const option = document.createElement('option');
            option.value = roleName;
            option.textContent = roleName;
            roleSelect.appendChild(option);
        });
        if (roleNames.includes("Product Manager")) {
            roleSelect.value = "Product Manager";
        } else if (roleNames.length > 0) {
            roleSelect.value = roleNames[0];
        }
    }

    // --- Create Input Fields and Role Value Placeholders ---
    function createInputFields() {
        inputsContainer.innerHTML = '';
         const header = document.createElement('div');
         header.classList.add('input-header');
         header.innerHTML = `
             <div class="category-title">Category</div>
             <div>Own Assessment</div>
             <div>Role Expectation</div>`;
         inputsContainer.appendChild(header);

        skillCategories.forEach((skillName, index) => {
            if (skillName !== "") {
                const row = document.createElement('div');
                row.classList.add('input-row');
                const label = document.createElement('label');
                const skillNumber = skillCategories.slice(0, index + 1).filter(s => s !== "").length;
                label.textContent = `${skillNumber}. ${skillName}`;
                label.setAttribute('for', `own-score-${index}`);
                const ownInput = document.createElement('input');
                ownInput.type = 'number';
                ownInput.id = `own-score-${index}`;
                ownInput.min = 0;
                ownInput.max = 6;
                ownInput.value = '';
                ownInput.addEventListener('change', generateChart); // Update on change
                const roleValueSpan = document.createElement('span');
                roleValueSpan.classList.add('role-value');
                roleValueSpan.id = `role-value-${index}`;
                roleValueSpan.textContent = '-';
                row.appendChild(label);
                row.appendChild(ownInput);
                row.appendChild(roleValueSpan);
                inputsContainer.appendChild(row);
            }
        });
    }

    // --- Function to Update Role Expectation Display ---
    function updateRoleExpectationsDisplay(selectedRole) {
        const expectations = roleExpectations[selectedRole];
        if (!expectations) return;
        skillCategories.forEach((skillName, index) => {
            if (skillName !== "") {
                const span = document.getElementById(`role-value-${index}`);
                if (span) {
                    span.textContent = (expectations[index] !== null && expectations[index] !== undefined) ? expectations[index] : '-';
                }
            }
        });
    }

    // --- Chart Generation Function ---
    function generateChart() {
        const ownScores = [];
        const labels = skillCategories;
        const selectedRole = roleSelect.value;
        const roleScores = roleExpectations[selectedRole] || Array(skillCategories.length).fill(null);

        skillCategories.forEach((skillName, index) => {
            if (skillName === "") {
                ownScores.push(null);
            } else {
                const inputElement = document.getElementById(`own-score-${index}`);
                if (inputElement) {
                    const ownValue = parseFloat(inputElement.value);
                    ownScores.push(isNaN(ownValue) ? null : Math.max(0, Math.min(6, ownValue)));
                } else {
                    ownScores.push(null);
                }
            }
        });

        const data = { labels: labels, datasets: [ /* Datasets definition unchanged */
                {
                    label: 'Own assessment', data: ownScores, fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)', pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(54, 162, 235)',
                    spanGaps: true
                },
                {
                    label: `${selectedRole} Expectation`, data: roleScores, fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5], pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)', spanGaps: true
                }
        ]};

        const config = {
            type: 'radar',
            data: data,
            options: {
                animation: false, // Animation disabled
                elements: { line: { borderWidth: 3 } },
                scales: { /* Scales definition unchanged */
                    r: {
                        angleLines: { display: true }, suggestedMin: 0, suggestedMax: 6,
                        ticks: { stepSize: 1 },
                        pointLabels: {
                            callback: function(label, index) { return labels[index] !== "" ? label : null; },
                            font: { size: 11 }
                        }
                    }
                },
                plugins: { /* Plugins definition unchanged */
                    tooltip: { filter: function(tooltipItem) { return tooltipItem.raw !== null; } },
                    legend: { position: 'top' }
                },
                maintainAspectRatio: true, // Keep aspect ratio
                responsive: true // Still useful for initial sizing
            }
        };

        if (skillsChart) { skillsChart.destroy(); }
        skillsChart = new Chart(canvas, config); // Assign instance to skillsChart variable
    }

    // --- Event Listener for Role Selection Change ---
    roleSelect.addEventListener('change', () => {
        const selectedRole = roleSelect.value;
        if (roleExpectations[selectedRole]) {
             updateRoleExpectationsDisplay(selectedRole);
             generateChart();
        } else {
             console.error("Selected role not found in expectations:", selectedRole);
        }
    });

    // --- NEW: Debounced Resize Handler ---
    const handleResize = debounce(() => {
        if (skillsChart) {
            // Explicitly tell the chart instance to resize
            // This ensures it redraws correctly even if responsive: true fails
            skillsChart.resize();
        }
    }, 150); // Wait 150ms after the last resize event before triggering

    // Attach the resize listener to the window
    window.addEventListener('resize', handleResize);


    // --- Initial Setup on Page Load ---
    populateRoleDropdown();
    createInputFields();
    const initialRole = roleSelect.value;
    if (roleExpectations[initialRole]) {
        updateRoleExpectationsDisplay(initialRole);
        generateChart();
    } else {
        console.error("Initial role not found:", initialRole);
    }

});