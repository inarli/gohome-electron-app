'use strict';
const utils = require('../utils/utils')
const {app, ipcMain} = require('electron')
const autoLaunch = require('auto-launch');
const appPath = app.getPath('exe').split('.app/Content')[0] + '.app'
const appLauncher = new autoLaunch({
    name:'goHome',
    path:appPath,
    isHidden : true
});

ipcMain.on('close', () => {
    app.quit()
})
ipcMain.on('init', () => {
    utils.init();
})
ipcMain.on('auto-launch-open', ()=>{
    appLauncher.enable();
})
ipcMain.on('auto-launch-close', ()=>{
    appLauncher.disable();
})

app.on('ready', () => {
    utils.init();
    setInterval(()=>{utils.init()},(1000 * 60 * 10))
    utils.autoUpdater();
});
