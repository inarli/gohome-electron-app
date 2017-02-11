'use strict';
const electron = require('electron');
const utils = require('../utils/utils')
const isOnline = require('is-online');
const app = electron.app;
const ipcMain = electron.ipcMain;
const menu = electron.Menu;
const shell = electron.shell;
const autoLaunch = require('auto-launch');
const appPath = app.getPath('exe').split('.app/Content')[0] + '.app'
var template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
];



const appLauncher = new autoLaunch({
    name:'goHome',
    path:appPath,
    isHidden : true
});

ipcMain.on('close', () => {
    app.quit()
})
ipcMain.on('openlink', (event,arg) => {
    shell.openExternal(arg);
})
ipcMain.on('init', () => {
    utils.init();
    utils.refresh();
})
ipcMain.on('auto-launch-open', ()=>{
    appLauncher.enable();
})
ipcMain.on('auto-launch-close', ()=>{
    appLauncher.disable();
})

app.on('ready', () => {
  utils.init();
  utils.autoUpdater();
  menu.setApplicationMenu(menu.buildFromTemplate(template));
});
