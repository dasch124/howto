import type { Post, PostPreview } from '@/cms/api/posts.api'

export type Resource = Post

export type ResourcePreview = PostPreview

export type ResourceKind = Resource['kind']
