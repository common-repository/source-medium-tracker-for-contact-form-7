<?php
/*
	Plugin Name: Source Medium Tracker for Contact Form 7
	Plugin URI: https://socialmind.gr
	Description: Tracks the source and medium of visitors and includes it in Contact Form 7 submissions.
	Version: 1.6
	Author: Angelos Synadakis by Social Mind
	Author URI: https://socialmind.gr/
	License: GPL-2.0+
	License URI: https://www.gnu.org/licenses/gpl-2.0.html
	Requires at least: 5.0
	Tested up to: 6.6
	Requires PHP: 7.0
	Text Domain: source-medium-tracker-for-contact-form-7
	Requires Plugins: contact-form-7
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Hook into 'plugins_loaded' to ensure all plugins are loaded before we check for CF7
add_action( 'plugins_loaded', 'smt_cf7_init' );

function smt_cf7_init() {
    // Check if Contact Form 7 is active
    if ( ! defined( 'WPCF7_VERSION' ) ) {
        add_action( 'admin_notices', 'smt_cf7_cf7_inactive_notice' );
        return;
    }

    // Enqueue the JavaScript file
    add_action('wp_enqueue_scripts', 'smt_cf7_enqueue_scripts');
    function smt_cf7_enqueue_scripts() {
		wp_enqueue_script(
			'cf7-smt-tracking',
			plugin_dir_url(__FILE__) . 'js/cf7-smt-tracking.js',
			array(),
			'1.6',
			true
		);
    }

    // Automatically add hidden fields to all CF7 forms
    add_filter('wpcf7_form_elements', 'smt_cf7_add_hidden_fields');
    function smt_cf7_add_hidden_fields($form) {
        $hidden_fields = '<input type="hidden" name="source" value="Unknown" />' . "\n";
        $hidden_fields .= '<input type="hidden" name="medium" value="Unknown" />' . "\n";
        $form = $form . $hidden_fields;
        return $form;
    }

    // Automatically include source and medium in admin emails
    add_filter('wpcf7_mail_components', 'smt_cf7_add_source_medium_to_email', 10, 3);
    function smt_cf7_add_source_medium_to_email($mail_components, $contact_form, $instance) {
        // Only modify the admin email
        if ( isset( $mail_components['body'] ) && isset( $mail_components['recipient'] ) ) {
            $submission = WPCF7_Submission::get_instance();
            if ( $submission ) {
                $data = $submission->get_posted_data();

                $source = isset( $data['source'] ) ? sanitize_text_field( $data['source'] ) : '(unknown)';
                $medium = isset( $data['medium'] ) ? sanitize_text_field( $data['medium'] ) : '(unknown)';

                // Append source and medium to the email body
                $mail_components['body'] .= "\n\n";
                $mail_components['body'] .= esc_html__( 'User Source: ', 'source-medium-tracker-for-contact-form-7' ) . esc_html( $source ) . "\n";
                $mail_components['body'] .= esc_html__( 'User Medium: ', 'source-medium-tracker-for-contact-form-7' ) . esc_html( $medium ) . "\n";
            }
        }

        return $mail_components;
    }
}

// Display an admin notice if Contact Form 7 is not active
function smt_cf7_cf7_inactive_notice() {
   echo '<div class="notice notice-error"><p>' . esc_html__( 'Source Medium Tracker for Contact Form 7 requires the Contact Form 7 plugin to be installed and active.', 'source-medium-tracker-for-contact-form-7' ) . '</p></div>';
}