(function() {

	function xConsole(catchErrors) {
		this.messageBuffer = [];
		this.catchErrors = catchErrors;
		this.id = 'xconsole_' + new Date().getTime();
		this.cssDir = 'css';
		this.ready = false;
		this.move = false;
		this.enrichWithJSON();
		this.loadStyle();
		this.initEvent();
		this.counts = [];
		this.times = [];
		this.historie = [];
		this.keyCodes = {
			ARROW_UP: 38,
			ARROW_DOWN: 40,
			ENTER: 13
		},
		this.position = 0;
	}

	xConsole.prototype.initEvent = function() {
		var con = this;
		if (this.catchErrors) {
			window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {  
				con.error(errorMsg, url, lineNumber, column, errorObj);
				return con.catchErrors;
			};
		}

		window.onload = function() {
			con.ready = true;
			con.createHtml();

			var x, y, posx, posy, first = true;
			window.onmouseup = function() {
				con.move = false;
				first = true;
			};
			window.onmousemove = function(e) {
				if (con.move) {
					if (first) {
						x = e.offsetX;
						y = e.offsetY;
						first = false;
					}
					posx = e.pageX - x;
					posy = e.pageY - y;
					var el = document.getElementById(con.id);
					el.style.left = posx + 'px';
					el.style.top = posy + 'px';
				}
			};
		}
	};

	xConsole.prototype.createHtml = function(callback) {
		var con = this;
		var mainHolder = document.createElement('div');
		mainHolder.id = this.id;
		mainHolder.className = 'xconsole';
		mainHolder.onmousedown = function() {
			con.move = true;
		};
		var messageHolder = document.createElement('div');
		messageHolder.className = 'xconsole_message_holder';
		mainHolder.appendChild(messageHolder);
		var xconsole_input_indicator = document.createElement('span');
		xconsole_input_indicator.className = 'xconsole_input_indicator';
		xconsole_input_indicator.appendChild(document.createTextNode('>'))
		mainHolder.appendChild(xconsole_input_indicator);
		var xconsole_input_field = document.createElement('input');
		xconsole_input_field.className = 'xconsole_input_field';
		xconsole_input_field.type = 'text';
		xconsole_input_field.onkeydown = function(event) {
			if (event.keyCode === con.keyCodes.ENTER && this.value !== '') {
				var value = this.value;
				con.historie.push(value);
				con.position = con.historie.length;
				con.evaluation(value);
				this.value = '';
				eval(value);
				return;
			}
			if (event.keyCode === con.keyCodes.ARROW_UP) {
				return con.navigateUp(this, event);
			}
			if (event.keyCode === con.keyCodes.ARROW_DOWN) {
				return con.navigateDown(this, event);
			}
		};
		mainHolder.appendChild(xconsole_input_field);
		document.body.appendChild(mainHolder);
		for (var i in this.messageBuffer) {
			this[this.messageBuffer[i].level].apply(this, this.messageBuffer[i].message);
		}
	};

	xConsole.prototype.navigateUp = function(elemnt, event) {
		var newValue;
		event.preventDefault();
		if (this.position > 0) {
			this.position--;
		}
		newValue = this.historie[this.position];
		elemnt.value = newValue;
		return false;
	};

	xConsole.prototype.navigateDown = function(elemnt, event) {
		var newValue;
		event.preventDefault();
		if (this.position < this.historie.length) {
			this.position++;
		}
		newValue = this.historie[this.position];
		if (typeof newValue === 'undefined') {
			newValue = '';
		}
		elemnt.value = newValue;
		return false;
	};

	xConsole.prototype.enrichWithJSON = function() {
		"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,r,o,f,u,i=gap,p=e[t];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(t)),"function"==typeof rep&&(p=rep.call(e,t,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":case"null":return String(p);case"object":if(!p)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(p)){for(f=p.length,n=0;f>n;n+=1)u[n]=str(n,p)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+i+"]":"["+u.join(",")+"]",gap=i,o}if(rep&&"object"==typeof rep)for(f=rep.length,n=0;f>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));else for(r in p)Object.prototype.hasOwnProperty.call(p,r)&&(o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+i+"}":"{"+u.join(",")+"}",gap=i,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var r;if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var n,r,o=t[e];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r=walk(o,n),void 0!==r?o[n]=r:delete o[n]);return reviver.call(t,e,o)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
	};

	xConsole.prototype.getMessageContainer = function() {
		for (var i in document.getElementById(this.id).childNodes) {
			if (document.getElementById(this.id).childNodes[i].className.indexOf('xconsole_message_holder') > -1) {
				return document.getElementById(this.id).childNodes[i];
				break;
			}
		}
	};

	xConsole.prototype.logMessage = function(level, message) {
		var logMessage = '<p class="xconsole_log_message '+ level + '">';
		logMessage += message;
		logMessage += '</p>';
		if (!this.ready) {
			this.messageBuffer.push({level: level, message:message});
		} else {
			this.getMessageContainer().innerHTML += logMessage;
			this.scrollToMessage();
		}
	};

	xConsole.prototype.scrollToMessage = function() {
		var objDiv = document.getElementById(this.id);
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	xConsole.prototype.loadStyle = function() {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = this.cssDir + '/console.css';
		document.head.appendChild(link);
	};

	xConsole.prototype.replacer = function(match, pIndent, pKey, pVal, pEnd) {
		var key = '<span class=json-key>';
		var val = '<span class=json-value>';
		var str = '<span class=json-string>';
		var r = pIndent || '';
		if (pKey)r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
		if (pVal) r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
		return r + (pEnd || '');
	};

	xConsole.prototype.prettyPrint = function(obj) {
		var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
		return JSON.stringify(obj, null, 3)
			.replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
			.replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(jsonLine, this.replacer);
	};

	xConsole.prototype.clear = function() {
		this.getMessageContainer().innerHTML = '';
	};

	xConsole.prototype.count = function(label) {
		if (typeof label === 'undefined') {
			return;
		}
		if (typeof this.counts[label] === 'undefined') {
			this.counts[label] = 1;	
		} else {
			this.counts[label]++
		}
		this.logMessage('log', label + ':' + this.counts[label]);
	};

	xConsole.prototype.time = function(label) {
		if (typeof label === 'undefined') {
			return;
		}
		this.times[label] = new Date().getTime();	
	};

	xConsole.prototype.timeEnd = function(label) {
		if (typeof label === 'undefined') {
			return;
		}
		if (typeof this.times[label] !== 'undefined') {
			this.logMessage('log', label + ':' + (new Date().getTime() - this.times[label]) + 'ms');
			
		}
	};

	xConsole.prototype.print = function(name, args) {
		var buffer = [];
		for (var i in args) {
			var arg = args[i];
			if (typeof arg === 'object') {

				buffer.push(this.prettyPrint(arg));
				continue;
			}
			buffer.push(arg);
		}
		this.logMessage(name, buffer);
	};

	xConsole.prototype.evaluation = function(input) {
		this.logMessage('log', '<span class="xconsole_input_indicator">&gt;</span>' + input);
	};

	xConsole.prototype.log = function() {
		this.print('log', arguments);
	};

	xConsole.prototype.dir = function() {
		this.print('log', arguments);
	};

	xConsole.prototype.dirxml = function() {
		this.print('log', arguments);
	};

	xConsole.prototype.debug = function() {
		this.print('debug', arguments);	
	};

	xConsole.prototype.error = function() {
		this.print('error', arguments);	
	};

	xConsole.prototype.info = function() {
		this.print('info', arguments);	
	};

	xConsole.prototype.group = function() {
		// not implemented yet
	};

	xConsole.prototype.groupCollapsed = function() {
		// not implemented yet
	};

	xConsole.prototype.groupEnd = function() {
		// not implemented yet
	};

	window.console = new xConsole(true);

}).call(this);
