/* Copyright 2013 - 2022 Waiterio LLC */
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { Command } = require('commander')
const getArticles = require('@polyblog/polyblog-js-client/getArticles.js')
// const getArticleById = require('@polyblog/polyblog-js-client/getArticleById.js')
const rehydrateSession = require('./session/rehydrateSession.js')
const isLoggedInSession = require('./session/isLoggedInSession.js')
const getBlog = require('./getBlog.js')
const login = require('./login.js')

function downloadCommand() {
  const command = new Command('download')
  command.option('-b, --blog <blogId>', 'blogId from polyblog.io')
  command.argument('[directory]', 'directory to download to the blog')

  command.action(async (directory, options) => {
    directory = directory || '.'

    console.log('download')

    rehydrateSession()

    if (!isLoggedInSession()) {
      await login()
    }

    let blog = await getBlog(options?.blog)
    let defaultLocale = blog.defaultLocale || 'en'
    // console.log({ blog, defaultLocale })

    let articles = await getArticles({ blogId: blog._id })
    // let articles = [await getArticleById('8e0158cb593bc8c789cb6978')]

    console.log(`Found ${articles.length} articles: `)

    let locales = articles.map(article => article.locale)
    locales = [...new Set(locales)]
    locales = locales.sort()

    console.log(`Found ${locales.length} locales: `, locales)

    // console.log('skip en articles')
    // articles = articles.filter(
    //   article => article.originalArticleId === 'b85843066bf56261697e31e8',
    // )

    // console.log({ articles })

    for (let i = 0; i < articles.length; i += 1) {
      const article = articles[i]
      let {
        _id,
        author,
        content,
        // coverImage,
        creationTime,
        lastRewriteTime,
        locale,
        slug,
        description,
        title,
        published,
        metadata,
        originalArticleId,
      } = article

      const isDefaultLocale = locale === defaultLocale

      const originalArticle = isDefaultLocale
        ? article
        : articles.find(article_ => article_._id === originalArticleId)

      if (!originalArticle) {
        throw new Error(
          `No original article found for ${_id} with slug: ${slug} and locale ${locale}`,
        )
      }

      const slugOriginal = originalArticle.slug

      metadata = metadata || {}

      // console.log({ article })

      let date = lastRewriteTime || creationTime
      let YYYY = new Date(date).toISOString().substring(0, 4)
      let MM = new Date(date).toISOString().substring(5, 7)
      let DD = new Date(date).toISOString().substring(8, 10)
      let filename = slug.replace(`${YYYY}/${MM}/`, `${YYYY}-${MM}-${DD}-`)
      const filepath = path.resolve(`content/blog/${locale}-${filename}.md`)

      let editUrl = isDefaultLocale
        ? `https://app.polyblog.io/blogs/${
            blog.name || blog._id
          }/articles/${_id}/write/`
        : `https://app.polyblog.io/blogs/${
            blog.name || blog._id
          }/articles/${_id}/translate/`

      date = date.substring(0, 19).replace('T', ' ')

      const markdown =
        '---\n' +
        '# DO NOT EDIT MANUALLY\n' +
        `# Edit at ${editUrl}\n` +
        '# Download translated files by running yarn download-posts\n' +
        `templateKey: ${metadata.templateKey}\n` +
        `language: ${locale}\n` +
        `featured: ${metadata.featured}\n` +
        `date: ${date.replace(' ', 'T')}.000Z\n` +
        `tags:${metadata.tags.map(tag => `\n  - ${tag}`).join('')}\n` +
        `topic: ${metadata.topic}\n` +
        `title: "${title.replaceAll('"', "'")}"\n` +
        `description: "${description.replaceAll('"', "'") || ''}"\n` +
        `author: ${author}\n` +
        `coverImage: ${metadata.coverImage}\n` +
        `slug: ${slug}\n` +
        `slugOriginal: ${slugOriginal}\n` +
        '---\n' +
        content

      await promisify(fs.writeFile)(filepath, markdown)
    }
  })

  return command
}

module.exports = downloadCommand
