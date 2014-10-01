function Router() {
	"use strict";
	this.URL = require('URIjs');
	this.config = require('./config.json');
	
}

Router.prototype.route = function(incomingURL){
	var url = this.URL(incomingURL);
	
	
	if(url.path() === "" || url.path() === "/" || url.path() === "\\"){
		return {"file":"\\index.ww","type":this.config.validSuffix.ww, "suffix":"ww"};
	}
	
	if(this.isValidSuffix(url.suffix())){
		return {"file":url.path(),"type":this.config.validSuffix[url.suffix()], "suffix":url.suffix(), "params":url.query().replace("&", " ")};
	}
	
	return {"file":"/404.htm"};
};

Router.prototype.isValidSuffix = function(suffix){
	if(typeof(this.config.validSuffix[suffix]) !== 'undefined')
	{
		return true;
	}
	return false;
};

module.exports = Router;