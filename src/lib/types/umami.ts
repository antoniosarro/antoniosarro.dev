/**
 * Configuration for the Umami Tracker
 * @property data-host-url - By default, Umami will send data to wherever the script is located. You can override this to send data to another location.
 * @property data-tag - The custom tag you want tu use for page view tracking
 * @property data-auto-track - By default, Umami tracks all page views and events for you automatically. You can disable this behavior and track events yourself using the tracker functions.
 * @property data-exclude-search - Exclude query parameters from tracking
 * @property data-domains - If you want the tracker to only run on specific domains, you can add them to your tracker script. This is a comma delimited list of domain names. Helps if you are working in a staging/development environment.
 * @property data-cache - If you get a lot of page views from the same user, for example in a forum website, you can cache some data to improve the performance of the tracking script. Note: This will use session storage so you may need to inform your users.
 */
export interface UmamiTrackerConfiguration {
	'data-host-url'?: string;
	'data-tag'?: string;
	'data-auto-track'?: boolean;
	'data-exclude-search'?: boolean;
	'data-domains'?: string;
	'data-cache'?: boolean;
}

export interface WindowWithUmami extends Window {
	umami: unknown | undefined;
}
