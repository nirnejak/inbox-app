import * as React from "react"

import * as motion from "motion/react-client"

import { BASE_TRANSITION } from "@/utils/animation"
import { getMetadata } from "@/utils/metadata"
import Inbox from "@/components/Inbox"

export const metadata = getMetadata({
  path: "/",
  title: "Next.js App",
  description: "Next.js TypeScript SaaS Starter",
})

const Home: React.FC = () => {
  return <Inbox />
}

export default Home
