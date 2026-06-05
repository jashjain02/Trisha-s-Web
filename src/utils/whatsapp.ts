export function openWhatsApp(phone: string, message: string) {
  const cleaned = phone.replace(/[^0-9+]/g, '')
  const encoded = encodeURIComponent(message)
  // On mobile opens WhatsApp app; on desktop opens WhatsApp Web
  window.open(`https://wa.me/${cleaned}?text=${encoded}`, '_blank')
}

export function shareWishToWhatsApp(wish: { title: string; category: string; description?: string }) {
  const text = [
    `💖 *New Wish on Trisha's Exchange™*`,
    ``,
    `Trisha wants: *${wish.title}*`,
    wish.description ? `"${wish.description}"` : null,
    `Category: ${wish.category}`,
    ``,
    `Be the first to claim it and earn friendship points! 🌸`,
    `Open the app to apply 👉 ${window.location.origin}${window.location.pathname}`,
  ].filter(Boolean).join('\n')

  // Opens WhatsApp share — user picks the group/contact to send to
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

export function notifySelectedFriend(
  phone: string,
  friendName: string,
  wishTitle: string
) {
  const message = [
    `🎉 Hey ${friendName}!`,
    ``,
    `Trisha has chosen *you* to fulfill her wish:`,
    `*"${wishTitle}"*`,
    ``,
    `Hurry up and make it happen! 💖`,
    `Once you're done, mark it as completed in the app.`,
  ].join('\n')

  openWhatsApp(phone, message)
}
