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

				$data_to_decode = str_replace( '\\', '', $_POST['serialized_data'] );

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

				$input_data = str_replace( '\\', '', $_POST['data'] );

				$json_data = json_decode( $input_data );

				$serialized_data = maybe_serialize( $json_data );

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

				window.mx_multiboxes = [

					<?php foreach ( $this->args['blocks'] as $key => $block ) : ?>

						[
							'<?php echo $key; ?>',

							<?php foreach ( $block as $_key => $elements ) : ?>

								{

									<?php foreach ( $elements as $__key => $element ) : ?>

										<?php echo $__key; ?>: '<?php echo $element; ?>',

									<?php endforeach; ?>

								},

							<?php endforeach; ?>							

						],

					<?php endforeach; ?>			

				];

			</script>

			<div id="mx_multibox">

				<div
					v-if="saved_data.length === 0"
				>

					<multibox_block
						v-for="(block, index) in multiboxes"
						:elements="block"
						:key="index"
						@data-output="set_data_output"
					></multibox_block>
					
				</div>
				<div v-else>

					<div
						v-if="errors.length === 0"
					>
						
						<multibox_block
							v-for="(block, index) in multiboxes"
							:elements="block"
							:key="index"
							@data-output="set_data_output"
						></multibox_block>	

					</div>
					<div
						v-else
					>
						
						<h2>ERROR!</h2>

						<p
							v-for="error in errors"
							style="color: red;"
						>
							{{ error }}
						</p>

					</div>
									
					
				</div>				

			</div>

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
			wp_enqueue_script( 'mx-vue-js', get_bloginfo( 'template_url' ) . '/inc/mx-metabox/js/vue-dev.js', [], '2', true );

			// Vue.js production
			// wp_enqueue_script( 'mx-vue-js', get_bloginfo( 'template_url' ) . '/inc/mx-metabox/js/vue-production.js', [], '2', true );

			// Vue.js custom
			wp_enqueue_script( 'mx-vue-js-custom', get_bloginfo( 'template_url' ) . '/inc/mx-metabox/js/vue-custom.js', [ 'mx-vue-js', 'jquery' ], time(), true );

			wp_localize_script( 'mx-vue-js-custom', 'mx_multibox_localize', 

				[
					'ajax_url' 			=> admin_url( 'admin-ajax.php' ),

					'nonce' 			=> wp_create_nonce( 'mx_nonce_multibox' ),
				]
			);

			// style 
			wp_enqueue_style( 'mx-multibox-style', get_bloginfo( 'template_url' ) . '/inc/mx-metabox/css/multibox-style.css', [], time() ); 

		}

}