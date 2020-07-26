import { HrTime } from '../types';

export default ([seconds, nanoseconds]: HrTime): number =>
	seconds + nanoseconds / 1e9;
