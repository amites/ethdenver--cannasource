/* global refresh_data */

/* exported GET */
function GET(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/* exported htmlspecialchars */
function htmlspecialchars(text) {
    text = (text + '').toString();

    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

/* exported parseJSON */
function parseJSON(value, error_value) {
    try {
        return JSON.parse(value);
    } catch (ex) {
        return error_value;
    }
}

/* exported json_html */
function json_html(object) {
    return htmlspecialchars(JSON.stringify(object, null, '    ')).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
}

/* exported onclick_encode */
var printed = false;
function onclick_encode(value) {
    return htmlspecialchars(JSON.stringify(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'"));
}

/* exported RAD */
function RAD(degrees) {
    return parseFloat(degrees) * Math.PI / 180.0;
}

/* exported DEG */
function DEG(radians) {
    return parseFloat(radians) * 180.0 / Math.PI;
}

function mod(x, y) {
    return parseFloat(x) - parseFloat(y) * Math.floor(parseFloat(x) / parseFloat(y));
}

/* exported offset */
function offset(world_point, distance, heading) {
    var lat_1_rad = world_point.latitude * Math.PI / 180.0;
    var lon_1_rad = world_point.longitude * Math.PI / 180.0;

    var d = distance / 2.09022e7;
    var c = heading * Math.PI / 180.0;

    var offset_lat = Math.asin(Math.sin(lat_1_rad) * Math.cos(d) + Math.cos(lat_1_rad) * Math.sin(d) * Math.cos(c));
    var dlon = Math.atan2(Math.sin(c) * Math.sin(d) * Math.cos(lat_1_rad), Math.cos(d) - Math.sin(lat_1_rad) * Math.sin(offset_lat));
    var offset_lon = mod(lon_1_rad + dlon + Math.PI, 2 * Math.PI) - Math.PI;

    return {
        latitude: offset_lat * 180.0 / Math.PI,
        longitude: offset_lon * 180.0 / Math.PI
    };
}

/* exported distanceTo */
function distanceTo(lat_1, lon_1, lat_2, lon_2) {
    var lat_1_rad = lat_1 * Math.PI / 180.0;
    var lon_1_rad = lon_1 * Math.PI / 180.0;
    var lat_2_rad = lat_2 * Math.PI / 180.0;
    var lon_2_rad = lon_2 * Math.PI / 180.0;

    var dist = 2.0 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat_1_rad - lat_2_rad) / 2.0), 2.0) + Math.cos(lat_1_rad) * Math.cos(lat_2_rad) * Math.pow(Math.sin((lon_1_rad - lon_2_rad) / 2.0), 2.0)));

    return dist * 20925524.9;
}

/* exported headingTo */
function headingTo(lat_1, lon_1, lat_2, lon_2) {
    var lat_1_rad = lat_1 * Math.PI / 180.0;
    var lon_1_rad = lon_1 * Math.PI / 180.0;
    var lat_2_rad = lat_2 * Math.PI / 180.0;
    var lon_2_rad = lon_2 * Math.PI / 180.0;

    var rad_dhg = mod(Math.atan2(Math.sin(lon_2_rad - lon_1_rad) * Math.cos(lat_2_rad), Math.cos(lat_1_rad) * Math.sin(lat_2_rad) - Math.sin(lat_1_rad) * Math.cos(lat_2_rad) * Math.cos(lon_2_rad - lon_1_rad)), 2.0 * Math.PI);
    return rad_dhg * (180.0 / Math.PI);
}

String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length) {
        str = padString + str;
    }
    return str;
};

if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (!Array.isArray(this)) {
            throw new TypeError('Array.prototype.find called on non-array');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.natSort) {
    Array.prototype.natSort = function (caseInsensitive) {
        for (var z = 0, t; t = this[z]; z++) {
            this[z] = [];
            var x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >= 48 && i <= 57));
                if (m !== n) {
                    this[z][++y] = "";
                    n = m;
                }
                this[z][y] += j;
            }
        }

        this.sort(function (a, b) {
            for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
                if (caseInsensitive) {
                    aa = aa.toLowerCase();
                    bb = bb.toLowerCase();
                }
                if (aa !== bb) {
                    var c = Number(aa), d = Number(bb);
                    if (c == aa && d == bb) {
                        return c - d;
                    } else {
                        return (aa > bb) ? 1 : -1;
                    }
                }
            }
            return a.length - b.length;
        });

        for (var z = 0; z < this.length; z++) {
            this[z] = this[z].join("");
        }
    };
}

