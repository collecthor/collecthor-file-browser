<script lang="ts">
	interface Props {
		size: number | null;
	}

	let { size }: Props = $props();
	const suffixes = [
		{ label: 'B', fractionDigits: 0 },
		{ label: 'KB', fractionDigits: 0 },
		{ label: 'MB', fractionDigits: 2 },
		{ label: 'GB', fractionDigits: 2 },
		{ label: 'TB', fractionDigits: 2 }
	];

	function format(size: number | null): string {
		if (size === null) {
			return '';
		}

		let formattedSize = size;
		for (const suffix of suffixes) {
			if (formattedSize < 1000) {
				return `${formattedSize.toFixed(suffix.fractionDigits)} ${suffix.label}`;
			} else {
				formattedSize = formattedSize / 1000;
			}
		}
		return `${size.toFixed(2)} PB`;
	}
</script>

<span>
	{format(size)}
</span>
