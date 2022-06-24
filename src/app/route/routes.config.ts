import type { PostPageParams } from '@/pages/posts/[id].page'
import type { PostsPageParams } from '@/pages/posts/page/[page].page'

export function cms() {
  return { pathname: '/cms' }
}

export function home() {
  return { pathname: '/' }
}

export function imprint() {
  return { pathname: '/imprint' }
}

export function posts(params?: PostsPageParams) {
  return { pathname: `/posts/page/${params?.page ?? 1}` }
}

export function post(params: PostPageParams) {
  return { pathname: `/posts/${params.id}` }
}
