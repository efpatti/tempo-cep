/// <reference types="react-scripts" />

// Adicione a seguinte declaração para fornecer um fallback para o módulo 'timers'
declare module "timers" {
  export const setTimeout: typeof global.setTimeout;
  export const clearTimeout: typeof global.clearTimeout;
  export const setInterval: typeof global.setInterval;
  export const clearInterval: typeof global.clearInterval;
}
