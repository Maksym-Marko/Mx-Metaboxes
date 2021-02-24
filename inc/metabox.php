<?php 

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

// metabox creating main class
class Mx_Metaboxes_Class
{

	protected $args = [];

	protected $defauls = [];

	public function __construct( $args )
	{

		$this->defaults = [
			'id'			=> 'mx-extra-metabox-1',
			'post_types' 	=> 'page', // ['page', 'post']
			'name'			=> esc_html( 'Extra metabox 1', 'mx-domain' ),
			'metabox_type'	=> 'input-text',
			'context' 		=> 'normal', // normal, side or advanced 
			'priority' 		=> 'high', // high, low, core, default
				'options' 	=> [],
			'default' 		=> ''
		];

		$this->args = wp_parse_args( $args, $this->defaults );

		if( is_array( $this->args['post_types'] ) ) :

			$this->args['metabox_id'] = $this->args['id'] . '_' . implode( '_',  $this->args['post_types'] );

		else :

			$this->args['metabox_id'] = $this->args['id'] . '_' . $this->args['post_types'];

		endif;

		$this->args['post_meta_key'] = '_mx_' . $this->args['metabox_id'] . '_id';
		$this->args['nonce_action']  = $this->args['metabox_id'] . '_nonce_action';
		$this->args['nonce_name']    = $this->args['metabox_id'] . '_nonce_name';

		// add options area
		if( $this->args['metabox_type'] == 'checkbox' ) {

			$i = 0;

			foreach ( $this->args['options'] as $key => $value ) {
				
				$this->args['options'][$key]['name'] = $this->args['post_meta_key'] . $i;

				$i++;

			}			

		}

		add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );

