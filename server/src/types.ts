import type { User, Session } from 'lucia';
import { DrizzleDB } from './middleware';

export type Context = {
	Bindings: {
		MY_DB: D1Database;
		VNP_URL: string;
		RETURN_URL: string;
		TMN_CODE: string;
		SECRET_KEY: string;
	};
	Variables: {
		user: User | null;
		session: Session | null;
		db: DrizzleDB;
	};
};
