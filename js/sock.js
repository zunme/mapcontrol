(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.MapSock = factory());
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
	var sock;
					  
	function MapSock(addr,fnInitCallBack ,fnCallBack ) {
		sock = new WebSocket(addr);
        sock.onopen = function () {
        	console.log ( "======== sock opend ===")
			fnInitCallBack();
        };
        sock.onclose = function () {
            console.log ( "===== close ====")
        };
        sock.onmessage = function (evt) {
        	 fnCallBack(evt.data) 
        }
		function send( data ){
			if( typeof data == 'object' ) data = JSON.stringify(data);
			sock.send(data)
		}
		function close () {
			sock.close();
			console.log ( "call close..")
		}
		
		return {
			send:send
			,close:close
		}
	}

return MapSock;
})));