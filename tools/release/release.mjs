/* eslint-disable no-console */
import { simpleGit } from "simple-git";
import fsExtra from "fs-extra";
import semver from "semver";
import yargs from "yargs";
import conventionalChangelog from "conventional-changelog";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs";

const git = simpleGit();

async function generateChangelog() {
  const changelogStream = fs.createWriteStream(
    path.resolve(process.cwd(), "RELEASE_NOTES.md"),
  );

  const stream = conventionalChangelog({
    preset: "angular", // or 'angular', 'eslint', etc.
    releaseCount: 1, // Only the latest release
  });

  stream.pipe(changelogStream).on("finish", () => {
    console.log("📄 Release notes generated in RELEASE_NOTES.md");
  });
}

async function bumpVersion(type) {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  console.log(pkgPath);
  const pkg = await fsExtra.readJson(pkgPath);

  const currentVersion = pkg.version;
  console.log("currentVersion", currentVersion);
  const newVersion = semver.inc(currentVersion, type);
  console.log("newVersion", newVersion);
  if (!newVersion) throw new Error("Version bump failed");

  pkg.version = newVersion;
  await fsExtra.writeJson(pkgPath, pkg, { spaces: 2 });

  const corePkg = await fsExtra.readJson(pkgPath);
  corePkg.version = newVersion;
  const corePath = path.resolve(process.cwd(), "libs/core/package.json");
  await fsExtra.writeJson(corePath, corePkg, { spaces: 2 });
  console.log(`🔧 Bumped version: ${currentVersion} → ${newVersion}`);
  return newVersion;
}

async function gitCommitAndTag(version) {
  return git
    .add("package.json")
    .add("RELEASE_NOTES.md")
    .commit(`chore(release): v${version}`)
    .addTag(`v${version}`)
    .push()
    .pushTags()
    .log()
    .exec(() => {
      console.log(`🏷️ Created git tag: v${version}`);
    });
}

(async () => {
  console.log("🚀 Starting release process...");
  const options = yargs(hideBin(process.argv))
    .version(false)
    .option("version", {
      alias: "v",
      // type: "string",
      description: "Specify the release type (semantic versioning)",
      choices: ["patch", "minor", "major", "prepatch", "prerelease", "release"],
      demandOption: true,
    })
    .help()
    .parseSync();

  try {
    const releaseType = options.version;
    if (!releaseType) {
      console.log("📭 No release needed based on recent commits.");
      return;
    }

    const newVersion = await bumpVersion(releaseType);
    await generateChangelog();
    await gitCommitAndTag(newVersion);
    console.log(`🚀 Released version ${options.version}`);
  } catch (err) {
    console.error("❌ Release failed:", err);
    process.exit(1);
  }
})();
