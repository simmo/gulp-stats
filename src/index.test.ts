import gulp from 'gulp';
import stats, { defaultOptions } from '.';
import defaultReporter from './reporters/log';

jest.mock('./reporters/log');

const delay = (fn: () => void, timeout: number) => {
	setTimeout(fn, timeout);
};

function taskA(done: () => void) {
	delay(done, 300);
}

function taskB(done: () => void) {
	delay(done, 100);
}

function taskC(done: () => void) {
	delay(done, 200);
}

function taskD(done: () => void) {
	delay(done, 400);
}

describe('stats', () => {
	test('uses default reporter', done => {
		stats(gulp);

		gulp.series(
			taskA,
			gulp.parallel(taskB, taskC),
			taskD
		)(() => {
			// Ensure the timer for the reporter is run
			jest.advanceTimersByTime(defaultOptions.elapseBeforeReport);

			try {
				expect(defaultReporter).toHaveBeenCalled();
				done();
			} catch (error) {
				done(error);
			}
		});

		jest.advanceTimersByTime(1000);
	});

	test('uses custom reporter', done => {
		const reporter = jest.fn(data => data);

		stats(gulp, { reporter });

		gulp.series(
			taskA,
			gulp.parallel(taskB, taskC),
			taskD
		)(() => {
			// Ensure the timer for the reporter is run
			jest.advanceTimersByTime(defaultOptions.elapseBeforeReport);

			try {
				expect(reporter).toHaveBeenCalled();
				done();
			} catch (error) {
				done(error);
			}
		});

		jest.advanceTimersByTime(1000);
	});

	test('includes branches', done => {
		const reporter = jest.fn(data => data);

		stats(gulp, { includeBranches: true, reporter });

		gulp.series(
			gulp.parallel(gulp.series(taskA, taskB), taskC),
			taskD
		)(() => {
			// Ensure the timer for the reporter is run
			jest.advanceTimersByTime(defaultOptions.elapseBeforeReport);

			try {
				expect(reporter).toHaveBeenCalled();
				expect(reporter.mock.results[0].value.tasks).toHaveLength(6);
				done();
			} catch (error) {
				done(error);
			}
		});

		jest.advanceTimersByTime(1000);
	});

	test('provides custom timeout', done => {
		const elapseBeforeReport = 1000;
		const reporter = jest.fn(data => data);

		stats(gulp, { elapseBeforeReport, reporter });

		gulp.series(
			taskA,
			taskB
		)(() => {
			try {
				expect(reporter).not.toHaveReturned();
				jest.advanceTimersByTime(elapseBeforeReport);
				expect(reporter).toHaveReturned();
				done();
			} catch (error) {
				done(error);
			}
		});

		jest.advanceTimersByTime(400);
	});
});
