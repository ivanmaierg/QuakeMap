import { pgTable, serial, text, timestamp, real, jsonb, index } from 'drizzle-orm/pg-core';

export const earthquakes = pgTable(
  'earthquakes',
  {
    id: serial('id').primaryKey(),
    usgsId: text('usgs_id').notNull().unique(),
    title: text('title').notNull(),
    magnitude: real('magnitude').notNull(),
    place: text('place'),
    time: timestamp('time', { withTimezone: true }).notNull(),
    updated: timestamp('updated', { withTimezone: true }),
    url: text('url'),
    detail: text('detail'),
    felt: real('felt'),
    cdi: real('cdi'),
    mmi: real('mmi'),
    alert: text('alert'),
    status: text('status'),
    tsunami: real('tsunami'),
    sig: real('sig'),
    net: text('net'),
    code: text('code'),
    ids: text('ids'),
    sources: text('sources'),
    types: text('types'),
    nst: real('nst'),
    dmin: real('dmin'),
    rms: real('rms'),
    gap: real('gap'),
    magType: text('mag_type'),
    type: text('type'),
    longitude: real('longitude').notNull(),
    latitude: real('latitude').notNull(),
    properties: jsonb('properties'),
    geometry: jsonb('geometry'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    usgsIdIdx: index('usgs_id_idx').on(table.usgsId),
    magnitudeIdx: index('magnitude_idx').on(table.magnitude),
    timeIdx: index('time_idx').on(table.time),
    locationIdx: index('location_idx').on(table.longitude, table.latitude),
    magnitudeTimeIdx: index('magnitude_time_idx').on(table.magnitude, table.time)
  })
);

export type Earthquake = typeof earthquakes.$inferSelect;
export type NewEarthquake = typeof earthquakes.$inferInsert;
