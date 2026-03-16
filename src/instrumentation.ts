export async function register() {
  if (process.env.NODE_ENV === 'development' && process.env.LOCAL_DB_WS_PROXY) {
    const { neonConfig } = await import('@neondatabase/serverless')
    neonConfig.wsProxy = () => process.env.LOCAL_DB_WS_PROXY!
    neonConfig.useSecureWebSocket = false
    neonConfig.pipelineTLS = false
    neonConfig.pipelineConnect = false
    neonConfig.forceDisablePgSSL = true
    console.log('[instrumentation] Neon local WS proxy configured:', process.env.LOCAL_DB_WS_PROXY)
  }
}
