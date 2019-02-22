// Essa função detecta keypresses no documento. Como fazer ela funcionar para o sistema todo?
document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
        console.log("Character typed: " + String.fromCharCode(charCode));
    }
};