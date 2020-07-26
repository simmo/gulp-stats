import log from './log';

const logSpy = jest.spyOn(console, 'log').mockImplementation(data => data);

describe('Log reporter', () => {
	test('formats and logs the report', () => {
		log({
			tasks: [
				{
					name: 'taskD',
					duration: 0.4,
					durationHr: [0, 400000000],
					durationPretty: '400 ms',
				},
				{
					name: 'taskA',
					duration: 0.3,
					durationHr: [0, 300000000],
					durationPretty: '300 ms',
				},
				{
					name: 'taskC',
					duration: 0.2,
					durationHr: [0, 200000000],
					durationPretty: '200 ms',
				},
				{
					name: 'taskB',
					duration: 0.1,
					durationHr: [0, 100000000],
					durationPretty: '100 ms',
				},
			],
			totalTime: 0.9,
			totalTimeHr: [0, 900000000],
			totalTimePretty: '900 ms',
		});

		expect(logSpy).toHaveReturnedWith(`
Gulp ran [36m[1m4 tasks[22m[39m in [36m[1m900 ms[22m[39m

[1m[4mTask[24m[22m     [1m[4mTime[24m[22m  [1m[4m% of total[24m[22m
taskD  [36m400 ms[39m         [35m44%[39m
taskA  [36m300 ms[39m         [35m33%[39m
taskC  [36m200 ms[39m         [35m22%[39m
taskB  [36m100 ms[39m         [35m11%[39m
`);
	});
});
