/**
 * TODO List for Visual Keylogger:
 * 
 * MUST HAVE:
 * 	- Function to get logger.py's location on system
 * NICE HAVE:
 * 	- Key typing speed detection
 * 	- Blur effect for password/ sensitive data insertion
 * 
 */

/* FUNDAMENTAL LIBRARY IMPORTS */ 
let {PythonShell} = require('python-shell')
const kb = require('keyboard-layout')
/* CONSTANT VARIABLES */
const modalList = ['caps_lock','shift','ctrl','alt']
const common = ["up","down","left","right","space"]
/* GLOBAL VARIABLES */
var digitAlternates = []
var scriptPath = './logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
var spKey = 'not_interested'
var modal = []
// ---------------------------------------------------------------------
/** 
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
		console.log(message)
		/* ALPHABETIC BEHAVIOUR */
		if(message[0] == "'"){
			if (modal.includes('caps_lock')||modal.includes('shift')){
				message = message.toUpperCase()
			}
			for(let i = 0; i < keyCollection.length; i++){
				// pyScript sends key as an array w single quotes and the key, this is a workaround for that
				if( keyCollection[i].innerHTML == message[1]){ 
					Object.assign(keyCollection[i].style,{
						'background-color':"lightblue", 
						'color':"#cccccc"
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
					if(separated.includes(specialKeys[1])){
						Object.assign(commonCollection[i].style, {
							'background-color':"lightblue",
							'color':"#cccccc"
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
					'color':"#cccccc"
				})
				sp.childNodes[0].textContent = spKey
				setTimeout(function(){ resetter(sp) }, 100)
			}
		}
	})
}
// ---------------------------------------------------------------------
/** 
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
	})
}
// ------------------------------------------------------------------
/** 
 * This function is specific to the special key, making it
 * "spawn" with the display change
 * 
 * @param {string} key is the string of the key we want to change
 */
function resetter(key){
	Object.assign(key.style,{
		'background-color': "rgb(100,100,100)",
		'color':"#cccccc"
	})
}
// ------------------------------------------------------------------

/** 
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
/** 
 * This function changes the keyboard layout based on modal key presses. 
 * A modal key press is a fancy way of saying Shift, Caps and Alt Gr, and 
 * this function is called when these keys are pressed to change the key display
 * accordingly. It does so by using the keyboard-layout package
 *
 * In this function you'll find three basic key types: "alphabetic", numeric
 * and others. Alphabetic and numeric key changes are made by using the following 
 * patterns from the kb layout module: 
 *
 * alphabetic = Key + <uppercase letter>
 * numeric = Digit + <number in question>
 * The other type is accessed with hard typed names, due to it's configuration in the 
 * keyboard-layout package.
 * 
 * First, we set the modal array by checking if the key pressed is in modalList. Then, we estabilish 
 * state by the modal array. Having those set, we loop through all the keys in the keyboard, checking 
 * whether they are digits, digit alternates (changed keys from usual numbers), alphanumeric or other, and 
 * calling the singleKeyChange function accordingly
 * 
 * @param {string} key is the string of the key we want to change
 *  
 */
function keyDisplayChanger(key){
	var keySet = document.getElementsByClassName('key')
	/* Setting modal on modal array */ 
	if (modalList.includes(key)) {
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
	for (let i = 0; i < keySet.length; i++){
		var alphabetic, digit, other, digitAlternate
		var currKeyCode = keySet[i].textContent.charCodeAt(0)
		digit = (currKeyCode > 47 && currKeyCode < 58) 
		digitAlternate = digitAlternates.includes(keySet[i].textContent)
		alphabetic  = ((currKeyCode > 96 && currKeyCode < 123) || (currKeyCode > 64 && currKeyCode < 91))
		other = (keySet[i].textContent.length != 1 || ((!digit && !alphabetic) && !digitAlternate))
		if (other){
			digit = false
			alphabetic = false
		}
		if (digit){
			singleKeyChange(state,'digit',keySet[i])
		} else if (alphabetic) {
			singleKeyChange(state, 'alphabetic', keySet[i])
		} else if (digitAlternate) {
			singleKeyChange(state, 'digitAlternate', keySet[i])
		} else if (other){
			singleKeyChange(state, 'other', keySet[i])
		}
		alphabetic = null; digit = null; other = null;
	}
}
/**
 * This function will use state and keyType to set the correct key change. We use the switch-case
 * structure to set the value of 'value', and then pass it to 'key' (if not null). If we're dealing
 * with other types, we send them to the otherTypeKeyChange function 
 *  
 * @param {string} state is the keyboard-layout state style we want
 * @param {string} keyType is the type of key estabilished in the parent function
 * @param {string} key is the current key we want to change
 */
function singleKeyChange(state, keyType, key){
	var value
	switch (state){
		case 'unmodified':
			switch (keyType){
				case 'digit':
					kb.getCurrentKeymap()['Digit' + key.textContent].unmodified != null ? value = kb.getCurrentKeymap()['Digit' + key.textContent].unmodified : value = 'N/A'
					break
				case 'alphabetic':
					kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].unmodified != null ? value = kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].unmodified : value = 'N/A'
					break
				case 'digitAlternate':
					kb.getCurrentKeymap()['Digit' + digitAlternates.indexOf(key.textContent)].unmodified != null ? value = kb.getCurrentKeymap()['Digit' + digitAlternates.indexOf(key.textContent)].unmodified : value = 'N/A'
					break
				case 'other':
					otherTypeKeyChange(state, key)
					break
			} break
		case 'withShift':
			switch (keyType){
				case 'digit':
					kb.getCurrentKeymap()['Digit' + key.textContent].withShift != null ? value = kb.getCurrentKeymap()['Digit' + key.textContent].withShift : value = 'N/A'
					break
				case 'alphabetic':
					kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].withShift != null ? value = kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].withShift : value = 'N/A'
					break
				case 'digitAlternate':
					kb.getCurrentKeymap()['Digit' + digitAlternates.indexOf(key.textContent)].withShift != null ? value = kb.getCurrentKeymap()['Digit' + digitAlternates.indexOf(key.textContent)].withShift : value = 'N/A'
					break
				case 'other':
					otherTypeKeyChange(state, key)
					break
			} break
		case 'withCaps':
			switch (keyType){
				case 'alphabetic':
					kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].withShift != null ? value = kb.getCurrentKeymap()['Key' + key.textContent.toUpperCase()].withShift : value = 'N/A'
					break
			} break
	}
	if (value != null){
		key.textContent = value
	}
}
/**
 * This is a big and gross function that deals with the many non-loopable forms in the keyboard-layout package. It 
 * essencialy checks the wanted state, then the key content to change value, just like it's parent. The gimmick here is that we just
 * enumerate all possible non standard options, and that makes this function really ugly and just overall not good. Also, there is a workaround:
 * 
 * When you're on shift mode and want to go back to unmodified, there's no simple way of checking if a key is a other-type withShift alteration.
 * You can either do that by making an array (like digitAlternates) or do what I did here:  I've decided, on unmodified, to call case on the withShift alterations.
 * You'll notice a pattern here, where we have a case with the hard typed key and the following case with it's withShift alteration
 * 
 * @param {string} state is the keyboard-layout state style we want
 * @param {string} key is the current other key we want to change
 */
