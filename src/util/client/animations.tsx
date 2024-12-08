export const defaultButtonAnim = {
  whileHover: {
    scale: 1.05,
    color: "#f82866"
  }
}

// Based on https://www.youtube.com/watch?v=31y7-k3ZG0g
export const fadeInChildren = {
  parent: {
    variants: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    initial: "hidden",
    animate: "show",
  },
  child: {
    variants: {
      hidden: { opacity: 0 },
      show: { opacity: 1 },
    }
  }
}


export const errorTextAnims = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
