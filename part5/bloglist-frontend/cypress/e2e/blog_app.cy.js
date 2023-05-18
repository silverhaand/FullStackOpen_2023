describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login to application')

    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('joe')
      cy.get('#password').type('schmoe')
      cy.get('#login-button').click()

      cy.get('.error')
        .contains('wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('create new blog').click()
      cy.get('#title').type('great view')
      cy.get('#author').type('eminem')
      cy.get('#url').type('test.com')
      cy.get('#create-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('great view')
      cy.contains('eminem')
      cy.get('.success').should('have.css', 'color', 'rgb(0, 0, 255)')
    })

    it('Users can like a blog', function () {
      cy.get('button').contains('view').click()
      cy.contains('likes 0')
      cy.get('button').contains('like').click()
      cy.contains('likes 1')
    })

    it('User who created blog can delete it', function () {
      cy.get('button').contains('view').click()
      cy.get(':contains("Matti Luukkainen")').eq(1)
      cy.on('window:confirm', () => true)

      cy.get('button').contains('remove').click()

      cy.get('.success', { timeout: 6000 }).should('not.exist')
      cy.contains('great view').should('not.exist')
      cy.contains('eminem').should('not.exist')
    })

    it('Only the creator can see the delete button of a blog', function () {
      cy.get('button').contains('logout').click()
      const otherUser = {
        name: 'Soloman',
        username: 'soloman',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users', otherUser)
      cy.get('#username').type('soloman')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('button').contains('view').click()
      cy.contains('Matti Luukkainen') //Which is original blog creator
      cy.get('button').contains('remove').should('not.exist')
    })
  })

  describe('Multiple blogs test', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('create new blog').click()
      cy.get('#title').type('Third most likes')
      cy.get('#author').type('eminem')
      cy.get('#url').type('test.com')
      cy.get('#create-button').click()
      cy.wait(1000)

      cy.get('#title').type('The title with the most likes')
      cy.get('#author').type('eminem')
      cy.get('#url').type('test.com')
      cy.get('#create-button').click()
      cy.wait(1000)

      cy.get('#title').type('The title with the second most likes')
      cy.get('#author').type('eminem')
      cy.get('#url').type('test.com')
      cy.get('#create-button').click()
      cy.wait(1000)
    })

    it('blogs are ordered according to likes with the blog with the most likes being first', function () {
      cy.get('button').each(($btn) => {
        if ($btn.text() === 'view') cy.wrap($btn).click()
      })

      let likes = [1, 3, 2]

      cy.get('.blog').each(($el, index) => {
        let likeButton = $el.find('button:contains("like")')

        for (let i = 0; i < likes[index]; i++) {
          cy.wrap(likeButton).click()
          cy.wait(500)
        }
      })
      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
      cy.get('.blog').eq(2).should('contain', 'Third most likes')
    })
  })
})