function otherTypeKeyChange(state, key){
	var value
	switch (state){
		case 'unmodified':
			switch (key.textContent){
				case "'":
					kb.getCurrentKeymap()['Backquote'].unmodified != null ? value = kb.getCurrentKeymap()['Backquote'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Backquote'].withShift:
					kb.getCurrentKeymap()['Backquote'].unmodified != null ? value = kb.getCurrentKeymap()['Backquote'].unmodified : value = 'N/A'
					break
				case ']':
					kb.getCurrentKeymap()['Backslash'].unmodified != null ? value = kb.getCurrentKeymap()['Backslash'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Backslash'].withShift:
					kb.getCurrentKeymap()['Backslash'].unmodified != null ? value = kb.getCurrentKeymap()['Backslash'].unmodified : value = 'N/A'
					break
				case '[':
					kb.getCurrentKeymap()['BracketRight'].unmodified != null ? value = kb.getCurrentKeymap()['BracketRight'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['BracketRight'].withShift:
					kb.getCurrentKeymap()['BracketRight'].unmodified != null ? value = kb.getCurrentKeymap()['BracketRight'].unmodified : value = 'N/A'
					break
				case ',':
					kb.getCurrentKeymap()['Comma'].unmodified != null ? value = kb.getCurrentKeymap()['Comma'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Comma'].withShift:
					kb.getCurrentKeymap()['Comma'].unmodified != null ? value = kb.getCurrentKeymap()['Comma'].unmodified : value = 'N/A'
					break
				case '=':
					kb.getCurrentKeymap()['Equal'].unmodified != null ? value = kb.getCurrentKeymap()['Equal'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Equal'].withShift:
					kb.getCurrentKeymap()['Equal'].unmodified != null ? value = kb.getCurrentKeymap()['Equal'].unmodified : value = 'N/A'
					break
				case "'\'":
					kb.getCurrentKeymap()['IntlBackslash'].unmodified != null ? value = kb.getCurrentKeymap()['IntlBackslash'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['IntlBackslash'].withShift:
					kb.getCurrentKeymap()['IntlBackslash'].unmodified != null ? value = kb.getCurrentKeymap()['IntlBackslash'].unmodified : value = 'N/A'
					break
				case "'/'":
					kb.getCurrentKeymap()['IntlRo'].unmodified != null ? value = kb.getCurrentKeymap()['IntlRo'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['IntlRo'].withShift:
					kb.getCurrentKeymap()['IntlRo'].unmodified != null ? value = kb.getCurrentKeymap()['IntlRo'].unmodified : value = 'N/A'
					break
				case '-':
					kb.getCurrentKeymap()['Minus'].unmodified != null ? value = kb.getCurrentKeymap()['Minus'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Minus'].withShift:
					kb.getCurrentKeymap()['Minus'].unmodified != null ? value = kb.getCurrentKeymap()['Minus'].unmodified : value = 'N/A'
					break
				case '.':
					kb.getCurrentKeymap()['Period'].unmodified != null ? value = kb.getCurrentKeymap()['Period'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Period'].withShift:
					kb.getCurrentKeymap()['Period'].unmodified != null ? value = kb.getCurrentKeymap()['Period'].unmodified : value = 'N/A'
					break
				case 'ç':
					kb.getCurrentKeymap()['Semicolon'].unmodified != null ? value = kb.getCurrentKeymap()['Semicolon'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Semicolon'].withShift:
					kb.getCurrentKeymap()['Semicolon'].unmodified != null ? value = kb.getCurrentKeymap()['Semicolon'].unmodified : value = 'N/A'
					break
				case ';':
					kb.getCurrentKeymap()['Slash'].unmodified != null ? value = kb.getCurrentKeymap()['Slash'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Slash'].withShift:
					kb.getCurrentKeymap()['Slash'].unmodified != null ? value = kb.getCurrentKeymap()['Slash'].unmodified : value = 'N/A'
					break
				case ' ':
					kb.getCurrentKeymap()['Space'].unmodified != null ? value = kb.getCurrentKeymap()['Space'].unmodified : value = 'N/A'
					break
				case kb.getCurrentKeymap()['Space'].withShift:
					kb.getCurrentKeymap()['Space'].unmodified != null ? value = kb.getCurrentKeymap()['Space'].unmodified : value = 'N/A'
					break
			}
			break
		case 'withShift':
			switch (key.textContent){
				case "'":
					kb.getCurrentKeymap()['Backquote'].withShift != null ? value = kb.getCurrentKeymap()['Backquote'].withShift : value = 'N/A'
					break
				case ']':
					kb.getCurrentKeymap()['Backslash'].withShift != null ? value = kb.getCurrentKeymap()['Backslash'].withShift : value = 'N/A'
					break
				case '[':
					kb.getCurrentKeymap()['BracketRight'].withShift != null ? value = kb.getCurrentKeymap()['BracketRight'].withShift : value = 'N/A'
					break
				case ',':
					kb.getCurrentKeymap()['Comma'].withShift != null ? value = kb.getCurrentKeymap()['Comma'].withShift : value = 'N/A'
					break
				case '=':
					kb.getCurrentKeymap()['Equal'].withShift != null ? value = kb.getCurrentKeymap()['Equal'].withShift : value = 'N/A'
					break
				case "'\'":
					kb.getCurrentKeymap()['IntlBackslash'].withShift != null ? value = kb.getCurrentKeymap()['IntlBackslash'].withShift : value = 'N/A'
					break
				case "'/'":
					kb.getCurrentKeymap()['IntlRo'].withShift != null ? value = kb.getCurrentKeymap()['IntlRo'].withShift : value = 'N/A'
					break
				case '-':
					kb.getCurrentKeymap()['Minus'].withShift != null ? value = kb.getCurrentKeymap()['Minus'].withShift : value = 'N/A'
					break
				case '.':
					kb.getCurrentKeymap()['Period'].withShift != null ? value = kb.getCurrentKeymap()['Period'].withShift : value = 'N/A'
					break
				case 'ç':
					kb.getCurrentKeymap()['Semicolon'].withShift != null ? value = kb.getCurrentKeymap()['Semicolon'].withShift : value = 'N/A'
					break
				case ';':
					kb.getCurrentKeymap()['Slash'].withShift != null ? value = kb.getCurrentKeymap()['Slash'].withShift : value = 'N/A'
					break
				case ' ':
					kb.getCurrentKeymap()['Space'].withShift != null ? value = kb.getCurrentKeymap()['Space'].withShift : value = 'N/A'
					break
			}
			break
	}
	if (value != null){
		key.textContent = value
	}
	
}
/**
 * This function is called once, to generate the digitAlternates array
 */
function settingDigitAlternates(){
	for (let i = 0; i < 10; i++){
		digitAlternates.push(kb.getCurrentKeymap()['Digit' + i].withShift != null ? kb.getCurrentKeymap()['Digit' + i].withShift : 'N/A')
	}
}
settingDigitAlternates()
