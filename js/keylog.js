/* Essa função detecta keypresses no documento. Como fazer ela funcionar para o sistema todo?
document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
        console.log("Character typed: " + String.fromCharCode(charCode));
    }
ok agora vai pq bb pyboy tá funfando

};*/
let {PythonShell} = require('python-shell')
var scriptPath = '/home/dundee/Documents/VisualKeyLogger/logger.py'
var options = { pythonOptions: ['-u'] }
var pyScript = null
// ---------------------------------------------------------------------
function startKeylogger(){
	pyScript = new PythonShell(scriptPath,options)
	pyScript.on('message',function(message){
		console.log(message)
	})
	pyScript.end(function(err){
		if (err == 'KeyboardInterrupt') {
			console.log('aff mano bom dia')
		}
		console.log('Finished w no mistakes')
	})
}
// ---------------------------------------------------------------------
function endKeylogger(){
	if(pyScript != null){
		pyScript.childProcess.kill('SIGINT')
	}
}
// ------------------------------------------------------------------
function switx(){
	if (document.getElementById('keylogger-switch').checked){
		startKeylogger()
	} else {
		endKeylogger()
	}
}