/* exported natsort */
function natsort(a, b) {
    function chunkify(t) {
        var tz = [];
        var x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >= 48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }

    var aa = chunkify(a);
    var bb = chunkify(b);

    for (var x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x]);
            if (c == aa[x] && d == bb[x]) {
                return c - d;
            } else {
                return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
    }
    return aa.length - bb.length;
}

/* exported natcasesort */
function natcasesort(a, b) {
    function chunkify(t) {
        var tz = [];
        var x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >= 48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }

    var aa = chunkify(a.toLowerCase());
    var bb = chunkify(b.toLowerCase());

    for (var x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x]);
            if (c == aa[x] && d == bb[x]) {
                return c - d;
            } else {
                return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
    }
    return aa.length - bb.length;
}

/* exported microtime */
function microtime() {
    return new Date().getTime() / 1000.0;
}

/* exported convertTimeLocal */
function convertTimeLocal(time) {
    var d = new Date(time * 1000.0);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() +
            " " + d.getHours().toString().lpad("0", 2) + ":" + d.getMinutes().toString().lpad("0", 2) + ":" + d.getSeconds().toString().lpad("0", 2);
}

/* exported convertDateLocal */
function convertDateLocal(time) {
    var d = new Date(time * 1000.0);
    return d.getFullYear() + "-" + (d.getMonth() + 1).toString().lpad("0", 2) + "-" + d.getDate().toString().lpad("0", 2);
}

/* exported convertTimeOnlyLocal */
function convertTimeOnlyLocal(time) {
    var d = new Date(time * 1000.0);
    return d.getHours().toString().lpad("0", 2) + ":" + d.getMinutes().toString().lpad("0", 2) + ":" + d.getSeconds().toString().lpad("0", 2);
}

/* exported parseTimeLocal */
function parseTimeLocal(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]).getTime() / 1000;
}

/* exported parseDateTimeLocal */
function parseDateTimeLocal(input) {
    var date_time_parts = input.split(" ");
    var date_parts = date_time_parts[0].split('-');
    var time_parts = date_time_parts[1].split(':');
    return new Date(date_parts[0], date_parts[1] - 1, date_parts[2], time_parts[0], time_parts[1], time_parts[2]).getTime() / 1000;
}

/* exported formatAge */
function formatAge(age) {
    var age_string = "";

    if (Math.round(age) < 0) {
        age_string += "-";
        age = Math.abs(age);
    }

    var days = Math.floor(age / 86400);
    age -= days * 86400;
    var hours = Math.floor(age / 3600);
    age -= hours * 3600;
    var minutes = Math.floor(age / 60);
    age -= minutes * 60;
    var seconds = Math.round(age);

    if (days > 0) {
        age_string += days + " day ";
    }
    if (hours > 0) {
        age_string += hours + " hr ";
    }
    if (minutes > 0) {
        age_string += minutes + " min ";
    }
    if (seconds > 0) {
        age_string += seconds + " s";
    }
    if (age_string === "") {
        age_string += "0 s";
    }
    return age_string.trim();
}

/* exported formatAgeRigid */
function formatAgeRigid(age) {
    var age_string = "";

    if (Math.round(age) < 0) {
        age_string += "-";
        age = Math.abs(age);
    }

    var hours = Math.floor(age / 3600);
    age -= hours * 3600;
    var minutes = Math.floor(age / 60);
    age -= minutes * 60;
    var seconds = Math.round(age);

    return hours.toString().lpad('0', 2) + ":" + minutes.toString().lpad('0', 2) + ":" + seconds.toString().lpad('0', 2);
}

