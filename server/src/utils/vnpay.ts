import dateFormat from 'dateformat';
import { IConfiguration } from '../helpers/config';
import querystring from 'qs';
import CryptoJS from 'crypto-js';

interface ICreatePaymentUrlRequest {
	ipAddr: string;
	amount: number;
	orderType: string;
	local: string;
	bankCode: string;
}

export const createPaymentUrl = (request: ICreatePaymentUrlRequest, config: IConfiguration): string => {
	const tmnCode = config.tmnCode;
	const secretKey = config.secretKey;
	const vnpUrl = config.vnpUrl;
	const returnUrl = config.returnUrl;
	const date = new Date();
	const createDate = dateFormat(date, 'yyyymmddHHmmss');
	const orderId = dateFormat(date, 'HHmmss');
	const amount = request.amount;
	const currCode = 'VND';
	let vnpParams: {
		vnp_Version: string;
		vnp_Command: string;
		vnp_TmnCode: string;
		vnp_Locale: string;
		vnp_CurrCode: string;
		vnp_TxnRef: string;
		vnp_OrderInfo: string;
		vnp_OrderType: string;
		vnp_Amount: number;
		vnp_ReturnUrl: string;
		vnp_IpAddr: string;
		vnp_CreateDate: string;
		vnp_BankCode?: string;
		vnp_SecureHash?: string;
	} = {
		vnp_Version: '2.1.0',
		vnp_Command: 'other',
		vnp_TmnCode: tmnCode,
		vnp_Locale: request.local || 'vn',
		vnp_CurrCode: currCode,
		vnp_TxnRef: orderId,
		vnp_OrderInfo: 'TTHD',
		vnp_OrderType: request.orderType,
		vnp_Amount: amount * 100,
		vnp_ReturnUrl: encodeURIComponent(returnUrl),
		vnp_IpAddr: request.ipAddr,
		vnp_CreateDate: createDate,
	};
	if (request.bankCode !== null && request.bankCode !== '') {
		vnpParams['vnp_BankCode'] = request.bankCode;
	}

	vnpParams = sortObject(vnpParams);

	const signData = querystring.stringify(vnpParams, { encode: false });
	const signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
	vnpParams['vnp_SecureHash'] = signed;
	return vnpUrl + '?' + querystring.stringify(vnpParams, { encode: false });
};

function sortObject<T extends Record<string, any>>(obj: T): T {
	let sorted: { [key: string]: any } = {};
	let str = [];
	let key;
	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			str.push(key);
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = obj[str[key]];
	}
	return sorted as T;
}
