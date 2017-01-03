'use strict'
const jQuery = require('jquery');
const store  = require('electron-json-storage');
const ipcRenderer = require('electron').ipcRenderer;

jQuery(()=>{

    jQuery('.apply').click(() => {

        var location1   = jQuery('#location1').val();
        var location2   = jQuery('#location2').val();
        var apiKey      = jQuery('#apikey').val();
        var language    = jQuery('input[type="radio"][name="language"]:checked').val();
        var refreshmin    =  jQuery('#refreshmin option:selected').val();
        var autoLaunch  = jQuery('input[type="checkbox"][name="auto-launch"]:checked').length > 0;
        if (autoLaunch) {
            ipcRenderer.send('auto-launch-open');
        } else {
            ipcRenderer.send('auto-launch-close');
        }
        store.set('homeway', {
            'location1':location1,
            'location2':location2,
            'apiKey':apiKey,
            'language':language,
            'autoLaunch':autoLaunch,
            'refreshmin':parseInt(refreshmin)
        },(a,b) => {
            ipcRenderer.send('init')
        });
    });

    jQuery('.quit').click(() => {
        ipcRenderer.send('close');
    });

    store.get('homeway', function (err,data) {

        if (data.location1 !== undefined) {
            jQuery('#location1').val(data.location1);
        }
        if (data.location2 !== undefined) {
            jQuery('#location2').val(data.location2);
        }

        if (data.apiKey !== undefined) {
            jQuery('#apikey').val(data.apiKey);
        }
        if (data.language !== undefined && data.language === 'tr_TR') {
            jQuery('#tr').prop('checked', true);
        } else if (data.language !== undefined && data.language === 'en_US') {
            jQuery('#en').prop('checked', true);
        }
        if (data.refreshmin !== undefined) {
            jQuery("#refreshmin option[value='"+parseInt(data.refreshmin)+"']").prop("selected", true);
        } else {
            jQuery("#refreshmin option[value='10']").prop("selected", true);
        }
        if (data.autoLaunch !== undefined) {
            jQuery('input[type="checkbox"][name="auto-launch"]').prop('checked',true);
        }
    });
});


