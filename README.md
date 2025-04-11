# Product Manager Skills Assessment

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-brightgreen)](https://rocky28r.github.io/spa-pm-evaluation/)

A Single Page Application designed for Product Managers and their managers to assess skills against standard role benchmarks. It provides a visual comparison using a radar chart and allows for easy sharing of the assessment.

**Live Application:** [https://rocky28r.github.io/spa-pm-evaluation/](https://rocky28r.github.io/spa-pm-evaluation/)

## Overview

This tool helps Product Managers understand their strengths and areas for development relative to common expectations for various PM roles (from Junior PM to SVP Product). Users can input their self-assessment scores for key PM competencies, compare them against a selected role benchmark, and visualize the results instantly.

## Features

* **Role Benchmarking:** Select from a predefined list of Product Manager roles (e.g., Product Manager, Senior PM, Group PM, Director, VP).
* **Self-Assessment Input:** Enter your proficiency level (0-3 in 0.5 increments) for 12 core PM skills grouped into categories (Customer Insight, Product Strategy, Influencing People, Product Execution).
* **Skill Descriptions:** Hover over the info icon `?` next to each skill for a detailed description.
* **Radar Chart Visualization:** Instantly see your self-assessment compared to the selected role benchmark on an interactive radar chart.
* **Responsive Design:** Usable across different screen sizes (desktop, tablet, mobile).
* **Data Persistence:** Your scores are automatically saved in your browser's Local Storage, so they persist between visits.
* **Shareable Links:** Generate and copy a unique URL containing your assessment scores and selected role with a single click using the "Copy Share Link" button.
* **Load from Link:** Opening a shared link automatically loads the specific role and scores into the tool.

## Technology Stack

* **HTML5:** Structure and content.
* **CSS3:** Styling and layout, including responsive design via media queries.
* **JavaScript (ES6+):** Application logic, DOM manipulation, state management (Local Storage, URL Params).
* **Chart.js:** Library used for rendering the radar chart visualization.

## How to Use

1.  **Visit the Live Application:** [https://rocky28r.github.io/spa-pm-evaluation/](https://rocky28r.github.io/spa-pm-evaluation/)
2.  **Select Role Benchmark:** Choose the PM role you want to compare against from the dropdown menu. The "Role Expectation" values and the corresponding line on the chart will update.
3.  **Enter Own Assessment:** Input your scores (0, 0.5, 1, 1.5, 2, 2.5, or 3) for each skill in the "Own Assessment" column. The chart will update automatically as you enter scores.
4.  **View Descriptions:** Hover over the `(i)` icon next to any skill name to read its full description in a tooltip.
5.  **Analyze Chart:** Compare your "Own assessment" shape (blue) against the "Role Expectation" shape (red dashed line).
6.  **Share Your Assessment:** Click the "Copy Share Link" button fixed in the bottom-right corner. The unique URL for your current assessment (role + scores) will be copied to your clipboard. Paste this link to share it with others.
7.  **Load an Assessment:** Simply open a shared link in your browser to view the assessment it contains.

## Persistence Explained

* **Local Storage:** As you enter scores, they are automatically saved to your browser's local storage. When you revisit the page from the same browser, your last entered scores will be loaded automatically.
* **URL Parameters:** When you click "Copy Share Link", the selected role and all entered scores are encoded into the URL's query parameters (e.g., `?role=Senior%20Product%20Manager&s1=3&s2=2.5...`). When the page loads, it checks for these parameters. If present, it loads the state from the URL instead of Local Storage.
