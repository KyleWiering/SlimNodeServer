require('newrelic');
//function strict() {"use strict";}
var http = require('http');
var fs = require('fs');
var router = require('./router');
var config = require('./config.json');
var runner = require("child_process");
//var spawn = runner.spawn;
//var phpproc = spawn('php', ['-d', 'default_socket_timeout=9999999', 'C:\\Development\\Code\\nodeserver\\postget.php']);
//var url = require('url');

http.createServer(function (req, res) {
	
	var Router = new router();
	
	var now = new Date;
	var jsonDate = now.toJSON();
	var path = Router.route(req.url);
	console.log(jsonDate + ' From: ' + req.connection.remoteAddress + ' For: ' + req.url + ' Got: ' + path.file + req.headers.host);
	var param = "";
	var splitHeader = ['waryway','com'];
	if(req.headers.host !== undefined){
		splitHeader = req.headers.host.split('.');
	}
	if(splitHeader.shift() === 'git') {
		if(path.file.indexOf("unloaded")) {
		console.log(JSON.stringify(path.suffix));
			if(path.suffix === ''){
				path.suffix = '.html';
				path.file = '/git/unloaded/index.html';
			}
			else {
				path.file = '/git'+path.file;
				if (path.suffix === 'ww'){
					//path.file + '/index.html';
					path.file = path.file.replace(".ww", ".html");
					path.suffix = '.html';
				}
			}
		}
		else {
			path.file = '/git' + path.file;
			
			if (path.suffix === 'ww'){
				//path.file + '/index.html';
				path.file = path.file.replace(".ww", ".html");
				path.suffix = '.html';
			}

		}
		if(path.file === 'git/index1.html' || path.file === '/git/index1.html')
		{
			path.file = path.file.replace("index1", "index");
		}
		
	}
/*		var options = {
			host: 'waryway.com',
			port: '99',
			path: '/git'+req.url,
			method: 'GET'
		};
		
		callback = function(response) {
		  var str = '';

		  //another chunk of data has been received, so append it to `str`
		  response.on('data', function (chunk) {
			str += chunk;
		  });

		  response.on("error", function(e){
			  console.log("Got error: " + e.message);
			});
		  
		  //the whole response has been received, so we just print it out here
		  response.on('end', function () {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(str);
			res.end();
			console.log(req.url);
			console.log(str);
		  });
		}

		http.request(options, callback).end();
		
	}
	else
	{*/
		
		if(path.file === '404.htm')
		{
			res.writeHead(404, {'Content-Type': 'text/html'});
		}
		
		if(path.file === 'index1.html' || path.file === '/index1.html')
		
		{
			path.suffix = "ww";
			path.file = path.file.replace("index1", "index");
			path.file = path.file.replace(".html", ".htm");
		}
		
		if(path.file === 'index.htm'||path.file === '/index.htm')
		{
			path.suffix = "ww";
			path.file = path.file.replace(".htm", ".ww");
		}
		
		if(path.suffix === 'php') {
			console.log("C:\\Development\\Code\\waryway" + path.file);
			console.log(JSON.stringify(path));
			//C:\\Development\\Code\\nodeserver\" + path.file + 
			runner.exec("php " + "C:\\Development\\Code\\waryway" + path.file + " "+  path.params, function(err, stdout, stderr) { sendData(err, stdout, stderr, res); });
		}
		else if(path.suffix === 'ww') {
			var response ='';
			try {
				var page = require(config.serverRoot + path.file.replace(".ww", ".jss"));
				var test = new page();
				response = test.view();
			} catch (err) {
				console.log(err);
				path.file = config.serverRoot + '/404.htm';
				response = fs.readFileSync(path.file);
			}	
			
			res.writeHead(200, config.validSuffix[path.type]);
			res.write(response);
			res.end();
		}
		else if(path.suffix === 'jss' || path.suffix === '') {
			if(path.suffix === '') {
				path.file = path.file + '/index.js';
			}
			
			var command = config.serverRoot + path.file.replace(".jss", ".js");
			var spawn = require('child_process').spawn;
			console.log('node ' +'"'+command+'"');
			child  = spawn('node', [command]);
			
			child.stdout.on('data', function (data) {
			  response = data;
			  console.log(config.validSuffix['jss']);
				res.writeHead(200, config.validSuffix['jss']);
				res.write(response+'');
				res.end();	
			  //console.log('stdout: ' + data);
			});

			child.stderr.on('data', function (data) {
			  console.log('stderr: ' + data);
				
			});

			child.on('close', function (code) {
			  if(code !== 0) {
				path.file = config.serverRoot + '/404.htm';
				response = fs.readFileSync(path.file);
				res.writeHead(500, config.validSuffix['jss']);
				res.write(response+'');
				res.end();	
			  }
			  
			});
			
			
		}
		else
		{	
			var response ='';
			try {
				
				response = fs.readFileSync(config.serverRoot + path.file);
			} catch (err) {
				path.file = config.serverRoot + '/404.htm';
				response = fs.readFileSync(path.file);
			}	
			res.writeHead(200, config.validSuffix[path.suffix]);
			res.write(response);
			res.end();
		}
	//}
 }).listen(80);

function sendData(err, stdout, stderr, response)
{
  if (err) return sendError(500, stderr, response);
  response.writeHead(200,{'Content-Type': 'text/html'});
  //response.write();
  response.end(stdout);
}

function sendError(errCode, errString, response)
{
  response.writeHead(errCode, {"Content-Type": "text/plain;charset=utf-8"});
  response.write(errString + "\n");
  response.end();
  return false;
}