		add_action( 'save_post', [ $this, 'save_meta_box' ] );

	}

	// add post meta
	public function add_meta_box() {
		add_meta_box(
			$this->args['metabox_id'],
			$this->args['name'],
			[ $this, 'meta_box_content' ],
			$this->args['post_types'],
			$this->args['context'],
			$this->args['priority']
		);
	}

	// save post meta
	public function save_meta_box( $post_id ) {
		if ( ! isset( $_POST[ $this->args['nonce_name'] ] ) || ! wp_verify_nonce( wp_unslash( $_POST[ $this->args['nonce_name'] ] ), $this->args['nonce_action'] ) ) { // phpcs:ignore WordPress.Security
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$value = $this->args['default'];

		if ( isset( $_POST ) && isset( $_POST[ $this->args['post_meta_key'] ] ) ) :

			if( $this->args['metabox_type'] == 'input-email' ) :

				// email field
				$value = sanitize_email( wp_unslash( $_POST[ $this->args['post_meta_key'] ] ) );

			elseif( $this->args['metabox_type'] == 'input-url' ) :

				// url field
				$value = esc_url_raw( $_POST[ $this->args['post_meta_key'] ] );


			elseif( $this->args['metabox_type'] == 'textarea' ) :

				// textarea field
				$value = sanitize_textarea_field( $_POST[ $this->args['post_meta_key'] ] );

			elseif( $this->args['metabox_type'] == 'html' ) :

				// textarea field (save HTML)
				$value = htmlspecialchars( $_POST[ $this->args['post_meta_key'] ] );
				// use "htmlspecialchars_decode()" to decode

			elseif( $this->args['metabox_type'] == 'image' ) :

				// image id
				$value = sanitize_text_field( $_POST[ $this->args['post_meta_key'] ] );

			elseif( $this->args['metabox_type'] == 'video' ) :

				// video id
				$value = sanitize_text_field( $_POST[ $this->args['post_meta_key'] ] );

			elseif( $this->args['metabox_type'] == 'document' ) :

				// document id
				$value = sanitize_text_field( $_POST[ $this->args['post_meta_key'] ] );

			elseif( $this->args['metabox_type'] == 'radio' ) :

				// radio value
				$value = sanitize_text_field( $_POST[ $this->args['post_meta_key'] ] );

			elseif( $this->args['metabox_type'] == 'checkbox' ) :

				$_value = null;

				// checkbox value
				foreach( $this->args['options'] as $key => $val ) {

					if( isset( $_POST[ $val['name'] ] ) ) {

						$_value = sanitize_text_field( $_POST[ $val['name'] ] );		

					}

					// save data
					update_post_meta( $post_id, $val['name'], $_value );

				}

				// checkbox marker
				$value = sanitize_text_field( $_POST[ $this->args['post_meta_key'] ] );

			else :

				// input text
				$value = sanitize_text_field( wp_unslash( $_POST[ $this->args['post_meta_key'] ] ) );

			endif;

		endif;



		// save data
		update_post_meta( $post_id, $this->args['post_meta_key'], $value );
		
	}

	// metabox content
	public function meta_box_content( $post, $meta )
	{

		$meta_value = get_post_meta(
			$post->ID,
			$this->args['post_meta_key'],
			true
		); 

		if( $meta_value == '' ) {

			$meta_value = $this->args['default'];

		}

		?>

		<p>
			<label for="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"></label>

			<?php if( $this->args['metabox_type'] == 'input-email' ) : ?>

				<!-- email field -->
				<input 
					type="email" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					value="<?php echo $meta_value; ?>"
				/>

			<?php elseif( $this->args['metabox_type'] == 'input-url' ) : ?>

				<!-- url field -->
				<input 
					type="url" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					value="<?php echo $meta_value; ?>"
				/>

			<?php elseif( $this->args['metabox_type'] == 'textarea' ) : ?>

				<!-- textarea field -->
				<textarea name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>" cols="30" rows="10"><?php echo $meta_value; ?></textarea>

			<?php elseif( $this->args['metabox_type'] == 'html' ) : ?>

				<!-- textarea field -->
				<textarea name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>" cols="30" rows="10"><?php echo $meta_value; ?></textarea>

			<?php elseif( $this->args['metabox_type'] == 'image' ) : ?>

				<?php

					$image_url = '';

					if( $meta_value !== '' ) {

						$image_url = wp_get_attachment_url( $meta_value );

					}

				?>

				<!-- image upload -->
				<div class="mx-image-uploader">

					<button
						class="mx_upload_image"
						<?php echo $image_url !== '' ? 'style="display: none;"' : ''; ?>
					>Choose image</button>				

					<!-- here we will save an id of image -->
					<input
						name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						type="hidden"
						class="mx_upload_image_save"
						value="<?php echo $meta_value; ?>"
					/>

					<!-- show an image -->
					<img
						src="<?php echo $image_url !== '' ? $image_url : ''; ?>"					
						style="width: 300px;"
						alt=""
						class="mx_upload_image_show"
						<?php echo $image_url == '' ? 'style="display: none;"' : ''; ?>						
					/>

					<!-- remove image -->
					<a
						href="#"
						class="mx_upload_image_remove"
						<?php echo $image_url == '' ? 'style="display: none;"' : ''; ?>
					>Remove Image</a>

				</div>

			<!-- video -->
			<?php elseif( $this->args['metabox_type'] == 'video' ) : ?>

				<?php

					$video_url = '';

					if( $meta_value !== '' ) {

						$video_url = wp_get_attachment_url( $meta_value );

					}

				?>

				<!-- video upload -->
				<div class="mx-video-uploader">

					<button
						class="mx_upload_video"
						<?php echo $video_url !== '' ? 'style="display: none;"' : ''; ?>
					>Choose Video</button>				

					<!-- here we will save an id of video -->
					<input
						name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						type="hidden"
						class="mx_upload_video_save"
						value="<?php echo $meta_value; ?>"
					/>

					<!-- show an video -->

					<video
						width="400"
						class="video-wrapper"
						autoplay loop
						<?php echo $video_url == '' ? 'style="display: none;"' : ''; ?>
					>
						<source
							src="<?php echo $video_url !== '' ? $video_url : ''; ?>"					
							style="width: 300px;"
							alt=""
							class="mx_upload_video_show"						
							type="video/mp4"
						/>
					Your browser does not support the video tag.</video>

					<!-- remove video -->
					<a
						href="#"
						class="mx_upload_video_remove"
						<?php echo $video_url == '' ? 'style="display: none;"' : ''; ?>
					>Remove video</a>

				</div>
				
			<?php elseif( $this->args['metabox_type'] == 'document' ) : ?>

				<?php

					$document_url = '';

					if( $meta_value !== '' ) {

						$document_url = wp_get_attachment_url( $meta_value );

					}

				?>

				<!-- document upload -->
				<div class="mx-document-uploader">

					<button
						class="mx_upload_document"
						<?php echo $document_url !== '' ? 'style="display: none;"' : ''; ?>
					>Choose Document</button>				

					<!-- here we will save an id of document -->
					<input
						name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
						type="hidden"
						class="mx_upload_document_save"
						value="<?php echo $meta_value; ?>"
					/>

					<!-- show an document -->

					<p 
						class="mx_upload_document_show"
						<?php echo $document_url == '' ? 'style="display: none;"' : ''; ?>
					>
						<?php echo $document_url !== '' ? $document_url : ''; ?>
					</p>

					<!-- remove document -->
					<a
						href="#"
						class="mx_upload_document_remove"
						<?php echo $document_url == '' ? 'style="display: none;"' : ''; ?>
					>Remove document</a>

				</div>
				
			<?php elseif( $this->args['metabox_type'] == 'radio' ) : ?>

				<?php				

					if( count( $this->args['options'] ) == 0 ) {
						echo '<p>You have to add some options to the "Options" array!</p>';
					} else {
					
						if( is_array( $this->args['options'] ) ) {

							$i = 0;

							foreach ( $this->args['options'] as $key => $val ) {

								?>
								<div>
									<input 
										type="radio"
										name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
										id="<?php echo esc_attr( $this->args['post_meta_key'] ) . $i; ?>"
										value="<?php echo $val['value']; ?>" 
										
										<?php if( $meta_value == '' ) : ?>

											<?php echo isset( $val['checked'] ) && $val['checked'] == true  ? 'checked' : ''; ?>

										<?php else : ?>

											<?php echo $meta_value == $val['value'] ? 'checked' : ''; ?>

										<?php endif; ?>


									>
									<label for="<?php echo esc_attr( $this->args['post_meta_key'] ) . $i; ?>"><?php echo $val['value']; ?></label>
								</div>
								
								<?php $i++;

							}

						}

					}
				?>

			<?php elseif( $this->args['metabox_type'] == 'checkbox' ) : ?>

				<?php					

					if( count( $this->args['options'] ) == 0 ) {
						echo '<p>You have to add some options to the "Options" array!</p>';
					} else {
					
						if( is_array( $this->args['options'] ) ) {

							?><input type="hidden" name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>" value="checkbox-type" /><?php

							$i = 0;

							foreach ( $this->args['options'] as $key => $val ) {

								$checkbox_value = get_post_meta(
									$post->ID,
									$val['name'],
									true
								);

								?>
								<div>
									<input 
										type="checkbox"
										name="<?php echo esc_attr( $val['name'] ); ?>"
										id="<?php echo esc_attr( $val['name'] ); ?>"
										value="<?php echo $val['value']; ?>"

										<?php 
										if( !$meta_value ) {

											echo isset( $val['checked'] ) && $val['checked'] == true  ? 'checked' : '';

										} else {

											echo $val['value'] == $checkbox_value  ? 'checked' : '';

										}

										?>

									>
									<label for="<?php echo esc_attr( $val['name'] ); ?>"><?php echo $val['value']; ?></label>
								</div>

								<?php $i++;

							}

						}						

					}
				?>
				
			<?php else : ?>

				<!-- input text -->
				<input 
					type="text" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
					value="<?php echo $meta_value; ?>"
				/>

			<?php endif; ?>


		</p>

		<?php wp_nonce_field( $this->args['nonce_action'], $this->args['nonce_name'], true, true );

	}

}