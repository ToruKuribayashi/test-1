'use strict';

export class MicroCmsApiClient {
	constructor(serviceDomain, apiKey) {
		const { createClient } = microcms;
		this.client = createClient({
			serviceDomain: serviceDomain,
			apiKey: apiKey
		});
	}
	
	getList(endpoint, fields, filters, orders, limit) {
		return new Promise(resolve => {
			this.client.getList({
				endpoint: endpoint,
				queries: {
					fields: fields,
					filters: filters,
					orders: orders,
					limit: limit
				}
			}).then((res) => resolve(res));
		});
	}
}

export class ObjectParseTool {
	constructor() {}
	
	parseQuery(qs) {
		const items = {};
		if (qs.indexOf('?') == -1) {
			return items;
		}
		const pairs = qs.split('?')[1].split('&');
		for (var i = 0; i < pairs.length; i++) {
			const pair = pairs[i].split('=');
			const key = decodeURIComponent(pair[0]);
			if (key.length != 0) {
				items[key] = decodeURIComponent(pair[1].replace("+"," "));
			}
		}
		return items;
	}
	
	findItem(items, key, value) {
		const index = this.#findItemIndex(items, key, value);
		return (0 <= index) ? [items[index]] : [];
	}
	
	findPrev(items, key, value) {
		const index = this.#findItemIndex(items, key, value);
		return (0 < index) ? [items[index - 1]] : [];
	}
	
	findNext(items, key, value) {
		const index = this.#findItemIndex(items, key, value);
		if (index == items.length - 1) {
			return [];
		}
		return (0 <= index) ? [items[index + 1]] : [];
	}
	
	#findItemIndex(items, key, value) {
		for (var i = 0; i < items.length; i++) {
			if (items[i][key] == value) {
				return i;
			}
		}
		return -1;
	}
}

export class HtmlConvertTool {
	constructor(fields, config) {
		this.fields = fields
		this.config = config
	}
	
	toHtml(format, data) {
		let html = '';
		if (Array.isArray(data)) {
			for (const row of data) {
				html += this.#parse(format, row);
			}
			
		} else {
			html += this.#parse(format, data);
		}
		return html;
	}

	#parse(format, row) {
		let text = format;
		for (const field of this.fields) {
			let value = '';
			if ((field in row) && (row[field] != null)) {
				if (field in this.config) {
					value = this.#format(this.config[field], row[field]);
				} else {
					value = row[field];
				}
			}
			text = text.replaceAll('${' + field + '}', value);
		}
		return text;
	}
	
	#format(config, value) {
		switch (config) {
			case 'dateFormat':
				return this.#dateFormat(value);
			case 'escape':
				return this.#escape(value);
			case 'arrayFirst':
				return this.#arrayFirst(value);
			case 'pictureUrl':
				return this.#pictureUrl(value);
			default:
				return value;
		}
	}
	
	#dateFormat(str) {
		const date = new Date(str);
		const y = date.getFullYear().toString().padStart(4, '0');
		const m = (date.getMonth() + 1).toString().padStart(2, '0');
		const d = date.getDate().toString().padStart(2, '0');
		return y + "-" + m + "-" + d;
	}
	
	#escape(str) {
		return str.replace(/[&'`"<>]/g, (match) => {
			return {
				'&': '&amp;',
				"'": '&#x27;',
				'`': '&#x60;',
				'"': '&quot;',
				'<': '&lt;',
				'>': '&gt;',
			}[match]
		});
	}

	#arrayFirst(array) {
		return (0 < array.length) ? array[0] : '';
	}
	
	#pictureUrl(picture) {
		return picture.url;
	}
}


