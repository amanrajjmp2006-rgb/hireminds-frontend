import { QRCodeCanvas } from "qrcode.react"

export default function ShareLinkCard({ link }) {
  const copy = async () => navigator.clipboard.writeText(link)

  return (
    <div className="glass mt-4 p-5">
      <p className="mb-2 text-sm text-slate-400">Shareable Test Link</p>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input readOnly value={link} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm" />
        <button onClick={copy} className="glow-btn whitespace-nowrap">Copy Link</button>
      </div>
      <div className="mt-4 inline-block rounded-xl bg-white p-2">
        <QRCodeCanvas value={link} size={116} />
      </div>
    </div>
  )
}
