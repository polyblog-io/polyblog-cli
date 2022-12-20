/* Copyright 2013 - 2022 Waiterio LLC */
import inquirer from 'inquirer'
import getBlogHttp from '@polyblog/polyblog-js-client/getBlog.js'
import getBlogs from '@polyblog/polyblog-js-client/getBlogs.js'
import getConfig from './getConfig.js'
import setConfig from './setConfig.js'

export default async function getBlog(blogIdOrName) {
  let blog

  let config = getConfig()

  if (!blogIdOrName) {
    blogIdOrName = config?.blogId
  }

  if (!blogIdOrName) {
    let blogs = await getBlogs()

    if (blogs.length === 0) {
      throw new Error(
        'There are no blogs. Create one first at https://app.polyblog.com/blogs/new',
      )
    } else if (blogs.length === 1) {
      blogIdOrName = blogs[0]._id
      blog = blogs[0] // eslint-disable-line prefer-destructuring
    } else {
      let choices = blogs
        .map(blog => ({
          name: blog.name,
          value: blog._id,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      let answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'blogId',
          message: 'Which blog?',
          choices,
        },
      ])

      blogIdOrName = answers.blogId
      blog = blogs.find(blog => blog._id === blogIdOrName)
    }

    if (blog && !config) {
      setConfig({
        organizationId: blog.organizationId,
        blogId: blog._id,
      })
      console.log('created polyblog.json with default blogId')
    }
  }

  if (!blog && blogIdOrName) {
    blog = await getBlogHttp(blogIdOrName)
  }

  return blog
}
