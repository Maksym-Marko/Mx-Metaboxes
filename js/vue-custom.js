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

				<label :for="id + '_input-text'">{{ attrs.label }}</label>

				<input
					type="text"
					:id="id + '_input-text'"
					:name="id + '_input-text'"
				/>

			</div>

		`

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
					:for="id + '_input-text'"
				>{{ attrs.label }}</label>

				<textarea
					:id="id + '_input-text'"
					:name="id + '_input-text'"
				></textarea>

			</div>

		`

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
					></mx-input-text>

					<mx-textarea
						v-if="_attributes.type === 'textarea'"
						:attrs="_attributes"
						:id="id"
					></mx-textarea>


				</div>
				<div v-else>

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

			// set_id() {

			// 	return 

			// }

		},
		mounted() {


		},
		computed: {

			checkElementType() {

				if( this.types.indexOf( this._attributes.type ) !== -1 ) {

					return true

				}	

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
				:style="styles"
				:id="elements[0]"
			>

				<div
					v-for="index in clone"
					:class="[index > 1 ? 'mx-cloned-element' : 'mx-origin-element']"
				>

					<multibox_element
						v-for="(element, index) in elements"
						:_attributes="element"
						v-if="typeof element !== 'string'"
						:id="'element_of_' + elements[0] + index"
					></multibox_element>

				</div>

			</div>

		`,
		data() {
			return {
				styles: {
					border: 		'1px solid #ccd0d4',
					marginBottom: 	'15px',
					padding: 		'10px'
				},
				id: 0,
				clone: 1
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
		multiboxes: mx_multiboxes
	}

} )