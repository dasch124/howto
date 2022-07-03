import { Combobox, Dialog, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { isNonEmptyArray } from '@stefanprobst/is-nonempty-array'
import cx from 'clsx'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes.config'
import type { SearchResponseHit, SearchResult } from '@/app/search/use-search'
import { useSearch } from '@/app/search/use-search'
import { Spinner } from '@/components/spinner'
import { useDialogState } from '@/lib/use-dialog-state'
import { useHumanReadableDate } from '@/lib/use-human-readable-date'

export function SearchDialogTrigger(): JSX.Element {
  const { plural, t } = useI18n<'common'>()
  const router = useRouter()
  const dialog = useDialogState()
  const [searchTerm, setSearchTerm] = useState('')
  const query = useSearch(searchTerm)
  const [selectedKey, _setSelectedKey] = useState<SearchResponseHit<SearchResult> | null>(null)

  const searchResultsGroups = query.data?.grouped_hits ?? []
  const searchResultsCount = query.data?.found ?? 0

  useEffect(() => {
    function open(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'k') {
        dialog.open()
        /** Prevent browser opening 'Search the web' dialog. */
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', open)

    return () => {
      document.removeEventListener('keydown', open)
    }
  })

  function onSelectionChange(searchResult: SearchResponseHit<SearchResult>) {
    // _setSelectedKey(searchResult)
    dialog.close()

    const href = routes.post({ id: searchResult.document.postId })
    const hash = searchResult.document.heading?.id
    router.push({ ...href, hash })
  }

  return (
    <div className="flex">
      <button
        aria-label={t(['common', 'search'])}
        className="flex-shrink-0 transition hover:text-accent-primary-text focus-visible:text-accent-primary-text"
        onClick={dialog.open}
      >
        <SearchIcon width="1em" />
      </button>
      <Transition.Root
        afterLeave={() => {
          setSearchTerm('')
        }}
        appear
        as={Fragment}
        show={dialog.isOpen}
      >
        <Dialog as="div" className="relative z-dialog" onClose={dialog.close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-dialog overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="divide-opacity-20 mx-auto max-w-2xl transform divide-y divide-gray-500 overflow-hidden rounded bg-gray-900 shadow-2xl ring-1 ring-gray-500 ring-offset-2 ring-offset-gray-500 transition-all">
                {/* <Dialog.Title className="sr-only">{t(['common', 'search'])}</Dialog.Title> */}
                <Combobox onChange={onSelectionChange} value={selectedKey}>
                  {/* <Combobox.Label className="block text-sm font-medium text-gray-700">
                    {t(['common', 'search'])}
                  </Combobox.Label> */}
                  <div className="relative">
                    <SearchIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                      width="1em"
                    />
                    <Combobox.Input
                      autoComplete="off"
                      autoCorrect="off"
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                      displayValue={(searchResult: SearchResponseHit<SearchResult> | null) => {
                        if (searchResult == null) return ''
                        return searchResult.document.title
                      }}
                      name="search-term"
                      onChange={(event) => {
                        setSearchTerm(event.currentTarget.value)
                      }}
                      placeholder={t(['common', 'search'])}
                      spellCheck="false"
                      type="search"
                    />
                  </div>
                  {isNonEmptyArray(searchResultsGroups) ? (
                    <Combobox.Options
                      static
                      className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-400"
                    >
                      {searchResultsGroups.map((searchResultsGroup) => {
                        const searchResults = searchResultsGroup.hits
                        const [key] = searchResultsGroup.group_key
                        const [searchResult] = searchResults
                        if (searchResult == null) return null

                        const title =
                          searchResult.highlights?.find((highlight) => {
                            return highlight.field === 'title'
                          })?.snippet ?? searchResult.document.title

                        return (
                          <div key={key} role="group">
                            <Combobox.Option
                              key={searchResult.document.id}
                              value={searchResult}
                              className={({ active }) => {
                                return cx(
                                  'cursor-default select-none px-4 py-2',
                                  active && 'bg-gray-800 text-white',
                                )
                              }}
                            >
                              <SearchResultPreview
                                authors={searchResult.document.authors}
                                date={searchResult.document.date}
                                tags={searchResult.document.tags}
                                title={title}
                              />
                            </Combobox.Option>
                            {searchResults.map((searchResult) => {
                              const heading = searchResult.document.heading

                              if (heading == null) return null

                              const content = searchResult.highlights?.find((highlight) => {
                                return highlight.field === 'content'
                              })

                              if (content == null) return null

                              const snippet = content.snippet

                              if (snippet == null) return null

                              return (
                                <Combobox.Option
                                  key={searchResult.document.id}
                                  value={searchResult}
                                  className={({ active }) => {
                                    return cx(
                                      'cursor-default select-none px-4 py-2',
                                      active && 'bg-gray-800 text-white',
                                    )
                                  }}
                                >
                                  <SearchResultChunkPreview heading={heading} snippet={snippet} />
                                </Combobox.Option>
                              )
                            })}
                          </div>
                        )
                      })}
                    </Combobox.Options>
                  ) : query.status === 'success' ? (
                    <p className="p-4 text-sm text-gray-400">
                      {t(['common', 'no-search-results'])}
                    </p>
                  ) : null}
                </Combobox>
                <footer className="flex flex-wrap items-center bg-gray-900 py-2.5 px-4 text-xs text-gray-400">
                  {query.status === 'loading' ? (
                    <span className="inline-flex gap-2">
                      <Spinner className="h-4 w-4" />
                      {t(['common', 'loading'])}
                    </span>
                  ) : query.status === 'success' ? (
                    searchResultsCount > 0 ? (
                      t(['common', 'search-results-count', plural(searchResultsCount)], {
                        values: { count: String(searchResultsCount) },
                      })
                    ) : (
                      t(['common', 'no-search-results'])
                    )
                  ) : query.status === 'error' ? (
                    t(['common', 'search-request-error'])
                  ) : (
                    t(['common', 'search-help-text'])
                  )}
                </footer>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

interface SearchResultPreviewProps {
  authors: SearchResponseHit<SearchResult>['document']['authors']
  date: SearchResponseHit<SearchResult>['document']['date']
  tags: SearchResponseHit<SearchResult>['document']['tags']
  title: string
}

function SearchResultPreview(props: SearchResultPreviewProps): JSX.Element {
  const { date, tags, title } = props

  const { t } = useI18n<'common'>()
  const publishDate = useHumanReadableDate(date)

  return (
    <article className="grid gap-1">
      <h2 className="font-medium" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="flex gap-2 text-xs text-muted-text">
        <time dateTime={date}>{publishDate}</time>
        <dl className="text-xs">
          <dt className="sr-only">{t(['common', 'post', 'tag', 'other'])}</dt>
          <dd>
            <ul className="flex gap-2" role="list">
              {tags.map((tag) => {
                return (
                  <li
                    className="inline-flex rounded bg-gray-500 px-1.5 font-medium text-gray-900"
                    key={tag}
                  >
                    {tag}
                  </li>
                )
              })}
            </ul>
          </dd>
        </dl>
      </div>
    </article>
  )
}

interface SearchResultChunkPreviewProps {
  heading: Exclude<SearchResponseHit<SearchResult>['document']['heading'], undefined>
  snippet: string
}

function SearchResultChunkPreview(props: SearchResultChunkPreviewProps): JSX.Element {
  const { heading, snippet } = props

  return (
    <article className="ml-2 grid gap-1 border-l border-l-muted-text pl-4">
      <h2 className="font-medium">
        {'#'.repeat(heading.depth)} {heading.title}
      </h2>
      <div className="text-xs text-muted-text" dangerouslySetInnerHTML={{ __html: snippet }} />
    </article>
  )
}
