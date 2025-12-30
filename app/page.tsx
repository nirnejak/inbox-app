import * as React from "react"

import { getMetadata } from "@/utils/metadata"

import Inbox from "@/components/Inbox"

export const metadata = getMetadata({
  path: "/",
  title: "Inbox",
  description: "Inbox of Email App",
})

const Home: React.FC = () => {
  return <Inbox />
}

export default Home
