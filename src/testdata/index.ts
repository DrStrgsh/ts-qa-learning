export const testData = {
  auth: {
    username: 'emilys',
    password: 'emilyspass',
    invalidPassword: 'wrong-password',
    invalidRefreshToken: 'invalid-refresh-token',
  },
  products: {
    searchQuery: 'phone',
    pageSize: 5,
  },
  uiAuth: {
    username: 'standard_user',
    password: 'secret_sauce',
    invalidPassword: 'wrong-password',
  },
  uiCustomerInfo: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
} as const
