let {PythonShell} = require('python-shell')
// TODO: Function to get logger.py location on system
var scriptPath = '/home/turuga/Documents/Shared/Productive/Projects/VisualKeyloggger/logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
var spKey = 'not_interested'
// ---------------------------------------------------------------------
/* 
 * This function starts and deals with anything keylogger related. First, it starts the keylogger with python-shell,
 * and then waits for a message to come from it. If something happens, we have a couple possible outputs
 *
 * If a key is "alphabetic" (part of the alphabet or usually used in a coding context), it'll find the correspondent key under
 * the HTMLCollection of items with the class 'key'. Once found, it'll trigger a .1s style change to that key using setTimeout
 *
 * If a key is "special" (not part of the alphabet, essencially), it'll go to a switch case to find it's correspondent symbol
 * in Material Icons. If there's a symbol for that, the 'special key button' (the last key of the HTMLCollection) will pop up 
 * in .1s, with the style change applied.
 */
function startKeylogger(){
	pyScript = new PythonShell(scriptPath,options)
	pyScript.on('message',function(message){
		var keyCollection = document.getElementsByClassName('key')
		console.log(message)
		/* ALPHABETIC BEHAVIOUR */
		if(message[0] == "'"){
			for(let i = 0; i < keyCollection.length; i++){
				// pyScript sends key as an array w single quotes and the key, this is a workaround for that
				if( keyCollection[i].innerHTML == message[1]){ 
					Object.assign(keyCollection[i].style,{
						'background-color':"lightblue",
						'color':"white"
					});	
					setTimeout( function(){
						resetter(keyCollection[i])
					}, 100)
				} else {
					console.log('searching')
				}
			}
		} else {
			var specialKeys = message.split(".")
			console.log(specialKeys[1])
			var common = ["up","down","left","right","space"]
			var commonCollection = document.getElementsByClassName('common')
			/* COMMON BEHAVIOUR */
			if (common.includes(specialKeys[1])) {
				for (let i = 0; i < commonCollection.length; i++){
					var separated = commonCollection[i].childNodes[0].textContent.split("_")
					console.log(separated)
					if(separated.includes(specialKeys[1])){
						Object.assign(commonCollection[i].style, {
							'background-color':"lightblue",
							'color':"white"
						})
						setTimeout(function(){
							resetter(commonCollection[i])
						}, 100)
					}
				}
			/* SPECIAL BEHAVIOUR */
			} else {
				var sp = document.getElementById('sp-key')
				switch(specialKeys[1]){
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
				}
				Object.assign(sp.style,{
					'background-color':"lightblue",
					'color':"white"
				})
				sp.childNodes[0].textContent = spKey
				setTimeout(function(){ resetter(sp) }, 100)
			}
		}
	})
}
// ---------------------------------------------------------------------
/* 
 * This functions kills the keylogger process. Since the switch is switched off at startup, this
 * null check is just to make sure that it doesn't try to kill what is not alive
 */
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
/* 
 * This function is specific to the special key, making it
 * "spawn" with the display change
 */
function resetter(key){
	Object.assign(key.style,{
		'background-color': "white",
		'color':"black"
	})
}
// ------------------------------------------------------------------

/* 
 * This function handles the main switch, enabling and disabling both the visual keyboard
 * and the keylogger as well
 */
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
