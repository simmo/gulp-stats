import gulp from 'gulp';
import stats, { defaultOptions } from '.';

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
	test('call reporter when all tasks complete', done => {
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
				expect(reporter.mock.results[0].value.tasks).toHaveLength(4);
				done();
			} catch (error) {
				done(error);
			}
		});

		jest.advanceTimersByTime(1000);
	});
});
