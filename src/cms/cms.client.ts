import { assert } from '@stefanprobst/assert'
import { groupBy } from '@stefanprobst/group-by'
import { isNonEmptyString } from '@stefanprobst/is-nonempty-string'
import { keyBy } from '@stefanprobst/key-by'
import { pick } from '@stefanprobst/pick'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import type { Curriculum, Licence, Person, Post, Tag } from 'contentlayer/generated'
import {
  allCurriculums,
  allLicences,
  allPeople,
  allPosts,
  allTags,
  allTestPosts,
} from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

// TODO: create map for core and details types once, not on demand in a functions

export type CurriculumCore = Pick<
  Curriculum,
  '_id' | 'abstract' | 'date' | 'id' | 'title' | 'uuid'
> & {
  editors?: Array<PersonCore>
  tags: Array<TagCore>
}

export type CurriculumDetails = Pick<
  Curriculum,
  '_id' | 'abstract' | 'date' | 'featuredImage' | 'id' | 'locale' | 'title' | 'uuid' | 'version'
> & {
  code: string
  editors?: Array<PersonCore>
  resources: Array<PostCore>
  tags: Array<TagCore>
}

type LicenceCore = Pick<Tag, '_id' | 'id' | 'name'>

type PersonCore = Pick<Person, '_id' | 'firstName' | 'id' | 'lastName'>

export type PostCore = Pick<
  Post,
  '_id' | 'abstract' | 'date' | 'id' | 'locale' | 'title' | 'uuid'
> & {
  authors: Array<PersonCore>
  tags: Array<TagCore>
}

export type PostDetails = Pick<
  Post,
  '_id' | 'abstract' | 'date' | 'featuredImage' | 'id' | 'locale' | 'title' | 'uuid' | 'version'
> & {
  authors: Array<PersonCore>
  code: string
  contributors?: Array<PersonCore>
  editors?: Array<PersonCore>
  licence: LicenceCore
  readingTime: number
  tags: Array<TagCore>
  toc: Toc
}

type TagCore = Pick<Tag, '_id' | 'id' | 'name'>

const curriculaById = keyBy(allCurriculums, (curriculum) => {
  return curriculum.id
})

const licencesById = keyBy(allLicences, (licence) => {
  return licence.id
})

const peopleById = keyBy(allPeople, (person) => {
  return person.id
})

const postsById = keyBy(allPosts, (post) => {
  return post.id
})

const postsByTag = groupBy(allPosts, (post) => {
  return post.tags
})

const tagsById = keyBy(allTags, (tag) => {
  return tag.id
})

const testPostsById = keyBy(allTestPosts, (post) => {
  return post.id
})

const testPostsByTag = groupBy(allTestPosts, (post) => {
  return post.tags
})

export function getCurriculumIds(): Array<Curriculum['id']> {
  const ids = allCurriculums.map((curriculum) => {
    return curriculum.id
  })

  return ids
}

export function getCurriculaCore(): Array<CurriculumCore> {
  const curricula = allCurriculums
    .map((curriculum) => {
      return getCurriculumCore(curriculum.id)
    })
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return curricula
}

export function getCurriculumCore(id: Curriculum['id']): CurriculumCore {
  const _curriculum = curriculaById[id]
  assert(_curriculum != null)

  const curriculum = {
    ...pick(_curriculum, ['_id', 'abstract', 'date', 'id', 'uuid']),
    editors: _curriculum.editors?.map(getPersonCore) ?? [],
    tags: _curriculum.tags.map(getTagCore),
    title: isNonEmptyString(_curriculum.shortTitle) ? _curriculum.shortTitle : _curriculum.title,
  }

  return curriculum
}

export function getCurriculum(id: Curriculum['id']): CurriculumDetails {
  const _curriculum = curriculaById[id]
  assert(_curriculum != null)

  const curriculum = {
    ...pick(_curriculum, [
      '_id',
      'abstract',
      'date',
      'featuredImage',
      'id',
      'locale',
      'title',
      'uuid',
      'version',
    ]),
    code: _curriculum.body.code,
    editors: _curriculum.editors?.map(getPersonCore) ?? [],
    resources: _curriculum.resources.map(getPostCore),
    tags: _curriculum.tags.map(getTagCore),
  }

  return curriculum
}

export function getLicence(id: Licence['id']): Licence {
  const licence = licencesById[id]
  assert(licence != null)
  return licence
}

export function getLicenceCore(id: Licence['id']): LicenceCore {
  const licence = getLicence(id)
  return pick(licence, ['_id', 'id', 'name'])
}

export function getPerson(id: Person['id']): Person {
  const person = peopleById[id]
  assert(person != null)
  return person
}

