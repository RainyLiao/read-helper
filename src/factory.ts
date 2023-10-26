#!/usr/bin/env zx

import process from 'node:process'
import sade from 'sade'
import { $, chalk, echo } from 'zx'
import { Direction, RhOptions } from './type'

$.verbose = false

/**
 * Checks out to the specified commit if it exists, and logs a message indicating success or failure.
 * @param {string|undefined} targetCommit - The commit to check out to.
 * @returns {Promise<void>}
 */
async function judgeTargetCommit(targetCommit?: string) {
  if (targetCommit) {
    await $`git checkout ${targetCommit}`
    echo`${chalk.green(`切换到 ${chalk.blue(targetCommit)} 成功`)}`
    echo`${chalk.yellow('你可以尽情的查看源码了')}`
  }
  else { echo`没有找到即将切换的commit` }
}

/**
 * Checks if the specified branch exists in the local git repository.
 * @param {string} branch - The name of the branch to check.
 * @returns {Promise<void>} - A Promise that resolves when the branch is found, or rejects if it is not found.
 */
async function checkBranch(branch: string) {
  const branches = (await $`git branch`).stdout.trim().split('\n').map(branch => branch.replace('*', '').trim())
  if (!branches.includes(branch)) {
    echo`请提供要查看源码的分支`
    process.exit(1)
  }
  echo`当前查看源码的分支为： ${chalk.blue.underline.bold(branch)}`
}

/**
 * Switches to a different branch or commit in Git.
 * @param {string} branch - The name of the branch to switch to.
 * @param {string} direction - The direction to move in the commit history. Can be "prev", "next", or "first".
 * @param {string} hash - The hash of the commit to switch to. If provided, direction is ignored.
 */
async function switchBranch(branch: string, direction: Direction, hash: string) {
  const commits = (await $`git log --reverse --pretty=%H ${branch}`).stdout.trim().split('\n')
  echo`当前分支的commit有 ${chalk.blue(commits.length)} 个`
  const currentCommit = (await $`git rev-parse HEAD`).stdout.trim()
  echo`当前commit是 ${chalk.blue(currentCommit)}`
  if (hash) {
    const targetCommit = commits.find(commit => commit.startsWith(hash))
    judgeTargetCommit(targetCommit)
    return
  }
  const currentCommitIndex = commits.indexOf(currentCommit)
  let targetCommitIndex = currentCommitIndex
  if (direction === 'prev')
    targetCommitIndex -= 1
  else if (direction === 'next')
    targetCommitIndex += 1
  else if (direction === 'first')
    targetCommitIndex = 0
  const targetCommit = commits[targetCommitIndex]
  judgeTargetCommit(targetCommit)
}

/**
 * Handles the arguments passed to the program and determines the target commit to view.
 * @param {string} dir - The directory to run the git commands in.
 * @param {object} opts - The options object containing the branch, direction, and hash properties.
 * @param {string} opts.branch - The name of the branch to view commits from.
 * @param {Direction} opts.direction - The direction to move through the commit history ('prev', 'next', or 'first').
 * @param {string} opts.hash - The hash of the commit to view.
 * @returns {Promise<void>} - A Promise that resolves when the target commit has been determined.
 */
async function handleArguments(_: string, opts: RhOptions) {
  const { branch, direction, hash } = opts
  await checkBranch(branch)
  await switchBranch(branch, direction, hash)
}

export function main() {
  try {
    sade('rh [dir]', true)
      .version('0.0.1')
      .describe('帮助用户快速切换git的历史记录，查看源码')
      .example('-b master -d prev')
      .example('-b master -d next')
      .example('-b master -d first')
      .option('-b, --branch', '指定要查看源码的分支')
      .option('-h, --hash', '指定跳到某个具体的commit')
      .option('-d, --direction', '指定查看的方向，prev表示上一个，next表示下一个，first表示第一个')
      .option('-v, --version', '查看版本号')
      .option('-h, --help', '查看帮助')
      .action(handleArguments)
      .parse(process.argv, {
        unknown: arg => chalk.red(`错误的参数或者参数值: ${arg}`),
      })
      // 增加一个rh back的命令
  }
  catch (p: any) {
    echo`${chalk.red('出错了')}`
    echo`${chalk.red(`错误信息如下:  ${p.stderr}`)}`
  }
}
