require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 2000;
const { MessageEmbed } = require("discord.js");

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@game-of-the-week.xa6jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const teamNames = require("./teamList.js").teamNames;
const { Client, Intents, ApplicationCommand } = require("discord.js");

const { token } = require("./config.json");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

const GUILDID = "595828355916496900";
const ADMINID = "948774804721381386";
const GOTWROLEID = "948823659190046770";
const REGISTEREDROLEID = "948777284775579688";
const STARTGOTWCOMMANDID = "948816970822869054";
const SETGOTWCOMMANDID = "948816970822869052";
const ENDGOTWCOMMANDID = "948816970822869055";
const ENDSEASONCOMMANDID = "948816970822869056";
const VOTECOMMANDID = "948816970822869057";

// Initialize Discord Bot

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once("ready", async function (evt) {
  console.log("Ready");
  // Setting permissions for commands based on role
  const fullPermissions = [
    {
      id: SETGOTWCOMMANDID,
      permissions: [
        {
          id: ADMINID,
          type: "ROLE",
          permission: true,
        },
      ],
    },
    {
      id: STARTGOTWCOMMANDID,
      permissions: [
        {
          id: ADMINID,
          type: "ROLE",
          permission: true,
        },
        {
          id: GOTWROLEID,
          type: "ROLE",
          permission: true,
        },
      ],
    },
    {
      id: ENDGOTWCOMMANDID,
      permissions: [
        {
          id: ADMINID,
          type: "ROLE",
          permission: true,
        },
      ],
    },
    {
      id: ENDSEASONCOMMANDID,
      permissions: [
        {
          id: ADMINID,
          type: "ROLE",
          permission: true,
        },
      ],
    },
    {
      id: VOTECOMMANDID,
      permissions: [
        {
          id: REGISTEREDROLEID,
          type: "ROLE",
          permission: true,
        },
      ],
    },
  ];
  await (
    await bot.guilds.fetch(GUILDID)
  ).commands.permissions.set({ fullPermissions });
});

