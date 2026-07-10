// src/database/index.ts
// =====================================================
// WatermelonDB setup — TerritorializaSUS
// =====================================================

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import { migrations } from './migrations';

import User from './models/User';
import Session from './models/Session';
import Zone from './models/Zone';
import Neighborhood from './models/Neighborhood';
import Street from './models/Street';
import Assignment from './models/Assignment';
import Household from './models/Household';
import Establishment from './models/Establishment';
import RiskPoint from './models/RiskPoint';
import SyncQueueItem from './models/SyncQueueItem';
import AppMetadata from './models/AppMetadata';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error('[WatermelonDB] Setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Session,
    Zone,
    Neighborhood,
    Street,
    Assignment,
    Household,
    Establishment,
    RiskPoint,
    SyncQueueItem,
    AppMetadata,
  ],
});

export {
  User,
  Session,
  Zone,
  Neighborhood,
  Street,
  Assignment,
  Household,
  Establishment,
  RiskPoint,
  SyncQueueItem,
  AppMetadata,
};
