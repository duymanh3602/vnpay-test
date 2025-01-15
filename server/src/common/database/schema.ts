import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	password: text('password').notNull(),
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expires_at: integer('expires_at').notNull(),
	user_id: integer('user_id')
		.notNull()
		.references(() => user.id),
	fresh: integer('fresh', { mode: 'boolean' }),
});

export const transaction = sqliteTable('transaction', {
	id: text('id').primaryKey(),
	vnpay_id: text('vnpay_id').notNull().unique(),
	secure_hash: text('secure_hash').notNull(),
	amount: integer('amount').notNull(),
	status: integer('status').notNull().default(0),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
});
