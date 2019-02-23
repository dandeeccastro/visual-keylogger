/* Essa função detecta keypresses no documento. Como fazer ela funcionar para o sistema todo?
document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
        console.log("Character typed: " + String.fromCharCode(charCode));
    }
ok agora vai pq bb pyboy tá funfando

};*/
const {PythonShell} = require( 'python-shell')
var scriptPath = '/home/turuga/Documents/Shared/Productive/Projects/VisualKeyloggger/logger.py'
var options = {
    pythonOptions: ['-u']
}
var pyScript = new PythonShell(scriptPath, options)
pyScript.on('message',function(message){
    console.log(message)
})
pyScript.end(function(err){
    if (err == 'KeyboardInterrupt') {
        console.log('aff mano bom dia')
    }
    console.log('Finished w no mistakes')
})

document.onkeypress = function(e){
    if(e.key == '1'){
        pyScript.childProcess.kill('SIGINT')
    }
}