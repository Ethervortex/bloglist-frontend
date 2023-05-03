import { useState } from 'react'

const CreateForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitle = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <form onSubmit={addBlog} data-testid="create-form">
      <h2>Create new</h2>
      <div>title: <input type="text" value={newTitle} onChange={handleTitle} id='title-input' /></div>
      <div>author: <input type="text" value={newAuthor} onChange={handleAuthor} id='author-input' /></div>
      <div>url: <input type="text" value={newUrl} onChange={handleUrl} id='url-input' /></div>
      <div><button type="submit" id='create-button'>create</button></div>
    </form>
  )
}

export default CreateForm