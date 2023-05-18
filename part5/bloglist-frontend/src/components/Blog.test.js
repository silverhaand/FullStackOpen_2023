/* eslint-disable quotes */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'
import Blog from './Blog'

jest.mock('../services/blogs')

const testBlog = {
  title: 'mock blog',
  author: 'mocker',
  url: 'mock.com',
  likes: 2,
  user: {
    name: 'matti'
  }
}

afterEach(() => jest.resetAllMocks())

test("Blog component renders blog's title and author, but does not render its URL or number of likes by default.", () => {

  render(<Blog blog={testBlog} />)

  const title = screen.getByText(/mock blog/i)
  expect(title).toBeDefined()

  const author = screen.getByText(/mocker/i)
  expect(author).toBeDefined()

  const url = screen.queryByText(/mock.com/i)
  expect(url).toBeNull()

  const likes = screen.queryByText(/likes/i)
  expect(likes).toBeNull()
})

test("blog's URL and number of likes are shown when view button is clicked", async () => {

  render(<Blog blog={testBlog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('mock.com')
  expect(url).toBeDefined()

  const likes = screen.getByText('likes 2')
  expect(likes).toBeDefined()
})

test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {

  blogService.addLike.mockResolvedValue()

  const mockHandler = jest.fn()

  render(<Blog blog={testBlog} fetchBlogs={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})