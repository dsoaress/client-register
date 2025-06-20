import { describe, expect, it, vi } from 'vitest'
import type { ProcessClientDataInputDTO } from '../dtos/process-client-data-input.dto'
import { ProcessClientDataUseCase } from './process-client-data.use-case'

describe('ProcessClientDataUseCase', () => {
  it('should be defined', () => {
    const useCase = new ProcessClientDataUseCase()
    expect(useCase).toBeDefined()
  })

  it('should process client data correctly', async () => {
    const useCase = new ProcessClientDataUseCase()
    const mockData = { id: '123', name: 'Test Client', email: 'jhon-doe@example.com' }

    console.log = vi.fn()

    await useCase.execute(mockData as unknown as ProcessClientDataInputDTO)

    expect(console.log).toHaveBeenCalledWith('Processing client data:', mockData.email)
  })
})
