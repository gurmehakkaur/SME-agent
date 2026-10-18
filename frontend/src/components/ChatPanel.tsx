import { useEffect, useRef, useState, type FormEvent } from 'react'
import { answerFor, chats } from '../data/mock'
import type { ChatMessage, Repo } from '../types'

export function ChatPanel({ repo }: { repo: Repo }) {
  const seed = chats[repo.id] ?? []
  const [messages, setMessages] = useState<ChatMessage[]>(seed)
  const [draft, setDraft] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(chats[repo.id] ?? [])
    setDraft('')
  }, [repo.id])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    const user: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((current) => [...current, user, answerFor(text, repo)])
    setDraft('')
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-line">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <h2 className="text-sm font-medium">Repo chat</h2>
          <p className="text-[12px] text-fog">Grounded in current code. Not a general chatbot.</p>
        </div>
        <span className="font-mono text-[11px] text-fog">scoped · {repo.name}</span>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[42rem] ${message.role === 'user' ? 'ml-auto' : ''}`}
          >
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
              <span>{message.role === 'user' ? 'You' : 'SME'}</span>
              <span>{message.createdAt}</span>
              {message.reused && (
                <span className="rounded-full bg-mint-dim px-2 py-0.5 text-mint">
                  reused · −{message.tokensSaved} tok
                </span>
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'bg-raised text-paper'
                  : 'border border-line bg-panel text-paper/95'
              }`}
            >
              <MessageText text={message.text} />
            </div>
            {message.evidence && message.evidence.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {message.evidence.map((item) => (
                  <li
                    key={`${item.path}-${item.lines}`}
                    className="rounded-lg border border-line bg-ink px-2 py-1 font-mono text-[11px] text-mint"
                  >
                    {item.path}
                    {item.symbol ? ` · ${item.symbol}` : ''}
                    {item.lines ? `:${item.lines}` : ''}
                    <span className="ml-2 text-fog">@{item.revision}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <form onSubmit={onSubmit} className="border-t border-line p-4">
        <label className="block">
          <span className="sr-only">Ask this repository</span>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            rows={3}
            placeholder={`Ask ${repo.owner}/${repo.name}…`}
            className="w-full resize-none rounded-xl border border-line bg-ink px-3 py-3 text-sm outline-none placeholder:text-fog/50 focus:border-mint/40"
          />
        </label>
        <div className="mt-2 flex items-center justify-between text-[11px] text-fog">
          <span className="font-mono">⌘/Ctrl + Enter</span>
          <button
            type="submit"
            className="rounded-lg bg-mint-dim px-3 py-1.5 font-mono text-[12px] text-mint ring-1 ring-mint/30 hover:bg-teal-900"
          >
            Ask
          </button>
        </div>
      </form>
    </section>
  )
}

function MessageText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code
            key={index}
            className="rounded-md bg-ink px-1 py-0.5 font-mono text-[12px] text-mint"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}
