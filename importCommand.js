const fs = require('fs')
const path = require('path')
const { Command } = require('commander')
const matter = require('gray-matter')
const uuid = require('@polyblog/polyblog-js-client/uuid.js')
const addOrUpdateArticle = require('@polyblog/polyblog-js-client/addOrUpdateArticle.js')
const rehydrateSession = require('./session/rehydrateSession.js')
const isLoggedInSession = require('./session/isLoggedInSession.js')
const getBlog = require('./getBlog.js')
const getFiles = require('./getFiles.js')
const login = require('./login.js')

function importCommand() {
  const command = new Command('import')
  command.option('--blog [blog]', 'blog id or name')

  command.action(async options => {
    try {
      console.log('import')

      rehydrateSession()

      if (!isLoggedInSession()) {
        await login()
      }

      let blog = await getBlog(options?.blog)
      let defaultLocale = blog.defaultLocale || 'en'
      console.log({ blog, defaultLocale })

      let files = getFiles()
      const { locales, paths } = blog
      console.log({ locales, paths })

      let articles = []

      paths.forEach(path_ => {
        if (path_.includes('%lang%') || path_.includes('%LANG%')) {
          const suffix = path_
            .replace('%LANG%', defaultLocale)
            .replace('%lang%', defaultLocale)
            .replace('%slug%', '(?<slug>.+)')
            .replace('%SLUG%', '(?<slug>.+)')
            .replace('%YYYY%', '(?<YYYY>[0-9]{4})')
            .replace('%MM%', '(?<MM>[0-9]{2})')
            .replace('%DD%', '(?<DD>[0-9]{2})')
          let endsWithRegex = new RegExp(`${suffix}$`)
          let matchingFiles = files.filter(file => endsWithRegex.test(file))
          console.log(
            `Found ${matchingFiles.length} matching files for path ${path_}`,
          )
          // matchingFiles = [
          //   '/_i18n/en/_posts/2010-09-03-welcome-dnsimple-blog.markdown',
          // ]
          // console.log({ matchingFiles })
          if (matchingFiles.length === 0) {
            console.log(`No matching files for path ${path_}`)
          } else {
            matchingFiles.forEach(file => {
              // console.log(`  ${file}`)

              if (file.startsWith('/')) {
                file = file.substring(1)
              }

              let filePath = path.resolve(file)

              let fileString = fs.readFileSync(filePath, 'utf8')
              // console.log({ fileString })
              let json = matter(fileString)
              json = {
                ...json.data,
                content: json.content,
                excerpt: json.excerpt || undefined,
              }

              console.log({ ...json, content: '...' })

              let match = new RegExp(suffix).exec(file)
              let { YYYY, MM, DD } = match?.groups || {}

              const _id = uuid()

              let description = json.description

              if (!description) {
                description = json.excerpt
                delete json.excerpt
              }

              if (!json.date) {
                json.date = `${YYYY}-${MM}-${DD} 00:00:00`
              }

              if (json.date?.length === 19) {
                json.date += '.000Z'
              }

              const creationTime = json.date
                ? new Date(json.date).toISOString()
                : new Date().toISOString()

              let { published, slug } = json
              delete json.published

              slug = slug || match?.groups?.slug
              slug = `${YYYY}/${MM}/${slug}`

              if (!slug) {
                throw new Error(`Could not find slug for file ${file}`)
              }

              if (typeof variable !== 'boolean') {
                published = true
              }

              let article = {
                _id,
                creationTime,
                lastEditTime: creationTime,
                googleTranslate: false,
                locale: defaultLocale,
                title: json.title,
                description,
                slug,
                content: json.content,
                author: json.author,
                published,
                categories: [],
                originalArticleId: _id,
                format: blog.articlesFormat || 'markdown',
                organizationId: blog.organizationId,
                blogId: blog._id,
                blog: blog.name,
                metadata: {
                  ...json,
                  title: undefined,
                  description: undefined,
                  content: undefined,
                  language: undefined,
                  locale: undefined,
                  author: undefined,
                  slug: undefined,
                  slugOriginal: undefined,
                  date: undefined,
                },
              }

              article = JSON.parse(JSON.stringify(article))
              console.log({ ...article, content: '...' })

              articles.push(article)
            })
          }
        } else {
          console.log(`Path ${path_} does not include %lang%`)
        }
      })

      for (let i = 0; i < articles.length; i += 1) {
        let article = articles[i]
        try {
          await addOrUpdateArticle(article)
          console.log(`${i + 1}: imported article ${article.slug}`)
        } catch (error) {
          console.log(`error for article ${article.slug}`, error)
        }
      }

      console.log(`Imported ${articles.length} articles`)
    } catch (error) {
      console.log('error', error)
    }
  })

  return command
}

module.exports = importCommand
