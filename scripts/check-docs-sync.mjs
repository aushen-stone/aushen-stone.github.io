import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function fail(message) {
  failures.push(message);
}

function requireIncludes(file, needle, reason = needle) {
  const content = read(file);
  if (!content.includes(needle)) {
    fail(`${file} is missing required reference: ${reason}`);
  }
}

function requireNotIncludes(file, needle, reason = needle) {
  const content = read(file);
  if (content.includes(needle)) {
    fail(`${file} contains stale reference: ${reason}`);
  }
}

function collectPageFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...collectPageFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      pages.push(path.relative(root, fullPath).split(path.sep).join("/"));
    }
  }

  return pages.sort();
}

function parseTaskSections(markdown) {
  const headingPattern = /^### ([^\n]+)\n/gm;
  const headings = [];
  let match;

  while ((match = headingPattern.exec(markdown)) !== null) {
    headings.push({
      title: match[1],
      start: match.index,
      bodyStart: headingPattern.lastIndex,
    });
  }

  return headings.map((heading, index) => {
    const end = headings[index + 1]?.start ?? markdown.length;
    return {
      title: heading.title,
      body: markdown.slice(heading.bodyStart, end),
    };
  });
}

function checkDeploymentContract() {
  const activeDocs = [
    "README.md",
    "docs/ARCHITECTURE.md",
    "docs/NEXT_STEPS.md",
    "docs/README_AGENT.md",
  ];

  for (const file of activeDocs) {
    requireNotIncludes(file, "peaceiris", "old peaceiris gh-pages workflow");
    requireNotIncludes(file, "dist -> gh-pages", "old dist to gh-pages workflow");
    requireNotIncludes(file, "publish_dir", "old gh-pages publish_dir workflow");
  }

  requireIncludes(".github/workflows/deploy.yml", "actions/configure-pages@v5");
  requireIncludes(".github/workflows/deploy.yml", "actions/upload-pages-artifact@v4");
  requireIncludes(".github/workflows/deploy.yml", "actions/deploy-pages@v4");
  requireIncludes(".github/workflows/deploy.yml", "npm run docs:check");
  requireIncludes("docs/ARCHITECTURE.md", "Pages artifact");
  requireIncludes("docs/README_AGENT.md", "actions/deploy-pages");
}

function checkRouteArchitectureContract() {
  const architecture = read("docs/ARCHITECTURE.md");
  const pageFiles = collectPageFiles(path.join(root, "src/app"));

  for (const pageFile of pageFiles) {
    if (!architecture.includes(pageFile)) {
      fail(`docs/ARCHITECTURE.md does not list route page ${pageFile}`);
    }
  }
}

function checkSitemapAndSeoContract() {
  requireIncludes("src/app/sitemap.ts", "BLOG_POSTS");
  requireIncludes("src/app/sitemap.ts", "PRODUCTS");
  requireIncludes("src/app/sitemap.ts", "ACCESSORY_BRANDS");
  requireNotIncludes("src/app/sitemap.ts", "thank-you", "thank-you route must stay out of sitemap");

  requireIncludes("docs/ARCHITECTURE.md", "/blog/[slug]");
  requireIncludes("docs/ARCHITECTURE.md", "generated blog detail routes");
  requireIncludes("docs/ARCHITECTURE.md", "/thank-you");
  requireIncludes("docs/ARCHITECTURE.md", "Excluded from sitemap: `/cart`, `/projects/[id]`, `/thank-you`.");
}

function checkContactConversionContract() {
  requireIncludes("src/app/contact/ContactPageClient.tsx", "contact_form_submit");
  requireIncludes("src/app/contact/ContactPageClient.tsx", "dataLayer");
  requireIncludes("src/app/contact/ContactPageClient.tsx", 'router.push("/thank-you/")');

  if (!exists("src/app/thank-you/page.tsx")) {
    fail("src/app/thank-you/page.tsx is missing");
  } else {
    requireIncludes("src/app/thank-you/page.tsx", 'path: "/thank-you/"');
    requireIncludes("src/app/thank-you/page.tsx", "index: false");
    requireIncludes("src/app/thank-you/page.tsx", "follow: false");
  }

  requireIncludes("docs/ARCHITECTURE.md", "contact_form_submit");
  requireIncludes("docs/ARCHITECTURE.md", "/thank-you/");
  requireIncludes("docs/NEXT_STEPS.md", "contact_form_submit");
  requireIncludes("docs/NEXT_STEPS.md", "/thank-you/");
}

function checkTaskGovernanceContract() {
  const nextSteps = read("docs/NEXT_STEPS.md");
  const sections = parseTaskSections(nextSteps);
  const activeTaskPattern = /^(LAUNCH-[A-Z0-9-]+|P1-[A-Z0-9-]+|MKT-[A-Z0-9-]+)\b/;
  const allowedStatuses = new Set(["Open", "Blocked", "In Progress", "Done"]);

  for (const section of sections) {
    const match = section.title.match(activeTaskPattern);
    if (!match) {
      continue;
    }

    const taskId = match[1];
    for (const field of ["Status", "Owner", "Evidence", "Exit Criteria", "Docs Impact"]) {
      if (!section.body.includes(`- ${field}:`)) {
        fail(`${taskId} is missing required field: ${field}`);
      }
    }

    const statusMatch = section.body.match(/- Status: `([^`]+)`/);
    if (!statusMatch || !allowedStatuses.has(statusMatch[1])) {
      fail(`${taskId} has invalid or missing status`);
    }

    if (taskId.startsWith("MKT-") && !section.body.includes("- Tags: `marketing`")) {
      fail(`${taskId} must include marketing tag`);
    }
  }

  requireIncludes("docs/NEXT_STEPS.md", "Docs Impact");
  requireIncludes("docs/README_AGENT.md", "Docs Impact");
  requireIncludes("docs/README_AGENT.md", "npm run docs:check");
  requireIncludes("docs/ARCHITECTURE.md", "Documentation Governance Contract");
}

checkDeploymentContract();
checkRouteArchitectureContract();
checkSitemapAndSeoContract();
checkContactConversionContract();
checkTaskGovernanceContract();

if (failures.length > 0) {
  console.error("docs:check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("docs:check passed");
