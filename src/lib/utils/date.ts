/**
 * Calculates the age of a person based on their birth date.
 *
 * @param {Date} birthDate - The birth date of the person to calculate the age for.
 * @returns {number} The age of the person in years.
 * @throws {Error} if the birth date is invalid or in the future.
 */
export function calculateAge(birthDate: Date): number {
	if (!isValidBirthDate(birthDate)) {
		throw new Error('Invalid birth date provided');
	}
	if (isFutureDate(birthDate)) {
		throw new Error('Birth date cannot be in the future');
	}
	return getAgeFromDates(new Date(), birthDate);
}

/**
 * Validates if a given date is a valid birth date.
 *
 * @param {Date} date - The date to validate as a birth date.
 * @returns {boolean} true if the date is a valid birth date, false otherwise.
 */
function isValidBirthDate(date: Date): boolean {
	return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates if a given date is in the future.
 *
 * @param {Date} date - The date to validate as being in the future.
 * @returns {boolean} true if the date is in the future, false otherwise.
 */
function isFutureDate(date: Date): boolean {
	return date > new Date();
}

/**
 * Calculates the age of a person based on their birth date and today's date.
 *
 * @param {Date} today - The current date.
 * @param {Date} birthDate - The birth date of the person to calculate the age for.
 * @returns {number} The age of the person in years.
 */
function getAgeFromDates(today: Date, birthDate: Date): number {
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

/**
 * Returns an array of years starting from the join year to the current year.
 *
 * @param {number | undefined} joinYear - The year the person joined.
 * @returns {number[]} An array of years.
 */
export function getGitHubYears(joinYear: number | undefined): number[] {
	if (!joinYear) return [];

	const currentYear = new Date().getFullYear();
	const duration = currentYear - joinYear + 1;
	return Array.from({ length: duration }, (_, i) => currentYear - i);
}

/**
 * Returns the day of the year for a given date string.
 *
 * @param {string} dateString - The date string in 'YYYY-MM-DD' format.
 * @returns {number} The day of the year.
 * @throws {Error} if the date string is invalid.
 */
export function getDayOfYear(dateString: string): number {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new Error('Invalid date format');
	}

	const startOfTheYear = new Date(date.getFullYear(), 0, 1);
	return Math.floor((date.getTime() - startOfTheYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

/**
 * Parses an ISO date string and returns a Date object.
 *
 * @param {string} isoString - The ISO date string to parse.
 * @returns {Date} The parsed Date object.
 * @throws {Error} if the ISO string is invalid.
 */
export function parseISO(isoString: string): Date {
	const parts = isoString.split('T');
	if (parts.length !== 2 && parts.length !== 1) {
		throw new Error('Invalid ISO format');
	}

	const [datePart, timePart] = parts;
	const dateParts = datePart.split('-').map(Number);

	let hours = 0,
		minutes = 0,
		seconds = 0;

	if (parts.length === 2) {
		const timeParts = timePart.split(':').map(Number);
		[hours, minutes, seconds] = timeParts;
	}

	const [year, month, day] = dateParts;

	if (month < 1 || month > 12) {
		throw new Error('Invalid month');
	}
	if (day < 1 || day > 31) {
		throw new Error('Invalid day');
	}
	if (hours < 0 || hours >= 24) {
		throw new Error('Invalid hour');
	}
	if (minutes < 0 || minutes >= 60) {
		throw new Error('Invalid minute');
	}
	if (seconds < 0 || seconds >= 60) {
		throw new Error('Invalid second');
	}

	return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Returns the name and number of the day of the week for a given date.
 *
 * @param {Date} date - The date to get the day of the week for.
 * @returns {{ name: string; number: number }} An object containing the day's name and number.
 */
export function getDayOfWeek(date: Date): { name: string; number: number } {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dayNumber = date.getDay();
	return {
		name: daysOfWeek[dayNumber],
		number: dayNumber
	};
}

/**
 * Subtracts a specified number of weeks from a given date.
 *
 * @param {Date} date - The original date.
 * @param {number} numWeeks - The number of weeks to subtract.
 * @returns {Date} The new date after subtracting the weeks.
 */
export function subtractWeeks(date: Date, numWeeks: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() - numWeeks * 7);
	return result;
}

/**
 * Returns the next occurrence of a specified day of the week from a given date.
 *
 * @param {Date} date - The original date.
 * @param {number} dayOfWeek - The target day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 * @returns {Date} The next occurrence of the specified day of the week.
 */
export function nextDay(date: Date, dayOfWeek: number): Date {
	const currentDay = date.getDay();
	let daysToAdd = (dayOfWeek - currentDay + 7) % 7;

	if (daysToAdd === 0) {
		daysToAdd = 7;
	}

	const resultDate = new Date(date);
	resultDate.setDate(date.getDate() + daysToAdd);

	return resultDate;
}

/**
 * Calculates the difference in calendar days between two dates.
 *
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {number} The difference in calendar days.
 * @throws {Error} if either input is not a valid Date object.
 */
export function differenceInCalendarDays(date1: Date, date2: Date): number {
	if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
		throw new Error('Both inputs must be instances of Date');
	}

	const startOfDay1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const startOfDay2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

	const timeDifference = Math.abs(startOfDay1.getTime() - startOfDay2.getTime()) as number;
	const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

	return dayDifference;
}

/**
 * Returns the month of a given date.
 *
 * @param {Date} date - The date to get the month for.
 * @returns {number} The zero-based month number (0 = January, 1 = February, ..., 11 = December).
 */
export function getMonth(date: Date): number {
	return date.getMonth();
}
