export const mockOnePagerResponse = {
  type: 'section',
  layout: 'single-column',
  children: [
    {
      type: 'headline',
      content: 'This is a Mock Headline From Our Fake API!'
    },
    {
      type: 'paragraph',
      content: 'This content is being served from a local mock file. It allows us to build and test the entire user interface without needing a live backend.'
    },
    {
      type: 'cta_button',
      content: 'Mock Call-to-Action'
    }
  ]
};
