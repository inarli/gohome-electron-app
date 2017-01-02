'use strict'
const unirest = require('unirest');
const jsonStorage = require('electron-json-storage');
const menubar = require('menubar');
const semver    = require('semver');
const config    = require('../config.json');
const {dialog, shell} = require('electron');

let defaultIcon = __dirname+'/../resources/icons/home.png';
let orangeIcon = __dirname+'/../resources/icons/home_orange.png';
let greenIcon = __dirname+'/../resources/icons/home_green.png';
let redIcon = __dirname+'/../resources/icons/home_red.png';
let mb = null;

function setIcon(delay) {
    if (delay >= 5 && delay <= 15) {
        mb.tray.setImage(orangeIcon);
    } else if (delay > 15) {
        mb.tray.setImage(redIcon);
    } else if (delay <= 5) {
        mb.tray.setImage(greenIcon);
    } else {
        mb.tray.setImage(defaultIcon);
    }
}
if (mb === null) {
    mb = menubar({
        index: 'file://'+__dirname+'/../main/index.html',
        icon: defaultIcon,
        width: 250,
        height: 375,
        resizable: false,
        showDockIcon: false,
        preloadWindow: true
    });
}


function init() {
    jsonStorage.get('homeway', function (err,data) {
        if (data === undefined || data.apiKey === undefined || data.location1 === undefined || data.location2 === undefined) {
            mb.tray.setTitle('Please Setup');
            mb.showWindow();
            mb.tray.setImage(defaultIcon);
        } else {
            let language = 'tr_TR';
            if (data.language !== undefined) {
                language = data.language;
            }
            mb.tray.setTitle('Waiting google maps api');
            let requestUrl 	= 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metrics&mode=driving&departure_time=now&language='+language+'&origins='+data.location1+'&destinations='+data.location2+'&key='+data.apiKey;
            unirest.get(requestUrl).send().end((response) => {
                let mapObj = response.body;
                if (mapObj.status == 'OK') {
                    if (mapObj.rows.length > 0) {
                        let row1 = mapObj.rows[0].elements[0];
                        let delay = (row1.duration_in_traffic.value - row1.duration.value) / 60;
                        setIcon(delay);
                        mb.tray.setTitle(row1.duration_in_traffic.text);
                        mb.tray.setToolTip(row1.distance.text);
                        mb.hideWindow()
                    }
                }
            });
        }
    })
}
exports.autoUpdater = ()=>{
    let jsonfile = 'https://raw.githubusercontent.com/inarli/gohome/master/package.json';
    unirest.get(jsonfile).send().end((response)=>{
        let json = JSON.parse(response.body);
        let newVersion = json.version;
        if (semver.gt(newVersion, config.version)) {
            const confirm = dialog.showMessageBox({
                type:'info',
                message :'A new version '+newVersion+' of '+config.appName+' is available',
                detail:'Do you want to download it?',
                buttons:['Yes','No']
            });
            if (confirm === 0) {
                shell.openExternal(config.downloadPage)
            }
        }
    });

}
exports.init = init;
