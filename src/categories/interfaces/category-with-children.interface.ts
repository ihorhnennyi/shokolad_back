export interface CategoryWithChildren {
	_id: string
	name: string
	description?: string
	parent?: string
	children: CategoryWithChildren[]
}
