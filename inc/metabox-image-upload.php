<?php 

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

// metabox creating main class
class Mx_Metaboxes_Image_Upload_Class
{

	// we will use jQuery
	// So we have to register scripts

	public static function register_scrips()
	{
		add_action( 'admin_enqueue_scripts', ['Mx_Metaboxes_Image_Upload_Class', 'upload_image_scrips'] );
	}

		public static function upload_image_scrips()
		{

			wp_enqueue_script( 'mx-image-upload', get_bloginfo( 'template_url' ) . '/mx-metabox/js/image-upload.js', array( 'jquery' ), time(), true );

		}

}
