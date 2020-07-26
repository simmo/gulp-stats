import { Gulp } from 'gulp';
import prettyTime from 'pretty-hrtime';
import { Report, HrTime, GulpEvent, Reporter } from './utils/types';
import logReporter from './reporters/log';
import hrToMs from './utils/hrToMs';

type Options = {
	elapseBeforeReport?: number;
	includeBranches?: boolean;
	reporter?: Reporter;
};

export const defaultOptions: Required<Options> = {
	elapseBeforeReport: 300,
	includeBranches: false,
	reporter: logReporter,
};

export default function stats(gulp: Gulp, options: Options = {}): void {
	const { elapseBeforeReport, includeBranches, reporter } = {
		...defaultOptions,
		...options,
	};
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
		if (includeBranches || !isBranch) {
			report.tasks.push({
				name,
				duration: hrToMs(duration),
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
			report.totalTime = hrToMs(totalTime);
			report.totalTimeHr = totalTime;
			report.totalTimePretty = prettyTime(totalTime);

			reportTimeout = setTimeout(reporter, elapseBeforeReport, report);
		}
	});
}
