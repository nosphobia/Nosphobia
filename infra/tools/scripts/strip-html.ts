import { readFileSync, writeFileSync } from "fs";
import { resolve, extname } from "path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("사용법: npx ts-node scripts/strip-html.ts <파일경로.html>");
  process.exit(1);
}

const html = readFileSync(resolve(inputPath), "utf-8");

const text = html
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<\/p>/gi, "\n")
  .replace(/<p[^>]*>/gi, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const outputPath = resolve(
  inputPath.replace(new RegExp(`${extname(inputPath)}$`), ".txt")
);

writeFileSync(outputPath, text, "utf-8");
console.log(`저장 완료: ${outputPath}`);
