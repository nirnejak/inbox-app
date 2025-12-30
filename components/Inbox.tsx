"use client"
import classNames from "@/utils/classNames"
import * as React from "react"

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

interface RAW_EMAIL {
  id: string
  from: string
  address: string
  time: string
  message: string
  subject: string
  tag: string
  read: string
}

const fetchEmails = async () => {
  const response = await fetch(API_URL)
  const data = response.json()
  return data
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
        if (i === index) {
          return {
            ...email,
            read: true,
          }
        } else {
          return email
        }
      })
    })
  }

  const formatDateTime = (datetime: string) => {
    const now = new Date(datetime)
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().split(" ")[0]
    return `${dateStr} ${timeStr}`
  }

  return (
    <main className="grid grid-cols-5 h-dvh">
      <aside className="max-h-dvh overflow-y-scroll bg-zinc-100">
        {isFetching ? (
          <div className="pt-3 text-center">Getting your email...</div>
        ) : (
          emails.map((email, index) => (
            <button
              key={index}
              onClick={() => openEmail(index)}
              className={classNames(
                email.read ? "bg-zinc-100" : "bg-zinc-200",
                "flex flex-col w-full text-left px-3 py-1.5 tracking-tight border-b border-b-zinc-300 hover:bg-zinc-300 transition-colors"
              )}
            >
              <p className="text-sm font-medium">{email.from}</p>
              <p className="text-xs">{email.subject}</p>
            </button>
          ))
        )}
      </aside>
      <section className="col-span-4 max-h-dvh overflow-y-scroll">
        {selectedEmail === null ? (
          <p className="p-5 size-full text-center tracking-tight text-zinc-700 pt-20">
            Select an email to preview
          </p>
        ) : (
          <div className="">
            <div className="w-full border-b p-5 border-zinc-200">
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
            <div className="w-full p-5 tracking-tight">
              {emails[selectedEmail].message}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Inbox
