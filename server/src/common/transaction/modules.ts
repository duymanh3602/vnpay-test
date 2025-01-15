import { eq } from 'drizzle-orm';
import { transaction } from '../database/schema';
import { DrizzleDB } from '../../middleware';

interface TransactionCreateRequest {
	amount: number;
	vnpay_id: string;
	secure_hash: string;
	user_id: string;
}

export const TransactionModule = (db: DrizzleDB) => {
	return {
		createTransaction: async (request: TransactionCreateRequest) => {
			return await db
				.insert(transaction)
				.values({
					id: crypto.randomUUID(),
					vnpay_id: request.vnpay_id,
					amount: request.amount,
					status: 0,
					secure_hash: request.secure_hash,
					user_id: request.user_id,
				})
				.returning()
				.get();
		},
		getTransactionById: async (id: string) => {
			const transactions = await db.select().from(transaction).where(eq(transaction.id, id)).limit(1);
			return transactions[0];
		},
		getTransactionByVnPayId: async (vnpId: string) => {
			const users = await db.select().from(transaction).where(eq(transaction.vnpay_id, vnpId)).limit(1);
			return users[0];
		},
	};
};
