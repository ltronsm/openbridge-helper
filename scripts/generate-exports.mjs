import fs from "fs";
import path from "path";

const CANDIDATES = [
  "@oicl/openbridge-webcomponents-react",
  "@ocean-industries-concept-lab/openbridge-webcomponents-react"
];

function resolveOpenBridgePackage() {
  for (const pkg of CANDIDATES) {
    try {
      import.meta.resolve(`${pkg}/package.json`);
      return pkg;
    } catch {}
  }

  throw new Error(
    "No supported OpenBridge React package found.\n" +
    "Install either:\n" +
    "- @oicl/openbridge-webcomponents-react\n" +
    "- @ocean-industries-concept-lab/openbridge-webcomponents-react"
  );
}

async function generateExports() {
  const PKG = resolveOpenBridgePackage();
  const ROOT = path.dirname(
    new URL(import.meta.resolve(`${PKG}/package.json`)).pathname
  );

  const OUT_DIR = "src/openbridge-helper";
  fs.mkdirSync(OUT_DIR, { recursive: true });

  function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      if (entry.isFile() && entry.name.endsWith(".js")) return full;
      return [];
    });
  }

  function extractExports(file) {
    const content = fs.readFileSync(file, "utf8");
    return [...content.matchAll(/export\s+(?:class|const|function)\s+(Ob[ic][A-Z]\w+)/g)]
      .map(m => m[1]);
  }

  function generate(subdir, prefix) {
    const files = walk(path.join(ROOT, subdir));
    const lines = [];

    for (const file of files) {
      const exports = extractExports(file).filter(e => e.startsWith(prefix));
      if (!exports.length) continue;

      const rel = file
        .replace(ROOT, PKG)
        .replace(/\\/g, "/")
        .replace(/\.js$/, "");

      for (const name of exports) {
        lines.push(`export { ${name} } from "${rel}";`);
      }
    }

    return lines.sort().join("\n");
  }

  fs.writeFileSync(`${OUT_DIR}/icons.ts`, generate("icons", "Obi"));
  fs.writeFileSync(`${OUT_DIR}/components.ts`, generate("components", "Obc"));

  console.log("✔ OpenBridge exports generated from", PKG);
}

export default generateExports;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateExports().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}