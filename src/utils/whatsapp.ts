function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('+')) return cleaned
  cleaned = cleaned.replace(/^0+/, '')
  // Bare 10-digit mobile number — assume India and add country code
  if (cleaned.length === 10) return `+91${cleaned}`
  return `+${cleaned}`
}

export function openWhatsApp(phone: string, message: string) {
  const cleaned = normalizePhone(phone)
  const encoded = encodeURIComponent(message)
  // On mobile opens WhatsApp app; on desktop opens WhatsApp Web
  window.open(`https://wa.me/${cleaned}?text=${encoded}`, '_blank')
}

export function shareWishToWhatsApp(wish: { title: string; category: string; description?: string }) {
  const text = [
    `💖 *New Wish on Trisha's Friendship Value™*`,
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
