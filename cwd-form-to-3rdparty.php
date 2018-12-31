<?php
/*
Plugin Name: CWD Form to 3rd party
Description: Provides connection between insurance quote form and 
*/

// also uses code from https://gist.github.com/gmazzap/1efe17a8cb573e19c086
// https://wordpress.stackexchange.com/questions/162240/custom-pages-with-plugin
// for including pages with the plugin

// Ensure PHP execution is only allowed when it is included as part of the core system
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * CWD 10-4-2018
 * Programmer: Tim McDonald
 * enqueue script handle form events in contact form iframe
 */
function my_javascripts() {
    wp_enqueue_script('cwd-form-phone-connect',
                      plugin_dir_url(__FILE__) . 'public/js/scratch.js',
                      array('jquery'),
                      'scriptversion 0.1',
                      true);

    wp_localize_script('cwd-form-phone-connect', 'cwd_wp', array(
        'ajax_url' => admin_url('admin-ajax.php')
    ));

    wp_enqueue_script('jquery_mask',
                      plugin_dir_url(__FILE__) . 'public/js/jquery.mask.min.js',
                      array('jquery'),
                      'scriptversion 0.1',
                      true);
}

add_action('wp_enqueue_scripts', 'my_javascripts');

