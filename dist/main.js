/// <reference path="../typings/index.d.ts"/>
var results = $("#results");
var textBox = $("#text-box");
var title = $('#title')[0];
var resultTemplate = $('#result-template').html();
Mustache.parse(resultTemplate);
function cleanString(string) {
    return string.replace('@', '').replace(' ', '');
}
function maxTone(tones) {
    var maxTone = Object.keys(tones).reduce(function (result, item) {
        if (tones[item] > result.score) {
            result.score = tones[item];
            result.tone_name = item;
        }
        return result;
    }, {
        score: 0,
        tone_name: ""
    });
    return maxTone;
}
;
function sendTweetToneRequest(userName, callback) {
    console.log('sending request');
    var cleanUserName = cleanString(userName);
    var url = "https://immense-sea-71091.herokuapp.com/tweetTone/" + cleanUserName;
    $.ajax({
        url: url,
        type: "GET"
    })
        .done(function (data) {
        callback(data);
    })
        .fail(function (error) {
        console.log(error);
    });
}
;
function makeToneString(tones) {
    var keys = Object.keys(tones);
    var toneString = "";
    for (var i = 0; i < keys.length; i++) {
        var tonePercent = Math.round(tones[keys[i]] * 100);
        toneString += " " + keys[i] + " " + tonePercent + "%";
        if (i < keys.length - 1)
            toneString += ', ';
    }
    return toneString;
}
$('form').submit(function (event) {
    event.preventDefault();
    if (textBox.val().length !== 0) {
        title.innerHTML = 'loading...';
        var query = textBox.val();
        sendTweetToneRequest(query, function (res) {
            var max = maxTone(res.tone);
            console.log(max);
            var toneString = makeToneString(res.tone);
            var newResult = Mustache.render(resultTemplate, {
                userName: res.tweetInfo.userName || 'no userName',
                tone: toneString,
                profileImage: res.tweetInfo.profileImage || 'http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png'
            });
            results.append(newResult);
            title.innerHTML = 'Enter a name';
        });
        textBox.val('');
    }
    return false;
});
