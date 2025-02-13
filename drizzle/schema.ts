import { pgTable, unique, integer, text, timestamp, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const fidMapping = pgTable("fid_mapping", {
	fid: integer().notNull(),
	imageUrl: text("image_url").notNull(),
	created: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updated: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		fidMappingFidUnique: unique("fid_mapping_fid_unique").on(table.fid),
	}
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
}, (table) => {
	return {
		usersUsernameUnique: unique("users_username_unique").on(table.username),
	}
});
