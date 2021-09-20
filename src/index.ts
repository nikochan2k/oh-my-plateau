#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import { extname } from "path";
import { Command } from "commander";
const program = new Command("oh-my-plateau");
program
  .usage("[options] <filePattern>")
  .option("-o, --overwrite", "overrite existing file")
  .option("-m, --minimize", "minimize file size by removing spaces");
program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
  process.exit(1);
}

const options = program.opts();

const EasySax = require("easysax");

const pattern = program.args[0];
glob(pattern, (err, matches) => {
  if (err) {
    console.warn("Illegal glob file pattern: " + pattern);
    process.exit(1);
  }

  for (let path of matches) {
    try {
      const xml = readFileSync(path, "utf-8");
      const corrected = parse(xml);
      if (!options.overwrite) {
        const extension = extname(path);
        const withoutExt = path.substr(0, path.length - extension.length);
        path = withoutExt + "_mod" + extension;
      }
      writeFileSync(path, corrected, "utf-8");
      console.log('Processed "' + path + '"');
    } catch (e) {
      console.log('Error "' + path + '":\n' + e);
    }
  }
});

const COORDINATES = /^\s*-?\d+(\.\d+)?(\s+-?\d+(\.\d+))*\s*$/;
const ALL_SPACES = /^\s+$/;

function parse(xml: string) {
  const parser = new EasySax();

  const chunks: string[] = [];

  parser.on(
    "startNode",
    (elementName, getAttr, unEntities, isTagEnd, getStringNode) => {
      chunks.push(getStringNode());
    }
  );

  parser.on("endNode", (elementName, unEntities, isTagStart, getStringNode) => {
    chunks.push(getStringNode());
  });

  parser.on("textNode", (text: string) => {
    if (COORDINATES.test(text)) {
      const coords = text.trim().split(/\s+/);
      for (let i = 0, end = coords.length; i + 1 < end; i += 3) {
        const lng = parseFloat(coords[i]);
        const lat = parseFloat(coords[i + 1]);
        if (isNaN(lng) || isNaN(lng)) {
          continue;
        }
        if (20 <= lng && lng <= 46 && 122 <= lat && lat <= 154) {
          coords[i] = lat.toString();
          coords[i + 1] = lng.toString();
        }
      }
      chunks.push(coords.join(" "));
    } else {
      if (options.minimize) {
        if (ALL_SPACES.test(text)) {
          chunks.push("\n");
        } else {
          chunks.push(text.trim());
        }
      } else {
        chunks.push(text);
      }
    }
  });

  parser.on("question", (text) => {
    chunks.push(text);
  });

  parser.on("error", (err) => {
    console.warn(err);
  });

  parser.parse(xml);
  return chunks.join("");
}
