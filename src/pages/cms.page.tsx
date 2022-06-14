import { PageMetadata } from '@stefanprobst/next-page-metadata'
import dynamic from 'next/dynamic'
import { Fragment, memo } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'

export const getStaticProps = withDictionaries(['common'])

export default function CmsPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'cms', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={metadata.title} titleTemplate={titleTemplate} />
      <div id="nc-root" />
      <NetlifyCms />
      <style jsx global>
        {`
          /* Temporary workaround to stop tailwind reset bleeding into richtext editor. */
          /* Should be fixed upstream: Netlify CMS richtext editor should explicitly set styles.
             and not rely on browser defaults. */
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ul {
            list-style: disc;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ol {
            list-style: decimal;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h1,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h2,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h3,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h4,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h5 {
            margin-bottom: 1rem;
            line-height: 1.125;
          }
        `}
      </style>
    </Fragment>
  )
}

const NetlifyCms = dynamic(
  async () => {
    // const { default: withResourceLinks } = await import('@stefanprobst/remark-resource-links')
    const { nanoid } = await import('nanoid')
    const { default: CMS } = await import('netlify-cms-app')
    const { config, collections } = await import('@/cms/cms.config')
    const { CoursePreview } = await import('@/cms/previews/course-preview')
    const { ResourcePreview } = await import('@/cms/previews/resource-preview')
    const { DownloadWidget } = await import('@/cms/widgets/download')
    const { FigureEditorWidget } = await import('@/cms/widgets/figure')
    const { QuizEditorWidget } = await import('@/cms/widgets/quiz')
    const { SideNoteEditorWidget } = await import('@/cms/widgets/sidenote')
    const { TabsEditorWidget } = await import('@/cms/widgets/tabs')
    const { VideoEditorWidget } = await import('@/cms/widgets/video')

    CMS.init({ config })

    CMS.registerEventListener({
      name: 'preSave',
      handler({ entry }) {
        const data = entry.get('data')

        if (![collections.posts.name, collections.courses.name].includes(entry.get('collection'))) {
          return data
        }

        if (data.get('uuid') == null) {
          return data.set('uuid', nanoid())
        }

        return data
      },
    })

    CMS.registerEditorComponent(DownloadWidget)
    CMS.registerEditorComponent(FigureEditorWidget)
    CMS.registerEditorComponent(QuizEditorWidget)
    CMS.registerEditorComponent(SideNoteEditorWidget)
    CMS.registerEditorComponent(TabsEditorWidget)
    CMS.registerEditorComponent(VideoEditorWidget)

    CMS.registerRemarkPlugin({
      settings: {
        bullet: '-',
        emphasis: '_',
      },
      // plugins: [withResourceLinks], // TODO:
    })

    CMS.registerPreviewTemplate(collections.posts.name, memo(ResourcePreview))
    CMS.registerPreviewTemplate(collections.courses.name, memo(CoursePreview))

    CMS.registerPreviewStyle('/assets/css/tailwind.css')
    CMS.registerPreviewStyle('/assets/css/index.css')

    return Fragment
  },
  {
    loading: function Loading(props) {
      const { error, pastDelay, retry, timedOut } = props

      const message =
        error != null ? (
          <div>
            Failed to load CMS! <button onClick={retry}>Retry</button>
          </div>
        ) : timedOut === true ? (
          <div>
            Taking a long time to load CMS... <button onClick={retry}>Retry</button>
          </div>
        ) : pastDelay === true ? (
          <div>Loading CMS...</div>
        ) : null

      return <div className="grid min-h-screen place-items-center">{message}</div>
    },
    ssr: false,
  },
)

// @refresh reset
