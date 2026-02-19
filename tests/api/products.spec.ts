import { test, expect } from '../fixtures/test'
import { assertProductsList } from '../../src/validations/assert'
import { ProductsListSchema } from '../../src/validations/products.schema'
import { testData } from '../../src/testdata'

test('GET /products returns valid contract + data', async ({ products }) => {
  const { res, body } = await test.step('Call GET /products', async () => {
    return products.list()
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(ProductsListSchema, 'ProductsList')
  })

  await test.step('Verify business assertions', async () => {
    const parsed = assertProductsList(body)

    expect.soft(parsed.products.length).toBeGreaterThan(0)

    if (parsed.products.length > 0) {
      expect.soft(parsed.products[0].price).toBeGreaterThanOrEqual(0)
      expect.soft(parsed.products[0].title.length).toBeGreaterThan(0)
    }
  })
})

test('GET /products pagination contract is stable', async ({ products }) => {
  const limit = testData.products.pageSize
  const { res, body } = await test.step('Call GET /products with pagination', async () => {
    return products.list({ limit, skip: 0 })
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(ProductsListSchema, 'ProductsList')
  })

  await test.step('Verify pagination fields', async () => {
    const parsed = assertProductsList(body)

    expect(parsed.products).toHaveLength(limit)
    expect(parsed.limit).toBe(limit)
    expect(parsed.skip).toBe(0)
  })
})

test('GET /products/search returns filtered results', async ({ products }) => {
  const query = testData.products.searchQuery
  const { res, body } = await test.step('Call GET /products/search', async () => {
    return products.search(query)
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(ProductsListSchema, 'ProductsList')
  })

  await test.step('Verify business assertions (search really filters)', async () => {
    const parsed = assertProductsList(body)

    expect(parsed.products.length).toBeGreaterThan(0)

    const normalizeQuery = query.toLowerCase()
    const hasMatch = parsed.products.some((p) => {
      const title = p.title.toLowerCase()
      const description = (p.description ?? '').toLowerCase()

      return title.includes(normalizeQuery) || description.includes(normalizeQuery)
    })

    expect(hasMatch).toBe(true)
  })
})
