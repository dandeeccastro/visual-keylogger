let {PythonShell} = require('python-shell')
// TODO: Function to get logger.py location on system
var scriptPath = '/home/turuga/Documents/Shared/Productive/Projects/VisualKeyloggger/logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
var spKey = 'F'
// ---------------------------------------------------------------------
function startKeylogger(){
	pyScript = new PythonShell(scriptPath,options)
	pyScript.on('message',function(message){
		var keyCollection = document.getElementsByClassName('key')
		console.log(message)
		/* 
		 * If key is not special, it's first character is a single quote. This is good to avoid 
		 * unecessary for loops 
		 */
		if(message[0] == "'"){
			for(let i = 0; i < keyCollection.length; i++){
				// pyScript sends key as an array w single quotes and the key, this is a workaround for that
				if( keyCollection[i].innerHTML == message[1]){ 
					Object.assign(keyCollection[i].style,{
						'background-color':"lightblue",
						'color':"white"
					});	
					setTimeout( function(){
						resetter(keyCollection,i)
					}, 100)
				} else {
					console.log('searching')
				}
			}
		} else {
			var specialKeys = message.split(".")
			switch(specialKeys[1]){
				case "space":
					spKey = 'space_bar'
					break
				case "tab":
					spKey = 'keyboard_tab'
					break
				case "caps_lock":
					spKey = 'keyboard_capslock'
					break
				case "backspace":
					spKey = 'keyboard_backspace'
					break
				case "enter":
					spKey = 'keyboard_return'
					break
				case "up":
					spKey = 'keyboard_arrow_up'
					break
				case "down": 
					spKey = 'keyboard_arrow_down'
					break
				case "left": 
					spKey = 'keyboard_arrow_left'
					break
				case "right":
					spKey = 'keyboard_arrow_right'
					break
			}
			document.getElementById('sp-key').innerHTML = spKey
			Object.assign(keyCollection[keyCollection.length - 1].style,{
				'display':'inline',
				'background-color':"lightblue",
				'color':"white"
			})
			setTimeout(function(){ spResetter(keyCollection[ keyCollection.length - 1]) }, 100)
		}
	})
}
// ---------------------------------------------------------------------
function endKeylogger(){
	if(pyScript != null){
		pyScript.childProcess.kill('SIGINT')
	}
	pyScript.end(function(err){
		if (err == 'KeyboardInterrupt') {
			console.log('aff mano bom dia')
		}
		console.log('Finished w no mistakes')
	})
}
// ------------------------------------------------------------------
function resetter(collection, i){
	Object.assign(collection[i].style,{
		'background-color': "white",
		'color':"black"
	});
}
// ------------------------------------------------------------------
function spResetter(key){
	Object.assign(key.style,{
		'display':'none',
		'background-color': "white",
		'color':"black"
	})
}
// ------------------------------------------------------------------
function switx(){
	if (document.getElementById('keylogger-switch').checked){
		startKeylogger()
		document.getElementById('title-container').style.display = 'none'
		document.getElementById('keyboard-container').style.display = 'flex'
	} else {
		endKeylogger()
		document.getElementById('keyboard-container').style.display = 'none'
		document.getElementById('title-container').style.display = 'inline'
	}
}
