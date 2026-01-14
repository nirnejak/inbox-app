"use client"
import * as React from "react"

import classNames from "@/utils/classNames"

const API_URL =
  "https://gist.githubusercontent.com/barbinbrad/13609dd592e31d8307dec955889e174d/raw/d9a29d9ff4053e5539e57bdd9e75c9fe527a0096/inbox.json"

interface EMAIL {
  id: number
  from: string
  address: string
  time: string
  message: string
  subject: string
  tag: string
  read: boolean
}

type Replace<T, R> = Omit<T, keyof R> & R
type RAW_EMAIL = Replace<EMAIL, { id: string; read: string }>

// type RAW_EMAIL = Omit<EMAIL, "id" | "read"> & {
//   id: string
//   read: string
// }

const fetchEmails = async () => {
  const response = await fetch(API_URL)
  const data = response.json()
  return data
}

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const Inbox: React.FC = () => {
  const [isFetching, setIsFetching] = React.useState(false)
  const [emails, setEmails] = React.useState<EMAIL[]>([])
  const [selectedEmail, setSelectedEmail] = React.useState<number | null>(null)

  React.useEffect(() => {
    setIsFetching(true)

    fetchEmails().then((rawEmails) => {
      setIsFetching(false)
      const typedEmails = rawEmails.map((email: RAW_EMAIL) => {
        return {
          ...email,
          id: Number(email.id),
          read: false, //hardcoded to false since API returns all the emails as read
        }
      })
      setEmails(typedEmails)
    })
  }, [])

  const openEmail = (index: number) => {
    setSelectedEmail(index)
    setEmails((currentEmails) => {
      return currentEmails.map((email, i) => {
        return {
          ...email,
          read: i === index ? true : email.read,
        }
      })
    })
  }

  if (isFetching) {
    return (
      <main className="grid place-content-center h-dvh">
        Getting your email...
      </main>
    )
  } else {
    return (
      <main className="grid grid-cols-5 h-dvh">
        <aside className="max-h-dvh overflow-y-scroll bg-zinc-100 border-r border-dashed border-zinc-300">
          {emails.map((email, index) => (
            <button
              key={index}
              onClick={() => openEmail(index)}
              className={classNames(
                email.read ? "bg-zinc-100" : "bg-zinc-200",
                "flex flex-col w-full text-left px-3 py-1.5 tracking-tight border-b border-dashed border-zinc-300 hover:bg-zinc-300 transition-colors"
              )}
            >
              <span className="text-sm font-medium">{email.from}</span>
              <span className="text-xs">{email.subject}</span>
            </button>
          ))}
        </aside>
        <section className="col-span-4 max-h-dvh overflow-y-scroll bg-zinc-100">
          {selectedEmail === null ? (
            <p className="p-5 size-full text-center tracking-tighter text-zinc-700 pt-20">
              Select an email to preview
            </p>
          ) : (
            <div>
              <div className="w-full border-b border-dashed p-5 border-zinc-300">
                <p className="tracking-tight">
                  From: {emails[selectedEmail].from}
                </p>
                <p className="text-sm tracking-tight">
                  Subject: {emails[selectedEmail].subject}
                </p>
                <p className="text-sm tracking-tight">
                  Received at: {formatDateTime(emails[selectedEmail].time)}
                </p>
              </div>
              <div className="w-full p-5 tracking-tighter">
                {emails[selectedEmail].message}
              </div>
            </div>
          )}
        </section>
      </main>
    )
  }
}

export default Inbox
