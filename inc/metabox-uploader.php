<?php 

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

// metabox creating main class
class Mx_Metaboxes_Uploader_Class
{

	// we will use jQuery
	// So we have to register scripts

	public static function register_scrips()
	{
		add_action( 'admin_enqueue_scripts', ['Mx_Metaboxes_Uploader_Class', 'upload_image_scrips'] );
	}

		public static function upload_image_scrips()
		{

			wp_enqueue_media();

			wp_enqueue_script( 'mx-image-upload', MX_METABOXEX_URL_TO_FOLDER . '/js/uploader.js', array( 'jquery' ), time(), true );

		}

}
