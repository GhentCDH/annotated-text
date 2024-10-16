import { readFileSync } from "fs";
import { execSync } from "node:child_process";

// Read input parameters
const args = process.argv.slice(2);
const allowedReleaseTypes = ["major", "minor", "patch"];
const releaseType = args[0]?.substring(2);

if (!allowedReleaseTypes.includes(releaseType))
  throw new Error(
    "Invalid release type. Allowed values are major, minor, patch"
  );

execSync(
  `npm version ${releaseType}  --allow-same-version
`,
  { stdio: "inherit" }
);

// Read version from package.json
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const version = packageJson.version;

execSync(`git checkout -b release/${version}`, { stdio: "inherit" });
// execSync(`git tag "v${version}`);
execSync(`git add . && git commit -m 'release: ${version} && git push`, {
  stdio: "inherit",
});
// execSync(`git push origin "v${version}`);

// Output the parameters and version
console.log(`Release type: ${releaseType}`);
console.log(`New version: ${version}`);
