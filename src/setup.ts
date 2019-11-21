import { defaultConfig, IConfig } from "./config/index";
import inquirer from "inquirer";
import { getFFMpegURL, getFFProbeURL, downloadFile } from "./ffmpeg-download";
const sha = require("js-sha512").sha512;
import * as path from "path";

export default async () => {
  const { downloadFFMPEG } = await inquirer
    .prompt([
      {
        type: "confirm",
        name: "downloadFFMPEG",
        message: "Download FFMPEG binaries?",
        default: true
      }
    ]);

  const { usePassword } = await inquirer
    .prompt([
      {
        type: "confirm",
        name: "usePassword",
        message: "Set a password (protect server in LAN)?",
        default: true
      }
    ]);

  let password;

  if (usePassword) {
    password = (await inquirer
      .prompt([
        {
          type: "password",
          name: "password",
          message: "Enter a password"
        }
      ])).password;

    let confirmPassword;

    do {
      confirmPassword = (await inquirer
        .prompt([
          {
            type: "password",
            name: "password",
            message: "Confirm password"
          }
        ])).password;
    }
    while (password != confirmPassword);
  }

  let config = JSON.parse(JSON.stringify(defaultConfig)) as IConfig;

  if (downloadFFMPEG) {
    const ffmpegURL = getFFMpegURL();
    const ffprobeURL = getFFProbeURL();

    const ffmpegPath = path.basename(ffmpegURL);
    const ffprobePath = path.basename(ffprobeURL);

    await downloadFile(ffmpegURL, ffmpegPath);
    await downloadFile(ffprobeURL, ffprobePath);

    config.FFMPEG_PATH = path.resolve(ffmpegPath);
    config.FFPROBE_PATH = path.resolve(ffprobePath);
  }

  if (usePassword)
    config.PASSWORD = sha(password);

  return config;
}