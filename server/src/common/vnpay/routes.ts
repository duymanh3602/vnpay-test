import { Context } from '../../types';
import { IConfiguration } from '../../helpers/config';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { json401Response, redirectResponse, requestBody } from '../../openai';
import { createPaymentUrl } from './vnpay';

const app = new OpenAPIHono<Context>();

const createPayment = createRoute({
	method: 'post',
	path: '/create-payment',
	...requestBody(
		z.object({
			amount: z.number(),
			orderType: z.string(),
			local: z.string(),
			bankCode: z.string(),
		})
	),
	responses: {
		...redirectResponse('Redirect to VNPay', '/'),
		...json401Response,
	},
});

app.openapi(createPayment, async (c) => {
	const config: IConfiguration = {
		tmnCode: c.env.TMN_CODE,
		secretKey: c.env.SECRET_KEY,
		vnpUrl: c.env.VNP_URL,
		returnUrl: c.env.RETURN_URL,
	};

	const { amount, orderType, local, bankCode } = c.req.valid('json');

	const paymentUrl = createPaymentUrl(
		{
			ipAddr: c.req.header('x-forwarded-for') || '127.0.0.1',
			amount: amount,
			orderType: orderType,
			local: local,
			bankCode: bankCode,
		},
		config
	);

	return c.redirect(paymentUrl);
});

export default app;
