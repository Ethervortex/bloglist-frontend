import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Notif from './components/Notif'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [info, setInfo] = useState({ message: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      // Tehtävä 5.10
      const sorted = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sorted)
    })
  }, [])

  // Tehtävä 5.2
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type='info') => {
    setInfo({ message, type })
    setTimeout(() => {
      setInfo({ message: null } )
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user)) // Tehtävä 5.2
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong username or password', 'error')
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleLikes = async (blog) => {
    const updatedB = { ...blog, likes: blog.likes + 1 }
    await blogService.update(updatedB)
    setBlogs(
      blogs.map((bl) => (bl.id === updatedB.id ? updatedB : bl))
    )
  }

  // Tehtävä 5.11
  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notify(`${blog.title} by ${blog.author} has been removed`)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      returnedBlog.user = user // Tehtävä 5.8
      setBlogs(blogs.concat(returnedBlog))
      notify(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    })
      .catch((error) => {
        console.error('Error creating blog:', error)
        notify('Error creating blog', 'error')
      })
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notif info={info} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <Notif info={info} />
      <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
      <b></b>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateForm createBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleRemove={handleRemove} user={user}/>
      )}
    </div>
  )
}

export default App