// input-text
Vue.component( 'mx_input-text',

	{
		props: {

			type: {
				type: String,
				required: true
			},

			block_name: {
				type: String,
				required: true
			},

			element_id: {
				type: Number,
				required: true
			},

			input_id: {
				type: Number,
				required: true
			},

			label: {
				type: String,
				required: true
			},

			value: {
				type: String,
				required: false
			}

		},

		template: `

			<div
				:class="'mx_' + type"
			>

				<label :for="block_name + '_element_' + element_id + '_input_' + input_id">{{ label }}</label>
				<input
					type="text"
					:id="block_name + '_element_' + element_id + '_input_' + input_id"
					:name="block_name + '_element_' + element_id + '_input_' + input_id"
					v-model="input"
				/>

			</div>

		`,
		data() {

			return {

				input: null

			}

		},

		methods: {

			_emit_data() {

				let block_name = this.block_name

				let element_id = this.element_id

				let input_id = this.input_id

				let type = this.type

				let value = this.input

				let label = this.label

				this.$emit( 'input_data', {
					block_name: block_name,
					element_id: element_id,
					input_id: input_id,
					input_type: type,
					value: value,
					label: label
				} )

			}

		},

		watch: {

			input() {

				this._emit_data()

			}

		},

		mounted() {

			this.input = this.value

		}
	}

)

// textarea
Vue.component( 'mx_textarea',

	{
		props: {

			type: {
				type: String,
				required: true
			},

			block_name: {
				type: String,
				required: true
			},

			element_id: {
				type: Number,
				required: true
			},

			input_id: {
				type: Number,
				required: true
			},

			label: {
				type: String,
				required: true
			},

			value: {
				type: String,
				required: false
			}

		},

		template: `

			<div
				:class="'mx_' + type"
			>
				<label :for="block_name + '_element_' + element_id + '_input_' + input_id">{{ label }}</label>
				<textarea
					:id="block_name + '_element_' + element_id + '_input_' + input_id"
					:name="block_name + '_element_' + element_id + '_input_' + input_id"
					v-model="input"
				></textarea>

			</div>

		`,
		data() {

			return {

				input: null

			}

		},

		methods: {

			_emit_data() {

				let block_name = this.block_name

				let element_id = this.element_id

				let input_id = this.input_id

				let type = this.type

				let value = this.input

				let label = this.label

				this.$emit( 'input_data', {
					block_name: block_name,
					element_id: element_id,
					input_id: input_id,
					input_type: type,
					value: value,
					label: label
				} )

			}

		},

		watch: {

			input() {

				this._emit_data()

			}

		},

		mounted() {

			this.input = this.value

		}
	}

)

Vue.component( 'mx_multibox_element',

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
					v-if="inputs_types.indexOf( input.type ) != -1"
				>
					<component 
						:is="'mx_' + input.type"
						:label="input.label"
						:type="input.type"
						:value="input.value"
						:block_name="block_name"
						:element_id="parseInt( element_id )"
						:input_id="parseInt( index )"

						@input_data="push_input_data"
					></component>

				</div>
				<div v-else>

					<h3>The "{{ input.type }}" type doesn't exists!</h3>

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

Vue.component( 'mx_multibox_block',

	{
		props: {

			block: {
				type: Object,
				required: true
			},
			block_name: {
				type: String,
				required: true
			},
			section_names: {
				type: Object,
				required: true
			}

		},

		template: `
			<div class="mx_multibox_block mx-multibox_wrap">

				<h3>{{ section_names[block_name] }}</h3>

				<mx_multibox_element

					v-for="element in number_of_elements"
					:attrs="block"
					:block_name="block_name"
					:element_id="element"
					:key="element"
					@add_new_element="add_new_element"
					@element_data="push_element_data"

				></mx_multibox_element>

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

				add_new: false,

				block_data: {}

			}

		},
		methods: {

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

				this.number_of_elements += 1

			}

		}

	}

)

// main component
let app_element = document.getElementById( 'mx_multibox_init' )

if( app_element !== null ) {

	let app = new Vue( {

		el: '#mx_multibox_init',
		data: {

			multiboxes: mx_multiboxes,

			errors: [],

			blocks: {},

			time_out: null,

			save_data_input_id: mx_metabox_id,

			blocks_output_data: {},

			section_names: {}

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

						action: 		'mx_convert_multibox',
						nonce: 			mx_multibox_localize.nonce,
						data:  			_this.blocks_output_data,
						section_names: 	_this.section_names

					}

					jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

						jQuery( '#' + _this.save_data_input_id ).val( response )

					} );

				}, 500 )				

			},

			init_multibox() {

				if( typeof this.multiboxes === 'object' ) {

					for ( const [key, value] of Object.entries( this.multiboxes ) ) {

						this.section_names[key] = value['section_name']

						delete this.multiboxes[key]['section_name']

					}				

					this.blocks = this.multiboxes

				}

			}

		},

		mounted() {

			// init
			this.init_multibox()

		}

	} )

}
