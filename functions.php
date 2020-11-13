<?php 

require get_template_directory() . '/mx-metabox/inc/metabox.php';

require get_template_directory() . '/mx-metabox/inc/metabox-image-upload.php';

Mx_Metaboxes_Image_Upload_Class::register_scrips();

// add text input
new Mx_Metaboxes_Class(
	[
		'id'			=> 'text-metabox',
		'post_types' 	=> 'page',
		'name'			=> esc_html( 'Text field', 'mx-domain' )
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