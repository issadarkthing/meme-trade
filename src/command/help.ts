import { stripIndent } from "common-tags";
import { Message } from "discord.js";


export default {
  name: "help",
  aliases: ["h"],
  async exec(msg: Message, args: string[]) {

    const sampleLink = "htts://reddit.com/sample";
    const help = stripIndent`
    MemeBroker is trading bot based on reddit posts on reddit. Trading is 
    limited to only a few subreddits which are \`r/dankmemes\` and \`r/memes\`.
    Meme value is calculated based on its score & upvote ratio per age (seconds).
    \`value = (score / age) * upvoteRatio\`
    The commands may have required or optional arguments, to differentiate
    \`<>\` is for required argument and \`[]\` is for optional. For example,
    \`r!buy ${sampleLink} 10\`

    **Command:** \`r!help\`
    **Alias:** \`r!h\`
    Show commands usage.

    **Command:** \`r!buy <link> [unit | max]\`
    **Alias:** \`r!b\`
    Buy meme from reddit with it's current value.
    To buy meme with unit of 1 use \`r!buy ${sampleLink} 1\`
    To buy meme with unit of 10 use \`r!buy ${sampleLink} 10\`
    To buy meme with max unit use \`r!buy <link> max\`

    **Command:** \`r!sell <index | all>\`
    **Alias:** \`r!s\`
    Sell meme from reddit with it's current value. 
    To sell 2nd meme in out items, use \`r!sell 2\`
    To sell all memes, use \`r!sell all\`

    **Command:** \`r!profile\`
    **Alias:** \`r!p\`
    Show user profile with all currently holding memes.

    **Command:** \`r!value <link> [unit | max]\`
    **Alias:** \`r!v\`
    Check the current value of the meme.
    This command works exactly like \`r!sell\` except it only show meme value.
    `

    msg.channel.send(help);
  }
}
