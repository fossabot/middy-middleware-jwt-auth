import debugFactory from 'debug'
import JWTAuthMiddleware from './index'
import { EncryptionAlgorithms } from './interfaces/IAuthOptions'

import JWT from 'jsonwebtoken'
import createHttpError from 'http-errors'

describe('JWTAuthMiddleware', () => {
  beforeAll(() => {
    debugFactory.enable('middy-middleware-jwt-auth')
  })

  it('throws a type error when options are misformed', () => {
    expect(() => JWTAuthMiddleware({} as any)).toThrowError(TypeError)
  })

  describe('before hook', () => {
    it('resolves successfully if event is misformed', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: 'secret'
      }
      await expect(
        JWTAuthMiddleware(options).before({} as any, next)
      ).resolves.toEqual(undefined)
    })

    it('resolves if token is valid', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({}, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      expect(
        await JWTAuthMiddleware(options).before(
          {
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
          },
          next
        )
      ).toEqual(undefined)
    })

    it('rejects if Authorization header is malformed', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      await expect(
        JWTAuthMiddleware(options).before(
          {
            event: {
              headers: {
                Authorization: 'Malformed header'
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(401, 'Format is Authorization: Bearer [token]')
      )
    })

    it('rejects if token is malformed', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = 'malformed token'
      await expect(
        JWTAuthMiddleware(options).before(
          {
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(401, 'Format is Authorization: Bearer [token]')
      )
    })
  })
})
