#!/usr/bin/env node

import program from "commander";

import { Users, Credentials } from ".";

const { version } = require("../package.json");

program
  .version(version)
  .description("Create sandbox credentials")
  .option("-x, --host <n>", "Your webhook host")
  .option("-p, --primary-key <n>", "Primary Key")
  .parse(process.argv);

const users = new Users({ subscriptionKey: program.primaryKey });

users
  .create(program.host)
  .then((userId: string) => {
    return users.login(userId).then((credentials: Credentials) => {
      console.log(
        "Momo Sandbox Credentials",
        JSON.stringify(
          {
            userSecret: credentials.apiKey,
            userId: userId
          },
          null,
          2
        )
      );
    });
  })
  .catch(error => {
    if (error.response && error.response.data) {
      console.log(error.response.data);
    }

    console.log(error.message);
  });
