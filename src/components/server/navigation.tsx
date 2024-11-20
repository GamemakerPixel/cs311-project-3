import Link from "next/link"
import Image from "next/image"


export default function Navigation() {
  interface NavLink {
    name: string
    link: string
  }

  const links: NavLink[] = [
    {name: "Generate Recipes", link: "/generate"},
    {name: "Browse Recipes", link: "/browse"}
  ]

  const navLinkClass: string = "mx-4"

  return (
    <nav className="flex items-center border-b-2 border-secondary border-opacity-10 px-4 py-4">
      <Link href="/" className="text-accent text-2xl flex items-center font-semibold">
        <Image
          src="/logo.svg"
          width={32}
          height={32}
          alt="Mythical Meals logo"
          className="mx-4"
        />
        Mythical Meals
      </Link>
      <div className="flex-grow" />
      {links.map(
        (link: NavLink, index: number) => (
          <Link href={link.link} key={index} className={navLinkClass}>{link.name}</Link>
        )
      )}
    </nav>
  )
}

