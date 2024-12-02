<script lang="ts">
	import Editor, { type BaseBlockProps } from '$lib/components/Blocks/Block/index.svelte';
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface ChartBlockProps extends BaseBlockProps {
		chartOptions: echarts.EChartsOption;
	}

	let { class: className, chartOptions = {} }: ChartBlockProps = $props();

	let chartDiv: HTMLDivElement;
	let chartInstance: echarts.ECharts;
	let selectedChartType = writable<'line' | 'bar' | 'scatter'>('line');
	let xAxisName = writable('X Axis');
	let yAxisName = writable('Y Axis');
	let minRange = writable<number | null>(null);
	let maxRange = writable<number | null>(null);

	onMount(() => {
		if (chartDiv) {
			chartInstance = echarts.init(chartDiv);
			chartInstance.setOption(chartOptions);
		}
	});

	const updateChartType = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		if (target && target.value) {
			const newType = target.value as 'line' | 'bar' | 'scatter';
			selectedChartType.set(newType);
			updateChartOptions();
		}
	};

	const updateChartOptions = () => {
		const options = JSON.parse(JSON.stringify(chartOptions));
		selectedChartType.subscribe((type) => {
			options.series = options.series.map((series: any) => {
				series.type = type;
				return series;
			});
		});
		xAxisName.subscribe((name) => {
			options.xAxis = { ...options.xAxis, name };
		});
		yAxisName.subscribe((name) => {
			options.yAxis = { ...options.yAxis, name };
		});
		minRange.subscribe((min) => {
			options.yAxis = { ...options.yAxis, min };
		});
		maxRange.subscribe((max) => {
			options.yAxis = { ...options.yAxis, max };
		});
		chartOptions = options;
		updateChart();
	};

	const updateChart = () => {
		if (chartInstance) {
			chartInstance.setOption(chartOptions, true);
		}
	};
</script>

<!-- Chart Block rendering area -->
<div class="chart-block">
	<div class="flex items-center gap-4">
		<label for="chartType">Select Chart Type:</label>
		<select id="chartType" onchange={updateChartType}>
			<option value="line">Line</option>
			<option value="bar">Bar</option>
			<option value="scatter">Scatter</option>
		</select>
	</div>
	<div class="flex items-center gap-4">
		<label for="xAxisName">X Axis Name:</label>
		<input
			type="text"
			id="xAxisName"
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				if (target.value) xAxisName.set(target.value);
			}}
		/>
	</div>
	<div class="flex items-center gap-4">
		<label for="yAxisName">Y Axis Name:</label>
		<input
			type="text"
			id="yAxisName"
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				if (target.value) yAxisName.set(target.value);
			}}
		/>
	</div>
	<div class="flex items-center gap-4">
		<label for="minRange">Y Axis Min:</label>
		<input
			type="number"
			id="minRange"
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				if (target.value) minRange.set(Number(target.value));
			}}
		/>
	</div>
	<div class="flex items-center gap-4">
		<label for="maxRange">Y Axis Max:</label>
		<input
			type="number"
			id="maxRange"
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				if (target.value) maxRange.set(Number(target.value));
			}}
		/>
	</div>
	<div bind:this={chartDiv} class="chart-container {className}"></div>
	<button class="update-button" onclick={updateChart}>Update Chart</button>
</div>

<style>
	.chart-block {
		padding: 1em;
	}

	.chart-container {
		width: 150%;
		height: 400px;
	}

	.update-button {
		margin-top: 1em;
		padding: 0.5em 1em;
		background-color: #007acc;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 4px;
	}

	.update-button:hover {
		background-color: #005fa3;
	}
</style>
