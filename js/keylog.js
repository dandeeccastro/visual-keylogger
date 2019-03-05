/* FUNDAMENTAL LIBRARY IMPORTS */ 
let {PythonShell} = require('python-shell')
const kb = require('keyboard-layout')
// TODO: Function to get logger.py location on system
/* CONSTANT VARIABLES */
const modalList = ['caps_lock','shift','ctrl','alt']
const common = ["up","down","left","right","space"]
/* GLOBAL VARIABLES */
var digitAlternates = []
var scriptPath = '/home/dundee/Documents/VisualKeyLogger/logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
var spKey = 'not_interested'
var modal = []
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
		var keyCollection = document.getElementsByClassName('alphabetic')
		/* ALPHABETIC BEHAVIOUR */
		if(message[0] == "'"){
			for(let i = 0; i < keyCollection.length; i++){
				// pyScript sends key as an array w single quotes and the key, this is a workaround for that
				if( keyCollection[i].innerHTML == message[1]){ 
					Object.assign(keyCollection[i].style,{
						'background-color':"lightblue", 
						'color':"white"
					});	
					keyDisplayChanger(message[1])
					setTimeout( function(){
						resetter(keyCollection[i])
					}, 100)
				}
			}
		} else {
			var specialKeys = message.split(".")
			console.log(specialKeys[1])
			keyDisplayChanger(specialKeys[1])
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
	spKey = 'not_interested'
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
// ------------------------------------------------------------------
/*
 * This function changes the keyboard layout based on modal key presses. 
 * A modal key press is a fancy way of saying Shift, Caps and Alt Gr, and 
 * this function is called when these keys are pressed to change the key display
 * accordingly. It does so by using the keyboard-layout package
 *
 * In this function you'll find three basic key types: "alphabetic", numeric
 * and others. Alphabetic and numeric key changes are made by using the following 
 * patterns from the kb layout module: 
 *
 * Key + <uppercase letter>
 * Digit + <number in question>
 *
 *
 * */
function keyDisplayChanger(key){
	var keySet = document.getElementsByClassName('key')
	/* Setting modal on modal array */ 
	if (modalList.includes(key)) {
		console.log('it is a modal') 
		if(modal.includes(key)){
			modal.pop()
		}else{
			modal.push(key)
		}
	}
	console.log(modal)
	var state
	/* Setting state based by modal array */
	if (modal.length == 0) {
		state = 'unmodified'
	} else if (modal.includes('caps_lock')) {
		state = 'withCaps'
	} else if (modal.includes('shift')){
		state = 'withShift'
	}
	/* ISSUES WITH THIS SPECIFIC LOOP 
		- This code is actual spaghetti, it is not optimized and needs to be polished
		- Code changes content once, never changes back
	*/
	console.log(digitAlternates)
	console.log('NASTY FOR LOOP START')
	for (let i = 0; i < keySet.length; i++){
		var alphabetic, digit, other
		var currKeyCode = keySet[i].textContent.charCodeAt(0)
		digit = ((currKeyCode > 47 && currKeyCode < 58) || digitAlternates.includes(keySet[i]))
		alphabetic  = ((currKeyCode > 96 && currKeyCode < 123) || (currKeyCode > 64 && currKeyCode < 91))
		other = (keySet[i].textContent.length != 1 || (!digit && !alphabetic))
		if (other){
			digit = false
			alphabetic = false
		}
		console.log('key: ' + keySet[i].textContent + ' other: ' + other + ' digit: ' + digit + ' alphabetic: ' + alphabetic)
		if (!other){
			if (state == 'unmodified'){
				if (digit){
					console.log(state)
					keySet[i].textContent = kb.getCurrentKeymap()['Digit' + keySet[i].textContent].unmodified
				}
				if (alphabetic){
					console.log(state)
					keySet[i].textContent = kb.getCurrentKeymap()['Key' + keySet[i].textContent.toUpperCase()].unmodified
				}
			}
			else if (state == 'withShift'){
				if (digit){
					console.log(state)
					keySet[i].textContent = kb.getCurrentKeymap()['Digit' + keySet[i].textContent].withShift
				}
				if (alphabetic){
					console.log(state)
					keySet[i].textContent = kb.getCurrentKeymap()['Key' + keySet[i].textContent.toUpperCase()].withShift
				}
			}
			else if (state == 'withCaps'){
				if (alphabetic){
					console.log(state)
					keySet[i].textContent = kb.getCurrentKeymap()['Key' + keySet[i].textContent.toUpperCase()].withShift
				}
			}
		}
		alphabetic = null; digit = null; other = null;
	}
	console.log('NASTY FOR LOOP END') 
}
function settingDigitAlternates(){
	for (let i = 0; i < 10; i++){
		digitAlternates.push(kb.getCurrentKeymap()['Digit' + i].withShift)
	}
}
settingDigitAlternates()
