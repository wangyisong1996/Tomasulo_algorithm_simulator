// A small subset of HDL
// actually Synchronous Sequential Logic (with D Flip Flops as signals)

var HDL = (function() {
	console.log("loading HDL module");
	
	var signal_list;
	
	var HDL_signal = function(u) {
		var ret = (function() {
			var value;
			var new_value;
			var has_set = false;
			
			var update_policy = u;
			
			return {
				val : function() {
					return value;
				},
				
				set : function(v) {
					// actually, a signal can only be set exactly once
					//   between two rising edges of the clock (in VHDL)
					
					new_value = v;
					has_set = true;
					
					return this;
				},
				
				clock : function() {
					// not the same mechanism as VHDL signal
					// In fact, we usually care more about wether it has been set
					
					if (has_set) {
						value = new_value;
						update_policy(value);
						has_set = false;
					}
					
					return this;
				},
				
				set_update_policy : function(f) {
					update_policy = f;
					
					return this;
				}
			};
		})();
		
		return signal_list.push(ret), ret;
	};
	
	var HDL_do_load = function() {
		console.log("HDL.do_load");
		
		signal_list = [];
	};
	
	var HDL_rising_edge = function() {
		signal_list.forEach((e) => e.clock());
	};
	
	var HDL_re_init = function() {
		signal_list = [];
	};
	
	return {
		do_load : HDL_do_load,
		signal : HDL_signal,
		rising_edge : HDL_rising_edge,
		re_init : HDL_re_init
	};
})();
