import { defineConfig } from 'drizzle-kit';
import { findSqliteDatabase } from './bin/find-db';

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/common/database/schema.ts',
	out: './src/common/database/migrations',
	dbCredentials: {
		url: findSqliteDatabase(),
	},
});
