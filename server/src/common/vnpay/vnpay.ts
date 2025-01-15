import dateFormat from 'dateformat';
import { IConfiguration } from '../../helpers/config';
import querystring from 'qs';
import CryptoJS from 'crypto-js';
import { generateVnpayId, sortObject } from './helpers';

interface ICreatePaymentUrlRequest {
	ipAddr: string;
	amount: number;
}

interface IVnpParams {
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
}

interface IVnpResponse {
	vnp_id: string;
	secure_hash: string;
	amount: number;
	redirect_url: string;
}

export const createPaymentUrl = (request: ICreatePaymentUrlRequest, config: IConfiguration): IVnpResponse => {
	const tmnCode = config.tmnCode;
	const secretKey = config.secretKey;
	const vnpUrl = config.vnpUrl;
	const returnUrl = config.returnUrl;
	const date = new Date();
	const createDate = dateFormat(date, 'yyyymmddHHmmss');
	// const orderId = generateVnpayId();
	const orderId = dateFormat(date, 'HHmmss');
	const amount = request.amount;
	const currCode = 'VND';
	let vnpParams: IVnpParams = {
		vnp_Version: '2.1.0',
		vnp_Command: 'pay',
		vnp_TmnCode: tmnCode,
		vnp_Locale: 'vn',
		vnp_CurrCode: currCode,
		vnp_TxnRef: orderId,
		vnp_OrderInfo: 'TTHD',
		vnp_OrderType: 'other',
		vnp_Amount: amount * 100,
		vnp_ReturnUrl: encodeURIComponent(returnUrl),
		vnp_IpAddr: request.ipAddr,
		vnp_CreateDate: createDate,
	};

	vnpParams = sortObject(vnpParams);

	const signData = querystring.stringify(vnpParams, { encode: false });
	const signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
	vnpParams['vnp_SecureHash'] = signed;
	const resp = vnpUrl + '?' + querystring.stringify(vnpParams, { encode: false });
	const vnpResponse: IVnpResponse = {
		vnp_id: orderId,
		secure_hash: signed,
		amount: amount,
		redirect_url: resp,
	};
	return vnpResponse;
};

export const getPaymentStatusUrl = (query: any, config: IConfiguration): string => {
	return '';
};