/* exported check_inside */
function check_inside(unique_id, parent_id, scope_id, floors) {
    var inside = false;
    var current = {
        unique_id: unique_id,
        parent_id: parent_id
    };
    while (current !== undefined) {
        if (scope_id === current.unique_id || scope_id === current.parent_id) {
            inside = true;
            break;
        }
        if (current.unique_id === current.parent_id) {
            break;
        }
        var next;
        next = floors.find(function (floor) {
            return floor.unique_id === current.unique_id;
        });
        current = next;
    }
    return inside;
}

/* exported update_html */
function update_html(element, html) {
    if (element && html !== element.last_html) {
        element.innerHTML = html;
        element.last_html = html;
        return true;
    } else {
        return false;
    }
}

/* exported alert_div */
function alert_div(message) {
    return Mustache.render(document.getElementById('template_alert_div').innerHTML, {type: 'alert-warning', icon: 'glyphicon-exclamation-sign', message: message});
}

function alert_modal(title, body) {
    show_modal({
        id: 'alert-modal',
        title: title,
        body: body,
        buttons: [{
                key: 'close',
                name: 'Close',
                type: 'btn-default'
            }],
        callback: function (button, data, modal) {
            $(modal).modal('hide');
        }
    });
}

/* exported defcon_class */
function defcon_class(priority) {
    var row_class = '';
    if (priority < 0) {

    } else if (priority < 1000) {
        row_class = 'success';
    } else if (priority < 2000) {
        row_class = 'info';
    } else if (priority < 3000) {
        row_class = 'notice';
    } else if (priority < 4000) {
        row_class = 'warning';
    } else {
        row_class = 'danger';
    }
    return row_class;
}

/* exported defcon_color */
function defcon_color(priority) {
    var color = 'FFFFFF';
    if (priority < 0) {

    } else if (priority < 1000) {
        color = '01A46D';
    } else if (priority < 2000) {
        color = '377FC7';
    } else if (priority < 3000) {
        color = 'F5D800';
    } else if (priority < 4000) {
        color = 'FF9B2B';
    } else {
        color = 'EC3E40';
    }
    return color;
}

/* exported defcon_name */
function defcon_name(priority) {
    var name = '';
    if (priority < 0) {

    } else if (priority < 1000) {
        name = '0=Nominal';
    } else if (priority < 2000) {
        name = '1=Low';
    } else if (priority < 3000) {
        name = '2=Medium';
    } else if (priority < 4000) {
        name = '3=High';
    } else {
        name = '4=Severe';
    }
    return name;
}

/* jshint -W079 */
var save_auth = true;
var sentinel = null;
var sentinels = null;
var username = null;
var token = null;
/* jshint +W079 */
try {
    //console.log("localStorage: ",localStorage);
    sentinel = localStorage.getItem('sentinel');
    sentinels = JSON.parse(localStorage.getItem('sentinels'));
    username = localStorage.getItem('username');
    token = localStorage.getItem('token');
} catch (ex) {
    console.log(ex);
}
var paused = false;

/* exported async */
function async(path, callback, request, url) {
    //console.log("path: ",path," callback: ",callback," request: ", request, " url: ", url);
    var sent;

    if (url && Array.isArray(sentinels)) {
        sent = sentinels.find(function (sent) {
            return sent.url === url;
        });
    }

    if (sent === undefined) {
        sent = {
            url: sentinel,
            token: token
        };
    }

    if (paused) {
        callback({error: "Paused"});
        return null;
    } else if (sent.url && sent.token) {
        return $.ajax({
            url: sent.url + '/rest/' + path,
            method: "POST",
            data: $.extend({token: sent.token}, request),
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            error: function (xhr, status, error) {
                callback({error: "Failed to retrieve" + (status ? ": " + status : "") + (error ? ": " + error : "")});
            }
        });
    } else {
        callback({error: "Not connected"});
        return null;
    }
}

