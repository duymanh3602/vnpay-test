import { Context } from '../../types';
import { IConfiguration } from '../../helpers/config';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { json200Response, json401Response, requestBody } from '../../openai';
import { createPaymentUrl } from './vnpay';
import { TransactionModule } from '../transaction/modules';
import { getDB } from '../database/helpers';

const VnPaySchema = z
	.object({
		vnpay_url: z.string().openapi({ example: 'Redirect VNPay Url' }),
	})
	.openapi('VnPay');

const app = new OpenAPIHono<Context>();

const createPayment = createRoute({
	method: 'post',
	path: '/create-payment',
	...requestBody(
		z.object({
			amount: z.number(),
		})
	),
	responses: {
		...json200Response(VnPaySchema, 'VnPay redirect url.'),
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

	const user = c.get('user');

	if (!user) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	const transactionModule = TransactionModule(getDB(c));

	const { amount } = c.req.valid('json');

	const payment = createPaymentUrl(
		{
			ipAddr: c.req.header('x-forwarded-for') || '127.0.0.1',
			amount: amount,
		},
		config
	);

	const saveTransaction = {
		amount: payment.amount,
		vnpay_id: payment.vnp_id,
		secure_hash: payment.secure_hash,
		user_id: user.id,
	};

	const resp = await transactionModule.createTransaction(saveTransaction);

	return c.json({ vnpay_url: payment.redirect_url }, 200);
});

export default app;
