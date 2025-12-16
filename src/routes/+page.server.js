import { error } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

const WISHLIST_URL =
	'https://script.google.com/macros/s/AKfycbyh46WN7WBsK9QuSTVNl_8ukrdQ7kipokUZhu-gbh6vhJviYhmomJrZjNYzq3f3x1pl/exec';

/* ---------------- Preview helper ---------------- */

const PREVIEW_CACHE = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

async function fetchPreview(url) {
	const cached = PREVIEW_CACHE.get(url);
	if (cached && Date.now() - cached.time < CACHE_TTL) {
		return cached.data;
	}

	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'KyraWishlistBot/1.0' }
		});

		const html = await res.text();
		const $ = cheerio.load(html);

		const data = {
			url,
			description:
				$('meta[property="og:description"]').attr('content') ||
				$('meta[name="description"]').attr('content') ||
				'',
			image: $('meta[property="og:image"]').attr('content') || null,
			site:
				$('meta[property="og:site_name"]').attr('content') ||
				new URL(url).hostname.replace('www.', '')
		};

		PREVIEW_CACHE.set(url, { time: Date.now(), data });
		return data;
	} catch {
		return {
			url,
			description: '',
			image: null,
			site: new URL(url).hostname.replace('www.', '')
		};
	}
}

/* ---------------- Wishlist parsing ---------------- */

const isUrl = (s) => /^https?:\/\/\S+/i.test(s.trim());

export async function load({ fetch }) {
	try {
		const res = await fetch(WISHLIST_URL);
		const body = await res.text();
		const parsed = JSON.parse(body);

		const content = parsed?.content ?? [];

		const items = [];
		let currentTitle = null;

		for (const block of content) {
			const text = block.text?.trim();
			if (!text) continue;

			if (isUrl(text)) {
				items.push({
					title: currentTitle || new URL(text).hostname.replace('www.', ''),
					url: text
				});
			} else {
				// Non-URL text BEFORE a URL is ALWAYS a title
				currentTitle = text;
			}
		}

		const previews = await Promise.all(
			items.map(async (item) => {
				const preview = await fetchPreview(item.url);

				return {
					title: item.title, // ← SOURCE OF TRUTH
					url: item.url,
					site: preview.site,
					description: preview.description,
					image: preview.image
				};
			})
		);

		return {
			items: previews,
			updated: parsed.updated
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to load wishlist');
	}
}
