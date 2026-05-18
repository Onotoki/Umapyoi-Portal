const fs = require('fs');
const d = fs.readFileSync('app_bundle.js', 'utf8');

// Search for `Sa` component in app_bundle.js
// Look for where Sa is defined. It might be: const Sa = ... or function Sa ...
// Or it's defined near SupportCardGrid component. Let's find `Sa` references or a component that renders the card thumbnail.

// Search for image URLs or files with format like `support_card_` in app_bundle.js
const regex = /support_card_[a-zA-Z0-9_\-\/]+/g;
const matches = [...new Set(d.match(regex))];
console.log('Support card image strings in app_bundle.js:', matches);

// Search for the component definition of Sa
// Let's look at the imports/setup of the bundle
const saIdx = d.indexOf('SupportCardGrid');
if (saIdx > -1) {
  // Let's search backwards or forwards for Sa
  const sub = d.substring(saIdx - 2000, saIdx);
  console.log('=== Context before SupportCardGrid ===');
  console.log(sub);
}
