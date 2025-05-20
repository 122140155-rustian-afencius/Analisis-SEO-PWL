/**
 * Performance Metrics Tracking Script
 * 
 * This script measures and displays the following performance metrics:
 * 1. Page Load Time
 * 2. First Contentful Paint (FCP)
 * 3. Largest Contentful Paint (LCP)
 * 4. Cumulative Layout Shift (CLS)
 * 5. First Input Delay (FID) / Interaction to Next Paint (INP)
 */

// Initialize metrics object
const performanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    interactionToNextPaint: 0,
    resourceCount: 0,
    resourceSize: 0,
    domNodes: 0
};

// Function to format time in milliseconds
function formatTime(timeInMs) {
    if (timeInMs < 1000) {
        return `${timeInMs.toFixed(2)}ms`;
    } else {
        return `${(timeInMs / 1000).toFixed(2)}s`;
    }
}

// Function to format size in bytes
function formatSize(bytes) {
    if (bytes < 1024) {
        return `${bytes}B`;
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)}KB`;
    } else {
        return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    }
}

// Function to update the metrics display
function updateMetricsDisplay() {
    const metricsContainer = document.getElementById('metrics-container');
    if (!metricsContainer) return;
    
    metricsContainer.innerHTML = `
        <div class="metric">
            <span class="metric-name">Page Load Time:</span>
            <span class="metric-value">${formatTime(performanceMetrics.pageLoadTime)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">First Contentful Paint:</span>
            <span class="metric-value">${formatTime(performanceMetrics.firstContentfulPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">Largest Contentful Paint:</span>
            <span class="metric-value">${formatTime(performanceMetrics.largestContentfulPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">Cumulative Layout Shift:</span>
            <span class="metric-value">${performanceMetrics.cumulativeLayoutShift.toFixed(3)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">Interaction to Next Paint:</span>
            <span class="metric-value">${formatTime(performanceMetrics.interactionToNextPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">Resource Count:</span>
            <span class="metric-value">${performanceMetrics.resourceCount}</span>
        </div>
        <div class="metric">
            <span class="metric-name">Resource Size:</span>
            <span class="metric-value">${formatSize(performanceMetrics.resourceSize)}</span>
        </div>
        <div class="metric">
            <span class="metric-name">DOM Nodes:</span>
            <span class="metric-value">${performanceMetrics.domNodes}</span>
        </div>
    `;
}

// Measure Page Load Time
window.addEventListener('load', () => {
    // Calculate basic page load time
    const loadTime = performance.now();
    performanceMetrics.pageLoadTime = loadTime;
    
    // Count DOM nodes
    performanceMetrics.domNodes = document.querySelectorAll('*').length;
    
    // Count resources and their sizes
    const resources = performance.getEntriesByType('resource');
    performanceMetrics.resourceCount = resources.length;
    performanceMetrics.resourceSize = resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
    
    // Update the display
    updateMetricsDisplay();
    
    // Log metrics to console for debugging
    console.log('Performance Metrics:', performanceMetrics);
});

// Measure First Contentful Paint (FCP)
const fcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const fcpEntry = entries[entries.length - 1];
    performanceMetrics.firstContentfulPaint = fcpEntry.startTime;
    updateMetricsDisplay();
});

fcpObserver.observe({ type: 'paint', buffered: true });

// Measure Largest Contentful Paint (LCP)
const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lcpEntry = entries[entries.length - 1];
    performanceMetrics.largestContentfulPaint = lcpEntry.startTime;
    updateMetricsDisplay();
});

lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

// Measure Cumulative Layout Shift (CLS)
let cumulativeLayoutShift = 0;
const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
            performanceMetrics.cumulativeLayoutShift = cumulativeLayoutShift;
            updateMetricsDisplay();
        }
    }
});

clsObserver.observe({ type: 'layout-shift', buffered: true });

// Measure First Input Delay (FID) or Interaction to Next Paint (INP)
const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
        if (entry.processingStart && entry.startTime) {
            const delay = entry.processingStart - entry.startTime;
            performanceMetrics.firstInputDelay = delay;
            updateMetricsDisplay();
        }
    }
});

fidObserver.observe({ type: 'first-input', buffered: true });

// For INP (newer metric replacing FID)
if (PerformanceObserver.supportedEntryTypes.includes('event')) {
    const inpObserver = new PerformanceObserver((entryList) => {
        const events = entryList.getEntries();
        if (events.length > 0) {
            // Calculate INP as the max interaction delay
            const delays = events.map(event => {
                if (event.processingStart && event.startTime) {
                    return event.processingStart - event.startTime;
                }
                return 0;
            });
            
            performanceMetrics.interactionToNextPaint = Math.max(...delays);
            updateMetricsDisplay();
        }
    });
    
    inpObserver.observe({ type: 'event', durationThreshold: 16, buffered: true });
}

// Send metrics to analytics (simulated)
function sendMetricsToAnalytics() {
    // In a real implementation, this would send data to an analytics service
    console.log('Sending metrics to analytics:', performanceMetrics);
    
    // Simulated analytics endpoint
    if (navigator.sendBeacon) {
        // Using Beacon API for non-blocking analytics sending
        const analyticsData = new Blob([JSON.stringify(performanceMetrics)], { type: 'application/json' });
        // navigator.sendBeacon('/analytics', analyticsData);
        console.log('Metrics sent via Beacon API');
    } else {
        // Fallback to fetch API
        console.log('Beacon API not supported, using fetch fallback');
    }
}

// Send metrics when user leaves the page
window.addEventListener('beforeunload', sendMetricsToAnalytics);

// Also send metrics after page has been fully loaded and metrics collected
window.addEventListener('load', () => {
    // Wait for all metrics to be collected (5 seconds after load)
    setTimeout(sendMetricsToAnalytics, 5000);
});
