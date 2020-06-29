<!doctype html>
<html lang="en">
  <head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title></title>
	<!-- CSS only -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

	<!-- JS, Popper.js, and jQuery -->
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
	<script src="/js/waitimage.js"></script>
	<script src="/js/panzoom.js"></script>
	<style>
		body{width:100%}
		#monitor_map_wrap {
			display: inline-block;
			width: 1022px;
			height: 575px;
		}
		#monitor_map > img {width:100%;}
		.cartwrap{
			z-index: 10;
			position: absolute;
			top: 10px;
			left: 10px;
			width: 10px;
			height: 10px;
			background-color: black;
		}
		#monitor_over{
		    z-index: 1;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;

		}
	</style>	
  </head>
<body>
	<div id="monitor_map_wrap">
		<div id="monitor_map">
			<img id="monitor_map_image" src="/img/map_20170331190752603013.jpg"/>
		</div>
		<div id="monitor_over">
		</div>
	</div>
	
	
  <script>
	const monitor_map_image = document.getElementById('monitor_map')
	const monitor_map = monitor_map_image.parentElement
	let panzoom
	$(document).ready( function() {
		$('#monitor_map').waitForImages ( function() {
			panzoom = Panzoom(monitor_map_image, {
				contain: 'outside',
				startScale: 1.2,
				maxScale: 5,
				cursor:'default',
				which: 2,
				//panOnlyWhenZoomed: true,
				duration: 300,
			})

			 monitor_map.addEventListener('wheel', function(event) {
			  //if (!event.shiftKey) return
			  panzoom.zoomWithWheel(event)
			})
			//map image event
			$("#monitor_map").on('panredraw', function(e ) {
				console.log ( '===panredraw====' )
				console.log ( e.detail );
			});

			$("#monitor_map").on('paninit', function(e ) {
				console.log ( '=== paninit====' )
				console.log ( e.detail );
				$("#monitor_map").append('<div class="cartwrap"></div>')
			});

			$("#monitor_map").on('panzoomreset', function(e, panzoom, matrix  ) {
				console.log ( 'panzoomreset')
			});
		});	  
	})
	
  </script>
</body>
	