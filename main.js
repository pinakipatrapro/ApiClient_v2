const { app, BrowserWindow } = require('electron')
const express = require('express');

var runUIServer = function () {
    var app = express();
    app.use(express.static(__dirname + '/webapp')); //__dir and not _dir
    var port = 8089; // you can use any port
    app.listen(port);
    console.log('server on' + port);
}

function createWindow() {
    // Create the browser window.
    runUIServer();
    const win = new BrowserWindow({
        icon: "assets\\logo.ico",
        width: 800,
        height: 600,
        webPreferences: {
            sandbox: true,
            webSecurity: false,
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadURL('http://localhost:8089/');
}
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.whenReady().then(createWindow)
