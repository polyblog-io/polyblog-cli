/* Copyright 2013 - 2022 Waiterio LLC */
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import polyblog from '@polyblog/polyblog-js-client'

const { getArticles } = polyblog

export default async function download(directory, options) {
  directory = directory || '.'
  const blogId = options.blog
  let articles = await getArticles({ blogId })

  console.log(`Found ${articles.length} articles: `)

  let locales = articles.map(article => article.locale)
  locales = [...new Set(locales)]
  locales = locales.sort()

  console.log(`Found ${locales.length} locales: `, locales)

  for (let i = 0; i < locales.length; i += 1) {
    const locale = locales[i]
    const folderpath = path.resolve(directory, locale)
    if (!(await promisify(fs.exists)(folderpath))) {
      await promisify(fs.mkdir)(folderpath)
    }
  }

  for (let i = 0; i < articles.length; i += 1) {
    const article = articles[i]
    const {
      author,
      content,
      coverImage,
      creationTime,
      lastRewriteTime,
      locale,
      slug,
      subtitle,
      title,
    } = article
    const filepath = path.resolve(directory, locale, `${slug}.md`)
    const markdown =
      '---\n' +
      `language: ${locale}\n` +
      `date: ${lastRewriteTime || creationTime}\n` +
      `title: ${title}\n` +
      `description: ${subtitle}\n` +
      `author: ${author}\n` +
      `coverimage: ${coverImage}\n` +
      '---\n' +
      content
    await promisify(fs.writeFile)(filepath, markdown)
  }
}
