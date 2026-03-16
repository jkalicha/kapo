const fs = require('fs');
const path = require('path');

const neonDir = path.join(__dirname, '..', 'node_modules', '@neondatabase', 'serverless');
const PATCH_MARKER = '/* LOCAL_DEV_PATCH */';

function findNeonConfigAlias(content) {
  const match = content.match(/(\w+)\s+as\s+neonConfig/);
  return match ? match[1] : 'neonConfig';
}

function patchFile(filePath, isESM) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(PATCH_MARKER)) {
    console.log(`[patch-neon-local] ${path.basename(filePath)} already patched`);
    return;
  }

  const neonConfigAlias = findNeonConfigAlias(content);
  const patch = isESM
    ? `
${PATCH_MARKER}
if (typeof process !== 'undefined' && process.env && process.env.LOCAL_DB_WS_PROXY) {
  ${neonConfigAlias}.wsProxy = function() { return process.env.LOCAL_DB_WS_PROXY; };
  ${neonConfigAlias}.useSecureWebSocket = false;
  ${neonConfigAlias}.pipelineTLS = false;
  ${neonConfigAlias}.pipelineConnect = false;
  ${neonConfigAlias}.forceDisablePgSSL = true;
}
`
    : `
${PATCH_MARKER}
;(function() {
  var proxy = (typeof process !== 'undefined' && process.env && process.env.LOCAL_DB_WS_PROXY);
  if (proxy) {
    var cfg = module.exports.neonConfig;
    if (cfg) {
      cfg.wsProxy = function() { return proxy; };
      cfg.useSecureWebSocket = false;
      cfg.pipelineTLS = false;
      cfg.pipelineConnect = false;
      cfg.forceDisablePgSSL = true;
    }
  }
})();
`;

  fs.writeFileSync(filePath, content + patch);
  console.log(`[patch-neon-local] Patched ${path.basename(filePath)}`);
}

patchFile(path.join(neonDir, 'index.js'), false);
patchFile(path.join(neonDir, 'index.mjs'), true);

console.log('[patch-neon-local] Done');
