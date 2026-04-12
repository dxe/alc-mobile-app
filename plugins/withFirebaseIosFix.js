const { withDangerousMod } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

// Firebase's Swift pods (FirebaseCoreInternal) need module maps to import
// ObjC dependencies (GoogleUtilities). use_modular_headers! generates those
// module maps for all pods, allowing Swift/ObjC interop without use_frameworks!.
// CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES is kept as a safety net.
module.exports = (config) =>
  withDangerousMod(config, [
    "ios",
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      // Add use_modular_headers! before the target block so Firebase Swift
      // pods can import ObjC dependencies that now have module maps.
      podfile = podfile.replace(
        "target 'ALC' do",
        "use_modular_headers!\n\ntarget 'ALC' do"
      );

      // Safety net for any remaining non-modular include warnings-as-errors.
      const fix = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end\n`;

      podfile = podfile.replace(
        "react_native_post_install(",
        fix + "    react_native_post_install("
      );

      fs.writeFileSync(podfilePath, podfile, "utf8");
      return cfg;
    },
  ]);
