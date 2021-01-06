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

				<label :for="set_id">{{ attrs.label }}</label>

				<input
					type="text"
					:id="set_id"
					:name="set_id"
					v-model="input_text"
					class="mx-data-input"
				/>

			</div>

		`,
		data() {

			return {

				input_text: null

			}
			
		},

		methods: {

			set_value() {

				if( this.attrs.value ) {

					return this.attrs.value

				} else {

					return ''

				}

			},

		},

		watch: {

			input_text() {

				let _this = this

				let id = this.id + this.prefix

				let _data = {
					value: _this.input_text,
					id: id,
					label: _this.attrs.label,
					type: 'input-text'
				}

				this.$emit( 'data-input', _data )

			}

		},

		computed: {

			set_id() {

				if( this.attrs.value ) {

					return this.attrs.id

				} else {

					return this.id + this.prefix

				}				

			},

			prefix() {

				return '_input-text'

			}

		},

		mounted() {

			this.input_text = this.set_value()

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
					:for="set_id"
				>{{ attrs.label }}</label>

				<textarea
					:id="set_id"
					:name="set_id"
					v-model="mx_textarea"
					class="mx-data-input"
				></textarea>

			</div>
		`,
		data() {

			return {

				mx_textarea: null

			}
			
		},
		methods: {

			set_value() {

				if( this.attrs.value ) {

					return this.attrs.value

				} else {

					return ''

				}

			},

		},
		watch: {

			mx_textarea() {

				let _this = this

				let id = this.id + this.prefix

				let _data = {
					value: _this.mx_textarea,
					id: id,
					label: _this.attrs.label,
					type: 'textarea'
				}

				this.$emit( 'data-input', _data )

			}

		},

		computed: {			

			set_id() {

				if( this.attrs.value ) {

					return this.attrs.id

				} else {

					return this.id + this.prefix

				}				

			},

			prefix() {

				return '_textarea'

			}

		},

		mounted() {

			this.mx_textarea = this.set_value()

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
			},
			element: {
				required: true
			},
			index_of_element: {
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

				_data_obj.element = this.element

				_data_obj._index = this.index_of_element

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
			},
			saved: {
				required: false
			}
		},
		template: ` 

			<div 
				class="mx-multibox_wrap"
				:id="elements[0]"					
			>

				<div 
					v-if="saved === true"					
				>

					<div
						v-for="_index in number_of_elements"
						:class="[_index > 1 ? 'mx-child-element' : 'mx-origin-element']"
					>

						<multibox_element
							v-for="(element, index) in saved_block"
							:key="index"
							:_attributes="element"
							v-if="typeof element !== 'string' && element.element === _index"
							:id="element.id"
							:element="_index"
							@errors="set_error"
							@data-input="set_data_input"
							:index_of_element="index"
						></multibox_element>

					</div>					

				</div>
				<div
					v-else					
				>

					<div
						class="mx-element"
						v-for="_index in number_of_elements"
						:class="[_index > 1 ? 'mx-child-element' : 'mx-origin-element']"
					>

						<multibox_element
							v-for="(element, index) in elements"
							:key="index"
							:_attributes="element"
							v-if="typeof element !== 'string'"
							:id="'element_of_' + elements[0] + '_' + index + '_el_' + _index"
							:element="_index"
							@errors="set_error"
							@data-input="set_data_input"
							:index_of_element="index"
						></multibox_element>

					</div>

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

				saved_block: [],

				_set_timeout: null,

				exists_element: false,

				exists_input: false
			}
		},
		methods: {

			set_data_input( _obj ) {

				let _this = this

				clearTimeout( _this._set_timeout )

				this._set_timeout = setTimeout( function() {

					_this.id_element_exists( _obj.element )

					if( _this.exists_element ) {

						// console.log( 'element need to update' )
						// update element
						_this.id_input_exists( _obj.element, _obj._index )

						// check the index
						if( _this.exists_input ) {

							_this.update_input( _obj.element, _obj )

							_this.exists_input = false

						} else {

							_this.add_input( _obj.element, _obj )

						}

						_this.exists_element = false

					} else {

						// console.log( 'create element ' )

						let new_element = {
							[_obj.element]: {
								[_obj._index]: _obj
							}
						}

						_this.block.push( new_element )

					}			
			
				}, 500 )

			},

			update_input( element_id, _obj ) {

				this.block[_obj.element][element_id][_obj._index] = _obj

			},

			add_input( element_id, _obj ) {

				console.log( _obj )

				this.block[_obj.element][element_id][_obj._index] = _obj

			},

			id_input_exists( element_id, input_id ) {

				let _this = this

				if( this.block[1][element_id] ) {

					for( const [key, value] of Object.entries( this.block[element_id] ) ) {

						for( const [_key, _value] of Object.entries( value ) ) {

							if( parseInt( _key ) === parseInt( input_id ) ) {

								_this.exists_input = true

							}

						}

					}

				}				

			},

			id_element_exists( _id ) {

				let _this = this

				this.block.forEach( function( value, index ) {

					if( typeof value === 'object' ) {

						for( const [_key, _value] of Object.entries( value ) ) {

							if( parseInt( _key ) === parseInt( _id ) ) {

								_this.exists_element = true

							}

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

			set_block_data() {

				let _this = this			

				this.block = []

				this.block.push( this.saved_block[0] )

				this.saved_block.forEach( function( value, index ) {

					if( typeof value === 'object' ) {

						// console.log(value )

						// todo: create block array by saved_block array 











					}

				} )

			},

			block_init() {

				let _this = this

				if( this.saved === true ) {					

					this.number_of_elements = 0

					this.saved_block.push( this.elements[0] )

					this.elements.forEach( function( value, index ) {

						if( typeof value === 'object' ) {

							for( const [_key, _value] of Object.entries( value ) ) {

								for( const [__key, __value] of Object.entries( _value ) ) {

									_this.saved_block.push( __value )

								}

							}

							_this.number_of_elements += 1

						}

					} )

					setTimeout( function() {

						_this.set_block_data();

					}, 1000 )					

				} else {

					this.block.push( this.elements[0] )

				}

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
		},
		computed: {

			

		}
	}
)

// main component
let app = new Vue( {

	el: '#mx_multibox',
	data: {
		multiboxes: mx_multiboxes,

		data_output: [],

		saved_data: [],

		exists: false,

		metabox: mx_metabox_id,

		serialized_data: mx_serialized_data,

		errors: []
	},
	methods: {

		match_saved_data() {

			let _this = this

			this.saved_data.forEach( function( element, index ) {

				let static = _this.multiboxes[index]

				let current = element

				if( current[0] === static[0] ) {

					// console.log( _this.multiboxes[index], element )


					// todo





				} else {

					_this.errors.push( 'Something went wrong with saved data.' )

				}

			} )

		},

		convert_data( _obj ) {

			let _this = this

			let json_data = JSON.stringify( _obj )

			let data = {
				action: 'mx_convert_multibox',
				nonce: 	mx_multibox_localize.nonce,
				data: 	json_data
			}

			jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

				jQuery( '#' + _this.metabox ).val( response )

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

		},

		decode_data() {

			if( this.serialized_data !== '' ) {

				let _this = this

				let data = {
					action: 			'mx_decode_multibox',
					nonce: 				mx_multibox_localize.nonce,
					serialized_data: 	_this.serialized_data
				}

				jQuery.post( mx_multibox_localize.ajax_url, data, function( response ) {

					_this.saved_data = JSON.parse( response )

				} )	

			}

		}

	},

	watch: {

		saved_data() {

			this.match_saved_data()

		}

	},

	mounted() {

		this.decode_data()

	}

} )