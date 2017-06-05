var utils;
var ui;
var config;
var HDL;
var CPU;

var main = (function() {
	console.log("loading main module");
	
	var conf_curr;
	
	var btn_power;
	var btn_run;
	var btn_pause;
	var btn_step;
	var btn_options;
	
	var options_ins;
	var options_mem;
	var options_FP;
	var options_INT;
	
	var state;
	// off, paused, running
	
	var trans_state = (s) => {
		state = s;
		
		if (s == "off") {
			btn_power.removeClass("active");
			
			btn_run.removeClass("active");
			btn_run.attr("disabled", "disabled");
			
			btn_pause.removeClass("active");
			btn_pause.attr("disabled", "disabled");
			
			btn_step.attr("disabled", "disabled");
		} else if (s == "paused") {
			btn_power.addClass("active");
			
			btn_run.removeClass("active");
			btn_run.removeAttr("disabled");
			
			btn_pause.addClass("active");
			btn_pause.removeAttr("disabled");
			
			btn_step.removeAttr("disabled");
		} else if (s == "running") {
			btn_power.addClass("active");
			
			btn_run.addClass("active");
			btn_run.removeAttr("disabled");
			
			btn_pause.removeClass("active");
			btn_pause.removeAttr("disabled");
			
			btn_step.attr("disabled", "disabled");
		}
	};
	
	var power_button_click = () => {
		if (state == "off") {
			trans_state("paused");
			CPU.power_on();
		} else if (state == "paused" || state == "running") {
			trans_state("off");
			CPU.power_off();
		}
	};
	
	var run_button_click = () => {
		// state must be paused
		if (state == "paused") {
			trans_state("running");
			CPU.run();
		}
	};
	
	var pause_button_click = () => {
		// state must be running
		if (state == "running") {
			trans_state("paused");
			CPU.pause();
		}
	};
	
	var step_button_click = () => {
		// state must be paused
		if (state == "paused") {
			CPU.step();
		}
	};
	
	var options_button_click = () => {
		if (state == "running") {
			trans_state("paused");
			CPU.pause();
		}
		
		options_ins.text(conf_curr.instructions);
		options_mem.text(conf_curr.mem_vals);
		options_FP.text(conf_curr.FP_reg_vals);
		options_INT.text(conf_curr.INT_reg_vals);
		
		$("#options_modal").modal();
	};
	
	var options_save = () => {
		if (state == "paused" || state == "running") {
			CPU.power_off();
			trans_state("off");
		}
		
		conf_curr.instructions = options_ins[0].value;
		conf_curr.mem_vals = options_mem[0].value;
		conf_curr.FP_reg_vals = options_FP[0].value;
		conf_curr.INT_reg_vals = options_INT[0].value;
		
		CPU.load_config(conf_curr);
		
		$("#options_modal").modal("hide");
	};
	
	return {
		do_load : function() {
			console.log("main.do_load");
			HDL.do_load();
			ui.do_load();
			CPU.do_load();
			CPU.load_config(conf_curr = config.get_default());
			
			btn_power = $("#btn_power");
			btn_run = $("#btn_run");
			btn_pause = $("#btn_pause");
			btn_step = $("#btn_step");
			btn_options = $("#btn_options");
			
			options_ins = $("#options_ins");
			options_mem = $("#options_mem");
			options_FP = $("#options_FP");
			options_INT = $("#options_INT");
			
			btn_power.click(power_button_click);
			btn_run.click(run_button_click);
			btn_pause.click(pause_button_click);
			btn_step.click(step_button_click);
			btn_options.click(options_button_click);
			
			$("#options_save").click(options_save);
			
			trans_state("off");
		}
	};
})();
