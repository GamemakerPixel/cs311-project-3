"use client"

import { useState, PropsWithChildren } from "react"


export default function ShowHide(
  {
    children,
    hintText,
    showButtonText,
    hideButtonText
  }:
  PropsWithChildren<{
    hintText: string,
    showButtonText: string,
    hideButtonText: string
  }>
) {
  const [revealed, setRevealed] = useState<boolean>(false);

  if (revealed) {
    return (
      <div className="flex flex-col">
        {children}
        <button
          onClick={() => {setRevealed(false)}}
          type="button"
          className={"mx-auto default-button min-w-32"}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <p className="text-center">
        {hintText}
      </p>
      <button onClick={() => {setRevealed(true)}} className="default-button mx-auto">
        {showButtonText}
      </button>
    </div>
  )

}
