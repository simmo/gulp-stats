import log from './log';
import stripAnsi from 'strip-ansi';

const logSpy = jest.spyOn(console, 'log').mockImplementation(data => data);

describe('Log reporter', () => {
	beforeEach(() => {
		logSpy.mockClear();
	});

	test('formats and logs the report', () => {
		log({
			tasks: [
				{
					name: 'taskD',
					duration: 0.4,
					durationHr: [0, 400000000],
					durationPretty: '400 ms',
					isBranch: false,
					isRoot: false,
				},
				{
					name: 'taskA',
					duration: 0.3,
					durationHr: [0, 300000000],
					durationPretty: '300 ms',
					isBranch: false,
					isRoot: false,
				},
				{
					name: 'taskC',
					duration: 0.2,
					durationHr: [0, 200000000],
					durationPretty: '200 ms',
					isBranch: false,
					isRoot: false,
				},
				{
					name: 'taskB',
					duration: 0.1,
					durationHr: [0, 100000000],
					durationPretty: '100 ms',
					isBranch: false,
					isRoot: false,
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

	test('use singular when 1 task', () => {
		log({
			tasks: [
				{
					name: 'taskD',
					duration: 0.4,
					durationHr: [0, 400000000],
					durationPretty: '400 ms',
					isBranch: false,
					isRoot: false,
				},
			],
			totalTime: 0.4,
			totalTimeHr: [0, 400000000],
			totalTimePretty: '400 ms',
		});

		expect(stripAnsi(logSpy.mock.results[0].value)).toContain('ran 1 task');
	});

	test('uses plural when 2 or more tasks', () => {
		log({
			tasks: [
				{
					name: 'taskD',
					duration: 0.4,
					durationHr: [0, 400000000],
					durationPretty: '400 ms',
					isBranch: false,
					isRoot: false,
				},
				{
					name: 'taskA',
					duration: 0.3,
					durationHr: [0, 300000000],
					durationPretty: '300 ms',
					isBranch: false,
					isRoot: false,
				},
			],
			totalTime: 0.7,
			totalTimeHr: [0, 700000000],
			totalTimePretty: '700 ms',
		});

		expect(stripAnsi(logSpy.mock.results[0].value)).toContain('ran 2 tasks ');
	});

	test('returns different messaging when no tasks provided', () => {
		log({
			tasks: [],
			totalTime: 0,
			totalTimeHr: [0, 0],
			totalTimePretty: '0 ms',
		});

		expect(logSpy.mock.results[0].value).toBe(`
Gulp ran [36m[1mno tasks[22m[39m in [36m[1m0 ms[22m[39m
`);
	});
});
