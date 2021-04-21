import { SpaceTraders } from "spacetraders-sdk";
import { Cargo, ErrorResponse, Good, LocationsResponse, System } from "spacetraders-sdk/dist/types";
import { AuthenticationError, NotFoundError, RateLimitError, RequestError } from "spacetraders-sdk/dist/errors"
import { asyncSleep, asyncWrap } from "spacetraders-sdk/dist/utils"
import axios, { AxiosError, AxiosResponse } from 'axios'
import Bottleneck from 'bottleneck'

//This file is a workaround while spacetraders-io's cutting-edge isn't released yet.

const BASE_URL = 'https://api.spacetraders.io'

//SystemsResponse bug solved
export interface SystemsResponse {
  systems: System[]
}

//Cutting edge structures
export interface Marketplace {
  quantityAvailable: number
  pricePerUnit: number
  volumePerUnit: number
  symbol: Good
  spread: number
  sellPricePerUnit: number
  purchasePricePerUnit: number
}

export interface AvailableStructure {
  allowedLocationTypes: string[]
  consumes: Good[]
  price: number
  name: string
  produces: Good[]
  symbol: string
}

export interface AvailableStructureResponse {
  structures: AvailableStructure[]
}

export interface CreateStructureResponse {
  structure: StructureDetails
}

export interface StructureDetails {
  id: string
  type: string
  location: string
  status: string
  active: boolean
  // Bug, awaiting fix
  ownedBy: {
    username?: string
    id?: string
  }
  inventory: Cargo[]
  consumes: Good[]
  produces: Good[]
}

export interface StructureDepositResponse {
  deposit: Cargo
  ship: { cargo: Cargo[] }
  structure: { inventory: Cargo[] }
}

export interface StructureTransferResponse {
  transfer: Cargo
  ship: { cargo: Cargo[] }
  structure: { inventory: Cargo[] }
}

export interface ListStructuresResponse {
  structures: StructureDetails[]
}


//Class extensions
// @ts-ignore : fu typescript checker hahahaha
class SpaceTradersExtend extends SpaceTraders {

  //SystemResponse bug
  async listSystemsFixed(): Promise<SystemsResponse> {
    const _: any = await this.listSystems()
    return _
  }

  //Cutting-edge structures
  listLocations(system: string = 'OE', type?: string, allowsConstruction?: boolean) {
    const url = !type ? `/game/systems/${system}/locations` : `/game/systems/${system}/locations?type=${type}&allowsConstruction=${allowsConstruction}`

    return this.makeAuthRequest<LocationsResponse>(url, 'get')
  }

  getAvailableStructures() {
    const url = `/game/structures`

    return this.makeAuthRequest<AvailableStructureResponse>(url, 'get')
  }

  createStructure(type: string, location: string) {
    const url = this.makeUserPath(`structures`)
    const payload = { type, location }

    return this.makeAuthRequest<CreateStructureResponse>(url, 'post', payload)
  }

  depositToStructure(structureId: string, shipId: string, good: Good, quantity: number) {
    const url = this.makeUserPath(`structures/${structureId}/deposit`)
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<StructureDepositResponse>(url, 'post', payload)
  }

  transferFromStructure(structureId: string, shipId: string, good: Good, quantity: number) {
    const url = this.makeUserPath(`structures/${structureId}/transfer`)
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<StructureTransferResponse>(url, 'post', payload)
  }

  viewStructureDetails(structureId: string) {
    const url = this.makeUserPath(`structures/${structureId}`)

    return this.makeAuthRequest<CreateStructureResponse>(url, 'get')
  }

  listStructures() {
    const url = this.makeUserPath(`structures`)

    return this.makeAuthRequest<ListStructuresResponse>(url, 'get')
  }

  //Private functions and vars copied
  // @ts-ignore : null booyah
  private static limiter: Bottleneck = null
  // @ts-ignore : ditto
  private limiter: Bottleneck = null
  private maxRetries = 3
  // @ts-ignore : ditto
  private username: string = null
  // @ts-ignore : ditto
  private token: string = null
  private useSharedLimiter = false

  private async makeAuthRequest<T>(url: string, method: 'get' | 'post' | 'put' | 'delete', payload: Record<string, any> = {}, retry = 0): Promise<T> {
    const headers = this.makeHeaders(this.token)
    const fullUrl = `${BASE_URL}${url}`

    const request = () =>
      asyncWrap<AxiosResponse<T | ErrorResponse>, AxiosError>(
        method === 'get' || method === 'delete' ? axios.get<T>(fullUrl, { headers }) : axios[method]<T>(fullUrl, payload, { headers }),
      )

    const [error, resp] = await this.sendRequest(request)

    const status = error ? error?.response?.status : resp.status
    const data = error ? error?.response?.data : resp.data
    const responseHeaders = error ? error.response?.headers : resp.headers

    if (status === 429 && retry < this.maxRetries) {
      const retryAfter = (responseHeaders['retry-after'] ?? 1) * 1000
      await asyncSleep(retryAfter)

      return this.makeAuthRequest<T>(url, method, payload, retry++)
    }
    if (status === 429) throw new RateLimitError('Too many requests.', 429, data, error)

    if (status === 401 || status === 403) throw new AuthenticationError('Invalid token.', status, data, error)
    if (status === 404) throw new NotFoundError('User not found.', 404, data, error)
    if (status === 400) throw new RequestError('Request error.', 400, data, error)

    if (error) throw new Error(error.message)

    if (typeof (resp.data as ErrorResponse).error !== 'undefined') throw new Error((resp.data as ErrorResponse).error.message)

    return resp.data as T
  }

  private makeUserPath(fragment?: string) {
    return fragment ? `/users/${this.username}/${fragment}` : `/users/${this.username}`
  }

  private makeHeaders(token: string) {
    return { Authorization: `Bearer ${token}` }
  }

  private sendRequest<T>(request: () => Promise<[AxiosError, AxiosResponse<T | ErrorResponse>]>) {
    if (this.limiter) return this.limiter.schedule(() => request())
    if (this.useSharedLimiter) return SpaceTradersExtend.limiter.schedule(() => request())

    return request()
  }
}

export default SpaceTradersExtend