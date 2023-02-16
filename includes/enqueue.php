<?php

// Enqueue the child stylesheets
function enqueue_styles() {
	if (!is_admin()) :
        $url = get_template_directory() . '/build/manifest.json';
        $assetstr = file_get_contents($url);
		$assets = json_decode($assetstr, true);
		$assets     = array(
			'css' => '/build/css/styles.min.css' . '?' . $assets['build/css/styles.min.css']['hash'],
        );
        
        wp_register_style( 'parent-theme', get_template_directory_uri() . $assets['css'], array(), '', 'all' );
        wp_enqueue_style( 'parent-theme' );

        $url = get_stylesheet_directory() . '/build/manifest.json';

        $child_manifest = file_get_contents($url);
        $ch_assets = json_decode($child_manifest, true);
        $ch_assets  = array(
			'css' => '/build/css/styles.min.css' . '?' . $ch_assets['build/css/styles.min.css']['hash'],
        );

        wp_enqueue_style('child-theme', get_stylesheet_directory_uri() . $ch_assets['css'], array(), '', 'all');
        
        // Linkedin inline script
        wp_register_script( 'tf--linkedin--p1', get_stylesheet_directory_uri() . '/build/js/tf--linkedin--p1.js' );
        wp_register_script( 'tf--linkedin--p2', get_stylesheet_directory_uri() . '/build/js/tf--linkedin--p2.js' );
        wp_enqueue_script( 'tf--linkedin--p1' );
        wp_enqueue_script( 'tf--linkedin--p2' );
        
    endif;
	
}
add_action('wp_enqueue_scripts', 'enqueue_styles');

/**
 * @summary         filters an enqueued script tag and adds a noscript element after it
 * 
 * @description     filters an enqueued script tag (identified by the $handle variable) and
 *                  adds a noscript element after it. If there is also an inline script enqueued
 *                  after $handled, adds the noscript element after it.
 * 
 * @src             https://wp-qa.com/does-wordpress-wp_enqueue_style-support-noscript
 * 
 * @access    public
 * @param     string    $tag       The tag string sent by `script_loader_tag` filter on WP_Scripts::do_item
 * @param     string    $handle    The script handle as sent by `script_loader_tag` filter on WP_Scripts::do_item
 * @param     string    $src       The script src as sent by `script_loader_tag` filter on WP_Scripts::do_item
 * @return    string    $tag       The filter $tag variable with the noscript element
 */
function add_noscript_filter($tag, $handle, $src){
    // as this filter will run for every enqueued script
    // we need to check if the handle is equals the script
    // we want to filter. If yes, than adds the noscript element

    if ( 'tf--linkedin--p2' === $handle ){
        $noscript = '<noscript>';
        // you could get the inner content from other function
        $noscript .= '<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=4290977&fmt=gif" />';
        $noscript .= '</noscript>';
        $tag = $tag . $noscript;
    }
        return $tag;
}
// adds the add_noscript_filter function to the script_loader_tag filters
// it must use 3 as the last parameter to make $tag, $handle, $src available
// to the filter function
add_filter('script_loader_tag', 'add_noscript_filter', 10, 3);