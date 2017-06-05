var config = (function() {
	console.log("loading config module");
	
	var conf_default = {
		load_queue_size : 3,
		store_queue_size : 3,
		n_RS_add : 3,
		n_RS_mul : 2,
		n_FP_registers : 11,
		n_INT_registers : 11,
		t_add : 2,
		t_sub : 2,
		t_mul : 10,
		t_div : 40,
		t_load : 2,
		t_store : 2,
		FP_reg_vals : [
			"F1 233",
			"F4 10.0",
			"F2 1e-2"
		].join("\n"),
		INT_reg_vals : [
			"R0 123",
			"R3 100"
		].join("\n"),
		mem_vals : [
			"0 1.0",
			"3 233",
			"2 1e9",
			"34 0.666666",
			"145 3.5",
			"45 0.1"
		].join("\n"),
		instructions : [
			"LD F6, 34(R2)",
			"LD F2, 45(R3)",
			"MULD F0, F2, F4",
			"SUBD F8, F2, F6",
			"DIVD F10, F0, F6",
			"ADDD F6, F8, F2"
			
			// "LD F3, 3(R2)",
			// "LD F4, 0(R5)",
			// "SUBD F1, F3, F4",
			// "DIVD F4, F1, F3",
			// "MULD F3, F1, F3",
			// "ST F3, 233(R2)",
			// "ST F4, 100(R1)"
		].join("\n")
	};
	
	return {
		get_default : function() {
			var ret = {};
			for (var k in conf_default) {
				ret[k] = conf_default[k];
			}
			return ret;
		}
	};
})();
