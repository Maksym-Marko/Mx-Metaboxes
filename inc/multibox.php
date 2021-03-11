<?php 

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

// metabox creating main class
class Mx_Multibox_Class extends Mx_Metaboxes_Class
{

	// convert data
	public function ajax_multibox()
	{

		// convert
		add_action( 'wp_ajax_mx_convert_multibox', [$this, 'mx_convert_multibox'] );

		// decode
		add_action( 'wp_ajax_mx_decode_multibox', [$this, 'mx_decode_multibox'] );

	}

		public function mx_decode_multibox()
		{

			if( empty( $_POST['nonce'] ) ) wp_die();

			if( wp_verify_nonce( $_POST['nonce'], 'mx_nonce_multibox' ) ) {

				$data_to_decode = str_replace( '\\', '', $_POST['data'] );

				$unserialized_data = maybe_unserialize( $data_to_decode );

				$json_data = json_encode( $unserialized_data );

				echo $json_data;

				wp_die();

			}

		}

		public function mx_convert_multibox()
		{

			if( empty( $_POST['nonce'] ) ) wp_die();

			if( wp_verify_nonce( $_POST['nonce'], 'mx_nonce_multibox' ) ) {

				$data_blocks = [

					'blocks' 		=> $_POST['data'],
					'section_names' => $_POST['section_names']

				];

				$serialized_data = maybe_serialize( $data_blocks );

				echo $serialized_data;

				wp_die();

			}

		}

	// metabox content
	public function meta_box_content( $post, $meta )
	{

		$meta_value = get_post_meta(
			$post->ID,
			$this->args['post_meta_key'],
			true
		); 

		?>

		<div>

			<label for="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"></label>

			<?php if( ! isset( $this->args['blocks'] ) ) : ?> 

				<h3>Please fill in the "blocks" array!</h3>

				<?php return; ?>

			<?php endif; ?>

			<script>

				window.mx_serialized_data = '<?php echo $meta_value; ?>';

				window.mx_metabox_id = '<?php echo esc_attr( $this->args['post_meta_key'] ); ?>';

				window.mx_multiboxes = {

					<?php foreach ( $this->args['blocks'] as $key => $block ) : ?>

						/* element ... */ <?php echo $key; ?> : {

							<?php $input_key = 1; ?>

							<?php foreach ( $block as $_key => $inputs ) : ?>	

									<?php if( isset( $inputs['section_name'] ) ) : ?>

										section_name: '<?php echo $inputs['section_name']; ?>',

										<?php continue; ?>

									<?php endif; ?>				

									/* input ... */ <?php echo $input_key; ?> : {

										<?php foreach ( $inputs as $__key => $input ) : ?>

											<?php echo $__key; ?>: '<?php echo $input; ?>',				

										<?php endforeach; ?>

										value: ''

										<?php $input_key++; ?>

									/* ... input */ },								

							<?php endforeach; ?>

						/* ... element */ },

					<?php endforeach; ?>			

				};

			</script>

			<?php

			 if( $meta_value == '' ) : ?>

				<!-- empty data -->
				<div id="mx_multibox_init">
					
					<mx_multibox_block

						v-for="(block, index) in blocks"
						:block="block"
						:block_name="index"
						:key="index"
						:section_names="section_names"
						
						@block_data="save_data"

					></mx_multibox_block>

					<!-- :section_name="Some section" -->

				</div>

			<?php else : ?>

				<!-- saved data -->			
				<div id="mx_multibox_saved">
					
					<div
						v-if="errors.length === 0"
					>

						<mx_multibox_block_saved

							v-for="(block, index) in blocks"
							:block="block"
							:block_name="index"
							:key="index + incr"
							@block_data="save_data"
							@add_element_to_block="add_element_to_block"
							:section_names="section_names"

							@delete_element="remove_element"

						></mx_multibox_block_saved>

					</div>
					<div
						v-else
					>

						{{ errors }}
						
					</div>

				</div>

			<?php endif; ?>


			<input 
				type="text" id="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
				name="<?php echo esc_attr( $this->args['post_meta_key'] ); ?>"
				value='<?php echo $meta_value; ?>'
			/>

		</div>

		<?php wp_nonce_field( $this->args['nonce_action'], $this->args['nonce_name'], true, true );
		
	}


	// save post meta
	public function save_meta_box( $post_id ) {

		if ( ! isset( $_POST[ $this->args['nonce_name'] ] ) || ! wp_verify_nonce( wp_unslash( $_POST[ $this->args['nonce_name'] ] ), $this->args['nonce_action'] ) ) { // phpcs:ignore WordPress.Security
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( isset( $_POST ) && isset( $_POST[ $this->args['post_meta_key'] ] ) ) :

			$value = sanitize_text_field( wp_unslash( $_POST[ $this->args['post_meta_key'] ] ) );

			// save data
			update_post_meta( $post_id, $this->args['post_meta_key'], $value );

		endif;


	}

	public function register_scrips()
	{

		add_action( 'admin_enqueue_scripts', [$this, 'multibox_scripts'] );

	}

		public function multibox_scripts()
		{

			// Vue.js development
			wp_enqueue_script( 'mx-vue-js', MX_METABOXEX_URL_TO_FOLDER . '/js/vue-dev.js', [], '2', true );

			// Vue.js production
			// wp_enqueue_script( 'mx-vue-js', MX_METABOXEX_URL_TO_FOLDER . '/js/vue-production.js', [], '2', true );

			// Vue.js custom
			wp_enqueue_script( 'mx-vue-js-custom-init', MX_METABOXEX_URL_TO_FOLDER . '/js/vue-custom.js', [ 'mx-vue-js', 'jquery' ], time(), true );

			// there is a data
			wp_enqueue_script( 'mx-vue-js-custom-saved', MX_METABOXEX_URL_TO_FOLDER . '/js/vue-custom-saved.js', [ 'mx-vue-js', 'jquery', 'mx-vue-js-custom-init' ], time(), true );

			wp_localize_script( 'mx-vue-js-custom-init', 'mx_multibox_localize', 

				[
					'ajax_url' 			=> admin_url( 'admin-ajax.php' ),

					'nonce' 			=> wp_create_nonce( 'mx_nonce_multibox' ),
				]
			);

			// style 
			wp_enqueue_style( 'mx-multibox-style', MX_METABOXEX_URL_TO_FOLDER . '/css/multibox-style.css', [], time() ); 

		}

}