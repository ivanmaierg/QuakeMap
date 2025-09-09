import type { Earthquake } from './features/earthquake/models/earthquake.type';

export type EmitterEvents = {
  'earthquake:created': { earthquake: Earthquake };
  'earthquake:updated': { earthquake: Earthquake };
  'earthquake:deleted': { earthquakeId: string };
  'data:ingested': { count: number; timestamp: Date };
  'stats:updated': { stats: any };
  'api:started': { timestamp: Date };
  'api:error': { error: Error; context: string };
};

// Event emitter types (simplified for now)
export type AppEmitter = {
  on: (event: string, handler: Function) => void;
  emit: (event: string, data: any) => void;
};
