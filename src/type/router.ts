import {
  Data,
} from './type'

export interface Location {
  path: string
  url?: string
  params?: Data
  query?: Data
}

export interface RouteTarget {
  name?: string
  path?: string
  params?: Data
  query?: Data
}