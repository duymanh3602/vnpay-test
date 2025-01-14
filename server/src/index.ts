/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { swaggerUI } from '@hono/swagger-ui';
import { csrf, validateRequest } from './middleware';
import { Context } from './types';
import authRoutes from './common/auth/routes';
import vnpRoutes from './common/vnpay/routes';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono<Context>();

app.use('*', csrf());
app.use('*', validateRequest());

app.get('/', (c) => c.redirect('/ui'));

app.route('/auth', authRoutes);
app.route('/pay', vnpRoutes);

app.doc('/doc', {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'Example API',
	},
});

app.get('/ui', swaggerUI({ url: '/doc' }));

export default app;
