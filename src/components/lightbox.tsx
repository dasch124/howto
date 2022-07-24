import { Dialog, Transition } from '@headlessui/react'
import type { ImageProps } from 'next/future/image'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { ResponsiveImage } from '@/components/resposive-image'
import { useDialogState } from '@/lib/use-dialog-state'

type LightBoxProps = ImageProps

export function LightBox(props: LightBoxProps): JSX.Element {
  const { t } = useI18n<'common'>()
  const dialog = useDialogState()

  return (
    <Fragment>
      <button
        aria-label={t(['common', 'post', 'show-fullsize-image'])}
        className="w-full"
        data-lightbox
        onClick={dialog.open}
      >
        <ResponsiveImage {...props} />
      </button>

      <Transition.Root appear as={Fragment} show={dialog.isOpen}>
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

          <div className="fixed inset-0 z-dialog grid place-items-center overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-7xl transform overflow-hidden rounded bg-gray-900 shadow-2xl ring-1 ring-gray-500 ring-offset-2 ring-offset-gray-500 transition-all">
                <ResponsiveImage {...props} sizes={undefined} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  )
}
