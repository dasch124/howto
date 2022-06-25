import { Combobox, Dialog, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { isNonEmptyArray } from '@stefanprobst/is-nonempty-array'
import { keyBy } from '@stefanprobst/key-by'
import cx from 'clsx'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes.config'
import type { SearchResponseHit, SearchResult } from '@/app/search/use-search'
import { useSearch } from '@/app/search/use-search'
import { Spinner } from '@/components/spinner'
import { useDialogState } from '@/lib/use-dialog-state'

export function SearchDialogTrigger(): JSX.Element {
  const { plural, t } = useI18n<'common'>()
  const router = useRouter()
  const dialog = useDialogState()
  const [searchTerm, setSearchTerm] = useState('')
  const query = useSearch(searchTerm)
  const [selectedKey, _setSelectedKey] = useState<SearchResponseHit<SearchResult> | null>(null)

  const searchResults = query.data?.hits ?? []

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

    const href = routes.post({ id: searchResult.document.id })
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
                  {isNonEmptyArray(searchResults) ? (
                    <Combobox.Options
                      static
                      className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-400"
                    >
                      {searchResults.map((searchResult) => {
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
                            <SearchResultPreview searchResult={searchResult} />
                          </Combobox.Option>
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
                    query.data != null && query.data.found > 0 ? (
                      t(['common', 'search-results-count', plural(query.data.found)], {
                        values: { count: String(query.data.found) },
                      })
                    ) : (
                      t(['common', 'no-search-results'])
                    )
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
  searchResult: SearchResponseHit<SearchResult>
}

function SearchResultPreview(props: SearchResultPreviewProps): JSX.Element {
  const { searchResult } = props

  const { formatDateTime, t } = useI18n<'common'>()

  const highlights = keyBy(searchResult.highlights ?? [], (highlight) => {
    return highlight.field
  })

  return (
    <article>
      {'title' in highlights ? (
        <h2 dangerouslySetInnerHTML={{ __html: highlights.title.snippet! }} />
      ) : (
        <h2>{searchResult.document.title}</h2>
      )}
      <div className="text-muted-text">
        <time dateTime={searchResult.document.date}>
          {formatDateTime(new Date(searchResult.document.date), { dateStyle: 'long' })}
        </time>
        {searchResult.document.heading != null ? (
          <span>
            {'#'.repeat(searchResult.document.heading.depth)} {searchResult.document.heading.title}
          </span>
        ) : null}
        {'content' in highlights ? (
          <div dangerouslySetInnerHTML={{ __html: highlights.content.snippet! }} />
        ) : null}
        <dl>
          <dt className="sr-only">{t(['common', 'post', 'tag', 'other'])}</dt>
          <dd>
            <ul className="flex gap-2" role="list">
              {searchResult.document.tags.map((tag) => {
                return <li key={tag}>{tag}</li>
              })}
            </ul>
          </dd>
        </dl>
      </div>
    </article>
  )
}
