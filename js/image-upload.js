jQuery( document ).ready( function( $ ) {

	// upload image
	$( '.mx_upload_image' ).on( 'click', function( e ) {

		var mx_upload_button = $( this );

		e.preventDefault();

		var frame;

		if ( frame ) {
			frame.open();
			return;
		}

		frame = wp.media.frames.customBackground = wp.media({

			title: 'choose image',

			library: {
				type: 'image'
			},

			button: {

				text: 'Upload'
			},

			multyple: false
		});


		frame.on( 'select', function() {

			var attachment = frame.state().get('selection').first();

			// and show the image's data
			var image_id = attachment.id;

			var image_url = attachment.attributes.url;

			// pace an id
			mx_upload_button.parent().find( '.mx_upload_image_save' ).val( image_id );

			// show an image
			mx_upload_button.parent().find( '.mx_upload_image_show' ).attr( 'src', image_url );
				mx_upload_button.parent().find( '.mx_upload_image_show' ).show();

			// show "remove button"
			mx_upload_button.parent().find( '.mx_upload_image_remove' ).show();

			// hide "upload" button
			mx_upload_button.hide();

		} );

		frame.open();

	} );

	// remove image
	$( '.mx_upload_image_remove' ).on( 'click', function( e ) {

		var remove_button = $( this );

		e.preventDefault();

		// remove an id
		remove_button.parent().find( '.mx_upload_image_save' ).val( '' );

		// hide an image
		remove_button.parent().find( '.mx_upload_image_show' ).attr( 'src', '' );
			remove_button.parent().find( '.mx_upload_image_show' ).hide();

		// show "Upload button"
		remove_button.parent().find( '.mx_upload_image' ).show();

		// hide "remove" button
		remove_button.hide();

	} );

	// video upload
	$( '.mx_upload_video' ).on( 'click', function( e ) {

		var mx_upload_button = $( this );

		e.preventDefault();

		var frame;

		if ( frame ) {
			frame.open();
			return;
		}

		frame = wp.media.frames.customBackground = wp.media({

			title: 'choose video',

			library: {
				type: 'video'
			},

			button: {

				text: 'Upload'
			},

			multyple: false
		});


		frame.on( 'select', function() {

			var attachment = frame.state().get('selection').first();

			// and show the video's data
			var video_id = attachment.id;

			var video_url = attachment.attributes.url;

			// pace an id
			mx_upload_button.parent().find( '.mx_upload_video_save' ).val( video_id );

			// show an video
			mx_upload_button.parent().find( '.mx_upload_video_show' ).attr( 'src', video_url );
				mx_upload_button.parent().find( '.video-wrapper' ).show();

				mx_upload_button.parent().find( '.video-wrapper' ).load();

			// show "remove button"
			mx_upload_button.parent().find( '.mx_upload_video_remove' ).show();

			// hide "upload" button
			mx_upload_button.hide();

		} );

		frame.open();

	} );

	// remove video
	$( '.mx_upload_video_remove' ).on( 'click', function( e ) {

		var remove_button = $( this );

		e.preventDefault();

		// remove an id
		remove_button.parent().find( '.mx_upload_video_save' ).val( '' );

		// hide an video
		remove_button.parent().find( '.mx_upload_video_show' ).attr( 'src', '' );
			remove_button.parent().find( '.video-wrapper' ).hide();

		// show "Upload button"
		remove_button.parent().find( '.mx_upload_video' ).show();

		// hide "remove" button
		remove_button.hide();

	} );

} )