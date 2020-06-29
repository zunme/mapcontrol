var gis = {
  /**
  * All coordinates expected EPSG:4326
  * @param {Array} start Expected [lon, lat]
  * @param {Array} end Expected [lon, lat]
  * @return {number} Distance - meter.
  */
  calculateDistance: function(start, end) {
    var lat1 = parseFloat(start[1]),
        lon1 = parseFloat(start[0]),
        lat2 = parseFloat(end[1]),
        lon2 = parseFloat(end[0]);

    return gis.sphericalCosinus(lat1, lon1, lat2, lon2);
  },
  /**
  * All coordinates expected EPSG:4326
  * @param {number} lat1 Start Latitude
  * @param {number} lon1 Start Longitude
  * @param {number} lat2 End Latitude
  * @param {number} lon2 End Longitude
  * @return {number} Distance - meters.
  */
  sphericalCosinus: function(lat1, lon1, lat2, lon2) {
    var radius = 6371e3; // meters
    var dLon = gis.toRad(lon2 - lon1),
        lat1 = gis.toRad(lat1),
        lat2 = gis.toRad(lat2),
        distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * radius;

    return distance;
  },

  /**
  * @param {Array} coord Expected [lon, lat] EPSG:4326
  * @param {number} bearing Bearing in degrees
  * @param {number} distance Distance in meters
  * @return {Array} Lon-lat coordinate.
  */
  createCoord: function(coord, bearing, distance) {
    /** http://www.movable-type.co.uk/scripts/latlong.html
    * φ is latitude, λ is longitude, 
    * θ is the bearing (clockwise from north), 
    * δ is the angular distance d/R; 
    * d being the distance travelled, R the earth’s radius*
    **/
    var 
      radius = 6371e3, // meters
      δ = Number(distance) / radius, // angular distance in radians
      θ = gis.toRad(Number(bearing));
      φ1 = gis.toRad(coord[1]),
      λ1 = gis.toRad(coord[0]);

    var φ2 = Math.asin(Math.sin(φ1)*Math.cos(δ) + 
      Math.cos(φ1)*Math.sin(δ)*Math.cos(θ));

    var λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ)*Math.cos(φ1),
      Math.cos(δ)-Math.sin(φ1)*Math.sin(φ2));
    // normalise to -180..+180°
    λ2 = (λ2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; 

    return [gis.toDeg(λ2), gis.toDeg(φ2)];
  },
  /**
   * All coordinates expected EPSG:4326
   * @param {Array} start Expected [lon, lat]
   * @param {Array} end Expected [lon, lat]
   * @return {number} Bearing in degrees.
   */
  getBearing: function(start, end){
    var
      startLat = gis.toRad(start[1]),
      startLong = gis.toRad(start[0]),
      endLat = gis.toRad(end[1]),
      endLong = gis.toRad(end[0]),
      dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat/2.0 + Math.PI/4.0) / 
      Math.tan(startLat/2.0 + Math.PI/4.0));

    if (Math.abs(dLong) > Math.PI) {
      dLong = (dLong > 0.0) ? -(2.0 * Math.PI - dLong) : (2.0 * Math.PI + dLong);
    }

    return (gis.toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  },
  toDeg: function(n) { return n * 180 / Math.PI; },
  toRad: function(n) { return n * Math.PI / 180; }
};

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.CourseBox = factory());
}(this, (function () {
	var __assign = function() {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	
	var indexKey
	var halldata
	var caddie_template;
	function CourseBox( idxname ) {
		var cartinCourse ={};
		var datalist = {}
		var leftboxwidth = 150; //코스이름박스 width
		var boxheight = 100;
		indexKey = idxname;
		
		var halldata = {};
		var waitingdata = {};
		var template = document.querySelector("#template-coursebox").innerHTML;
		var waiting_template, caddie_template;

		$.each( coursedata,  function (idx , courserow) {
			var distancedata = {};
			var beforelat = 0;beforelng=0;
			var hall=[];
			var totaldistance = 0, start=0;
			
			
			
			var fromstart = 0, beforpoint = null , halltmp;
			//var reshtml = html.replace("{title}", courserow.courseName).replace("{id}", courserow.id); 	$("#courseboxarea").append( reshtml);
			
			$.each ( courserow.points , function ( p_idx, p_row){
				var distance = 0;
				if( p_row.hole > 0 ){
					var holeNo = "hall_" + p_row.hole;
					if( halltmp != null && halltmp.hole != p_row.hole ){
						hall.push ( halltmp );
						halltmp ={hole: p_row.hole , fromstart : null, distance :null}
					}
					if (halltmp == null)  halltmp ={hole: p_row.hole , fromstart : null, distance :null}
					if( beforpoint !== null) {
						distance = Math.floor(gis.calculateDistance ( beforpoint, [p_row.lat, p_row.lng] ) );
					}
					fromstart += distance;
					if ( halltmp.fromstart == null ) halltmp.fromstart = fromstart;
					if( p_row.isHall =='Y') halltmp.distance += distance;
					coursedata[idx].points[p_idx].fromstart = fromstart;
					
					beforpoint = [p_row.lat, p_row.lng];
					totaldistance = halltmp.distance + halltmp.fromstart; 
				}else if( halltmp != null )	{hall.push ( halltmp ); halltmp = null;}
			})
			coursedata[idx].hall = hall;
			coursedata[idx].totaldistance = totaldistance;
			$.each ( coursedata[idx].hall , function ( h_idx, h_row){
				coursedata[idx].hall[h_idx].size =  { width : h_row.distance / totaldistance, left : h_row.fromstart / totaldistance  }
			})
			var res = Mustache.render( template, coursedata[idx] )
			$("#courseboxarea").append( res);
			
			halldata["c"+courserow.id]=coursedata[idx];
		})
		resize()
		$(window).resize(resize);
		function resize() {
			var boxwidth = $("#courseboxarea").width() - leftboxwidth - 5;
			$(".courselinewrap").each(function() { $(this).width( boxwidth) })
			$(".course_td_row").each(function() { $(this).height( boxheight) })
			$(".coursehallrange").each( function () {
				$(this).css("width", $(this).data("width") * boxwidth ).css("left", $(this).data("left") * boxwidth )
			})
			$(".coursehallname").each( function () {
				$(this).css("width", $(this).data("width") * boxwidth ).css("left", $(this).data("left") * boxwidth )
			})
			
		}
		function unsetdata( key ){
			if( typeof key !='string') key = key+"";
			if ( typeof datalist[key] != "undefined"){
				delete datalist[key];
				$("#circle" + key ).remove();
			}
			if ( typeof waitingdata[key] != "undefined"){
				delete waitingdata[key];
				$("#waiting" + key ).remove();
			} 
		}
		function setData ( data ){
			var key  = ""+data[indexKey]
			var olddata = datalist[key];
			var obj = conv(data)
			var left;
			if (caddie_template == null ) caddie_template = $("#template-coursebox-caddie").html()
			if (waiting_template == null ) waiting_template = $("#template-coursebox-caddie-waiting").html()
			/*if ( obj.nowcourse == "0" || obj.holeNo == "0"){
				
					return;
			}else*/
			if (obj.isWating || obj.isEnd) {
				var res = Mustache.render( waiting_template, obj )
				if ( typeof olddata != "undefined" ){
					$("#circle" + key ).remove();
					delete datalist[key];
				}
				if ( typeof waitingdata[key] =="undefined"){
					$("#waiting"  + (obj.nowcourse < 1 ||obj.isEnd || obj.fhs==0 ? '': obj.nowcourse) ).append(res);
				}else if (waitingdata[key].nowcourse != obj.nowcourse , waitingdata[key].isEnd != obj.isEnd ) {
					$("#waiting" + key ).remove();  
					$("#waiting"  + (obj.nowcourse < 1 ||obj.isEnd || obj.fhs==0 ? '': obj.nowcourse) ).append(res);
				}
				waitingdata[key] = obj;
				return;
			}else {
				
				var point = search( halldata[ "c"+obj.nowcourse ].points, "ord",obj.positionNo, false)
				if ( point.length < 1) return;
				else point = point[0];
				if( typeof point.fromstart !='undefined'){
					left = point.fromstart / halldata[ "c"+obj.nowcourse ].totaldistance * 100 //$("#courlinewrap"+obj.nowcourse).width() )
					obj.left = left;
				}else {
					obj.left = 10000;
					console.log ( "=== wa_en==")
					console.log ( obj )
				}

			}
			
			var res = Mustache.render( caddie_template, obj )
			if ( typeof olddata == "undefined") {
				datalist[key] = obj;
				$("#courline" + obj.nowcourse ).append ( res)
			}
			else {
				 if ( datalist[key].nowcourse != obj.nowcourse || datalist[key].isWating != obj.isWating || datalist[key].isEnd != obj.isEnd){
					 $("#circle" + key ).remove();
					 $("#courline" + obj.nowcourse ).append( res)
				 }else {
					 $("#circle" + key ).data("left", obj.left).css("left", obj.left+"%")
				 }
				datalist[key] = obj;
			}
			var sorted = coursesort( obj.nowcourse );
			for ( var i in sorted ){
				if( i %2 == 0){
					$("#circle" + sorted[i][0]).removeClass("circleEven").addClass("circleOdd")
				}else{
					$("#circle" + sorted[i][0]).removeClass("circleOdd").addClass("circleEven")	
				}
			}
		}
		function coursesort( course ){
			//console.log ( datalist )
			var sortable = []
			for ( var caddie in datalist ) {
				if ( datalist[caddie].nowcourse == course && !datalist[caddie].isEnd && !datalist[caddie].isWating){
					sortable.push( [caddie, datalist[caddie].left])
				}
			}
			sortable.sort(function(a, b) {
				return a[1] - b[1];
			});
			return sortable;
		}
		function conv(data){
			var obj = {}
			// fci : 시작코스
			// courseidx : 현재 코스
			// ctt : "CA" - 주의표시
			obj.id = data[indexKey];
			obj.name = data.caddieName; 
			obj.nowcourse = data.courseIdx;
			obj.startcourse = data.fci;
			obj.moretype = data.ctt;
			obj.positionNo = data.pointNo
			obj.holeNo = data.holeNo;
			
			
			obj.isWating = false;
			obj.isEnd = false;
			
			obj.fhs = data.fhs
			
			if ( obj.positionNo == null || obj.positionNo < 1 || obj.nowcourse == 0 || obj.holeNo < 1 ){
				obj.isWating = true;
				if(obj.fhs> 9) obj.isEnd = true;
			}
			/*
			else if(data.fhs = 0) {
			 	return obj;
			}else if ( data.fhs < 10) {
				obj.isWating =true;
			}else obj.isEnd = true;
			*/
				/*
				var pntNo = Math.floor(cart.pos);
				var cs = courseIdx > 0 ? $.Urban.findObj($.control.crs, 'idx', courseIdx) : null;
        		var pnt = pntNo > 0 && cs != null && cs.points.length > pntNo ? cs.points[pntNo - 1] : null;
				if (pntNo != 0 && cart.holeNo != 0 && courseIdx != 0 && pnt != null && pnt.hole_number != 0) {
				}else {
				  //waiting
				  	if( latlng.fhs == 0 ){
						//append 
					}else if ( latlng.fhs < 10){
						//setWaitingCart
					}else {
						// cart.append "종료 text"
					}
				}
			*/
			return obj;
		}
		return {
			setData : setData,
			getData : function () {return cartinCourse;},
			sort : coursesort
		}
	}

return CourseBox;
})));