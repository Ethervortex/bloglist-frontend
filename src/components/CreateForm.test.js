import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'
import Togglable from './Togglable'

describe('<CreateForm/>', () => {
  test('calls createBlog with correct input', async () => {
    const createBlog = jest.fn()
    const { container } = render(
      <Togglable buttonLabel="create new blog">
        <CreateForm createBlog={createBlog} />
      </Togglable>
    )
    const toggleButton = screen.getByText('create new blog')
    await userEvent.click(toggleButton)
    await screen.findByTestId('create-form')

    const input1 = container.querySelector('#title-input')
    const input2 = container.querySelector('#author-input')
    const input3 = container.querySelector('#url-input')

    const sendButton = screen.getByText('create')

    await userEvent.type(input1, 'Title test' )
    await userEvent.type(input2, 'Author test' )
    await userEvent.type(input3, 'Url test' )

    await userEvent.click(sendButton)
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Title test',
      author: 'Author test',
      url: 'Url test',
    })
  })
})