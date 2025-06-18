import type { PaginatedFiltersDTO } from '../dtos/paginated-filters.dto'

export interface Repository<Entity> {
  findById?(id: string): Promise<Entity | null>
  findAll?(filters: PaginatedFiltersDTO): Promise<{ data: Entity[]; total: number }>
  create?(Entity: Entity): Promise<void>
  update?(Entity: Entity): Promise<void>
  delete?(id: string): Promise<void>
}
