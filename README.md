## Getting Started
Simply Run `npm install discordbots.group`.

## Example
```js

const DBG = require('discordbots.group');

/*
* Bot ID     
* User Token 
*/

const DBGClient = new DBG('Bot ID', 'User Token');

DBGClient.updateServerCount(100)
console.log("Server Count Updated")

DBGClient.getBotInfo('435161743183052801').then(bot => {

    console.log("Current Bot Username: "+ bot.username),
    console.log("Current Bot ID: "+ bot.discordid),
    console.log("Current Bot Libary: "+ bot.libary)


 DBGClient.getCurrentBot().then(bot => {

    console.log("Current Bot Username: "+ bot.username),
    console.log("Current Bot ID: "+ bot.discordid),
    console.log("Current Bot Libary: "+ bot.libary)

}) 
```

## License - Apache 2.0 License