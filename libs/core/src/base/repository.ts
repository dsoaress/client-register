import type { PaginatedFiltersDTO } from '../dtos/paginated-filters.dto'

export interface Repository<Entity> {
  findById?(id: string): Promise<Entity | null>
  findAll?(filters: PaginatedFiltersDTO): Promise<{ data: Entity[]; total: number }>
  create?(entity: Entity): Promise<void>
  update?(entity: Entity): Promise<void>
  delete?(id: string): Promise<void>
}
