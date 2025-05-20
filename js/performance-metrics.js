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
  domNodes: 0,
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
  const metricsContainer = document.getElementById("metrics-container");
  if (!metricsContainer) return;

  // Function to determine status color based on metric value
  function getStatusColor(metric, value) {
    // Define thresholds for each metric
    const thresholds = {
      pageLoadTime: { good: 2000, medium: 3000 }, // ms
      firstContentfulPaint: { good: 1800, medium: 3000 }, // ms
      largestContentfulPaint: { good: 2500, medium: 4000 }, // ms
      cumulativeLayoutShift: { good: 0.1, medium: 0.25 }, // unitless
      interactionToNextPaint: { good: 200, medium: 500 }, // ms
    };

    // Default to green for metrics without specific thresholds
    if (!thresholds[metric]) return "var(--success-color)";

    // Convert time strings back to numbers for comparison
    let numValue = value;
    if (typeof value === "string") {
      if (value.includes("ms")) {
        numValue = parseFloat(value);
      } else if (value.includes("s")) {
        numValue = parseFloat(value) * 1000;
      }
    }

    // Return appropriate color based on thresholds
    if (numValue <= thresholds[metric].good) {
      return "var(--success-color)";
    } else if (numValue <= thresholds[metric].medium) {
      return "var(--warning-color)";
    } else {
      return "var(--error-color)";
    }
  }

  metricsContainer.innerHTML = `
        <div class="metric">
            <span class="metric-name" data-metric="pageLoadTime">Page Load Time</span>
            <span class="metric-value" style="color: ${getStatusColor(
              "pageLoadTime",
              performanceMetrics.pageLoadTime
            )}">${formatTime(performanceMetrics.pageLoadTime)}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="firstContentfulPaint">First Contentful Paint</span>
            <span class="metric-value" style="color: ${getStatusColor(
              "firstContentfulPaint",
              performanceMetrics.firstContentfulPaint
            )}">${formatTime(performanceMetrics.firstContentfulPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="largestContentfulPaint">Largest Contentful Paint</span>
            <span class="metric-value" style="color: ${getStatusColor(
              "largestContentfulPaint",
              performanceMetrics.largestContentfulPaint
            )}">${formatTime(performanceMetrics.largestContentfulPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="cumulativeLayoutShift">Cumulative Layout Shift</span>
            <span class="metric-value" style="color: ${getStatusColor(
              "cumulativeLayoutShift",
              performanceMetrics.cumulativeLayoutShift
            )}">${performanceMetrics.cumulativeLayoutShift.toFixed(3)}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="interactionToNextPaint">Interaction to Next Paint</span>
            <span class="metric-value" style="color: ${getStatusColor(
              "interactionToNextPaint",
              performanceMetrics.interactionToNextPaint
            )}">${formatTime(performanceMetrics.interactionToNextPaint)}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="resourceCount">Resource Count</span>
            <span class="metric-value">${
              performanceMetrics.resourceCount
            }</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="resourceSize">Resource Size</span>
            <span class="metric-value">${formatSize(
              performanceMetrics.resourceSize
            )}</span>
        </div>
        <div class="metric">
            <span class="metric-name" data-metric="domNodes">DOM Nodes</span>
            <span class="metric-value">${performanceMetrics.domNodes}</span>
        </div>
    `;
}

// Measure Page Load Time
window.addEventListener("load", () => {
  // Calculate basic page load time
  const loadTime = performance.now();
  performanceMetrics.pageLoadTime = loadTime;

  // Count DOM nodes
  performanceMetrics.domNodes = document.querySelectorAll("*").length;

  // Count resources and their sizes
  const resources = performance.getEntriesByType("resource");
  performanceMetrics.resourceCount = resources.length;
  performanceMetrics.resourceSize = resources.reduce(
    (total, resource) => total + (resource.transferSize || 0),
    0
  );

  // Update the display
  updateMetricsDisplay();

  // Log metrics to console for debugging
  console.log("Performance Metrics:", performanceMetrics);
});

// Measure First Contentful Paint (FCP)
const fcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const fcpEntry = entries[entries.length - 1];
  performanceMetrics.firstContentfulPaint = fcpEntry.startTime;
  updateMetricsDisplay();
});

fcpObserver.observe({ type: "paint", buffered: true });

// Measure Largest Contentful Paint (LCP)
const lcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lcpEntry = entries[entries.length - 1];
  performanceMetrics.largestContentfulPaint = lcpEntry.startTime;
  updateMetricsDisplay();
});

lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

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

clsObserver.observe({ type: "layout-shift", buffered: true });

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

fidObserver.observe({ type: "first-input", buffered: true });

