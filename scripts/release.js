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

function updateVersionCodes(newCode) {
  const buildGradlePath = path.join(ROOT, 'android/app/build.gradle');
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  buildGradle = buildGradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
  fs.writeFileSync(buildGradlePath, buildGradle);

  const appJsonPath = path.join(ROOT, 'app.json');
  const appJson = readJson(appJsonPath);
  appJson.expo.android.versionCode = newCode;
  writeJson(appJsonPath, appJson);
}

function runBuild() {
  console.log('Building release bundle...');
  execSync('cd android && ./gradlew bundleRelease', { cwd: ROOT, stdio: 'inherit' });
}

function main() {
  const currentCode = getCurrentVersionCode();
  const newCode = currentCode + 1;

  console.log(`Current versionCode: ${currentCode}`);
  console.log(`New versionCode: ${newCode}`);

  updateVersionCodes(newCode);
  runBuild();

  const bundleDir = path.join(ROOT, 'android/app/build/outputs/bundle/release');
  execSync(`open ${bundleDir}`, { cwd: ROOT });

  console.log(`\n✅ Release bundle ready in Finder`);
}

main();