export function getPersonCore(id: Person['id']): PersonCore {
  const person = getPerson(id)
  return pick(person, ['_id', 'firstName', 'id', 'lastName'])
}

export function getPersonFullName(person: Person | PersonCore): string {
  return [person.firstName, person.lastName].filter(isNonEmptyString).join(' ')
}

export function getPostIds(): Array<Post['id']> {
  const ids = allPosts.map((post) => {
    return post.id
  })

  return ids
}

export function getPostsCore(): Array<PostCore> {
  const posts = allPosts
    .map((post) => {
      return getPostCore(post.id)
    })
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return posts
}

export function getPostsCoreByTags(ids: Array<Tag['id']>): Array<PostCore> {
  const allPostsByTags = ids.flatMap((id) => {
    return postsByTag[id] ?? []
  })

  const uniquePostsByTags = Object.values(
    keyBy(allPostsByTags, (post) => {
      return post.id
    }),
  )

  const posts = uniquePostsByTags
    .map((post) => {
      return getPostCore(post.id)
    })
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return posts
}

export function getPostCore(id: Post['id']): PostCore {
  const _post = postsById[id]
  assert(_post != null)

  const post = {
    ...pick(_post, ['_id', 'abstract', 'date', 'id', 'locale', 'uuid']),
    authors: _post.authors.map(getPersonCore),
    tags: _post.tags.map(getTagCore),
    title: isNonEmptyString(_post.shortTitle) ? _post.shortTitle : _post.title,
  }

  return post
}

export function getPost(id: Post['id']): PostDetails {
  const _post = postsById[id]
  assert(_post != null)

  const post = {
    ...pick(_post, [
      '_id',
      'abstract',
      'date',
      'featuredImage',
      'id',
      'locale',
      'title',
      'uuid',
      'version',
    ]),
    authors: _post.authors.map(getPersonCore),
    code: _post.body.code,
    contributors: _post.contributors?.map(getPersonCore) ?? [],
    editors: _post.editors?.map(getPersonCore) ?? [],
    licence: getLicenceCore(_post.licence),
    readingTime: _post.body.data.readingTime ?? 0,
    tags: _post.tags.map(getTagCore),
    toc: _post.toc ? _post.body.data.toc ?? [] : [],
  }

  return post
}

export function getTag(id: Tag['id']): Tag {
  const tag = tagsById[id]
  assert(tag != null)
  return tag
}

export function getTagCore(id: Tag['id']): TagCore {
  const tag = getTag(id)
  return pick(tag, ['_id', 'id', 'name'])
}

export function getTestPostIds(): Array<Post['id']> {
  const ids = allTestPosts.map((post) => {
    return post.id
  })

  return ids
}

export function getTestPostsCore(): Array<PostCore> {
  const posts = allTestPosts
    .map((post) => {
      return getTestPostCore(post.id)
    })
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return posts
}

export function getTestPostsCoreByTags(ids: Array<Tag['id']>): Array<PostCore> {
  const allTestPostsByTags = ids.flatMap((id) => {
    return testPostsByTag[id] ?? []
  })

  const uniquePostsByTags = Object.values(
    keyBy(allTestPostsByTags, (post) => {
      return post.id
    }),
  )

  const posts = uniquePostsByTags
    .map((post) => {
      return getTestPostCore(post.id)
    })
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return posts
}

export function getTestPostCore(id: Post['id']): PostCore {
  const _post = testPostsById[id]
  assert(_post != null)

  const post = {
    ...pick(_post, ['_id', 'abstract', 'date', 'id', 'locale', 'uuid']),
    authors: _post.authors.map(getPersonCore),
    tags: _post.tags.map(getTagCore),
    title: isNonEmptyString(_post.shortTitle) ? _post.shortTitle : _post.title,
  }

  return post
}

export function getTestPost(id: Post['id']): PostDetails {
  const _post = testPostsById[id]
  assert(_post != null)

  const post = {
    ...pick(_post, [
      '_id',
      'abstract',
      'date',
      'featuredImage',
      'id',
      'locale',
      'title',
      'uuid',
      'version',
    ]),
    authors: _post.authors.map(getPersonCore),
    code: _post.body.code,
    contributors: _post.contributors?.map(getPersonCore) ?? [],
    editors: _post.editors?.map(getPersonCore) ?? [],
    licence: getLicenceCore(_post.licence),
    readingTime: _post.body.data.readingTime ?? 0,
    tags: _post.tags.map(getTagCore),
    toc: _post.toc ? _post.body.data.toc ?? [] : [],
  }

  return post
}
