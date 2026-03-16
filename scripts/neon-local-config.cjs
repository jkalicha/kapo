if (process.env.LOCAL_DB_WS_PROXY) {
  try {
    const { neonConfig } = require('@neondatabase/serverless')
    neonConfig.wsProxy = () => process.env.LOCAL_DB_WS_PROXY
    neonConfig.useSecureWebSocket = false
    neonConfig.pipelineTLS = false
    neonConfig.pipelineConnect = false
    neonConfig.forceDisablePgSSL = true
  } catch {}
}
