require("dotenv").config;
const Bot = require("node-telegram-bot-api");
const {
  INPUT_STATUS: ipstatus,
  INPUT_TOKEN: tgtoken, //Telegram api token
  INPUT_CHAT: chatid, // Telegram Chat ID
  INPUT_IU_TITLE: ititle, // Issue title
  INPUT_IU_NUM: inum, // Issue Number
  INPUT_IU_ACTOR: iactor, // Issue made by
  INPUT_IU_BODY: ibody, // Issue Body
  INPUT_PR_NUM: pnum, // PR Number
  INPUT_PR_STATE: prstate, // PR Opened, reponed or closed
  INPUT_PR_TITLE: ptitle, // PR Title
  INPUT_PR_BODY: pbody, // Body of the PR
  GITHUB_EVENT_NAME: ghevent, // Name of the trigger event
  GITHUB_REPOSITORY: repo, // Repository the trigger was made from
  GITHUB_ACTOR: ghactor, // User who triggered the action
  GITHUB_SHA: sha, // Commit ID
  GITHUB_WORKFLOW: ghwrkflw, // Workflow Name
} = process.env;

const bot = new Bot(tgtoken);
// Function to return the response for the specific trigger
const evresp = (gevent) => {
  switch (gevent) {
    //Switch statement for issues
    case "issues":
      return `
        [new issue] ${prstate}

        title | number  : ${ititle} | #${inum}
        author : \`${iactor}\`
        message : *${ibody}*
        [Link to Issue](https://github.com/${repo}/issues/${inum})
        [Link to Repository](https://github.com/${repo}/)
        [Build log](https://github.com/${repo}/commit/${sha}/checks)
      `;
    // Switch statement for Pull Requests
    case "pull_request":
      return `
        [new pull request] ${prstate} 

        PR Number:      ${pnum}
        PR Title:       ${ptitle}
        PR Body:        *${pbody}*
        PR By:          ${ghactor}

        [Link to Issue](https://github.com/${repo}/pull/${pnum})
        [Link to Repository](https://github.com/${repo}/)
        [Build log](https://github.com/${repo}/commit/${sha}/checks)
      `;
    default:
      // switch statement for Pushes
      return `
        [new *${ghevent}*]

        By: *${ghactor}* 
        Tag: ${process.env.GITHUB_REF}

        [Link to Repository](https://github.com/${repo}/)
      `;
  }
};
// assigning the output to a variable
const output = evresp(ghevent);
// sending the message
bot.sendMessage(chatid, output, { parse_mode: "Markdown" });
