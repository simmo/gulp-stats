import hrToMs from './hrToMs';

describe('hrToMs', () => {
	test('converts precision time to milliseconds', () => {
		expect(hrToMs([1, 300000000])).toBe(1.3);
	});
});
