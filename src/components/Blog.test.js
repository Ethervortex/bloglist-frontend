import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  beforeEach(() => {
    blog = {
      title: 'Test title',
      author: 'Teemu Testaaja',
      url: 'www.test.fi',
      likes: 10,
      user: {
        name: 'Joku Vaa'
      }
    }
  })

  test('renders title by default', () => {
    render(<Blog blog={blog} />)

    const element = screen.getByText('Test title', { exact: false })
    const element2 = screen.queryByText('www.test.fi')

    expect(element).toBeDefined()
    expect(element2).toBeNull()
  })

  test('shows url, likes and user after clicking view', async () => {
    const handleLikes = jest.fn()
    const handleRemove = jest.fn()
    const user = { name: 'Joku Vaa' }
    render(<Blog blog={blog} handleLikes={handleLikes} handleRemove={handleRemove} user={user} />)
    const button = screen.getByText('view')
    await userEvent.click(button)

    const element = screen.getByText('www.test.fi', { exact: false })
    const element2 = screen.getByText('likes', { exact: false })
    const element3 = screen.getByText('Joku Vaa', { exact: false })

    expect(element).toBeDefined()
    expect(element2).toBeDefined()
    expect(element3).toBeDefined()
  })

  test('likes button clicked two times', async () => {
    const handleLikes = jest.fn()
    const handleRemove = jest.fn()
    const user = { name: 'Joku Vaa' }
    render(<Blog blog={blog} handleLikes={handleLikes} handleRemove={handleRemove} user={user} />)
    const button = screen.getByText('view')
    await userEvent.click(button)

    const button2 = screen.getByText('like')
    await userEvent.click(button2)
    await userEvent.click(button2)

    expect(handleLikes).toHaveBeenCalledTimes(2)
  })
})