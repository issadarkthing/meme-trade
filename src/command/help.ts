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
    The commands may have required or optional arguments, to differentiate
    \`<>\` is for required argument and \`[]\` is for optional. For example,
    \`r!buy https://reddit.com/sample 10\`

    \`r!help\`
    Show commands usage.

    \`r!buy <link> [unit]\`
    Buy meme from reddit with it's current value.

    \`r!sell <link>\`
    Sell meme from reddit with it's current value.

    \`r!profile\`
    Show user profile with currently holding memes.

    \`r!value <link>\`
    Check the current value of the meme.
    `

    msg.channel.send(help);
  }
}
