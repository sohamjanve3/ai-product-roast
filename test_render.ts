import React from 'react';
import { renderToString } from 'react-dom/server';
import { demoRoast } from './src/services/gemini';
import RoastDashboard from './src/components/RoastDashboard';

try {
  console.log("Starting render test of RoastDashboard...");
  const html = renderToString(
    React.createElement(RoastDashboard, {
      roast: demoRoast,
      onReset: () => console.log("onReset called"),
      screenshotUrl: null
    })
  );
  console.log("Render test completed successfully! Length of HTML:", html.length);
} catch (error) {
  console.error("Render test failed with error:", error);
  process.exit(1);
}
