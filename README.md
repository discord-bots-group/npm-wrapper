# Discord Bots Group API
A simple library for interacting with the discordbots.group API.

## Getting Started
Simply install by navigating to your project directory then running `npm i discord-bots-group/npm-wrapper`.

## Example

```js
const Client = require('discordbots.group');
const client = new Client('Bot ID', 'Token');

client.getStats().then(stats => {
    console.log(stats);
}).catch((e) => {
    console.error(e);
})

client.getBots().then(bots => {
    console.log(bots);
}).catch((e) => {
    console.error(e);
})

client.getUsers().then(users => {
    console.log(users);
}).catch((e) => {
    console.error(e);
})

client.getBot('509277637928157195').then(bot => {
    console.log(bot);
}).catch((e) => {
    console.error(e);
})

client.getCurrent().then(bot => {
    console.log(bot);
}).catch((e) => {
    console.error(e);
})

client.updateCount(10).then(bot => {
    console.log(bot);
}).catch((e) => {
    console.error(e);
})

client.hasVoted('449653897695461376').then(votes => {
    console.log(votes);
}).catch((e) => {
    console.error(e);
})
```

## License
[Apache 2.0 License](https://github.com/discordbots-group/npm-wrapper/blob/master/LICENSE)