const CreateForm = ({ addBlog, newTitle, handleTitle, newAuthor, handleAuthor, newUrl, handleUrl }) => {
  return (
    <form onSubmit={addBlog}>
      <div>title: <input type="text" value={newTitle} onChange={handleTitle}/></div>
      <div>author: <input type="text" value={newAuthor} onChange={handleAuthor}/></div>
      <div>url: <input type="text" value={newUrl} onChange={handleUrl}/></div>
      <div><button type="submit">create</button></div>
    </form>
  )
}

export default CreateForm