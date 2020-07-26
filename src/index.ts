import { Gulp } from 'gulp';
import prettyTime from 'pretty-hrtime';
import { Report, HrTime, GulpEvent, Reporter } from './types';
import logReporter from './reporters/log';

const hrToFloat = ([seconds, nanoseconds]: HrTime) =>
	seconds + nanoseconds / 1e9;

type Options = {
	reporter?: Reporter;
	elapseBeforeReport?: number;
};

export const defaultOptions: Required<Options> = {
	reporter: logReporter,
	elapseBeforeReport: 300,
};

export default function applyStats(gulp: Gulp, options: Options = {}): void {
	const { reporter, elapseBeforeReport } = { ...defaultOptions, ...options };
	const tasksInProgress: { [id: number]: number } = {};
	const report: Report = { tasks: [] };
	let startTime: HrTime;
	let reportTimeout: ReturnType<typeof setTimeout>;

	gulp.on('start', ({ uid }: GulpEvent) => {
		clearTimeout(reportTimeout);

		if (!startTime) {
			startTime = process.hrtime();
		}

		tasksInProgress[uid] = uid;
	});

	gulp.on('stop', ({ uid, name, duration, branch: isBranch }: GulpEvent) => {
		if (!isBranch) {
			report.tasks.push({
				name,
				duration: hrToFloat(duration),
				durationHr: duration,
				durationPretty: prettyTime(duration),
			});
		}

		delete tasksInProgress[uid];

		if (Object.keys(tasksInProgress).length === 0) {
			const totalTime = process.hrtime(startTime);

			report.tasks = report.tasks.sort(
				({ duration: a }, { duration: b }) => b - a
			);
			report.totalTime = hrToFloat(totalTime);
			report.totalTimeHr = totalTime;
			report.totalTimePretty = prettyTime(totalTime);

			reportTimeout = setTimeout(reporter, elapseBeforeReport, report);
		}
	});
}
