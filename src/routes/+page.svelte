<script>
	export let data;

	let query = '';

	$: items = data?.items ?? [];
	$: filtered = items.filter((i) =>
		(i.title + ' ' + i.url).toLowerCase().includes(query.trim().toLowerCase())
	);

	const host = (url) => {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return '';
		}
	};
</script>

<svelte:head>
	<title>Kyra’s Wishlist</title>
	<meta name="description" content="Kyra’s wishlist pulled from a Google Doc." />
</svelte:head>

<main class="wrap">
	<header class="header">
		<div>
			<h1>Kyra’s Wishlist</h1>
			{#if data.updated}
				<p class="sub">
					Last updated: {new Date(data.updated).toLocaleString()}
				</p>
			{/if}
		</div>

		<input
			class="search"
			placeholder="Search items…"
			bind:value={query}
			aria-label="Search wishlist"
		/>
	</header>

	{#if data.error}
		<p class="error">{data.error}</p>
	{/if}

	{#if filtered.length}
		<section class="grid">
			{#each filtered as item (item.url)}
				<a class="card" href={item.url} target="_blank" rel="noreferrer">
					<div class="preview">
						{#if item.image}
							<img class="previewImg" src={item.image} alt="" loading="lazy" />
						{:else}
							<div class="previewPlaceholder">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<path d="M21 15l-5-5L5 21" />
								</svg>
							</div>
						{/if}
					</div>

					<div class="cardContent">
						<div class="cardTop">
							<h2>{item.title}</h2>
							<span class="pill">
								{item.site ?? host(item.url)}
							</span>
						</div>

						{#if item.note}
							<p class="note">{item.note}</p>
						{/if}

						{#if item.description}
							<p class="desc">{item.description}</p>
						{/if}

						<p class="url">{item.url}</p>
					</div>
				</a>
			{/each}
		</section>
	{:else}
		<p class="empty">No wishlist items found.</p>
	{/if}
</main>

<style>
	.note {
		margin: 6px 0 0;
		font-size: 14px;
		line-height: 1.45;
		color: var(--text);
		font-weight: 400;
		position: relative;
		padding-left: 12px;
	}

	.note::before {
		content: '✎';
		position: absolute;
		left: 0;
		top: 0;
		font-size: 12px;
		opacity: 0.5;
	}

	.wrap {
		max-width: 980px;
		margin: 0 auto;
		padding: 20px 12px 48px;
		color: var(--text);
	}

	@media (min-width: 640px) {
		.wrap {
			padding: 32px 18px 64px;
		}
	}

	/* ---------- Header ---------- */

	.header {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 20px;
		padding-bottom: 18px;
		border-bottom: 2px solid #c6e6fc;
		position: relative;
	}

	@media (min-width: 720px) {
		.header {
			display: grid;
			grid-template-columns: 1fr 320px;
			gap: 12px;
			align-items: end;
			margin-bottom: 24px;
			padding-bottom: 20px;
		}
	}

	h1 {
		margin: 0;
		font-size: 26px;
		letter-spacing: -0.02em;
		color: var(--accent);
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(97, 84, 115, 0.08);
	}

	@media (min-width: 640px) {
		h1 {
			font-size: 32px;
		}
	}

	.sub {
		margin: 6px 0 0;
		color: var(--muted);
		font-size: 13px;
	}

	@media (min-width: 640px) {
		.sub {
			font-size: 14px;
		}
	}

	.search {
		width: 100%;
		padding: 11px 13px;
		border-radius: 8px;
		border: 1.5px solid #c6e6fc;
		background: #ffffff;
		box-shadow: 0 2px 6px rgba(198, 230, 252, 0.2);
		font-size: 15px;
	}

	.search:focus {
		outline: none;
		border-color: #615473;
		box-shadow: 0 0 0 3px rgba(198, 230, 252, 0.5);
	}

	/* ---------- Grid ---------- */

	.grid {
		display: grid;
		gap: 14px;
		grid-template-columns: 1fr;
	}

	@media (min-width: 720px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 16px;
		}
	}

	/* ---------- Cards ---------- */

	.card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 14px;
		padding: 16px;
		border-radius: 8px;
		border: 1.5px solid #c6e6fc;
		background: #ffffff;
		color: inherit;
		text-decoration: none;
		box-shadow: 0 2px 8px rgba(198, 230, 252, 0.25);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
	}

	@media (hover: hover) {
		.card:hover {
			transform: translateY(-3px) rotate(-0.3deg);
			box-shadow: 0 8px 20px rgba(97, 84, 115, 0.15);
			border-color: #ffa8b6;
		}
	}

	.preview {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.previewImg {
		width: 72px;
		height: 72px;
		border-radius: 6px;
		object-fit: cover;
		background: #f2f2f2;
		box-shadow:
			inset 0 0 0 1px rgba(97, 84, 115, 0.08),
			0 2px 6px rgba(0, 0, 0, 0.08);
	}

	@media (min-width: 640px) {
		.previewImg {
			width: 84px;
			height: 84px;
		}
	}

	.previewPlaceholder {
		width: 72px;
		height: 72px;
		border-radius: 6px;
		background: linear-gradient(135deg, rgba(218, 243, 201, 0.2), rgba(198, 230, 252, 0.2));
		border: 1.5px dashed rgba(97, 84, 115, 0.16);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(97, 84, 115, 0.4);
		flex-shrink: 0;
	}

	@media (min-width: 640px) {
		.previewPlaceholder {
			width: 84px;
			height: 84px;
		}
	}

	.previewPlaceholder svg {
		width: 32px;
		height: 32px;
	}

	.cardContent {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.cardTop {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
	}

	h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.3;
		min-width: 0;
		word-break: break-word;
	}

	.pill {
		font-size: 11px;
		padding: 5px 8px;
		border-radius: 4px;
		border: 1px solid #c6e6fc;
		background: #c6e6fc;
		color: #615473;
		white-space: nowrap;
		flex-shrink: 0;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 500;
	}

	.desc {
		margin: 6px 0 0;
		font-size: 13px;
		line-height: 1.4;
		color: var(--muted);
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex-grow: 1;
	}

	.url {
		margin: 10px 0 0;
		font-size: 12px;
		color: var(--muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.empty {
		text-align: center;
		color: var(--muted);
		margin-top: 24px;
	}
</style>
