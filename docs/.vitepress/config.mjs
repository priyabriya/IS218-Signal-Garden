import { defineConfig } from 'vitepress'

const repo = process.env.GITHUB_REPOSITORY
const [owner, name] = (repo || '').split('/')
const base = process.env.PAGES_BASE || (name && name.toLowerCase() !== owner.toLowerCase() + '.github.io' ? '/' + name + '/' : '/')
const entries = [
  { text: 'Field notes', link: '/research' },
  { text: 'Project record', link: '/project-record' },
  { text: 'Checks & peer review', link: '/review' }
]
export default defineConfig({
  title: 'Game Fieldnotes', description: 'A working notebook on AI-assisted game design', base,
  themeConfig: {
    nav: [{text: 'Research', link: '/research'}, {text: 'Plan', link: '/project-record'}, ...(repo ? [{text:'Repository',link:'https://github.com/' + repo}] : [])],
    sidebar: [{text: 'November notebook', items: entries}],
    search: { provider: 'local' },
    footer: {message: 'Working notebook · November 2026'}
  }
})
