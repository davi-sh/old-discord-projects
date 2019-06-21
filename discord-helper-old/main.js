const Eris = require('eris');
const colors = require('colors');

var bot = new Eris(");
var prefix = '/';

var silencedUsers = {};
var timeOuts = [];

bot.on('ready', () => {
    log('Bot has connected successfully');
});

bot.on('messageCreate', (msg) => {
    //log all of the chat messages to the console but without a color code
    if (!msg.content.startsWith(prefix) || msg.author.id !== '115594246123159555') {
        logChat(msg);
        return;
    }
    else{
        var msgNoPrefix = msg.content.slice(1).toLowerCase(); //remove the / and convert to lower
        var msgParts = msgNoPrefix.split(' '); //split at spaces
        //var channel = msg.channel.id;
        log('Testing command: ' + msgNoPrefix, 1);
        switch(msgParts[0]){ //switch over the first 'word' to check which command it is
            case 'lenny': //posts a lenny face
                lenny(msg);
                break;
            case 'purge': //purges all of the targets messages in the last 100
                purge(msg, msgParts);
                break;
            case 'clear': //clears the last n lines up to 100
                clear(msg, msgParts);
                break;
            case 'silence': //prevents a user from talking until they are unsilenced //TODO persistence?
                silence(msg, msgParts);
                break;
            case 'unsilence': //allows a silenced user to talk again
                unsilence(msg, msgParts);
                break;
            case 'timeout': //silences a user for a specified number of seconds
                timeout(msg, msgParts);
                break;
            default:
                log('Invalid command: ' + msgParts[0], 1);
                break;
        }
    }

});


/* COMMAND FUNCTIONS */
function lenny(msg){
    log('Executing /lenny on ' + msg.channel.name.toUpperCase());
    msg.delete();
    bot.createMessage(msg.channel.id, '( ͡° ͜ʖ ͡°)');
}

function purge(msg, msgParts){
    log('Executing /purge ' + msgParts[1] + ' on ' + msg.channel.name.toUpperCase());

    /* Check for permissions first */
    if (!msg.member.permission.has('manageMessages')){
        log('Insufficient permissions to manage messages on guild ID ' + msg.guild.id, 1);
        msg.delete();
        return;
    }

    if (!msgParts[1]) {
        log("No target was specified for purge command", 2);
        msg.delete();
        return;
    }
    var count = 0;
    msg.channel.getMessages(100).then((res) =>{
        res.forEach((element) => {
            //check if the username, nickname, or id matches the target
            if (element.author.username.toLowerCase() === msgParts[1] ||
                element.member.nick === msgParts[1] || //FIXME nickname checking isn't working, id is safest
                element.author.id === msgParts[1]){
                element.delete();
                count++;
            }
        });
        log('Deleted ' + count + ' messages');
        msg.delete();
    });
}

function clear(msg, msgParts){
    log('Executing /clear on ' + msg.channel.name.toUpperCase());

    /* Check for permissions first */
    if (!msg.member.permission.has('manageMessages')){
        log('Insufficient permissions to manage messages on guild ID ' + msg.guild.id, 1);
        msg.delete();
        return;
    }

    var toClear;
    if (!msgParts[1]){ //clear the default last 50
        log('No amount specified so clearing default number of messages', 1); //TODO make default configurable
        toClear = 50;
    }
    else if (isNaN(msgParts[1])){
        log(msgParts[1] + ' is not a number, using default of 50', 1);
        toClear = 50;
    }
    else if (parseInt(msgParts[1]) > 100){
        log(msgParts[1] + ' is greater than max of 100, using 100 instead', 1);
        toClear = 100;
    }
    else if (parseInt(msgParts[1]) <= 0){
        log(msgParts[1] + ' is <= 0, why the fuck would you clear <= 0 messages idiot.', 2);
        msg.delete();
        return;
    }
    else {
        log('Clearing the last ' + msgParts[1] + ' messages');
        toClear = parseInt(msgParts[1]);
    }

    if (!toClear) {
        log('Something went wrong with the clear command', 2);
        return;
    }
    var count = 0;
    msg.channel.getMessages(toClear).then((res) =>{
        res.forEach((element) => {
            element.delete();
            count++;

        });
        log('Deleted ' + count + ' messages');
    });

}

function silence(msg, msgParts){
    log('Executing /silence on ' + msg.channel.name.toUpperCase());

    /* Check for permissions first */
    if (!msg.member.permission.has('manageMessages')){
        log('Insufficient permissions to manage messages on guild ID ' + msg.guild.id, 1);
        msg.delete();
        return;
    }

    if (!msgParts[1]){
        log('Silence requires at least 1 user ID to target', 1);
        return;
    }

    else {
        if (!silencedUsers[msg.guild.id]){
            silencedUsers[msg.guild.id] = {};
        }
        for (var i=1 ; i<msgParts.length ; i++){
            if (!isNaN(msgParts[i])){
                silencedUsers[msg.guild.id][msgParts[i]] = true; //users are silenced on a per-guild basis
                log('Silenced user ID ' + msgParts[i] + ' on guild ID ' + msg.guild.id, 0);
            }
            else {
                log(msgParts[i] + ' is not a number/user ID; skipping', 1);
            }
        }
    }
    msg.delete();
}

function unsilence(msg, msgParts){

    for(var i=1 ; i<msgParts.length ; i++){
        if (isNaN(msgParts[i])){
            log(msgParts[i] + ' is not a number/user ID ; skipping', 1)
        }
        else {
            if(!silencedUsers[msg.guild.id] || !silencedUsers[msg.guild.id][msgParts[i]]){
                log(msgParts[i] + ' was not silenced; skipping', 1)
            }
            else {
                silencedUsers[msg.guild.id][msgParts[i]] = false;
                log('Unsilenced ' + msgParts[i] + ' on guild ID ' + msg.guild.id);
            }
        }
    }
    msg.delete();

}

//THIS MESSAGE LISTENER IS ONLY FOR THE SILENCE COMMAND
bot.on('messageCreate', (msg) =>{
    if (silencedUsers[msg.guild.id][msg.author.id]){
        msg.delete();
        log('Deleted a message from silenced user ID ' + msg.author.id);
    }
});

function timeout(msg, msgParts){
    /* Check for permissions first */
    if (!msg.member.permission.has('manageMessages')){
        log('Insufficient permissions to manage messages on guild ID ' + msg.guild.id, 1);
        msg.delete();
        return;
    }

    if (msgParts.length === 3 && !isNaN(msgParts[1]) && !isNaN(msgParts[2])){
        if (!silencedUsers[msg.guild.id]){
            silencedUsers[msg.guild.id] = {};
        }
        silencedUsers[msg.guild.id][msgParts[1]] = true; //users are silenced on a per-guild basis
        log('Timed out user ID ' + msgParts[1] + ' on guild ID ' + msg.guild.id, 0);
        timeOuts.push(setTimeout(() =>{
            silencedUsers[msg.guild.id][msgParts[1]] = false;
            log('Timeout for user ID ' + msgParts[1] + ' has expired on guild ID ' + msg.guild.id);
            return;
        }, msgParts[2]*1000));//the *1000 converts from seconds to milliseconds
    }
    else {
        if (msgParts.length !== 3){
            log('Invalid input, timeout syntax is /timeout userID time', 1);
        }
        else if (isNaN(msgParts[1])){
            log(msgParts[1] + ' is not a number/user ID', 1);
        }
        else if (isNaN(msgParts[2])){
            log(msgParts[2] + ' is not a valid duration for timeout', 1);
        }
    }
    msg.delete();
    return;
}

/* Connect the bot */
bot.connect();

/* HELPER FUNCTIONS */

/*
 * Call like you would console.log, adds a timestamp and colors according to type
 * 0 - status
 * 1 - warning
 * 2 - error
 * 3 - chat message
 */
function log(message, type){
    if (!message){
        console.warn("Bad debug message");
        return;
    }

    var msg = message;
    type = type || 0;

    var date = new Date;
    date.setTime(date.getTime());
    var timestamep = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']';

    msg = timestamep + ' ' + msg; //prefix the timestamp
    if (type === 0) { //status message
        console.log(msg.green);
    }
    else if (type === 1){ //warning message
        console.log(msg.yellow);
    }
    else if (type === 2){ //error message
        console.log(msg.red.bgBlue + ' '); //space to add padding
    }
    else if (type === 3){ //chat message
        console.log(msg);
    }
}

function logChat(msg){
    log(msg.channel.name.toUpperCase() + ' - ' + msg.author.username + ': ' + msg.content, 3);
}

/*
 * TODO: way to check if a string is a valid user ID or username
 * Can get member list for current guild then search it for the string, check both user IDs and user names
 * This might have poor efficiency
 *
 * TODO: streamline permission checking
 * Can do the same thing I'm already doing, have function that takes string and returns if that perm is found
 */