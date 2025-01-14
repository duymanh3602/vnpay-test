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

import { IConfiguration } from './helpers/config';
import { createPaymentUrl } from './utils/vnpay';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const config: IConfiguration = {
			tmnCode: env.TMN_CODE,
			secretKey: env.SECRET_KEY,
			vnpUrl: env.VNP_URL,
			returnUrl: env.RETURN_URL,
		};

		const url = createPaymentUrl(
			{
				ipAddr: request.headers.get('x-forwarded-for') || '127.0.0.1',
				amount: 100000,
				orderType: 'billpayment',
				local: 'vn',
				bankCode: 'VIETINBANK',
			},
			config
		);

		return new Response(url);
	},
} satisfies ExportedHandler<Env>;
