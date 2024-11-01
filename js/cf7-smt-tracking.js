(function() {
	// Function to parse URL query parameters
	function getQueryParams() {
		var params = {};
		var qs = window.location.search.substring(1);
		var pairs = qs.split('&');
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split('=');
			params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
		}
		return params;
	}

	// Function to classify referrer
	function classifyReferrer(referrer) {
		var source = '';
		var medium = '';

		if (!referrer || referrer === '') {
			source = '(direct)';
			medium = '(none)';
		} else {
			var refUrl;
			try {
				refUrl = new URL(referrer);
			} catch (e) {
				// Invalid referrer URL
				source = '(direct)';
				medium = '(none)';
				return { source: source, medium: medium };
			}
			
			var refDomain = refUrl.hostname.replace('www.', '').toLowerCase();

			var searchEngines = ['google.com', 'bing.com', 'yahoo.com', 'baidu.com', 'duckduckgo.com', 'yandex.ru', 'ask.com', 'aol.com'];
			var socialMedia = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'pinterest.com', 't.co', 'reddit.com', 'tumblr.com', 'youtube.com', 'snapchat.com', 'tiktok.com', 'whatsapp.com', 'wechat.com', 'messenger.com'];
			 var emailProviders = ['mail.google.com', 'outlook.live.com', 'mail.yahoo.com', 'mail.aol.com', 'mail.ru', 'protonmail.com', 'icloud.com', 'mail.yandex.com', 'gmx.com', 'zoho.com'];

			// Function to check if refDomain ends with any domain in an array
			function matchesDomainList(refDomain, domainList) {
				for (var i = 0; i < domainList.length; i++) {
					if (refDomain === domainList[i] || refDomain.endsWith('.' + domainList[i])) {
						return domainList[i];
					}
				}
				return null;
			}

			var matchedDomain;

			// Detecting the medium based on the referrer domain
			matchedDomain = matchesDomainList(refDomain, searchEngines);
			if (matchedDomain) {
				source = matchedDomain;
				medium = 'organic';
			} else {
				matchedDomain = matchesDomainList(refDomain, socialMedia);
				if (matchedDomain) {
					source = matchedDomain;
					medium = 'social'; // Default to organic social
				} else {
					matchedDomain = matchesDomainList(refDomain, emailProviders);
					if (matchedDomain) {
						source = '(email)';
						medium = 'email';
					} else {
						source = refDomain;
						medium = 'referral';
					}
				}
			}
		}

		return {source: source, medium: medium};
	}

	// Function to get cookie by name
	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
		}
		return null;
	}

	// Function to set cookie
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
	}
	
	function getCurrentDomain() {
		return window.location.hostname.replace('www.', '').toLowerCase();
	}

	// Function to determine source and medium
	function getSourceAndMedium() {
		var params = getQueryParams();
		var source = '';
		var medium = '';

		// 1. Check for UTM parameters
		if (params['utm_source'] && params['utm_medium']) {
			source = params['utm_source'];
			medium = params['utm_medium'];
		}
		// 2. Check for Google Ads gclid parameter (indicates paid search)
		else if (params['gclid']) {
			source = 'google';
			medium = 'cpc (Paid Google)';
		}
		// 3. Check for Facebook Ads fbclid parameter (indicates paid social)
		else if (params['fbclid']) {
			source = 'facebook.com';
			medium = 'paid social';
		}
		// 4. Check for email parameters
		else if (params['utm_medium'] && params['utm_medium'] === 'email') {
			source = params['utm_source'] || '(email)';
			medium = 'email';
		}
		// 5. Use referrer information
		else {
			var referrer = document.referrer;
			var refInfo = classifyReferrer(referrer);
			source = refInfo.source;
			medium = refInfo.medium;

			// Additional logic to distinguish between organic and paid social
			if (medium === 'social' && params['utm_medium']) {
				if (params['utm_medium'] === 'paid social' || params['utm_medium'] === 'cpc') {
					medium = 'paid social';
				}
			}
		}

		return { source: source, medium: medium };
	}

	// Get existing source from cookie
	var source = getCookie('session_source');
	var medium = getCookie('session_medium');
	
	// Get current domain name
	var currentDomain = getCurrentDomain();

	if (!source || !medium || source === currentDomain) {
		var sourceMedium = getSourceAndMedium();
		source = sourceMedium.source;
		medium = sourceMedium.medium;

		// Store in cookies with a 2-day expiration
		setCookie('session_source', source, 2); // 2 days
		setCookie('session_medium', medium, 2); // 2 days
	}

	// Ensure the DOM is fully loaded before executing
	document.addEventListener('DOMContentLoaded', function() {
		// Find all forms with Contact Form 7 class
		var forms = document.querySelectorAll('.wpcf7-form');
		// Existing JavaScript code to determine source and medium

		// Now set the hidden form fields
		forms.forEach(function(form) {
			var sourceField = form.querySelector('input[name="source"]');
			if (sourceField) {
				sourceField.value = source;
			}

			var mediumField = form.querySelector('input[name="medium"]');
			if (mediumField) {
				mediumField.value = medium;
			}
		});
	});
})();