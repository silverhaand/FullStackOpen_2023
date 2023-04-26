const {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, blogsInDb, usersInDb
} = require('../utils/list_helper')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blog = []

  const result = dummy(blog)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    expect(totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})

describe('most likes', () => {
  test('of empty list is empty object', () => {
    expect(favoriteBlog([])).toEqual({})
  })

  test('of a list of blogs is the correct blog', () => {
    const mostLikedBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }

    expect(favoriteBlog(blogs)).toEqual(mostLikedBlog)
  })
})

describe('author of most blogs', () => {
  test('of empty list is null', () => {
    expect(mostBlogs([])).toBe(null)
  })

  test('of a large list of blogs is correct', () => {
    const authorWithMost = {
      author: "Robert C. Martin",
      blogs: 3
    }

    expect(mostBlogs(blogs)).toEqual(authorWithMost)
  })
})

describe('author with most likes', () => {
  test('of empty list is null', () => {
    expect(mostLikes([])).toBe(null)
  })

  test('of a large list of blogs is correct', () => {
    const mostLikedAuth = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    expect(mostLikes(blogs)).toEqual(mostLikedAuth)
  })
})

// Backend blog tests

describe('backend testing', () => {
  const testBlogs = [
    {
      title: 'we da best',
      author: 'djkhalid',
      url: 'dj.com',
      likes: 3
    },
    {
      title: 'the w6rst',
      author: 'polyphia',
      url: 'w6rst.com',
      //blog.likes is removed for testing
    }
  ]
  let token

  beforeAll(async () => {
    await User.deleteMany({})
    // password hashing is included in usersRouter.post()
    const newUser = {
      username: 'billy bob',
      name: 'ROOT',
      password: "salainen"
    }
    await api.post('/api/users').send(newUser)

    const userBob = {
      username: "billy bob",
      password: "salainen"
    }
    const response = await api.post('/api/login').send(userBob)
    token = response.body.token
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const testBlogsWithUserID = 
      testBlogs.map(blog => ({...blog, user: user}))
    await Blog.insertMany(testBlogsWithUserID)
  })

  test('verify that amount of blogs is correct', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(testBlogs.length)
  })

  test('each blog object has "id" property', async () => {
    const response = await api.get('/api/blogs')

    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })

  test('HTTP post request to /api/blogs works', async () => {
    const newBlog = {
      title: 'bengals',
      author: 'Spike',
      url: 'nytimes.com',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogs = await Blog.find({})
    expect(updatedBlogs).toHaveLength(testBlogs.length + 1)

    const contents = updatedBlogs.map(b => b.title)
    expect(contents).toContain('bengals')
  })

  test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided.', async () => {
    const blogsAtStart = await blogsInDb()
    const failedBlog = {
      title: 'failed blog',
      author: 'failure',
      url: 'fail.com',
      likes: 0
    }

    const result = await api
      .post('/api/blogs')
      .send(failedBlog)
      .expect(401)

    expect(result.body.error).toContain('Unauthorized')

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('if "likes" property is missing, will default to 0', async () => {
    const response = await api.get('/api/blogs')

    for (let blog of response.body) {
      if (!blog.likes) {
        await api
          .put(`/api/blogs/${blog.id}`)
          .send(blog)  //blog.likes is set to 0 if undefined in controller 
          .expect(200)
      }
    }
    const updatedResponse = await api.get('/api/blogs')

    for (let blog of updatedResponse.body) {
      expect(blog.likes).toBeDefined()
    }
  })

  test('if "title" or "url" properties are missing in POST, backend response is 400 Bad Request', async () => {
    const noTitle = { author: 'joeschmo', url: 'something.com', likes: 1 }
    const noUrl = { title: 'datewithdestiny', author: 'joeschmo', likes: 1 }

    await api
      .post('/api/blogs')
      .send(noTitle)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(noUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(testBlogs.length)
  })

  test('updates blog likes successfully', async () => {
    const blogsAtStart = await blogsInDb()
    const selectedBlog = blogsAtStart[0]
    const blogAddLikes = { ...selectedBlog, likes: selectedBlog.likes + 10 }

    await api
      .put(`/api/blogs/${selectedBlog.id}`)
      .send(blogAddLikes)
      .expect(200)

    const updatedBlogs = await blogsInDb()

    expect(updatedBlogs).toContainEqual(blogAddLikes)
  })

  test('delete succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const updatedBlogs = await Blog.find({})
    expect(updatedBlogs).toHaveLength(testBlogs.length - 1)

    const contents = updatedBlogs.map(b => b.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

})

describe('users testing', () => {
  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'billy bob',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username is less than 3 chars', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 're',
      name: 'John Gotti',
      password: 'ongod'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)

    expect(result.body.error).toContain('invalid username or password')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})