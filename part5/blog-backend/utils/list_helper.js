const Blog = require('../models/blog')
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}

const favoriteBlog = (blogs) => {
  const checkLikes = (mostLiked, blog) => {
    return blog.likes > mostLiked.likes || Object.keys(mostLiked).length === 0
      ?
      { title: blog.title, author: blog.author, likes: blog.likes }
      : mostLiked
  }

  return blogs.reduce(checkLikes, {})
}

const mostBlogs = (blogs) => {
  const blogCount = {}
  let topAuthor = null
  let maxBlogs = 0
  
  blogs.forEach(blog => {
    !blogCount[blog.author]
      ? blogCount[blog.author] = 1
      : blogCount[blog.author]++
    
    if (blogCount[blog.author] > maxBlogs) {
      maxBlogs = blogCount[blog.author]
      topAuthor = blog.author
    }
  })
  
  if (!topAuthor) return null
  
  return { author: topAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  const likeCount = {}
  let topAuthor = null
  let topLikes = 0

  blogs.forEach(blog => {
    !likeCount[blog.author] 
      ? likeCount[blog.author] = blog.likes
      : likeCount[blog.author] += blog.likes
    
    if (likeCount[blog.author] > topLikes) {
      topAuthor = blog.author
      topLikes = likeCount[blog.author]
    } 
  })

  if (!topAuthor) return null

  return { author: topAuthor, likes: topLikes }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
}