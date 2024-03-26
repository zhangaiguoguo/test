import { readFileSync, writeFileSync } from "fs";
import { baseParse } from "./parseTemplate.js";
import { getCurrentTime } from "./utils.js"

const template = readFileSync("./template.vue", 'utf-8')

const filePath = "./template.json"

writeFileSync(filePath, "", "utf-8")

console.warn("已清空当前文件" + filePath);

const startTime = getCurrentTime()

const treePath = baseParse(template)

const parseTreeTime = getCurrentTime() - startTime

writeFileSync(filePath, JSON.stringify(treePath, null, "\t"), "utf-8")

console.warn("已写入当前文件" + filePath, "耗时" + (getCurrentTime() - startTime), "解析模板文件耗时" + parseTreeTime);