=== Source Medium Tracker for Contact Form 7 ===
Contributors: asynadak
Tags: contact form 7, tracking, source, medium, utm
Requires at least: 5.0
Tested up to: 6.6
Requires PHP: 7.0
Stable tag: 1.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Tracks the source and medium of visitors and includes this information in Contact Form 7 submissions.

== Description ==

Contact Form 7 Source Medium Tracker is a plugin that captures the source and medium of your website visitors and includes this information in the submissions made via Contact Form 7 forms. This allows you to track where your leads are coming from, enhancing your marketing analytics.

**Features:**

- Tracks UTM parameters, referrers, and other indicators to determine the source and medium.
- Works seamlessly with Contact Form 7 forms.
- Automatically includes the source and medium in admin emails without manual configuration.
- Supports tracking for organic, paid, social media, email, and more.

== Installation ==

1. Upload the `cf7-source-medium-tracker` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. No further configuration is needed. The plugin works automatically with your Contact Form 7 forms.

== Frequently Asked Questions ==

= Do I need to modify my Contact Form 7 forms? =

No, the plugin automatically adds the necessary hidden fields to your forms and includes the tracking information in admin emails.

= Does this plugin comply with GDPR and other privacy laws? =

While the plugin collects minimal data (source and medium), it's essential to inform your users about any tracking and obtain consent if required. Please update your privacy policy accordingly.


== Changelog ==

= 1.6 =
* Improved social media tracking.
* Minor bug fixes.

= 1.5 =
* Enqueue tracking script on all pages to ensure accurate source tracking.

= 1.4 =
* Fixed issue with hidden fields not being populated correctly.

= 1.3 =
* Adjusted plugin initialization to prevent false inactive notices.

= 1.2 =
* Automatically include source and medium in admin emails.

= 1.1 =
* Improved handling to exclude the website's own domain dynamically.

= 1.0 =
* Initial release.

== Upgrade Notice ==

= 1.5 =
Please update to ensure the plugin tracks the source and medium on the homepage and landing pages.

== License ==

This program is free software licensed under the GNU GPL version 2 or later.

== Privacy Policy ==

This plugin collects the source and medium of visitors when they submit a form via Contact Form 7. This information is included in the admin emails and is not stored in the database. Site owners should update their privacy policies to inform users about this data collection.