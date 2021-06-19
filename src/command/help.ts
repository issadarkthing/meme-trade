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
    \`r!h\`
    Show commands usage.

    \`r!buy <link> [unit | max]\`
    \`r!b <link> [unit | max]\`
    Buy meme from reddit with it's current value.
    To buy max meme with max unit use \`r!buy <link> max\`

    \`r!sell <index | all>\`
    \`r!s <index | all>\`
    Sell meme from reddit with it's current value. To sell all memes, you can
    just use \`r!sell all\`

    \`r!profile\`
    \`r!p\`
    Show user profile with currently holding memes.

    \`r!value <link> [unit | max]\`
    \`r!v <link> [unit | max]\`
    Check the current value of the meme.
    To check meme value with max unit use \`r!buy <link> max\`
    `

    msg.channel.send(help);
  }
}
