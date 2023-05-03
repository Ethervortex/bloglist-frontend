describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  // Tehtävä 5.17
  it('Login form is shown', function() {
    cy.contains('Log in to application').should('be.visible')
  })

  // Tehtävä 5.18
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  // Tehtävä 5.19
  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('a title created by cypress')
      cy.get('#author-input').type('cypress')
      cy.get('#url-input').type('test url')
      cy.get('#create-button').click()
      cy.contains('a title created by cypress')
      cy.contains('cypress')
    })

    // Tehtävä 5.20
    it('A blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('a test title')
      cy.get('#author-input').type('Teemu Testaaja')
      cy.get('#url-input').type('test url')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })

    // Tehtävä 5.21
    it('A blog can be removed by user and remove button is seen', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('a test title to be deleted')
      cy.get('#author-input').type('Teemu Testaaja')
      cy.get('#url-input').type('test url')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true)
      })
      cy.wait(2000)
      cy.request('GET', 'http://localhost:3003/api/blogs').then((response) => {
        const blogs = response.body
        expect(blogs).to.have.lengthOf(0)
      })
    })

    // Tehtävä 5.22
    it('A remove button is only seen be user', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('Test button')
      cy.get('#author-input').type('Bad Blogger')
      cy.get('#url-input').type('test url')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('remove')
      cy.contains('logout').click()
      const user2 = {
        name: 'Teemu Testaaja',
        username: 'teemu',
        password: '12345'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user2)
      cy.get('#username').type('teemu')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    // Tehtävä 5.23
    it('Create 3 blogs with 2, 4 and 6 likes. Then check correct order', function() {
      let blogLikes = []

      for (let i = 1; i <= 3; i++) {
        const title = `Blog number ${i}`
        const author = `Author ${i}`
        const url = `https://www.blog${i}.com`

        cy.contains('create new blog').click()
        cy.get('#title-input').type(title)
        cy.get('#author-input').type(author)
        cy.get('#url-input').type(url)
        cy.get('#create-button').click()
        cy.contains('view').click()

        for (let j = 1; j <= i * 2; j += 1) {
          cy.get('.blog').eq(i - 1).contains('like').click()
          blogLikes.push(i)
          cy.wait(1000)
        }
      }

      cy.request('GET', 'http://localhost:3003/api/blogs').then(response => {
        const blogs = response.body
        expect(blogs).to.have.lengthOf(3)
      })
      cy.contains('hide').click()
      cy.contains('hide').click()
      cy.contains('hide').click()
      cy.reload()
      cy.get('.blog').eq(0).should('contain', 'Blog number 3')
      cy.get('.blog').eq(1).should('contain', 'Blog number 2')
      cy.get('.blog').eq(2).should('contain', 'Blog number 1')
    })
  })
})