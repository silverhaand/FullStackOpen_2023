import { useState } from 'react'
import blogService from '../services/blogs'

const CreateBlog = ({ setNotification, fetchBlogs }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const postBlog = async event => {
    event.preventDefault()

    try {
      await blogService.create({ title, author, url })
      setNotification(`a new blog ${title} by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
      fetchBlogs()
      setTimeout(() => setNotification(null), 5000)

    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <form onSubmit={postBlog}>
        <div>
          <label htmlFor='title'>
          title:
            <input
              type='text'
              id='title'
              value={title}
              name='Title'
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor='author'>
          author:
            <input
              type='text'
              id='author'
              value={author}
              name='Author'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor='url'>
          url:
            <input
              type='text'
              id='url'
              value={url}
              name='Url'
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>

        <button type="submit" id='create-button'>create</button>
      </form>
    </div>
  )
}

export default CreateBlog