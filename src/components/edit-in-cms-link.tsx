import { PencilIcon } from '@heroicons/react/outline'
import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes.config'
import type { PostDetails } from '@/cms/cms.client'

interface EditInCmsLinkProps {
  id: PostDetails['id']
}

export function EditInCmsLink(props: EditInCmsLinkProps): JSX.Element {
  const { id } = props

  const { t } = useI18n<'common'>()

  return (
    <Link
      className="inline-flex items-center gap-2 text-sm"
      href={{
        ...routes.cms(),
        hash: `/collections/posts/entries/${id}/index`,
      }}
    >
      <PencilIcon className="flex-shrink-0" width="1em" />
      {t(['common', 'post', 'edit-post-in-cms'])}
    </Link>
  )
}