// For INP (newer metric replacing FID)
if (PerformanceObserver.supportedEntryTypes.includes("event")) {
  const inpObserver = new PerformanceObserver((entryList) => {
    const events = entryList.getEntries();
    if (events.length > 0) {
      // Calculate INP as the max interaction delay
      const delays = events.map((event) => {
        if (event.processingStart && event.startTime) {
          return event.processingStart - event.startTime;
        }
        return 0;
      });

      performanceMetrics.interactionToNextPaint = Math.max(...delays);
      updateMetricsDisplay();
    }
  });

  inpObserver.observe({ type: "event", durationThreshold: 16, buffered: true });
}

// Send metrics to analytics (simulated)
function sendMetricsToAnalytics() {
  // In a real implementation, this would send data to an analytics service
  console.log("Sending metrics to analytics:", performanceMetrics);

  // Simulated analytics endpoint
  if (navigator.sendBeacon) {
    // Using Beacon API for non-blocking analytics sending
    const analyticsData = new Blob([JSON.stringify(performanceMetrics)], {
      type: "application/json",
    });
    // navigator.sendBeacon('/analytics', analyticsData);
    console.log("Metrics sent via Beacon API");
  } else {
    // Fallback to fetch API
    console.log("Beacon API not supported, using fetch fallback");
  }
}

// Send metrics when user leaves the page
window.addEventListener("beforeunload", sendMetricsToAnalytics);

// Also send metrics after page has been fully loaded and metrics collected
window.addEventListener("load", () => {
  // Wait for all metrics to be collected (5 seconds after load)
  setTimeout(sendMetricsToAnalytics, 5000);
});

/**
 * Performance Metrics Dashboard
 * Tracks and displays various website performance metrics
 */

document.addEventListener("DOMContentLoaded", () => {
  // Get dashboard elements
  const dashboard = document.getElementById("performance-dashboard");
  const metricsContainer = document.getElementById("metrics-container");
  const toggleBtn = document.getElementById("toggle-dashboard");
  const dashboardTitle = dashboard.querySelector("h3");

  // Initialize dashboard state
  let isDashboardMinimized = false;

  // Toggle dashboard visibility
  function toggleDashboard() {
    isDashboardMinimized = !isDashboardMinimized;
    dashboard.classList.toggle("minimized", isDashboardMinimized);
    toggleBtn.textContent = isDashboardMinimized
      ? "Show Metrics"
      : "Hide Metrics";
  }

  // Add event listeners
  toggleBtn.addEventListener("click", toggleDashboard);
  dashboardTitle.addEventListener("click", toggleDashboard);

  // Start with minimized dashboard
  dashboard.classList.add("minimized");
  toggleBtn.textContent = "Show Metrics";

  // Collect and display performance metrics
  function collectMetrics() {
    const metrics = [];

    // Navigation timing metrics
    if (performance && performance.timing) {
      const timing = performance.timing;

      // Calculate page load time
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      metrics.push({
        label: "Page Load Time",
        value: `${(pageLoadTime / 1000).toFixed(2)}s`,
      });

      // Calculate DOM content loaded time
      const domContentLoadedTime =
        timing.domContentLoadedEventEnd - timing.navigationStart;
      metrics.push({
        label: "DOM Content Loaded",
        value: `${(domContentLoadedTime / 1000).toFixed(2)}s`,
      });

      // Calculate server response time
      const serverResponseTime = timing.responseEnd - timing.requestStart;
      metrics.push({
        label: "Server Response Time",
        value: `${(serverResponseTime / 1000).toFixed(2)}s`,
      });
    }

    // Memory usage (if available)
    if (performance && performance.memory) {
      metrics.push({
        label: "JS Heap Size",
        value: `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`,
      });
    }

    // Connection information
    if (navigator.connection) {
      if (navigator.connection.effectiveType) {
        metrics.push({
          label: "Connection Type",
          value: navigator.connection.effectiveType,
        });
      }

      if (navigator.connection.downlink) {
        metrics.push({
          label: "Downlink Speed",
          value: `${navigator.connection.downlink} Mbps`,
        });
      }
    }

    // Display metrics
    displayMetrics(metrics);
  }

  // Display metrics in the dashboard
  function displayMetrics(metrics) {
    metricsContainer.innerHTML = "";

    metrics.forEach((metric) => {
      const metricItem = document.createElement("div");
      metricItem.className = "metric-item";

      const metricLabel = document.createElement("span");
      metricLabel.className = "metric-label";
      metricLabel.textContent = metric.label;

      const metricValue = document.createElement("span");
      metricValue.className = "metric-value";
      metricValue.textContent = metric.value;

      metricItem.appendChild(metricLabel);
      metricItem.appendChild(metricValue);
      metricsContainer.appendChild(metricItem);
    });
  }

  // Initialize metrics
  setTimeout(collectMetrics, 0);

  // Update metrics periodically for long-running sessions
  setInterval(() => {
    // Only update if dashboard is visible
    if (!isDashboardMinimized) {
      collectMetrics();
    }
  }, 30000); // Update every 30 seconds
});
