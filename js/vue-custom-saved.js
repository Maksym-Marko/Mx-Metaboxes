
Vue.component( 'mx_multibox_element_saved',

	{
		props: {

			attrs: {
				type: Object,
				required: true
			},
			block_name: {
				type: String,
				required: true
			},
			element_id: {
				type: Number,
				required: true
			}

		},

		template: `

		<div 
			class="mx_multibox_element"
			:class="'mx_element_' + element_id">

			<div
				v-for="(input, index) in attrs"
			>

				<div
					v-if="inputs_types.indexOf( input.input_type ) != -1"
				>
					<component 
						:is="'mx_' + input.input_type"
						:label="input.label"
						:type="input.input_type"
						:value="input.value"
						:block_name="block_name"
						:element_id="parseInt( element_id )"
						:input_id="parseInt( index )"

						@input_data="push_input_data"
					></component>

				</div>
				<div v-else>

					<h3>The "{{ input.input_type }}" type doesn't exists!</h3>

				</div>

			</div>

		</div>
		`,
		data() {

			return {
				inputs_types: [
					'input-text',
					'textarea'
				],
				inputs: [],

				element_data: {}
			}

		},
		methods: {

			push_input_data( _obj ) {

				let _this = this

				this.inputs.forEach( function( v, i ) {

					let _model = 'mx_input' + _obj.input_id

					if( Object.keys(_this.inputs[i])[0] === _model ) {

						_this.inputs[i][_model] = _obj.value

					}

				} )

				// collect input data
				this.element_data[_obj.input_id] = _obj

				// console.log( this.element_data )

				this.$emit( 'element_data', this.element_data )

			},

			check_inputs_filed_in() {

				let _this = this

				let filled_in = true

				this.inputs.forEach( function( v, i ) {

					let _key = Object.keys( _this.inputs[i] )

					if( ! _this.inputs[i][_key] ) {

						filled_in = false

					}

				} )

				return filled_in

			}			

		},

		watch: {

			inputs: {

				handler: function( _value ) {

				 	let add_element = this.check_inputs_filed_in()

				 	this.$emit( 'add_new_element', add_element )

	            },

	            deep: true

			}

		},

		mounted() {

			let _this = this

			for ( const [key, value] of Object.entries( this.attrs ) ) {

				let _model = {
					['mx_input' + key]: null
				}
	
				_this.inputs.push( _model )

			}

		}
	}

)

Vue.component( 'mx_multibox_block_saved',

	{
		props: {

			block: {
				type: Object,
				required: true
			},
			block_name: {
				type: String,
				required: true
			}

		},

		template: `
			<div class="mx_multibox_block mx-multibox_wrap">

				<mx_multibox_element_saved

					v-for="element in number_of_elements"
					:attrs="block[element]"
					:block_name="block_name"
					:element_id="element"
					:key="element"
					@add_new_element="add_new_element"
					@element_data="push_element_data"

				></mx_multibox_element_saved>

				<mx_multibox_element_saved

					v-if="number_of_additional_elements > 0"
					v-for="element in number_of_additional_elements"
					:attrs="block_patern"
					:block_name="block_name"
					:element_id="number_of_additional_elements + number_of_elements"
					:key="number_of_additional_elements + number_of_elements"
					@add_new_element="add_new_element"
					@element_data="push_element_data"

				></mx_multibox_element_saved>

				<button
					class="mx-add-block"
					@click.prevent="add_element"
					v-if="add_new"
				>Add</button>

			</div>
		`,
		data() {

			return {

				number_of_elements: 1,

				number_of_additional_elements: 0,

				add_new: false,

				block_patern: {},

				block_data: {}

			}

		},
		methods: {

			_obj_size( obj ) {

			  let size = 0

			  for ( const key in obj ) {

			    if ( obj.hasOwnProperty( key ) ) size++

			  }

			  return size

			},

			push_element_data( _obj ) {

				let _this = this

				for ( const [key, value] of Object.entries( _obj ) ) {


					if( typeof this.block_data[value.block_name] !== 'object'  ) {

						_this.block_data[value.block_name] = {}

						_this.block_data[value.block_name][value.element_id] = _obj

					} else {

						_this.block_data[value.block_name][value.element_id] = _obj

					}

				}

				this.$emit( 'block_data', this.block_data )

			},

			add_new_element( _bollean ) {

				this.add_new = _bollean

			},

			add_element() {

				this.number_of_additional_elements += 1

			},

			set_number_of_elements() {

				this.number_of_elements = this._obj_size( this.block )

			},

			set_block_patern() {

				// block_patern
				this.block_patern = this.block[1]

				for ( const [key, value] of Object.entries( this.block_patern ) ) {

					delete this.block_patern[key]['block_name']

					delete this.block_patern[key]['element_id']

					delete this.block_patern[key]['input_id']

					this.block_patern[key]['value'] = ''

				}

			}

		},

		mounted() {

			// set number of elements
			this.set_number_of_elements()

			// set block patern
			this.set_block_patern()

		}

	}

)

// main component
let app_element_saved = document.getElementById( 'mx_multibox_saved' )

if( app_element_saved !== null ) {

	let app = new Vue( {

		el: '#mx_multibox_saved',
		data: {

			errors: [],

			blocks: {},

			time_out: null,

			save_data_input_id: mx_metabox_id,

			blocks_output_data: {},

			get_data_from_db: mx_serialized_data

		},
		methods: {

			save_data( data ) {				

				let _this = this

				// enter the block
				for ( const [key, value] of Object.entries( data ) ) {

					if( typeof _this.blocks_output_data[key] !== 'object'  ) {

						_this.blocks_output_data[key] = {} // create a block

						// enter the element
						for ( const [_key, _value] of Object.entries( value ) ) {

							_this.blocks_output_data[key][_key] = _value // create and fill in an element

						}

					} else {

						// enter the element
						for ( const [_key, _value] of Object.entries( value ) ) {

							_this.blocks_output_data[key][_key] = _value // create and fill in an element

						}

					}

				}

				// save data to the input
				clearTimeout( this.time_out )

				this.time_out = setTimeout( function() {

					let data = {

						action: 'mx_convert_multibox',
						nonce: mx_multibox_localize.nonce,
						data:  _this.blocks_output_data

					}

					jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

						jQuery( '#' + _this.save_data_input_id ).val( response )

					} );

				}, 500 )				

			},

			get_saved_data() {

				if( this.get_data_from_db ) {

					let _this = this

					setTimeout( function() {

						let data = {

							action: 'mx_decode_multibox',
							nonce: mx_multibox_localize.nonce,
							data:  _this.get_data_from_db

						}

						jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

							if( _this.isJSON( response ) ) {

								let saved_obj = JSON.parse( response )

								_this.blocks = saved_obj		

							} else {

								_this.errors.push( 'JSON.pars error!' )

							}					

						} );						

					},1000 )					

				}

			},

			isJSON( str ) {
				try {
			        JSON.parse(str);
			    } catch (e) {
			        return false;
			    }
			    return true;
			},

		},

		mounted() {

			// get data if exists
			this.get_saved_data()

		}

	} )

}