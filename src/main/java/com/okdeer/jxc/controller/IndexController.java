package com.okdeer.jxc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
//@RequestMapping()
public class IndexController {
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String toReport() {
		return "index";
	}
	
	@RequestMapping(value = "/sessionKeeper", method = RequestMethod.GET)
	public String toKeepSession(){
		return "sessionKeeper";
	}
}
