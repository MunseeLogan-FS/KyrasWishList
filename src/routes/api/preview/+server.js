import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

const PREVIEW_CACHE = new Map();
const CACHE_TTL = 1000 * 60 * 30;

async function fetchPreview(url) {
	const cached = PREVIEW_CACHE.get(url);
	if (cached && Date.now() - cached.time < CACHE_TTL) {
		return cached.data;
	}

	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'KyraWishlistBot/1.0' },
			signal: AbortSignal.timeout(5000)
		});

		const html = await res.text();
		const $ = cheerio.load(html);

		const data = {
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
			description: '',
			image: null,
			site: new URL(url).hostname.replace('www.', '')
		};
	}
}

export async function GET({ url }) {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'Missing url parameter' }, { status: 400 });
	}

	const preview = await fetchPreview(targetUrl);
	return json(preview);
}
