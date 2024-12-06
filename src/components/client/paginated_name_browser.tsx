"use client"

import { useState, useEffect } from "react"


interface PageResponse {
  names: string[]
  cursor: {
    next: number
    previous: number
  } | undefined
  last: boolean
}


export default function PaginatedNameBrowser(
  {
    getNextPage,
    getPreviousPage,
    nextText = "Next",
    previousText = "Previous",
    title = "",
  }: 
  {
    getNextPage: (cursor: number) => Promise<PageResponse>
    getPreviousPage: (cursor: number) => Promise<PageResponse>
    nextText?: string,
    previousText?: string,
    title?: string
  }
) {
  const [currentPage, setCurrentPage] = useState<string[]>([])
  const [cursor, setCursor] = useState<number | undefined>(undefined)
  const [blockNext, setBlockNext] = useState<boolean>(false)
  const [blockPrevious, setBlockPrevious] = useState<boolean>(false)

  
  // This only needs to run once, since the user will trigger all
  // future updates.
  useEffect(() => {
    async function loadInitialPage() {
      const initialPage = await getNextPage()
      setCurrentPage(initialPage.names)
      setCursor(initialPage.cursor)
      setBlockNext(initialPage.last)
      // Always starts on the first element.
      setBlockPrevious(true)
    }
    loadInitialPage()
  }, [])


  async function onNextPressed() {
    const page = await getNextPage(cursor)
    setCurrentPage(page.names)
    setCursor(page.cursor)
    setBlockNext(page.last)
    // As long as there are 
    setBlockPrevious(false)
  }


  async function onPreviousPressed() {
    const page = await getPreviousPage(cursor)
    setCurrentPage(page.names)
    setCursor(page.cursor)
    setBlockPrevious(page.last)
    setBlockNext(false)
  }


  return (
    <div className="flex flex-col items-center text-center bg-darker_primary mx-auto rounded-xl">
      {<p>{title}</p> && (title)}
      <div>
        {currentPage.map((name: string, index: number) => (
          <p
            key={index}
            className="bg-primary rounded-lg px-2 my-1"
          >
            {name}
          </p>
        ))}
      </div>
      <div>
        <button
          onClick={onPreviousPressed} disabled={blockPrevious}
          className="small-button mx-1"
        >
          {previousText}
        </button>
        <button
          onClick={onNextPressed} disabled={blockNext}
          className="small-button mx-1"
        >
          {nextText}
        </button>
      </div>
    </div>

  )
}
