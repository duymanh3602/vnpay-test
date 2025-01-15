export const generateVnpayId = () => {
	return `${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

export function sortObject<T extends Record<string, any>>(obj: T): T {
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
