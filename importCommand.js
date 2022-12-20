import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import matter from 'gray-matter'
import uuid from '@polyblog/polyblog-js-client/uuid.js'
import addOrUpdateArticle from '@polyblog/polyblog-js-client/addOrUpdateArticle.js'
import rehydrateSession from './session/rehydrateSession.js'
import isLoggedInSession from './session/isLoggedInSession.js'
import getBlog from './getBlog.js'
import getFiles from './getFiles.js'
import login from './login.js'

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

              const _id = uuid()

              let subtitle = json.description

              if (!subtitle) {
                subtitle = json.excerpt
                delete json.excerpt
              }

              const creationTime = json.date
                ? new Date(json.date).toISOString()
                : new Date().toISOString()

              let { published, slug } = json
              delete json.published

              if (!slug) {
                let match = new RegExp(suffix).exec(file)
                slug = match.groups.slug
              }

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
                subtitle: json.description || json.ex,
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

export default importCommand
