export interface DatabaseProbe {
  ping(): Promise<void>;
}
export function healthService(database: DatabaseProbe) {
  return {
    async check() {
      try {
        await database.ping();
        return {
          status: 'ok',
          db: 'up',
          time: new Date().toISOString(),
        } as const;
      } catch {
        return { status: 'degraded', db: 'down' } as const;
      }
    },
  };
}
