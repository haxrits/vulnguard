'use strict';

const buildResults = require('./resultBuilder');

const vulnerabilitiesList = [];

const runScan = () => {
    // Simulating scanning process
    // Example of scanned results for demonstration purposes
    vulnerabilitiesList.push({ severity: 'Critical' });
    vulnerabilitiesList.push({ severity: 'High' });
    vulnerabilitiesList.push({ severity: 'Medium' });
    vulnerabilitiesList.push({ severity: 'Low' });
    vulnerabilitiesList.push({ severity: 'Safe' });

    return buildResults(vulnerabilitiesList);
};

const countSeverities = (results) => {
    const counts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
        Safe: 0,
    };

    results.forEach(vuln => {
        if (counts.hasOwnProperty(vuln.severity)) {
            counts[vuln.severity]++;
        }
    });

    return counts;
};

const outputResults = () => {
    const results = runScan();
    const counts = countSeverities(results);
    console.log('Severity Counts:', counts);
};

module.exports = {
    runScan,
    outputResults,
};