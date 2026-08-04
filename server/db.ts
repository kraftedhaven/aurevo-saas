import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { CallConsoleSettings, InsertCallConsoleSettings, InsertObjectionResponse, InsertTradeBenchmark, InsertTrackerEntry, InsertUser, ObjectionResponse, TradeBenchmark, TrackerEntry, callConsoleSettings, objectionResponses, tradeBenchmarks, trackerEntries, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "businessId"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getCallConsoleSettings(userId: number): Promise<CallConsoleSettings | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get call console settings: database not available");
    return undefined;
  }
  const result = await db.select().from(callConsoleSettings).where(eq(callConsoleSettings.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCallConsoleSettings(settings: InsertCallConsoleSettings): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert call console settings: database not available");
    return;
  }
  await db.insert(callConsoleSettings).values(settings).onDuplicateKeyUpdate({
    set: settings,
  });
}

export async function getTrackerEntries(userId: number): Promise<TrackerEntry[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tracker entries: database not available");
    return [];
  }
  return db.select().from(trackerEntries).where(eq(trackerEntries.userId, userId));
}

export async function addTrackerEntry(entry: InsertTrackerEntry): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add tracker entry: database not available");
    return;
  }
  await db.insert(trackerEntries).values(entry);
}

export async function deleteTrackerEntry(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete tracker entry: database not available");
    return;
  }
  await db.delete(trackerEntries).where(and(eq(trackerEntries.id, id), eq(trackerEntries.userId, userId)));
}

export async function getTradeBenchmarks(): Promise<TradeBenchmark[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trade benchmarks: database not available");
    return [];
  }
  return db.select().from(tradeBenchmarks);
}

export async function addTradeBenchmark(benchmark: InsertTradeBenchmark): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add trade benchmark: database not available");
    return;
  }
  await db.insert(tradeBenchmarks).values(benchmark).onDuplicateKeyUpdate({
    set: benchmark,
  });
}

export async function getObjectionResponses(trade?: string, painPoint?: string): Promise<ObjectionResponse[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get objection responses: database not available");
    return [];
  }
  const conditions = [];
  if (trade) {
    conditions.push(eq(objectionResponses.trade, trade));
  }
  if (painPoint) {
    conditions.push(eq(objectionResponses.painPoint, painPoint));
  }

  if (conditions.length > 0) {
    return db.select().from(objectionResponses).where(and(...conditions));
  } else {
    return db.select().from(objectionResponses);
  }
}

export async function addObjectionResponse(response: InsertObjectionResponse): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add objection response: database not available");
    return;
  }
  await db.insert(objectionResponses).values(response);
}
