import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'
import CreateBlog from './CreateBlog'

jest.mock('../services/blogs')

test('when making a new blog form, the event handler is called with the right details when the new blog is created', async () => {
  const inputBlog = {
    title: 'mock blog',
    author: 'mocker',
    url: 'mock.com',
    likes: 2,
    user: {
      name: 'matti'
    }
  }
  blogService.create.mockResolvedValue()

  const mockHandler = jest.fn
  render(<CreateBlog fetchBlogs={mockHandler} />)

  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/title/i), inputBlog.title)
  await user.type(screen.getByLabelText(/author/i), inputBlog.author)
  await user.type(screen.getByLabelText(/url/i), inputBlog.url)

  await user.click(screen.getByText('create'))

  expect(blogService.create).toHaveBeenCalledWith({
    title: inputBlog.title,
    author: inputBlog.author,
    url: inputBlog.url
  })
})