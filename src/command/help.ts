import { stripIndent } from "common-tags";
import { Message } from "discord.js";


export default {
  name: "help",
  aliases: ["h"],
  async exec(msg: Message, args: string[]) {

    const help = stripIndent`
    MemeBroker is trading bot based on reddit posts on reddit. Trading is 
    limited to only a few subreddits which are \`r/dankmemes\` and \`r/memes\`.
    Meme value is calculated based on its upvote, upvote ratio per age (seconds).

    **r!help**
    Show commands usage.

    **r!buy <link>**
    Buy meme from reddit with it's current value.

    **r!sell <link>**
    Sell meme from reddit with it's current value.

    **r!profile**
    Show user profile with currently holding memes.

    **r!value <link>**
    Check the current value of the meme.
    `

    msg.channel.send(help);
  }
}
