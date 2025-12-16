<script>
	export let data;

	// FIXES "items is not defined"
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
				<p class="sub">Last updated: {new Date(data.updated).toLocaleString()}</p>
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
					<div class="cardTop">
						<h2>{item.title}</h2>
						<span class="pill">{host(item.url)}</span>
					</div>
					<p class="url">{item.url}</p>
				</a>
			{/each}
		</section>
	{:else}
		<p class="empty">No wishlist items found.</p>
	{/if}
</main>

<style>
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

	.header {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 20px;
		padding-bottom: 18px;
		border-bottom: 2px solid rgba(97, 84, 115, 0.1);
		position: relative;
	}

	.header::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(97, 84, 115, 0.15) 20%,
			rgba(97, 84, 115, 0.15) 80%,
			transparent
		);
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
		font-weight: 400;
	}

	@media (min-width: 640px) {
		.sub {
			margin: 8px 0 0;
			font-size: 14px;
		}
	}

	.search {
		width: 100%;
		padding: 11px 13px;
		border-radius: 8px;
		border: 1.5px solid rgba(97, 84, 115, 0.2);
		outline: none;
		background: #ffffff;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.05),
			0 2px 8px rgba(97, 84, 115, 0.06);
		transition: all 0.2s ease;
		font-size: 15px;
	}

	@media (min-width: 640px) {
		.search {
			padding: 12px 14px;
			font-size: 16px;
		}
	}

	.search:focus {
		border-color: var(--accent);
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.05),
			0 0 0 3px rgba(198, 230, 252, 0.4),
			0 4px 12px rgba(97, 84, 115, 0.12);
	}

	.error {
		padding: 12px 14px;
		border-radius: 8px;
		background: rgba(255, 168, 182, 0.12);
		border: 1.5px solid rgba(255, 168, 182, 0.3);
		margin: 12px 0 20px;
		color: var(--text);
		box-shadow: 0 2px 8px rgba(255, 168, 182, 0.1);
		font-size: 14px;
	}

	@media (min-width: 640px) {
		.error {
			padding: 14px 16px;
			margin: 12px 0 24px;
		}
	}

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

	.card {
		display: block;
		padding: 16px 16px 14px;
		border-radius: 6px;
		border: 1.5px solid rgba(97, 84, 115, 0.18);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
		background: #ffffff;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.06),
			0 2px 8px rgba(97, 84, 115, 0.08);
		position: relative;
		min-width: 0;
	}

	@media (min-width: 640px) {
		.card {
			padding: 18px 18px 16px;
		}
	}

	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 6px;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(218, 243, 201, 0.03) 2px,
			rgba(218, 243, 201, 0.03) 4px
		);
		pointer-events: none;
	}

	@media (hover: hover) {
		.card:hover {
			transform: translateY(-3px) rotate(-0.3deg);
			box-shadow:
				0 2px 4px rgba(0, 0, 0, 0.08),
				0 8px 24px rgba(97, 84, 115, 0.14),
				0 16px 40px rgba(97, 84, 115, 0.08);
			border-color: rgba(97, 84, 115, 0.28);
		}
	}

	.cardTop {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 2px;
		min-width: 0;
	}

	h2 {
		margin: 0;
		font-size: 16px;
		line-height: 1.3;
		font-weight: 600;
		color: var(--text);
		overflow-wrap: break-word;
		word-break: break-word;
		min-width: 0;
		flex: 1;
	}

	@media (min-width: 640px) {
		h2 {
			font-size: 17px;
		}
	}

	.pill {
		font-size: 11px;
		color: var(--accent);
		border: 1px solid rgba(97, 84, 115, 0.2);
		padding: 5px 8px;
		border-radius: 4px;
		white-space: nowrap;
		background: rgba(198, 230, 252, 0.15);
		font-weight: 500;
		letter-spacing: 0.01em;
		flex-shrink: 0;
	}

	@media (min-width: 640px) {
		.pill {
			padding: 5px 9px;
		}
	}

	.url {
		margin: 10px 0 0;
		font-size: 12px;
		color: var(--muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 400;
		min-width: 0;
	}

	@media (min-width: 640px) {
		.url {
			font-size: 13px;
		}
	}

	.empty {
		color: var(--muted);
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
	}

	@media (min-width: 640px) {
		.empty {
			margin-top: 24px;
			font-size: 15px;
		}
	}
</style>
