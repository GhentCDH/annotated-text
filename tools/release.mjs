import { readFileSync } from "fs";
import { execSync } from "node:child_process";

// Read input parameters
// eslint-disable-next-line no-undef
const args = process.argv.slice(2);
const allowedReleaseTypes = ["major", "minor", "patch"];
const releaseType = args[0]?.substring(2);

if (!allowedReleaseTypes.includes(releaseType))
  throw new Error(
    "Invalid release type. Allowed values are major, minor, patch"
  );

execSync(`npm version ${releaseType}`, { stdio: "inherit" });

// Read version from package.json
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const version = packageJson.version;

execSync(`git push`, {
  stdio: "inherit",
});
execSync(`git push origin "v${version}`);

// Output the parameters and version
console.log(`Release type: ${releaseType}`);
console.log(`New version: ${version}`);

console.warn(`Promote tag to release on github`);
