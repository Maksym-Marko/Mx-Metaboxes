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

				this.$emit( 'input_data', {
					block_name: block_name,
					element_id: element_id,
					input_id: input_id,
					input_type: type,
					value: value
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

			this._emit_data()

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

				this.$emit( 'input_data', {
					block_name: block_name,
					element_id: element_id,
					input_id: input_id,
					input_type: type,
					value: value
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

			this._emit_data()

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
				this.element_data[_obj.input_id] = {

					['element_' + _this.element_id]: _obj

				}

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
			}

		},

		template: `
			<div class="mx_multibox_block mx-multibox_wrap">

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

					console.log( key, value )

				}

				// this.block_data[_obj.input_id] = {

				// 	[_this.block_name]: _obj

				// }

				// this.$emit( 'input_data', _obj )

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
let app_element = document.getElementById( 'mx_multibox' )

if( app_element !== null ) {

	let app = new Vue( {

		el: '#mx_multibox',
		data: {

			multiboxes: mx_multiboxes,

			errors: [],

			blocks: {},

			time_out: null

		},
		methods: {

			save_data( data ) {

				clearTimeout( this.time_out )

				this.time_out = setTimeout( function() {

					console.log( data )

				}, 1000 )				

			},

			parseMultiboxes() {

				if( typeof this.multiboxes === 'object' ) {

					this.blocks = this.multiboxes

				}

			}

		},

		watch: {

			

		},

		mounted() {

			this.parseMultiboxes()

		}

	} )

}
