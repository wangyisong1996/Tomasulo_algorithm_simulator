var utils = (function() {
	
	console.log("loading utils module");
	
	var to_hex = function(n) {
		if (n == 0) {
			return "0";
		} else if (n > 0) {
			var ret = "";
			while (n > 0) {
				ret = "0123456789abcdef"[n % 16] + ret;
				n = (n - n % 16) / 16;
			}
			return ret;
		}
	};
	
	return {
		animations : {
			opacity : function(e, l, r, step, t) {
				var tmp = l;
				var x = function() {
					if (step > 0) {
						if (tmp >= r) tmp = r;
					} else {
						if (tmp <= r) tmp = r;
					}
					
					e.style.opacity = tmp;
					
					if (tmp == r) return;
					
					tmp += step;
					setTimeout(x, t);
				};
				x();
			},
			bgcolor : function(e, l1, l2, l3, r1, r2, r3, s1, s2, s3, t) {
				var t1 = l1, t2 = l2, t3 = l3;
				// var bgcolor_org = $(e)[0].style["background-color"];
				var x = function() {
					if (s1 > 0) {
						if (t1 >= r1) t1 = r1;
					} else if (s1 < 0) {
						if (t1 <= r1) t1 = r1;
					}
					
					if (s2 > 0) {
						if (t2 >= r2) t2 = r2;
					} else if (s2 < 0) {
						if (t2 <= r2) t2 = r2;
					}
					
					if (s3 > 0) {
						if (t3 >= r3) t3 = r3;
					} else if (s3 < 0) {
						if (t3 <= r3) t3 = r3;
					}
					
					$(e).css("background-color", "#" + to_hex(t1) + to_hex(t2) + to_hex(t3));
					
					if (t1 == r1 && t2 == r2 && t3 == r3) {
						// $(e).css("background-color", bgcolor_org);
						return;
					}
					
					t1 += s1, t2 += s2, t3 += s3;
					setTimeout(x, t);
				};
				x();
			}
		}
	};
})();
