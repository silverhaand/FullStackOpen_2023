import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, fetchBlogs, currentUsername }) => {
  const [view, setView] = useState(false)
  const toggleView = () => setView(!view)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = async () => {
    const updatedBlog = {
      user: blog.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await blogService.addLike(updatedBlog)
    fetchBlogs()
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id)
      fetchBlogs()
    }
  }

  return (
    <div style={blogStyle}>
      {!view &&
        <div className='blog'>
          {blog.title} {blog.author}
          <button style={{ marginLeft: 5 }} onClick={toggleView}>
            view
          </button>
        </div>
      }
      {view &&
        <div className='blog'>
          <div>
            {blog.title} {blog.author}
            <button style={{ marginLeft: 5 }} onClick={toggleView}>
              hide
            </button>
          </div>
          <p>{blog.url}</p>
          <div>
            likes {blog.likes}
            <button onClick={updateLikes}>like</button>
          </div>
          <p>{blog.user.name}</p>

          {blog.user.username === currentUsername &&
            <button onClick={deleteBlog}>remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog