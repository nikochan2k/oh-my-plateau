#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import { extname } from "path";
const EasySax = require("easysax");

if (process.argv.length <= 2) {
  console.error("Usage: node oh-my-plateau <filePattern>");
  process.exit(1);
}

const pattern = process.argv[2];
glob(pattern, (err, matches) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  for (const path of matches) {
    const xml = readFileSync(path, "utf-8");
    const corrected = parse(xml);
    const extension = extname(path);
    const withoutExt = path.substr(0, path.length - extension.length);
    const newPath = withoutExt + "_mod" + extension;
    writeFileSync(newPath, corrected, "utf-8");
  }
});

const COORDINATES = /^\s*-?\d+(\.\d+)?(\s+-?\d+(\.\d+))*\s*$/;

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
      chunks.push(text);
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
