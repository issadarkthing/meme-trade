import { stripIndent, stripIndents } from "common-tags";
import { Message } from "discord.js";
import { sampleLink } from "../utils";
import { Command, commands } from "../main";

export default {
  name: "help",
  alias: "h",
  args: "[commandName]",
  description: stripIndent`
    Show commands usage.
    To show help on specific command, use \`r!help buy\`
  `,
  async exec(msg: Message, args: string[]) {

    const [arg] = args;

    if (arg) {

      const cmd = commands.find(cmd => cmd.alias === arg || cmd.name === arg);
      if (!cmd)
        return msg.channel.send("No command found!");

      const help = makeHelp(cmd);
      return msg.channel.send(help);
    }

    const header = stripIndent`
    MemeBroker is trading bot based on reddit posts on reddit. Trading is 
    limited to only a few subreddits which are \`r/dankmemes\` and \`r/memes\`.
    Meme value is calculated based on its score & upvote ratio per age (seconds).
    \`value = (score / age) * upvoteRatio\`
    The commands may have required or optional arguments, to differentiate
    \`<>\` is for required argument and \`[]\` is for optional. For example,
    \`r!buy ${sampleLink} 10\``

    let commandsHelp = "";

    commands.forEach(cmd => {
      commandsHelp += "\n\n";
      commandsHelp += makeHelp(cmd);
    })

    msg.channel.send(header + commandsHelp);
  }
}

function makeHelp(cmd: Command) {
  return stripIndents`
    **Command:** \`r!${cmd.name} ${cmd.args || ""}\`
    **Alias:** \`${cmd.alias ? "r!" + cmd.alias : " "}\`
    ${cmd.description}`
}
