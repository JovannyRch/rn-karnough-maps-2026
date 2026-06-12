const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
}

function getCurrentVersionCode() {
  const buildGradle = fs.readFileSync(path.join(ROOT, 'android/app/build.gradle'), 'utf8');
  const match = buildGradle.match(/versionCode\s+(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function bumpSemver(version, type) {
  const parts = version.split('.').map(Number);
  if (type === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}

function updateVersionCodes(newCode, bumpType) {
  const buildGradlePath = path.join(ROOT, 'android/app/build.gradle');
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  buildGradle = buildGradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
  fs.writeFileSync(buildGradlePath, buildGradle);

  const appJsonPath = path.join(ROOT, 'app.json');
  const appJson = readJson(appJsonPath);
  appJson.expo.android.versionCode = newCode;

  const oldVersion = appJson.expo.version;
  appJson.expo.version = bumpSemver(oldVersion, bumpType);
  writeJson(appJsonPath, appJson);

  return { oldVersion, newVersion: appJson.expo.version };
}

function runBuild() {
  console.log('Building release bundle...');
  execSync('cd android && ./gradlew bundleRelease', { cwd: ROOT, stdio: 'inherit' });
}

function main() {
  const bumpType = process.argv[2] || 'patch';
  if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Usage: node release.js [patch|minor|major]');
    process.exit(1);
  }

  const currentCode = getCurrentVersionCode();
  const newCode = currentCode + 1;

  console.log(`Current versionCode: ${currentCode}`);
  console.log(`New versionCode: ${newCode}`);

  const { oldVersion, newVersion } = updateVersionCodes(newCode, bumpType);
  console.log(`Version: ${oldVersion} → ${newVersion} (${bumpType})`);

  runBuild();

  const bundleDir = path.join(ROOT, 'android/app/build/outputs/bundle/release');
  execSync(`open ${bundleDir}`, { cwd: ROOT });

  console.log(`\n✅ Release bundle ready in Finder`);
}

main();