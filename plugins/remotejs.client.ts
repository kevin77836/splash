export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    const script = document.createElement('script')
    script.setAttribute('data-consolejs-channel', 'e185a8ce-77b5-866f-c190-ab92ffa76712')
    script.src = 'https://remotejs.com/agent/agent.js'
    document.head.appendChild(script)
  }
}) 