let {PythonShell} = require('python-shell')
// TODO: Function to get logger.py location on system
var scriptPath = '/home/turuga/Documents/Shared/Productive/Projects/VisualKeyloggger/logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
// ---------------------------------------------------------------------
function startKeylogger(){
	pyScript = new PythonShell(scriptPath,options)
	pyScript.on('message',function(message){
		var keyCollection = document.getElementsByClassName('key')
		for(let i = 0; i < keyCollection.length; i++){
			// pyScript sends key as an array w single quotes and the key, this is a workaround for that
			if( keyCollection[i].innerHTML == message[1]){ 
				Object.assign(keyCollection[i].style,{display:"none"});	
				// TODO: Fix bug that never returns function
				setTimeout(resetter(keyCollection,i), 100)
			} else {
				console.log('searching')
			}
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
	Object.assign(collection[i].style,{display:"inline"});
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