function refresh_sents(username, password) {
    //console.log("refresh_sents: ",username, " ", password);
    //password = '!Fpm041090';
    if (password !== undefined) {
        sentinels = [];
        console.log("Refreshing sentinels disabled");
        /*
         try{
         if(save_auth){
         localStorage.setItem("sentinels", JSON.stringify(sentinels));
         }
         }catch(ex){
         console.log(ex);
         }

         $.getJSON("https://reardenit.com/sentinel/", function(sentinel_names){
         function sent(name, path){
         var url = 'https://reardenit.com/sentinel/' + path;
         $.ajax({
         url: url + '/rest/token',
         method: "POST",
         data: {
         username: username,
         password: password
         },
         dataType: "json",
         timeout: 5000,
         success: function(data){
         if(data.error){
         console.log(name, path, data.error);
         }else{
         console.log(name, path, data);
         $.ajax({
         url: url + '/rest/locale',
         method: "POST",
         data: {
         token: data.token
         },
         dataType: "json",
         timeout: 10000,
         success: function(locale){
         if(locale.error){
         console.log(name, path, locale.error);
         }else{
         var bounds = new google.maps.LatLngBounds();
         bounds.extend(new google.maps.LatLng(locale.min_lat, locale.min_lon));
         bounds.extend(new google.maps.LatLng(locale.min_lat, locale.max_lon));
         bounds.extend(new google.maps.LatLng(locale.max_lat, locale.min_lon));
         bounds.extend(new google.maps.LatLng(locale.max_lat, locale.max_lon));

         sentinels.push({
         name: name,
         url: url,
         token: data.token,
         sw: {
         latitude: bounds.getSouthWest().lat(),
         longitude: bounds.getSouthWest().lng()
         },
         ne: {
         latitude: bounds.getNorthEast().lat(),
         longitude: bounds.getNorthEast().lng()
         },
         center: {
         latitude: bounds.getCenter().lat(),
         longitude: bounds.getCenter().lng()
         },
         priority: parseInt(locale.max_priority)
         });

         try{
         if(save_auth){
         localStorage.setItem("sentinels", JSON.stringify(sentinels));
         }
         }catch(ex){
         console.log(ex);
         }
         }
         },
         error: function(xhr, status){
         console.log(name, path, status);
         }
         });
         }
         },
         error: function(xhr, status){
         console.log(name, path, status);
         }
         });
         }

         for(var path in sentinel_names){
         sent(sentinel_names[path], path);
         }
         });
         */
    }
}

function updateToken(new_token) {
    token = new_token;
    try {
        if (save_auth) {
            localStorage.setItem('token', token);
        }
    } catch (ex) {
        console.log(ex);
    }
}

navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

function stopVideo(video_element) {
    video_element.style.display = "none";
    video_element.pause();
    delete video_element.poster;
    delete video_element.src;
    if (video_element.stream !== undefined) {
        video_element.stream.getTracks()[0].stop();
    }
    delete video_element.stream;
}

function startVideo(video_element, id) {
    stopVideo(video_element);

    var callback = function () {
        navigator.getUserMedia({video: {optional: [{sourceId: id}]}}, function (stream) {
            console.log(stream);
            delete video_element.poster;
            video_element.src = window.URL.createObjectURL(stream);
            video_element.style.display = "block";
            video_element.stream = stream;
        }, function (error) {
            console.log(error);
        });
    }

    if ('cordova' in window && 'plugins' in cordova && 'permissions' in cordova.plugins) {
        var permissions = cordova.plugins.permissions;
        permissions.requestPermission(permissions.CAMERA, function (status) {
            console.log(JSON.stringify(status));
            if (status.hasPermission) {
                callback();
            }
        }, function (error) {
            console.log(JSON.stringify(error));
        });
    } else {
        callback();
    }
}

function change_modal_index(e) {
    var index = parseFloat($(e.target).attr('data-index'));
    if (e.which === 40 || (e.target.tagName === "INPUT" && e.which === 13)) {
        e.preventDefault();
        $('[data-index="' + (index + 1).toString() + '"]').focus();
    } else if (e.which === 38) {
        e.preventDefault();
        $('[data-index="' + (index - 1).toString() + '"]').focus();
    }
}

