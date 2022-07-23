import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { request } from '@stefanprobst/request'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { MainLayout } from '@/components/main.layout'
import type { Locale } from '~/config/i18n.config'
import { createImprintUrl } from '~/config/imprint.config'

interface ImprintPageProps {
  html: string
}

export const getStaticProps = withDictionaries(
  ['common'],
  async function getStaticProps(
    context: GetStaticPropsContext,
  ): Promise<GetStaticPropsResult<ImprintPageProps>> {
    const locale = context.locale as Locale
    const html = (await request(createImprintUrl(locale), { responseType: 'text' })) as string

    return { props: { html } }
  },
)

export default function ImprintPage(props: ImprintPageProps): JSX.Element {
  const { html } = props

  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'imprint', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={metadata.title} titleTemplate={titleTemplate} />
      <MainLayout>
        <h1 className="text-5xl font-black text-accent-primary-text">{metadata.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </MainLayout>
    </Fragment>
  )
}