bot.on("interactionCreate", async (interaction) => {
  await interaction.deferReply();
  // Error handling to check if user has invalid nickname
  if (
    !interaction.member.nickname ||
    !interaction.member.nickname.includes(" ")
  ) {
    interaction.editReply("Invalid user");
    return;
  }
  let fullUserNickname = interaction.member.nickname.split(" ");
  console.log("full user nickname ", fullUserNickname);
  let userNickname = fullUserNickname[0];
  // More error handling to check if user has invalid nickname
  if (
    !teamNames.has(userNickname) ||
    fullUserNickname[1] != "|" ||
    !fullUserNickname[2]
  ) {
    interaction.editReply("Invalid user");
    return;
  }
  let userId = interaction.user.id;
  console.log("Command ID: " + interaction.commandId);

  if (!interaction.isCommand()) return;
  let args = interaction.options.data;

  await client.connect();
  const currentMatchupCollection = client
    .db("gameOfTheWeek")
    .collection("currentMatchup");
  const userCollection = client.db("gameOfTheWeek").collection("users");
  let matchup = await currentMatchupCollection.findOne({});
  let randomUser = await userCollection.findOne({});

  const { commandName } = interaction;
  switch (commandName) {
    case "setgotw":
      if (!matchup.isEnded) {
        interaction.editReply(
          "Error: You must wait until the current GOTW has been ended to set a new one"
        );
        return;
      }
      let homeTeam = args[0].value;
      let awayTeam = args[1].value;

      if (!teamNames.has(homeTeam) || !teamNames.has(awayTeam)) {
        interaction.editReply("Invalid matchup");
        return;
      }

      console.log(homeTeam, awayTeam);
      client.connect((err) => {
        if (err) {
          console.log(err);
          return;
        }
        currentMatchupCollection.findOneAndUpdate(
          {},
          {
            $set: {
              homeTeamName: homeTeam,
              awayTeamName: awayTeam,
              isLive: true,
              isEnded: false,
              isSet: true,
            },
          }
        );
        userCollection.updateMany(
          {},
          { $set: { votedHome: false, votedAway: false, currentVote: "N/A" } }
        );
        // Giving the GOTW role to the teams playing in the game of the week
        userCollection.findOne(
          { userName: homeTeam },
          async function (err, user) {
            // Error handling in case an invalid matchup is submitted
            if (err) {
              console.log(err);
              return;
            }
            if (!user) {
              interaction.editReply("Invalid matchup");
              return;
            }
            let gotwRole = interaction.guild.roles.cache.get(GOTWROLEID);
            const guild = await bot.guilds.fetch(GUILDID);
            const members = await guild.members.fetch(user.discordId);
            members.roles.add(gotwRole);
            userCollection.findOne(
              { userName: awayTeam },
              async function (err, user) {
                // Error handling in case the teams are valid but one or both of the users are not registered
                if (err) {
                  console.log(err);
                  return;
                }
                if (!user) {
                  interaction.editReply("Invalid matchup");
                  return;
                }
                let gotwRole = interaction.guild.roles.cache.get(GOTWROLEID);
                const guild = await bot.guilds.fetch(GUILDID);
                const members = await guild.members.fetch(user.discordId);
                members.roles.add(gotwRole);
                await interaction.editReply(
                  "Game of the week has been set, " +
                    homeTeam +
                    " vs " +
                    awayTeam
                );
                (
                  await (
                    await bot.guilds.fetch(GUILDID)
                  ).commands.fetch(VOTECOMMANDID)
                ).setDescription(
                  "The current GOTW is: " +
                    homeTeam +
                    " vs " +
                    awayTeam +
                    ", predict the winner below"
                );
                console.log(
                  await (
                    await bot.guilds.fetch(GUILDID)
                  ).commands.fetch(VOTECOMMANDID)
                );
              }
            );
          }
        );
      });
      break;

    case "register":
      console.log(userId, userNickname);
      client.connect((err) => {
        if (err) {
          console.log(err);
          return;
        }
        // Sets users discord id in database based on their nickname
        userCollection.findOneAndUpdate(
          { userName: userNickname },
          { $set: { discordId: userId } },
          async function (err, data) {
            // Check if an invalid user tried to register
            if (!data.value) {
              interaction.editReply("Failed to regiser.");
              return;
            }
            let registeredRole =
              interaction.guild.roles.cache.get(REGISTEREDROLEID);
            interaction.member.roles.add(registeredRole);
            await interaction.editReply("Successfully registered!");
          }
        );
      });

      break;

    case "startgotw":
      if (matchup.isStarted) {
        interaction.editReply("Error: GOTW has already been started");
        return;
      }
      if (!matchup.isSet) {
        interaction.editReply(
          "Error: You must wait until the GOTW is set before starting it"
        );
        return;
      }
      client.connect(async (err) => {
        if (err) {
          console.log(err);
          return;
        }
        let matchup = await currentMatchupCollection.findOne({});
        console.log(matchup);
        currentMatchupCollection.findOneAndUpdate(
          {},
          { $set: { isLive: false, isStarted: true, isSet: false } }
        );
        await interaction.editReply(
          "@everyone GOTW is now starting, voting has been disabled"
        );
      });
      client.connect((err) => {
        if (err) {
          console.log(err);
          return;
        }
        // Finds the current GOTW team names
        currentMatchupCollection.findOne({}, function (err, data) {
          let homeTeamName = data.homeTeamName;
          let awayTeamName = data.awayTeamName;
          // Updates the users vote history with their current vote once the GOTW starts
          userCollection.updateMany(
            { currentVote: homeTeamName },
            { $push: { voteHistory: homeTeamName } }
          );
          userCollection.updateMany(
            { currentVote: awayTeamName },
            { $push: { voteHistory: awayTeamName } }
          );
          userCollection.updateMany(
            { currentVote: "N/A" },
            { $push: { voteHistory: "N/A" } }
          );
        });
      });

      break;

    case "endgotw":
      // TRYING TO FIX MULTIPLE END GOTW COMMAND CALLS
      if (!matchup.isStarted) {
        interaction.editReply(
          "Error: Game of the week must be started before ending it"
        );
        return;
      }
      if (matchup.isEnded) {
        interaction.editReply(
          "ERROR: Game of The Week has already been ended, winner: " + winner
        );
        return;
      }
      let winner = args[0].value;
      client.connect(async (err) => {
        if (err) {
          console.log(err);
          return;
        }
        let currentMatchup = await currentMatchupCollection.findOne({});
        // Error handling if user enters a team as the winner who is not in the GOTW
        if (
          winner != currentMatchup.homeTeamName &&
          winner != currentMatchup.awayTeamName
        ) {
          interaction.editReply(
            "Invalid input, winner must be from the GOTW: " +
              currentMatchup.homeTeamName +
              " vs " +
              currentMatchup.awayTeamName
          );
          return;
        }
        let teamName = currentMatchup.homeTeamName;
        let user = await userCollection.findOne({ userName: teamName });
        const guild = await bot.guilds.fetch(GUILDID);
        let member = await guild.members.fetch(user.discordId);
        let gotwRole = interaction.guild.roles.cache.get(GOTWROLEID);
        // Increasing number correct for all users with the winner as their current vote
        userCollection.updateMany(
          { currentVote: winner },
          { $inc: { numberCorrect: 1 } }
        );
        await interaction.editReply("GOTW has ended, winning team: " + winner);
        // Getting users which are currently in the GOTW
        currentMatchupCollection.findOne({}, function (err, data) {
          userCollection
            .find(
              { userName: { $in: [data.homeTeamName, data.awayTeamName] } },
              { discordId: 1 }
            )
            .toArray(async function (err, users) {
              // Removing GOTW role from users with GOTW role
              users.forEach(async (user) => {
                const members = await guild.members.fetch(user.discordId);
                members.roles.remove(gotwRole);
              });
            });
          // Making isEnded true in the database to ensure that we dont end the GOTW multiple times
          currentMatchupCollection.findOneAndUpdate(
            {},
            { $set: { isEnded: true, isStarted: false } }
          );
        });
      });
      break;

    case "endseason":
      // Error handling for if a user tries to end the season early
      if (randomUser.voteHistory.length <= 20) {
        interaction.editReply(
          "Error: The /endseason command cannot be used until the Gridiron season has been completed"
        );
        return;
      }
      let confirmation = args[0].value;
      // Error handling for if confirm is not passed as an argument
      if (confirmation != "confirm") {
        await interaction.editReply('Error: must enter "confirm" as argument');
        return;
      }
      await interaction.editReply("Sucessfully ended season");

      client.connect((err) => {
        if (err) {
          console.log(err);
          return;
        }
        // Resetting all user data
        userCollection.updateMany(
          {},
          {
            $set: {
              voteHistory: [],
              numberCorrect: 0,
              currentVote: "N/A",
              votedHome: false,
              votedAway: false,
            },
          }
        );
        // Resetting isEnded so we can end the next GOTW
        currentMatchupCollection.findOneAndUpdate(
          {},
          { $set: { isEnded: false } }
        );
      });
      break;

    case "vote":
      // Store the users vote from the argument in the command
      let userVote = args[0].value;
      client.connect((err) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!currentMatchup.isLive) {
          interaction.editReply("Error: Voting period has ended");
          return;
        }
        currentMatchupCollection.findOne({}).then((data) => {
          let homeTeamName = data.homeTeamName;
          let awayTeamName = data.awayTeamName;
          // Error handling in case user inputs invalid team name
          if (userVote != homeTeamName && userVote != awayTeamName) {
            interaction.editReply(
              "Error, you did not vote for one of the teams in the GOTW (" +
                homeTeamName +
                " vs " +
                awayTeamName +
                ")"
            );
            client.close();
            return;
          }
          userCollection
            .findOneAndUpdate(
              { userName: userNickname },
              {
                $set: {
                  votedHome: userVote == homeTeamName,
                  votedAway: userVote == awayTeamName,
                  currentVote: userVote,
                },
              }
            )
            .then((data) => {
              console.log(data);
              interaction.editReply("You voted for the " + userVote + "!");
              client.close();
            });
        });
      });
      break;

    case "leaderboard":
      let rank = 0;
      // Creating the leaderboard
      const leaderboard = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("GOTW Leaderboard");

      // Queries the database for users sorted by number correct
      let sortedUsers = await userCollection
        .find({})
        .limit(16)
        .sort({ numberCorrect: -1 })
        .toArray();
      sortedUsers.forEach((user) => {
        rank += 1;
        leaderboard.addFields({
          name:
            rank.toString() +
            ". " +
            user.userName +
            " - " +
            user.numberCorrect.toString(),
          value: "\u200B",
        });
      });
      interaction.editReply({ embeds: [leaderboard] });
      break;
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

bot.login(token);
