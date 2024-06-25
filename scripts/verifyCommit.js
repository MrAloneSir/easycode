const chalk = require('chalk');

const msgPath = process.env.HUSKY_GIT_PARAMS;

const msg = require('fs')
  .readFileSync(msgPath, 'utf-8')
  .trim();

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;
if (!commitRE.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      '不合要求的 commit message 格式'
    )}\n\n${chalk.red(
      '  为了自动生成changelog文件，请使用合适的提交信息。例如：\n\n'
    )}    ${chalk.green("feat(compiler): add 'comments' option")}\n` +
    `    ${chalk.green('fix(v-model): handle events on blur (close #28)')}\n\n${chalk.red(
      '  在 .github/commit-convention.md 查看更多信息。\n'
    )}`
  );
  process.exit(1);
}
