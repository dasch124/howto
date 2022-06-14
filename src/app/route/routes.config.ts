import type { PostPageParams } from '@/pages/posts/[id].page'

export function cms() {
  return { pathname: '/cms' }
}

export function home() {
  return { pathname: '/' }
}

export function imprint() {
  return { pathname: '/imprint' }
}

export function posts() {
  return { pathname: '/posts' }
}

export function post(params: PostPageParams) {
  return { pathname: `/posts/${params.id}` }
}
