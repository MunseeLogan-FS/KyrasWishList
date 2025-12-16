// src/routes/+page.server.js
import { error } from '@sveltejs/kit';

const WISHLIST_URL =
	'https://script.google.com/macros/s/AKfycbyh46WN7WBsK9QuSTVNl_8ukrdQ7kipokUZhu-gbh6vhJviYhmomJrZjNYzq3f3x1pl/exec';

const isUrl = (s) => /^https?:\/\/\S+/i.test(s.trim());

function toItems(content = []) {
	const items = [];
	let currentTitle = null;

	for (const block of content) {
		const text = (block?.text ?? '').trim();
		if (!text) continue;

		if (isUrl(text)) {
			// if we have a title, pair it; otherwise derive a fallback title
			let title = currentTitle;
			if (!title) {
				try {
					title = new URL(text).hostname.replace(/^www\./, '');
				} catch {
					title = 'Link';
				}
			}

			items.push({
				title,
				url: text
			});

			// IMPORTANT: do NOT clear currentTitle here,
			// because your doc has cases like "Cotton Sweaters" followed by multiple links
			continue;
		}

		// Non-url paragraph becomes the "current title"
		currentTitle = text;
	}

	return items;
}

export async function load({ fetch }) {
	try {
		const res = await fetch(WISHLIST_URL);
		const body = await res.text();

		let parsed;
		try {
			parsed = JSON.parse(body);
		} catch (parseErr) {
			console.error('Wishlist API returned non-JSON response', {
				status: res.status,
				contentType: res.headers.get('content-type') ?? '',
				bodySnippet: body.slice(0, 200)
			});
			throw error(502, 'Wishlist source returned an invalid response');
		}

		if (!res.ok) {
			throw error(res.status, parsed?.message ?? 'Failed to fetch wishlist');
		}

		const content = parsed?.content ?? [];
		const items = toItems(content);

		return {
			items,
			updated: parsed?.updated ?? null,
			error: null
		};
	} catch (err) {
		console.error('Failed to load wishlist', err);
		return {
			items: [],
			updated: null,
			error: 'Unable to fetch wishlist right now.'
		};
	}
}
