/*
* Elements 
*/
	// input-text
	Vue.component( 'mx-input-text', {

		props: {
			attrs: {
				type: Object,
				required: true
			},
			id: {
				required: true
			}
		},

		template: ` 

			<div>

				<label :for="id + prefix">{{ attrs.label }}</label>

				<input
					type="text"
					:id="id + prefix"
					:name="id + prefix"
					v-model="input_text"
					class="mx-data-input"
				/>

			</div>

		`,
		data() {

			return {

				input_text: ''

			}
			
		},
		watch: {

			input_text() {

				let _this = this

				let id = this.id + this.prefix

				let _data = {
					value: _this.input_text,
					id: id
				}

				this.$emit( 'data-input', _data )

			}

		},

		computed: {

			prefix() {

				return '_input-text'

			}

		}

	} )

	// textarea
	Vue.component( 'mx-textarea', {

		props: {
			attrs: {
				type: Object,
				required: true
			},
			id: {
				required: true
			}
		},

		template: ` 

			<div>

				<label 
					:for="id + 'prefix'"
				>{{ attrs.label }}</label>

				<textarea
					:id="id + prefix"
					:name="id + 'prefix'"
					v-model="mx_textarea"
					class="mx-data-input"
				></textarea>

			</div>
		`,
		data() {

			return {

				mx_textarea: ''

			}
			
		},
		watch: {

			mx_textarea() {

				let _this = this

				let id = this.id + this.prefix

				let _data = {
					value: _this.mx_textarea,
					id: id
				}

				this.$emit( 'data-input', _data )

			}

		},

		computed: {

			prefix() {

				return '_textarea'

			}

		}

	} )

/*
* Main components
*/
// element
Vue.component( 'multibox_element',
	{
		props: {
			_attributes: {
				required: true
			},
			id: {
				required: true
			}
		},
		template: ` 

			<div
				:id="id"
			>				

				<div 
					v-if="checkElementType"
				>

					<!-- Mount the element -->

					<mx-input-text
						v-if="_attributes.type === 'input-text'"
						:attrs="_attributes"
						:id="id"
						@data-input="data_input"
					></mx-input-text>

					<mx-textarea
						v-if="_attributes.type === 'textarea'"
						:attrs="_attributes"
						:id="id"
						@data-input="data_input"
					></mx-textarea>


				</div>
				<div 
					class="mx-failed"
					v-else
				>

					<h3>This type doesn't exists.</h3>
					<b>{{_attributes}}</b>

				</div>

			</div>

		`,
		data() {
			return {
				types: [
					'input-text',
					'textarea'
					
				]
			}
		},
		methods: {

			data_input( _data_obj ) {

				this.$emit( 'data-input', _data_obj )

			}

		},
		mounted() {


		},
		computed: {

			checkElementType() {

				if( this.types.indexOf( this._attributes.type ) !== -1 ) {

					return true

				}

				this.$emit( 'errors', 'This type doesnt exists.' )

				return false

			}

		}
	}
)

// block
Vue.component( 'multibox_block',
	{
		props: {
			elements: {
				type: Array,
				required: true
			}
		},
		template: ` 

			<div 
				class="mx-multibox_wrap"
				:id="elements[0]"
			>

				<div
					v-for="_index in number_of_elements"
					:class="[_index > 1 ? 'mx-child-element' : 'mx-origin-element']"
				>

					<multibox_element
						v-for="(element, index) in elements"
						:key="index"
						:_attributes="element"
						v-if="typeof element !== 'string'"
						:id="'element_of_' + elements[0] + '_' + index + '_el_' + _index"
						@errors="set_error"
						@data-input="set_data_input"
					></multibox_element>

				</div>

				<button
					class="mx-add-block"
					@click.prevent="add_block"
					v-if="errors.length === 0"
				>Add</button>

			</div>

		`,
		data() {
			return {
				id: 0,
				number_of_elements: 1,
				errors: [],
				block: [],

				_set_timeout: null,

				exists: false
			}
		},
		methods: {

			set_data_input( _obj ) {

				let _this = this

				clearTimeout( _this._set_timeout )

				this._set_timeout = setTimeout( function() {

					_this.id_exists( _obj.id )

					if( _this.exists ) {

						_this.update_obj( _obj.id, _obj.value )

						_this.exists = false

					} else {

						_this.block.push( _obj )
						

					}				
			
				}, 500 )

			},

			update_obj( _id, _value ) {

				let _this = this

				this.block.forEach( function( value, index ) {

					if( value.id === _id ) {

						_this.block[index]['value'] = _value

					}

				} )	

			},

			id_exists( _id ) {

				let _incr = 0

				let _this = this

				this.block.forEach( function( value, index ) {

					_incr++

					if( typeof value === 'object' ) {

						if( value.id === _id ) {

							_this.exists = true

						}					

					}

				} )				

			},

			add_block() {

				this.number_of_elements += 1

			},

			set_error( _error ) {

				this.errors.push( _error )

			}, 

			block_init() {

				this.block.push( this.elements[0] )

			}

		},
		mounted() {

			this.block_init()

		},
		watch: {


			block: {

				handler: function( _value ) {

				 	this.$emit( 'data-output', this.block )			 					 		

	            },

	            deep: true

			}
		}
	}
)

// main component
let app = new Vue( {

	el: '#mx_multibox',
	data: {
		multiboxes: mx_multiboxes,
		data_output: [],

		exists: false
	},
	methods: {

		convert_data( _obj ) {

			let json_data = JSON.stringify( _obj )

			let data = {
				action: 'mx_convert_multibox',
				nonce: 	mx_multibox_localize.nonce,
				data: 	json_data
			}

			jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

				console.log( response )

			} )		

		},

		set_data_output( _array ) {

			this.id_exists( _array[0] )

			if( ! this.exists ) {

				this.data_output.push( _array )		

			}

			this.convert_data( this.data_output )

		},

		id_exists( _id ) {

			let _incr = 0

			let _this = this

			this.data_output.forEach( function( value, index ) {

				_incr++

				if( typeof value === 'object' ) {

					if( value[0] === _id ) {

						_this.exists = true

					}					

				}

			} )				

		}

	}

} )