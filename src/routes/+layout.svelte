<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { browser } from '$app/environment';

	let { children } = $props();

	function getAutoTheme() {
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		if ((month === 11 && day >= 15) || month === 12) return 'christmas';
		if ((month === 4 && day >= 22) || (month === 5 && day <= 30)) return 'birthday';
		return 'default';
	}

	let activeTheme = $state(getAutoTheme());

	function setTheme(theme) {
		activeTheme = theme;
	}

	$effect(() => {
		if (browser) document.body.setAttribute('data-theme', activeTheme);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="themeToggle">
	<button
		class="themeBtn"
		class:active={activeTheme === 'default'}
		onclick={() => setTheme('default')}
		title="Default"
	>
		🌿
	</button>
	<button
		class="themeBtn"
		class:active={activeTheme === 'christmas'}
		onclick={() => setTheme('christmas')}
		title="Christmas"
	>
		🎄
	</button>
	<button
		class="themeBtn"
		class:active={activeTheme === 'birthday'}
		onclick={() => setTheme('birthday')}
		title="Birthday"
	>
		🎂
	</button>
</div>

{#if activeTheme === 'christmas'}
	<div class="snowflakes" aria-hidden="true">
		{#each Array(30) as _, i}
			<div
				class="snowflake"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					5}s; animation-duration: {8 + Math.random() * 10}s;"
			>
				❅
			</div>
		{/each}
	</div>
{/if}

{#if activeTheme === 'birthday'}
	<div class="confetti" aria-hidden="true">
		{#each Array(40) as _, i}
			<div
				class="confettiPiece"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					4}s; animation-duration: {4 + Math.random() * 5}s;"
			></div>
		{/each}
	</div>
{/if}

{@render children()}

<style>
	.themeToggle {
		position: fixed;
		top: 16px;
		right: 16px;
		display: flex;
		gap: 8px;
		z-index: 100;
	}

	.themeBtn {
		width: 44px;
		height: 44px;
		border: 2px solid rgba(97, 84, 115, 0.2);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		cursor: pointer;
		font-size: 20px;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.themeBtn:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.themeBtn.active {
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	/* Christmas Snowflakes */
	.snowflakes {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10;
		overflow: hidden;
	}

	.snowflake {
		position: absolute;
		top: -10%;
		font-size: 24px;
		color: rgba(255, 255, 255, 0.8);
		animation: fall linear infinite;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
	}

	@keyframes fall {
		0% {
			top: -10%;
			opacity: 1;
		}
		100% {
			top: 110%;
			opacity: 0.3;
		}
	}

	.snowflake:nth-child(2n) {
		animation-duration: 12s;
		font-size: 18px;
	}

	.snowflake:nth-child(3n) {
		animation-duration: 15s;
		font-size: 28px;
	}

	.snowflake:nth-child(4n) {
		animation-duration: 18s;
		font-size: 20px;
	}

	/* Birthday Confetti */
	.confetti {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10;
		overflow: hidden;
	}

	.confettiPiece {
		position: absolute;
		top: -10%;
		width: 10px;
		height: 10px;
		background: linear-gradient(45deg, #ff69b4, #87ceeb, #ffd700);
		animation: confettiFall 5s linear infinite;
		border-radius: 2px;
	}

	@keyframes confettiFall {
		0% {
			top: -10%;
			transform: rotate(0deg);
			opacity: 1;
		}
		100% {
			top: 110%;
			transform: rotate(720deg);
			opacity: 0;
		}
	}

	.confettiPiece:nth-child(2n) {
		background: #ff69b4;
		animation-duration: 6s;
	}

	.confettiPiece:nth-child(3n) {
		background: #87ceeb;
		animation-duration: 7s;
	}

	.confettiPiece:nth-child(4n) {
		background: #ffd700;
		animation-duration: 8s;
	}
</style>
