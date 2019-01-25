#!/usr/bin/env node

import program from "commander";

import momo from "./";

import { Credentials } from "./types";

const { version } = require("../package.json");

program
  .version(version)
  .description("Create sandbox credentials")
  .option("-x, --host <n>", "Your webhook host")
  .option("-p, --primary-key <n>", "Primary Key")
  .parse(process.argv);

const stringify = (obj: object) => JSON.stringify(obj, null, 2);

const { Users } = momo();

const users = Users({ primaryKey: program.primaryKey });

users
  .create(program.host)
  .then((userId: string) => {
    return users.login(userId).then((credentials: Credentials) => {
      console.log(
        "Momo Sandbox Credentials",
        stringify({
          userSecret: credentials.apiKey,
          userId
        })
      );
    });
  })
  .catch(error => {
    let message: string = stringify(error.message);

    if (error.response && error.response.data) {
      message = stringify(error.response.data);
    }

    console.log(message);
  });
