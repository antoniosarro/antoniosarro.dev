import type { Contribution } from '$lib/types/github/contributions';

export function calculateAge(birthDate: Date): number {
	if (!isValidBirthDate(birthDate)) {
		throw new Error('Invalid birth date provided');
	}
	if (isFutureDate(birthDate)) {
		throw new Error('Birth date cannot be in the future');
	}
	return getAgeFromDates(new Date(), birthDate);
}

function isValidBirthDate(date: Date): boolean {
	return date instanceof Date && !isNaN(date.getTime());
}

function isFutureDate(date: Date): boolean {
	return date > new Date();
}

function getAgeFromDates(today: Date, birthDate: Date): number {
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}

export function getGitHubYears(joinYear: number | undefined): number[] {
	if (!joinYear) return [];

	const currentYear = new Date().getFullYear();
	const duration = currentYear - joinYear + 1;
	return Array.from({ length: duration }, (_, i) => currentYear - i);
}

export function getDayOfYear(dateString: string): number {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new Error('Invalid date format');
	}

	const startOfYear = new Date(date.getFullYear(), 0, 1);
	const daysDifference = date.getTime() - startOfYear.getTime();
	return Math.floor(daysDifference / (24 * 60 * 60 * 1000)) + 1;
}

export function parseISO(isoString: string): Date {
	const parts = isoString.split('T');
	if (parts.length !== 2 && parts.length !== 1) {
		throw new Error('Invalid ISO format');
	}

	const [datePart, timePart] = parts;
	const [year, month, day] = datePart.split('-').map(Number);

	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	if (timePart) {
		[hours, minutes, seconds] = timePart.split(':').map(Number);
	}

	if (month < 1 || month > 12) throw new Error('Invalid month');
	if (day < 1 || day > 31) throw new Error('Invalid day');
	if (hours < 0 || hours >= 24) throw new Error('Invalid hour');
	if (minutes < 0 || minutes >= 60) throw new Error('Invalid minute');
	if (seconds < 0 || seconds >= 60) throw new Error('Invalid second');

	return new Date(year, month - 1, day, hours, minutes, seconds);
}

export function getDayOfWeek(date: Date): { name: string; number: number } {
	const daysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	const dayNumber = date.getDay();
	return {
		name: daysOfWeek[dayNumber],
		number: dayNumber
	};
}

export function subtractWeeks(date: Date, numWeeks: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() - numWeeks * 7);
	return result;
}

export function nextDay(date: Date, dayOfWeek: number): Date {
	const currentDay = date.getDay();
	const daysToAdd = (dayOfWeek - currentDay + 7) % 7 || 7;

	const result = new Date(date);
	result.setDate(date.getDate() + daysToAdd);
	return result;
}

export function differenceInCalendarDays(date1: Date, date2: Date): number {
	if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
		throw new Error('Both inputs must be instances of Date');
	}

	const startOfDay1 = new Date(
		date1.getFullYear(),
		date1.getMonth(),
		date1.getDate()
	);
	const startOfDay2 = new Date(
		date2.getFullYear(),
		date2.getMonth(),
		date2.getDate()
	);
	const timeDifference = Math.abs(
		startOfDay1.getTime() - startOfDay2.getTime()
	);

	return timeDifference / (1000 * 60 * 60 * 24);
}

export function getMonth(date: Date): number {
	return date.getMonth();
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	});
}

export function formatDateFull(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
		day: 'numeric'
	});
}

export function generateMockYearlyDates(year: number): Contribution[] {
	const dates: Contribution[] = [];

	for (let month = 1; month <= 12; month++) {
		const daysInMonth = new Date(year, month, 0).getDate();
		for (let day = 1; day <= daysInMonth; day++) {
			dates.push({
				date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
				count: 0,
				level: 0
			});
		}
	}

	return dates;
}
