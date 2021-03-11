<?php 

// D:\OSPanel\domains\mx-metaboxes.local/wp-content/themes/twentytwentyone/mx-metaboxes
if ( ! defined( 'MX_METABOXEX_PATH_TO_FOLDER' ) ) {

	define( 'MX_METABOXEX_PATH_TO_FOLDER', get_template_directory() . '/mx-metaboxes' );

}

// http://mx-metaboxes.local/wp-content/themes/twentytwentyone/mx-metaboxes
if ( ! defined( 'MX_METABOXEX_URL_TO_FOLDER' ) ) {

	define( 'MX_METABOXEX_URL_TO_FOLDER', get_template_directory_uri() . '/mx-metaboxes' );

}

require MX_METABOXEX_PATH_TO_FOLDER . '/inc/metabox.php';

require MX_METABOXEX_PATH_TO_FOLDER . '/inc/metabox-uploader.php';

Mx_Metaboxes_Uploader_Class::register_scrips();

// add text input
new Mx_Metaboxes_Class(
	[
		'id'			=> 'text-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Text field', 'mx-domain' ),
		'default' 		=> 'News & Media'
	]
);

// add email input
new Mx_Metaboxes_Class(
	[
		'id'			=> 'email-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'E-mail field', 'mx-domain' ),
		'metabox_type'	=> 'input-email'
	]
);

// add url input
new Mx_Metaboxes_Class(
	[
		'id'			=> 'url-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'URL field', 'mx-domain' ),
		'metabox_type'	=> 'input-url'
	]
);

// description
new Mx_Metaboxes_Class(
	[
		'id'			=> 'desc-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Some Description', 'mx-domain' ),
		'metabox_type'	=> 'textarea'
	]
);

// add checkboxes
new Mx_Metaboxes_Class(
	[
		'id'			=> 'checkboxes-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Checkbox Buttons', 'mx-domain' ),
		'metabox_type'	=> 'checkbox',
		'options' 		=> [
			[
				'value' => 'Dog',
				'checked' 	=> true
			],
			[
				'value' 	=> 'Cat'
			],
			[
				'value' 	=> 'Fish'
			]		
		]
	]
);

// add radio buttons
new Mx_Metaboxes_Class(
	[
		'id'			=> 'radio-buttons-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Radio Buttons', 'mx-domain' ),
		'metabox_type'	=> 'radio',
		'options' 		=> [
			[
				'value' => 'red'
			],
			[
				'value' => 'green'
			],
			[
				'value' 	=> 'Yellow',
				'checked' 	=> true
			]		
		]
	]
);

// image upload
new Mx_Metaboxes_Class(
	[
		'id'			=> 'featured-image-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Featured image', 'mx-domain' ),
		'metabox_type'	=> 'image'
	]
);

// video upload
new Mx_Metaboxes_Class(
	[
		'id'			=> 'featured-video-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Video Upload', 'mx-domain' ),
		'metabox_type'	=> 'video',
		'context' 		=> 'side',
		'priority' 		=> 'low'
	]
);

// save HTML
new Mx_Metaboxes_Class(
	[
		'id'			=> 'some-html-to-save',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Save HTML', 'mx-domain' ),
		'metabox_type'	=> 'html'
	]
);

// Document upload
new Mx_Metaboxes_Class(
	[
		'id'			=> 'featured-document-metabox',
		'post_types' 	=> 'documents',
		'name'			=> esc_html( 'Document Upload', 'mx-domain' ),
		'metabox_type'	=> 'document'
	]
);

/**
* multibox
*/
require MX_METABOXEX_PATH_TO_FOLDER . '/inc/multibox.php';

	$multibox = new Mx_Multibox_Class(
		[
			'id'			=> 'text-metabox-multibox',
			'post_types' 	=> 'post',
			'name'			=> esc_html( 'MultiBox', 'mx-domain' ),
			'blocks' 		=> [

				// block 1
				'block_1' 		=> [
					[ 'section_name' => 'Some section' ],
					[
						'type' => 'input-text',
						'label' => esc_html( 'Enter Title', 'mx-domain' ),
					],
					[
						'type' => 'textarea',
						'label' => esc_html( 'Enter the text', 'mx-domain' ),
					]
				],

				// block 2
				'block_2' 		=> [
					[ 'section_name' => 'Some section 2' ],
					[
						'type' => 'input-text',
						'label' => esc_html( 'Enter Title 2', 'mx-domain' ),
					]
				]

			]
			
		]
	);

	$multibox->register_scrips();

	$multibox->ajax_multibox();