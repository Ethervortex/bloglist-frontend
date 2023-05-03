import { useState } from 'react'

const Blog = ({ blog, handleLikes, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLikes(blog)} style={{ backgroundColor: 'lightgreen' }}>like</button>
          </div>
          <div>{blog.user && <div>{blog.user.name}</div>}
            {!blog.user && user && <div>{user.name}</div>}
            {user.name === blog.user.name && (
              <button style={{ backgroundColor: '#c8a2c8' }} onClick={() => handleRemove(blog)}>remove</button>
            )}</div>
        </div>
      )}
    </div>
  )}

export default Blog