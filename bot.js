addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const token = "8475834144:AAFE9PzdPssZwUUm-qpsaaTErdBg9KQqTNw"
  const api_base = `https://api.telegram.org/bot${token}`
  const deepLinks = ["/start", "/login", "melink", "/msgtosupport"]

  // دریافت پیام جدید از تلگرام
  const r = await fetch(`${api_base}/getUpdates`)
  const data = await r.json()

  for (let upd of data.result || []) {
    const offset = upd.update_id + 1
    const msg = upd.message || {}
    const text = msg.text || ""
    const chat_id = msg.chat?.id

    if (text && chat_id) {
      console.log("Original:", text)

      // حذف کلمات لیست
      const new_text = text.split(" ").filter(w => !deepLinks.includes(w)).join(" ")
      console.log("Cleaned:", new_text)

      // ارسال پیام پاک‌شده
      if (new_text.trim()) {
        await fetch(`${api_base}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(new_text)}`)
      }
    }
  }

  return new Response("Checked messages!", {status: 200})
       }
