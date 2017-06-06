var config;
var utils;

var ui = (function() {
	console.log("loading ui module");
	
	var animate_update = function(e) {
		// e.style["background-color"] = "green";
		// utils.animations.opacity(e, 0.0, 1.0, 0.06, 30);
		utils.animations.bgcolor(e, 127, 255, 127, 255, 255, 255, 15, 0, 15, 30);
	}
	
	var main_div;
	
	var instruction_queue_table;
	var load_store_queue_table;
	var RS_add_mul_table;
	var FP_registers_table;
	var INT_registers_table;
	var memory_table;
	var FP_add_table;
	var FP_mul_table;
	var FP_div_table;
	
	var CPU_cycles_text;
	var CPU_PC_text;
	
	var elements;
	
	
	var ui_clear_memory_table = function() {
		var trs = $(memory_table).find("tr");
		for (var i = trs.length - 1; i > 0; i--) {
			trs[i].parentElement.removeChild(trs[i]);
		}
	};
	
	var ui_clear_instruction_queue_table = function() {
		var trs = $(instruction_queue_table).find("tr");
		for (var i = trs.length - 1; i > 0; i--) {
			trs[i].parentElement.removeChild(trs[i]);
		}
	};
	
	
	var ui_do_load = function() {
		console.log("ui.do_load");
		
		var get_e = function(s) { return document.getElementById(s); };
		
		main_div = get_e("main_div");
		
		instruction_queue_table = get_e("instruction_queue_table");
		load_store_queue_table = get_e("load_store_queue_table");
		RS_add_mul_table = get_e("RS_add_mul_table");
		FP_registers_table = get_e("FP_registers_table");
		INT_registers_table = get_e("INT_registers_table");
		memory_table = get_e("memory_table");
		FP_add_table = get_e("FP_add_table");
		FP_mul_table = get_e("FP_mul_table");
		FP_div_table = get_e("FP_div_table");
		
		CPU_cycles_text = get_e("CPU_cycles");
		CPU_PC_text = get_e("CPU_PC");
		
		document.body.removeChild(get_e("loading_text"));
	};
	
	var ui_reload_ui = function(conf) {
		console.log("reloading ui ...");
		
		elements = {};
		
		// (1) init load queue & store queue
		(() => {
			var trs = $(load_store_queue_table).find("tr");
			for (var i = trs.length - 1; i > 0; i--) {
				trs[i].parentElement.removeChild(trs[i]);
			}
			
			var n, p;
			
			n = conf.load_queue_size;
			p = $(trs[0].parentElement);
			var load_queue = {};
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var ele = {};
				["name", "busy", "PC", "Vk", "Qk", "addr"].forEach((e) => {
					tr.append(ele[e] = $("<td>"));
				});
				p.append(tr);
				var name = "Load" + (i + 1);
				ele.name.text(name);
				load_queue[name] = ele;
			}
			
			n = conf.store_queue_size;
			var store_queue = {};
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var ele = {};
				["name", "busy", "PC", "Vk", "Qk", "addr"].forEach((e) => {
					tr.append(ele[e] = $("<td>"));
				});
				p.append(tr);
				var name = "Store" + (i + 1);
				ele.name.text(name);
				store_queue[name] = ele;
			}
			
			elements.load_queue = load_queue;
			elements.store_queue = store_queue;
		})();
		
		
		// (2) init RS add & RS mul
		(() => {
			var trs = $(RS_add_mul_table).find("tr");
			for (var i = trs.length - 1; i > 0; i--) {
				trs[i].parentElement.removeChild(trs[i]);
			}
			
			var n, p;
			
			n = conf.n_RS_add;
			p = $(trs[0].parentElement);
			var RS_add = {};
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var ele = {};
				["name", "busy", "op", "PC", "Vj", "Qj", "Vk", "Qk"].forEach((e) => {
					tr.append(ele[e] = $("<td>"));
				});
				p.append(tr);
				var name = "Add" + (i + 1);
				ele.name.text(name);
				RS_add[name] = ele;
			}
			
			n = conf.n_RS_mul;
			var RS_mul = {};
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var ele = {};
				["name", "busy", "op", "PC", "Vj", "Qj", "Vk", "Qk"].forEach((e) => {
					tr.append(ele[e] = $("<td>"));
				});
				p.append(tr);
				var name = "Mult" + (i + 1);
				ele.name.text(name);
				RS_mul[name] = ele;
			}
			
			elements.RS_add = RS_add;
			elements.RS_mul = RS_mul;
		})();
		
		
		
		// (3) init FP regs
		(() => {
			var trs = $(FP_registers_table).find("tr");
			var tr_0 = $(trs[0]);
			var tr_1 = $(trs[1]);
			
			tr_0.find("td").toArray().forEach((e) => e.parentElement.removeChild(e));
			tr_1.find("td").toArray().forEach((e) => e.parentElement.removeChild(e));
			
			var n = conf.n_FP_registers;
			var FP_regs = {};
			for (var i = 0; i < n; i++) {
				var name = "F" + i;
				var ele = $("<td>");
				FP_regs[name] = ele;
				tr_0.append($("<td>" + name + "</td>"));
				tr_1.append(ele);
			}
			
			elements.FP_regs = FP_regs;
		})();
		
		// (4) init INT regs
		(() => {
			var trs = $(INT_registers_table).find("tr");
			var tr_0 = $(trs[0]);
			var tr_1 = $(trs[1]);
			
			tr_0.find("td").toArray().forEach((e) => e.parentElement.removeChild(e));
			tr_1.find("td").toArray().forEach((e) => e.parentElement.removeChild(e));
			
			var n = conf.n_INT_registers;
			var INT_regs = {};
			for (var i = 0; i < n; i++) {
				var name = "R" + i;
				var ele = $("<td>");
				INT_regs[name] = ele;
				tr_0.append($("<td>" + name + "</td>"));
				tr_1.append(ele);
			}
			
			elements.INT_regs = INT_regs;
		})();
		
		
		// (5) init memory table
		(() => {
			ui_clear_memory_table();
			elements.memory_table = $(memory_table);
		})();
		
		// (6) init instruction queue table
		(() => {
			ui_clear_instruction_queue_table();
			elements.instruction_queue_table = $(instruction_queue_table);
		})();
		
		// (7) init Memory Controller
		(() => {
			elements.MC = {
				is_running : $("#MC_is_running"),
				type : $("#MC_type"),
				name : $("#MC_name"),
				time : $("#MC_time")
			};
		})();
		
		// (8) init FP Adder
		(() => {
			var tbody = $(FP_add_table).find("tbody");
			var trs = tbody.find("tr");
			for (var i = 0; i < trs.length; i++) {
				trs[i].parentElement.removeChild(trs[i]);
			}
			
			var n = conf.t_add_sub.length;
			var FPA = [];
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var tmp = {};
				["stage", "busy", "op", "name", "time"].forEach((s) => {
					tr.append(tmp[s] = $("<td>"));
				});
				tbody.append(tr);
				tmp.stage.text(i);
				FPA.push(tmp);
			}
			
			elements.FPA = FPA;
		})();
		
		// (9) init FP Multiplier
		(() => {
			var tbody = $(FP_mul_table).find("tbody");
			var trs = tbody.find("tr");
			for (var i = 0; i < trs.length; i++) {
				trs[i].parentElement.removeChild(trs[i]);
			}
			
			var n = conf.t_mul.length;
			var FPM = [];
			for (var i = 0; i < n; i++) {
				var tr = $("<tr>");
				var tmp = {};
				["stage", "busy", "op", "name", "time"].forEach((s) => {
					tr.append(tmp[s] = $("<td>"));
				});
				tbody.append(tr);
				tmp.stage.text(i);
				FPM.push(tmp);
			}
			
			elements.FPM = FPM;
		})();
		
		// (10) init FP Divider
		(() => {
			elements.FPD = {
				is_running : $("#FPD_is_running"),
				type : $("#FPD_type"),
				name : $("#FPD_name"),
				time : $("#FPD_time")
			};
		})();
		
		
		
		// done
		main_div.style.visibility = "visible";
		
		for (var i = 0; i < main_div.children.length; i++) {
			setTimeout(function() {
				var t = i;
				return function() {
					animate_update(main_div.children[t]);
				}
			}(), i * 100);
		}
	};
	
	var update_func = function(_e) {
		var e = _e;
		return function(v) {
			$(e).text(v + ""), animate_update(e);
		};
	};
	
	var add_memory_table_entry = (count) => {
		var trs = elements.memory_table.find("tr");
		var tmp = $("<tr>");
		var ret = {
			addr : $("<td>"),
			val : $("<td>")
		};
		tmp.append(ret.addr);
		tmp.append(ret.val);
		tmp.insertAfter(trs[count]);
		return ret;
	};
	
	var add_instruction_queue_table_entry = () => {
		var tmp = $("<tr>");
		var ret = {
			PC : $("<td>"),
			name : $("<td>"),
			dest : $("<td>"),
			src1 : $("<td>"),
			src2 : $("<td>"),
			issue : $("<td>"),
			execution : $("<td>"),
			writeback : $("<td>")
		};
		tmp.append(ret.PC);
		tmp.append(ret.name);
		tmp.append(ret.dest);
		tmp.append(ret.src1);
		tmp.append(ret.src2);
		tmp.append(ret.issue);
		tmp.append(ret.execution);
		tmp.append(ret.writeback);
		elements.instruction_queue_table.append(tmp);
		return ret;
	};
	
	return {
		do_load : ui_do_load,
		reload_ui : ui_reload_ui,
		get_elements : () => elements,
		clear_memory_table : ui_clear_memory_table,
		clear_instruction_queue_table : ui_clear_instruction_queue_table,
		add_memory_table_entry : add_memory_table_entry,
		add_instruction_queue_table_entry : add_instruction_queue_table_entry,
		
		update_func : update_func,
		
		CPU_cycles_update_func : () => update_func(CPU_cycles_text),
		CPU_PC_update_func : () => update_func(CPU_PC_text)
		
	};
})();
