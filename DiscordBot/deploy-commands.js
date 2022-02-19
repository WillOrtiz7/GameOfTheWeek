const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("setgotw")
    .addStringOption((option) =>
      option.setName("hometeam").setDescription("Enter the home team name")
    )
    .addStringOption((option) =>
      option.setName("awayteam").setDescription("Enter the away team name")
    )
    .setDescription("Sets the game of the week")
    .setDefaultPermission(false),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("register")
    .setDescription("Link your account with GridironHub"),
  new SlashCommandBuilder()
    .setName("startgotw")
    .setDescription("Starting the game of the week, voting is now disabled)")
    .setDefaultPermission(false),
  new SlashCommandBuilder()
    .setName("endgotw")
    .addStringOption((option) =>
      option.setName("winner").setDescription("Winner of the GOTW")
    )
    .setDescription("Ends GOTW")
    .setDefaultPermission(false),
  new SlashCommandBuilder()
    .setName("endseason")
    .addStringOption((option) =>
      option
        .setName("confirmation")
        .setDescription("Type confirm to confirm the end of the season.")
    )
    .setDescription("Ends the season, resetting every teams data")
    .setDefaultPermission(false),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
