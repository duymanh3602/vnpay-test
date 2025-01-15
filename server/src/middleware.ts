import { initializeLucia } from './common/auth/lib';
import { verifyRequestOrigin } from 'lucia';
import { getCookie, setCookie } from 'hono/cookie';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { MiddlewareHandler } from 'hono';
import type { Context } from './types';
import * as schema from './common/database/schema';

type Handler = MiddlewareHandler<Context>;
export type DrizzleDB = DrizzleD1Database<typeof schema>;

export const csrf = (): Handler => {
	return async (c, next) => {
		// CSRF middleware
		if (c.req.method === 'GET') {
			return next();
		}
		const originHeader = c.req.header('Origin');
		const hostHeader = c.req.header('Host');
		if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
			return c.body(null, 403);
		}
		return next();
	};
};

export const validateRequest = (): Handler => {
	return async (c, next) => {
		const lucia = initializeLucia(c.env.MY_DB);
		const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

		if (!sessionId) {
			c.set('user', null);
			c.set('session', null);
			return next();
		}

		const { session, user } = await lucia.validateSession(sessionId);

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id).serialize();
			// setCookie(c, 'auth_session', sessionCookie, {
			// 	httpOnly: false,
			// 	secure: false,
			// 	path: '/',
			// 	maxAge: 60 * 60 * 24 * 7,
			// });
			c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
				append: true,
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie().serialize();
			// setCookie(c, 'auth_session', sessionCookie, {
			// 	httpOnly: false,
			// 	secure: false,
			// 	path: '/',
			// 	maxAge: 60 * 60 * 24 * 7,
			// });
			c.header('Set-Cookie', sessionCookie, {
				append: true,
			});
		}

		c.set('user', user);
		c.set('session', session);

		return next();
	};
};

export const unauthenticatedOnly = (): Handler => {
	return async (c, next) => {
		const user = c.var.user;
		if (user) {
			return c.redirect('/');
		}
		return next();
	};
};

export const authenticatedOnly = (): Handler => {
	return async (c, next) => {
		const user = c.var.user;
		if (!user) {
			return c.redirect('/login');
		}
		return next();
	};
};
