import './app.css'
import App from './App.svelte'
import 'remixicon/fonts/remixicon.css'

const app = new App({
  // target: document.getElementById('app')!,
  target: document.getElementById('app') as HTMLElement,
})

export default app
