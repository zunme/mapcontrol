<?php
$aaa = $_REQUEST['type'];
?>
<!DOCTYPE html>
<html>
  <head>
    <title>View Rotation</title>
    <link rel="stylesheet" href="ol.css" type="text/css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="ol.js"></script>
  </head>
  <body>
    <div id="map" class="map"></div>
<script type="text/javascript">
 
	//37.2086391, 127.569751
    //openlayers3

    //지도 레이어용
	var extent = [127.567751, 37.2086391, 0, 0]  // image size is 128x128 px
	//상하 : 숫자가 클수록 아래로 내려감.
	//좌우 : 숫자가 클수록 아래로 내려감.
	
    //맵핑 레이어용
	var extent_img = [127.558852, 37.1981391, 127.576751, 37.2203291] // 타입1
//	var extent_img = [127.558552, 37.1978391, 127.576751, 37.2199291] // 타입2
	//첫번째값 :  위쪽, 숫자가 낮을수록 위로 올라감.
	//두번째값 : 왼쪽, 숫자가 낮을수록 오른쪽으로 이동
	//세번째값 :  아래쪽, 숫자가 낮을수록 위로 올라감.
	//네번째값 : 오른쪽, 숫자가 낮을수록 왼쪽으로 이동


	//마커 값
	var iconFeatures=[];

	var iconFeature = new ol.Feature({ // 기준 포인트
  	  geometry: new ol.geom.Point([127.5719949, 37.2086739,0,0]),
	  name: 'Null Island',
	  population: 4000,
	  rainfall: 500
	});

	var iconFeature2 = new ol.Feature({ // 윗쪽 삼거리
  	  geometry: new ol.geom.Point([127.564213, 37.2113521,0,0]),
	  name: 'Null Island',
	  population: 4000,
	  rainfall: 500
	});

	var iconFeature3 = new ol.Feature({ // 오른쪽 홀 포인트
  	  geometry: new ol.geom.Point([127.5692305, 37.2142239,0,0]),
	  name: 'Null Island',
	  population: 4000,
	  rainfall: 500
	});

	var iconFeature4 = new ol.Feature({ // 왼쪽 끝
  	  geometry: new ol.geom.Point([127.5725405, 37.2028705,0,0]),
	  name: 'Null Island',
	  population: 4000,
	  rainfall: 500
	});

	iconFeatures.push(iconFeature);
	iconFeatures.push(iconFeature2);
	iconFeatures.push(iconFeature3);
	iconFeatures.push(iconFeature4);

	var vectorSource = new ol.source.Vector({
		features: iconFeatures //add an array of features
	});

	var iconStyle = new ol.style.Style({
	  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		anchor: [50, 50],
		anchorXUnits: 'pixels',
		anchorYUnits: 'pixels',
		opacity: 1,
		src: 'img/marker.png'
	  }))
	});


	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: iconStyle
	});

    var map = new ol.Map({
        layers: [
              new ol.layer.Tile({
                
                source: new ol.source.OSM()
              }),
		<?php if($aaa=="2"){?>

              new ol.layer.Image({
                  source: new ol.source.ImageStatic({
                    url: 'img/img_maps.jpg',
                    crossOrigin: '',
                    projection: 'EPSG:4326',
                    imageExtent: extent_img,
                  }),
				opacity: 0.5,
              }),
		<?php }?>
			vectorLayer,

        ],
        target: 'map',
        view: new ol.View({
            projection : 'EPSG:4326',      
            center: extent,
			//rotation: -80.105,
            zoom: 19
        })
    });

    //leaflet 지도
//    var leafletMap = L.map('leafletMap').setView([37.2086391, 127.569751],16)
    
//    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
    
//    var imageUrl = '/images/common/example5Leaflet.png',
  //      imageBounds = [[37.518308, 126.924628], [37.520308, 126.926628]];
 
//    L.imageOverlay(imageUrl, imageBounds).addTo(leafletMap);
    

</script>
  </body>
</html>