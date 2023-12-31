var fileSize = 0;
var fileData;
var loadButton;
var originalFileName;
var saveButton;
var off;
var hex;
var chr;

document.addEventListener("DOMContentLoaded", function () {
    loadButton = document.getElementById("loadButton"); // For loading files
    saveButton = document.getElementById("saveButton"); // For saving files
    autoByte = document.getElementById("autoByte"); // Determins whether or not to automatically move to the next byte
    hexHeader = document.getElementById("hexHeader"); // Header for the hex table
    off = document.getElementById("off"); // Table for offsets
    hex = document.getElementById("hex"); // Table for hex values
    chr = document.getElementById("chr"); // Table for ASCII values

    var row = document.createElement("tr");
    for (let a = 0; a < 16; a++) {
        cell = document.createElement("input");
        cell.value = num2hex(a);
        cell.disabled = true;
        row.append(cell);
    }
    hexHeader.append(row);

    loadButton.onclick = function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.onchange = function () {
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = function () {
                hex.innerText = "";
                fileSize = new DataView(reader.result).byteLength;
                fileData = new Uint8Array(reader.result);
                write2hex();
                write2chr();
                write2off();
            }
            reader.readAsArrayBuffer(file);
            originalFileName = file.name;
        }
    }

    saveButton.onclick = function () {
        if (fileSize != 0) {
            savedData = []
            for (let a = 0; a < fileSize; a++) {
                savedData.push(Number("0x" + document.getElementById("hex " + a).value));
            }
            console.log(savedData)

            const link = document.createElement("a");
            var dataUrl = "data:application/octet-stream;base64," + btoa(String.fromCharCode.apply(!1, new Uint8Array(savedData)));
            link.href = dataUrl
            link.download = originalFileName;
            link.click();
            URL.revokeObjectURL(dataUrl);
        }
    }
})



function hex2chr(hex) {
    return num2chr(Number("0x" + hex));
}

function hex2num(hex) {
    return Number("0x" + hex);
}

function num2hex(num) {
    return num.toString(16).padStart(2, "0").toUpperCase();
}

function num2chr(num) {
    return ((num >= 32 && num <= 126) || (num >= 161 && num <= 255)) ? String.fromCharCode(num) : ".";
}

function chr2hex(cha) {
    return num2hex(cha.charCodeAt(0));
}

function chr2num(cha) {
    return cha.charCodeAt(0);
}


function write2hex() {
    hex.innerText = "";
    for (let a = 0; a < Math.ceil(fileSize / 16); a++) {
        var row = document.createElement("tr");
        for (let b = 0; b < 16 && a * 16 + b < fileSize; b++) {
            input = document.createElement("input");
            input.value = num2hex(fileData[a * 16 + b]);
            input.id = hex.id + " " + (a * 16 + b);
            input.maxLength = 2;

            input.onchange = function () {
                validateHex(this);
            }

            input.oninput = function () {
                validateHex(this);
                if (this.value.length > 1 && autoByte.checked){
                    console.log(this.id)
                    console.log(hex.id + " " + (Number(this.id.replace(hex.id, ""))+1))
                    try {document.getElementById(hex.id + " " + (Number(this.id.replace(hex.id, ""))+1)).focus();}
                    catch {alert("You have reached the end of the table")}
                }
            }

            input.onfocus = function () {
                this.placeholder = this.value;
                this.value = "";
            };

            input.onblur = function () {
                if (this.value === "") {
                    this.value = this.placeholder;
                } else {
                    validateHex(this);
                    this.value = this.value.padStart(2, "0");
                    document.getElementById(chr.id + this.id.replace(hex.id, "")).value = hex2chr(this.value.padStart(2, "0"));
                }
            };

            row.append(input);
        }
        hex.append(row);
    }
}

function write2chr() {
    chr.innerText = "";
    for (let a = 0; a < Math.ceil(fileSize / 16); a++) {
        var row = document.createElement("tr");
        for (let b = 0; b < 16 && a * 16 + b < fileSize; b++) {
            input = document.createElement("input");
            input.value = num2chr(fileData[a * 16 + b]);
            input.id = chr.id + " " + (a * 16 + b);
            input.maxLength = 1;

            input.onchange = function () {
                validateChr(this);
            }

            input.oninput = function () {
                validateChr(this);
                if (this.value.length > 0 && autoByte.checked){
                    console.log(this.id)
                    console.log(chr.id + " " + (Number(this.id.replace(chr.id, ""))+1))
                    try {document.getElementById(chr.id + " " + (Number(this.id.replace(chr.id, ""))+1)).focus();}
                    catch {alert("You have reached the end of the table")}
                }
            }

            input.onfocus = function () {
                this.placeholder = this.value;
                this.value = "";
            };

            input.onblur = function () {
                if (this.value === "") {
                    this.value = this.placeholder;
                } else {
                    validateChr(this);
                    document.getElementById(hex.id + this.id.replace(chr.id, "")).value = chr2hex(this.value);
                }
            };

            row.append(input);
        }
        chr.append(row);
    }
}

function write2off() {
    off.innerText = "";
    for (let a = 0; a < Math.ceil(fileSize / 16); a++) {
        var row = document.createElement("tr");
        row.append(num2hex(a * 16).padStart(8, "0"));
        off.append(row);
    }
}

function validateHex(hex) {
    if (!/^[0-9a-fA-F]+$/.test(hex.value.toString())) {
        hex.value = hex.value.slice(0, -1);
    }
    hex.value = hex.value.toUpperCase();
}
function validateChr(chr) {
    if (num2chr(chr2num(chr.value)) == ".") {
        chr.value = chr.value.slice(0, -1);
    }
}