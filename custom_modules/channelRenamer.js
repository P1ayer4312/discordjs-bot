const {
    reactWith
} = require('./essentials');

/**
 * Rename channels by getting and setting a JSON object
 * @param {Object} msg 
 * @param {Array} cmd 
 */
async function channelRenamer(msg, cmd) {
    if (cmd.length == 1) {
        reactWith(msg, 'warning');
    } else {
        switch (cmd[1]) {
            case 'get': {
                const chData = msg.guild.channels.cache;
                const keys = chData.keys();
                let chItems = [];
                for (let i of keys) {
                    const channel = chData.get(i);
                    let newItem = {
                        name: channel.name,
                        id: channel.id
                    }
                    // if ('topic' in channel && channel.topic != null) {
                    //     newItem['topic'] = channel.topic;
                    // }
                    chItems.push(newItem);
                }

                msg.channel.send("```\n" + JSON.stringify(chItems) + "```");
                break;
            }

            case 'set': { // ch set [{"JSON": "object"}]
                try {
                    const newItems = JSON.parse(cmd.join(' ').substring(7));
                    const channels = msg.guild.channels.cache;
                    for await (let item of newItems) {
                        const channel = channels.get(item.id);
                        if ('name' in item) {
                            channel.setName(item.name);
                        }

                        // if ('topic' in item) {
                        //     channel.setTopic(item.topic);
                        // }
                    }

                    reactWith(msg, 'success');
                } catch (e) {
                    console.log(e);
                    reactWith(msg, 'warning');
                }
                break;
            }

            default: {
                reactWith(msg, 'warning');
                break;
            }
        }
    }
}

module.exports = channelRenamer;