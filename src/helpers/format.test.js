import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCardExpiry,
  formatDateGroup,
  maskCardNumber,
} from './format'

describe('formatCurrency', () => {
  it('formaterar belopp i SEK som default', () => {
    expect(formatCurrency(1234.5)).toMatch(/1\s?234,50/)
    expect(formatCurrency(1234.5)).toMatch(/kr/)
  })

  it('respekterar annan valuta', () => {
    expect(formatCurrency(50, 'EUR')).toMatch(/€/)
  })

  it('hanterar nullish som 0', () => {
    expect(formatCurrency(null)).toMatch(/0,00/)
    expect(formatCurrency(undefined)).toMatch(/0,00/)
  })

  it('faller tillbaka till SEK för tom currency-sträng', () => {
    expect(formatCurrency(10, '')).toMatch(/kr/)
  })
})

describe('formatCardExpiry', () => {
  it('returnerar streck för null', () => {
    expect(formatCardExpiry(null)).toBe('—')
  })

  it('formaterar månad och år som tvåsiffrigt', () => {
    // sv-SE producerar "28-03" / "03/28" beroende på Node-ICU.
    expect(formatCardExpiry('2028-03-15')).toMatch(/\b03\b/)
    expect(formatCardExpiry('2028-03-15')).toMatch(/\b28\b/)
  })
})

describe('formatDateGroup', () => {
  it('returnerar "Idag" för dagens datum', () => {
    expect(formatDateGroup(new Date())).toBe('Idag')
  })

  it('returnerar "Igår" för gårdagens datum', () => {
    const y = new Date()
    y.setDate(y.getDate() - 1)
    expect(formatDateGroup(y)).toBe('Igår')
  })
})

describe('maskCardNumber', () => {
  it('maskar med last4', () => {
    expect(maskCardNumber('1234')).toBe('**** **** **** 1234')
  })

  it('fallback för saknat värde', () => {
    expect(maskCardNumber()).toBe('**** **** **** ????')
  })
})
