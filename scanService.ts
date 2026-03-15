// Updated logic for vulnerability severity counting
function countVulnerabilities(severities) {
    let counts = { low: 0, medium: 0, high: 0, critical: 0 };
    severities.forEach(severity => {
        if (counts[severity] !== undefined) {
            counts[severity]++;
        }
    });
    return counts;
}

// Diagnostic function to verify scoring
function verifyScoring(counts) {
    const total = counts.low + counts.medium + counts.high + counts.critical;
    if (total === 0) return 'No vulnerabilities found.';

    return {
        low: (counts.low / total * 100).toFixed(2) + '%',
        medium: (counts.medium / total * 100).toFixed(2) + '%',
        high: (counts.high / total * 100).toFixed(2) + '%',
        critical: (counts.critical / total * 100).toFixed(2) + '%'
    };
}