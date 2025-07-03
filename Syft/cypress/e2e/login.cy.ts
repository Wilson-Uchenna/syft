describe('Syft Login → Feed View Flow', () => {
  const email = 'testuser@example.com';
  const password = 'testpassword';

  beforeEach(() => {
    cy.visit('/');

    // Wait for the app shell to load
    cy.get('ion-app', { timeout: 20000 }).should('exist');
  });

  it('logs in and displays feed page correctly', () => {
    // STEP 1: Open the login modal
    cy.get('ion-button.open-login').click();

    // STEP 2: Fill in login form
    cy.get('form.login-form ion-input[type="email"] input').type(email, { force: true });
    cy.get('form.login-form ion-input[type="password"] input').type(password, { force: true });

    cy.get('form.login-form ion-checkbox')
  .click({ force: true })
  .should('have.attr', 'aria-checked', 'true');


    // STEP 3: Submit form
    cy.get('form.login-form ion-button.login-button').click({ force: true });

    // Wait for feed content to appear first (like the empty state or feed list)
cy.get('app-feed-list, .empty-state', { timeout: 20000 }).should('exist');

// THEN assert the title
cy.get('ion-title.feeds', { timeout: 10000 }).should('have.text', 'My Feeds');

    // Optional STEP 7: Confirm feed content or empty state
    cy.get('ion-content').then(($el) => {
      if ($el.find('.empty-state').length) {
        cy.get('.empty-state').should('contain.text', 'You have no files yet.');
      } else {
        cy.get('app-feed-item').should('exist');
      }
    });
  });
});