/* exported show_modal */
function show_modal(modal_data) {
    $('#' + modal_data.id).modal('hide');
    $('#' + modal_data.id).remove();

    $('body').append(Mustache.render(document.getElementById('template_modal').innerHTML, modal_data));

    var index = 0;
    if (Array.isArray(modal_data.inputs)) {
        modal_data.inputs.forEach(function (input) {
            $('#' + modal_data.id + '-' + input.key).attr("data-index", index++);
            if (input.multiple) {
                var multiselect_data = {
                    buttonContainer: '<div class="form-group" />',
                    buttonClass: 'form-control text-left',
                    maxHeight: 300,
                    enableCaseInsensitiveFiltering: true,
                    onDropdownShown: function() {
                        $('#' + modal_data.id + '-' + input.key).parent().find("button.multiselect-clear-filter").click();
                        $('#' + modal_data.id + '-' + input.key).parent().find("input[type='text'].multiselect-search").focus();
                    }
                };
                if (input.select_all) {
                    multiselect_data.includeSelectAllOption = true;
                    multiselect_data.selectAllText = input.select_all;
                }
                $('#' + modal_data.id + '-' + input.key).multiselect(multiselect_data);
            } else if (input.image) {
                var select_element = document.getElementById(modal_data.id + '-' + input.key);
                var video_element = document.getElementById(modal_data.id + '-' + input.key + '-video');
                var button_element = document.getElementById(modal_data.id + '-' + input.key + '-button');
                var file_element = document.getElementById(modal_data.id + '-' + input.key + '-file');
                var scan_element = document.getElementById(modal_data.id + '-' + input.key + '-scan');

                var picture_taken = function () {
                    if (input.image === "QR") {
                        button_element.innerHTML = '<span class="glyphicon glyphicon-refresh"></span>&nbsp;Rescan';
                        scan_element.value = '';
                        scan_element.style.display = 'block';

                        var image_data;
                        if (video_element.stream) {
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext('2d');
                            canvas.width = video_element.videoWidth;
                            canvas.height = video_element.videoHeight;
                            ctx.drawImage(video_element, 0, 0, canvas.width, canvas.height);
                            image_data = canvas.toDataURL("image/png");
                        } else if (video_element.poster) {
                            image_data = video_element.poster;
                        } else {
                            console.log("No stream or poster");
                        }

                        if (image_data) {
                            qrcode.callback = function (code) {
                                scan_element.value = code;
                            };
                            qrcode.decode(image_data);
                        } else {
                            console.log("No image data");
                        }
                    } else {
                        button_element.innerHTML = '<span class="glyphicon glyphicon-refresh"></span>&nbsp;Reupload';
                    }
                    button_element.paused = true;
                };

                select_element.onchange = function () {
                    if (select_element.value === "") {
                        stopVideo(video_element);
                        button_element.style.display = 'none';
                        button_element.onclick = function () {};
                        file_element.onclick = function () {};
                    } else if (select_element.value === "file") {
                        stopVideo(video_element);
                        button_element.style.display = 'block';
                        button_element.innerHTML = '<span class="glyphicon glyphicon-picture"></span>&nbsp;Upload Image';
                        button_element.paused = false;
                        button_element.onclick = function () {
                            if (button_element.paused) {
                                button_element.innerHTML = '<span class="glyphicon glyphicon-picture"></span>&nbsp;Upload Image';
                                button_element.paused = false;
                            } else {
                                $(file_element).click();
                            }
                        };
                        file_element.onchange = function (event) {
                            if (event.target.files.length > 0) {
                                console.log(event.target.files[0]);

                                var reader = new FileReader();
                                reader.onload = function (event) {
                                    video_element.poster = event.target.result;
                                    video_element.style.display = "block";

                                    picture_taken();
                                };
                                reader.readAsDataURL(event.target.files[0]);
                            }
                        };
                    } else {
                        startVideo(video_element, select_element.value);
                        button_element.style.display = 'block';
                        if (input.image === "QR") {
                            button_element.innerHTML = '<span class="glyphicon glyphicon-qrcode"></span>&nbsp;Scan Code';
                        } else {
                            button_element.innerHTML = '<span class="glyphicon glyphicon-camera"></span>&nbsp;Take Picture';
                        }
                        button_element.paused = false;
                        button_element.onclick = function () {
                            console.log(button_element.paused);
                            if (button_element.paused) {
                                video_element.play();

                                if (input.image === "QR") {
                                    button_element.innerHTML = '<span class="glyphicon glyphicon-qrcode"></span>&nbsp;Scan Code';
                                    scan_element.style.display = 'none';
                                } else {
                                    button_element.innerHTML = '<span class="glyphicon glyphicon-camera"></span>&nbsp;Take Picture';
                                }
                                button_element.paused = false;
                            } else {
                                video_element.pause();

                                picture_taken();
                            }
                        };
                        file_element.onclick = function () {};
                    }
                };

                var html = "<option value=''>None</option>";

                if (navigator.getUserMedia && MediaStreamTrack.getSources) {
                    console.log("MediaStreamTrack");
                    MediaStreamTrack.getSources(function (sourceInfos) {
                        var camera_number = 1;
                        for (var i = 0; i < sourceInfos.length; i++) {
                            var sourceInfo = sourceInfos[i];

                            console.log(i + ": " + JSON.stringify({
                                enabled: sourceInfo.enabled,
                                id: sourceInfo.id,
                                kind: sourceInfo.kind,
                                label: sourceInfo.label,
                                facing: sourceInfo.facing
                            }));

                            if (sourceInfo.kind === 'video') {
                                var name = "Camera";
                                if (sourceInfo.facing === "user") {
                                    name = "Front Camera";
                                } else if (sourceInfo.facing === "environment") {
                                    name = "Back Camera";
                                }
                                html += '<option value="' + sourceInfo.id + '">' + name + ' (' + camera_number + ')</option>';
                                camera_number++;
                            }
                        }

                        html += '<option value="file">File</option>';

                        select_element.innerHTML = html;
                    });
                } else {
                    console.log("No User Media");

                    html += '<option value="file">File</option>';

                    select_element.innerHTML = html;
                }
            }
        });
    }

    if (Array.isArray(modal_data.buttons)) {
        modal_data.buttons.forEach(function (button) {
            $('#' + modal_data.id + '-' + button.key).attr("data-index", index++);
            $('#' + modal_data.id + '-' + button.key).click(function () {
                $('#' + modal_data.id).find('.btn').attr("disabled", "disabled");

                var data = {};
                if (Array.isArray(modal_data.inputs)) {
                    modal_data.inputs.forEach(function (input) {
                        if (input.checkbox) {
                            data[input.key] = document.getElementById(modal_data.id + '-' + input.key).checked;
                            console.log(document.getElementById(modal_data.id + '-' + input.key), data[input.key]);
                        } else if (input.image) {
                            var video_element = document.getElementById(modal_data.id + '-' + input.key + '-video');
                            if (input.image === "QR") {
                                var scan_element = document.getElementById(modal_data.id + '-' + input.key + '-scan');
                                data[input.key] = scan_element.value;
                            } else if (video_element.stream) {
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext('2d');
                                canvas.width = video_element.videoWidth;
                                canvas.height = video_element.videoHeight;
                                ctx.drawImage(video_element, 0, 0, canvas.width, canvas.height);
                                data[input.key] = canvas.toDataURL("image/jpeg");
                            } else if (video_element.poster) {
                                data[input.key] = video_element.poster;
                            }
                            stopVideo(video_element);
                        } else {
                            data[input.key] = $('#' + modal_data.id + '-' + input.key).val();
                        }
                    });
                }
                modal_data.callback(button.key, data, $('#' + modal_data.id));
            });
        });
    }

    $('#' + modal_data.id).on('keydown', 'input', change_modal_index);
    $('#' + modal_data.id).on('keydown', 'select', change_modal_index);
    $('#' + modal_data.id).on('keydown', 'button', change_modal_index);

    $('#' + modal_data.id).on('shown.bs.modal', function () {
        $('#' + modal_data.id).find('[data-index="0"]').focus();
    });

    $('#' + modal_data.id).modal('show');
}
