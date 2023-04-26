const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor,async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author, 
    url: body.url,
    user: user.id,
    likes: body.likes || 0
  })

  if (!blog.title || !blog.url) return response.status(400).end()

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, 
    blog, 
    { new: true }
  )
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    console.log("Successfully deleted\n", blog)

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).json({ 
      error: 'forbidden: you can only delete blogs you created' 
    })
  }
})

module.exports = blogsRouter

// token for matti Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2NDQ2MmEzNDg3ODQ1YzYxN2FlNTM2MmIiLCJpYXQiOjE2ODI0MzE0MTl9.nUyu9G864O3uRxhiDK0PJ5yXBzBzf5cWwLWnCPbv2bk

// token for soloman Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNvbG9tYW4iLCJpZCI6IjY0NDdlZTYxNWQxMGZlZGMzYmE4ZjhkZCIsImlhdCI6MTY4MjQzNTcwMn0.gEEw9K1M3HmMiEY6i3vGSqh7W5H08MUGN4Kfo8DHuDA