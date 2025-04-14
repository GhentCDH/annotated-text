/* eslint-disable no-console */
import { simpleGit } from "simple-git";
import { readJson, writeJson } from "fs-extra";
import * as semver from "semver";
import { ReleaseType } from "semver";
import * as yargs from "yargs";
import conventionalChangelog from "conventional-changelog";
import * as path from "path";
import * as fs from "fs";

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

async function bumpVersion(type: semver.ReleaseType) {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  console.log(pkgPath);
  const pkg = await readJson(pkgPath);
  const currentVersion = pkg.version;
  const newVersion = semver.inc(currentVersion, type);

  if (!newVersion) throw new Error("Version bump failed");

  pkg.version = newVersion;
  await writeJson(pkgPath, pkg, { spaces: 2 });
  console.log(`🔧 Bumped version: ${currentVersion} → ${newVersion}`);
  return newVersion;
}

async function gitCommitAndTag(version: string) {
  git
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

const dynamicReleaseTypes = (): ReleaseType[] => {
  // You could fetch this from an API, file, logic, etc.
  return [
    "patch",
    "minor",
    "major",
    "prepatch",
    "prerelease",
    "prerelease",
    "release",
  ];
};

(async () => {
  const options = await (yargs as any)
    .version(false)
    .option("version", {
      alias: "v",
      type: "string",
      description: "Specify the release version type",
      choices: dynamicReleaseTypes(), // 👈 dynamic options
      demandOption: true,
    })
    .parseAsync();

  try {
    const releaseType: ReleaseType = options.version;
    if (!releaseType) {
      console.log("📭 No release needed based on recent commits.");
      return;
    }

    const newVersion = await bumpVersion(releaseType);
    await generateChangelog();
    await gitCommitAndTag(newVersion);
  } catch (err) {
    console.error("❌ Release failed:", err);
    process.exit(1);
  }
})();
