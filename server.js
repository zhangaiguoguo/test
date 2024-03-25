import { readFileSync, writeFileSync } from "fs";
import { baseParse } from "./parseTemplate.js";

const template = readFileSync("./template.vue", 'utf-8')

writeFileSync("./template.json", JSON.stringify(baseParse(template)), "utf-8")