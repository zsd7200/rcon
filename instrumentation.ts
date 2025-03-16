export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { envVariablesCheck } = await import('@/components/utils/PasswordOperations');
    const { migrate } = await import('@/db/Migrations');
    
    envVariablesCheck();
    migrate();
  }
}