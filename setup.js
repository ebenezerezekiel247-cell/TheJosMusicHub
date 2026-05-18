const fs = require('fs')
const path = require('path')

const files = {
  '.gitignore': `node_modules\n.next\n.env.local\n.env`,
  'package.json': `{"name":"thejosmusichub","version":"1.0.0","private":true,"scripts":{"dev":"next dev","build":"next build","start":"next start"},"dependencies":{"next":"14.2.5","react":"18.3.1","react-dom":"18.3.1","next-cloudinary":"^6.0.0","@supabase/supabase-js":"^2.45.0"},"devDependencies":{"tailwindcss":"^3.4.0","autoprefixer":"^10.4.0","postcss":"^8.4.0","typescript":"^5.4.0","@types/node":"^20.0.0","@types/react":"^18.0.0"}}`,
  'tailwind.config.js': `module.exports = {content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],theme:{extend:{colors:{brand:"#0EA5E9"}}},plugins:[]}`,
  'postcss.config.js': `module.exports = {plugins:{tailwindcss:{},autoprefixer:{}}}`,
  'next.config.js': `module.exports = {images:{domains:['res.cloudinary.com']}}`,
  '.env.example': `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=\nNEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nCLOUDINARY_API_KEY=\nCLOUDINARY_API_SECRET=`,
  'lib/supabase.ts': `import { createClient } from '@supabase/supabase-js'\nexport const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)`,
  'app/globals.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody{background:#0a0a0a;color:#fff;}`,
  'app/layout.tsx': `import './globals.css'\nexport const metadata={title:'TheJosMusicHub',description:'Home of Plateau State Music'}\nexport default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}`,
  'app/page.tsx': `'use client'\nimport {useEffect,useState} from 'react'\nimport UploadButton from '@/components/UploadButton'\nimport TrackCard from '@/components/TrackCard'\nexport default function Home(){const[tracks,setTracks]=useState<any[]>([]);const loadTracks=async()=>{const res=await fetch('/api/tracks');setTracks(await res.json())};useEffect(()=>{loadTracks()},[]);return<main className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto"><header className="flex justify-between items-center border-b border-gray-800 pb-4"><h1 className="text-3xl font-bold">TheJosMusicHub</h1><UploadButton onUpload={loadTracks}/></header><section className="mt-10"><h2 className="text-2xl font-semibold mb-4">Trending in Jos</h2><div className="space-y-4">{tracks.length===0?<p className="text-gray-500">No tracks yet.</p>:tracks.map(t=><TrackCard key={t.id} track={t}/>)}</div></section></main>}`,
  'app/api/tracks/route.ts': `import {NextResponse} from 'next/server'\nimport {supabase} from '@/lib/supabase'\nexport async function GET(){const{data,error}=await supabase.from('tracks').select('*').order('created_at',{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json(data)}\nexport async function POST(req:Request){const body=await req.json();const{data,error}=await supabase.from('tracks').insert([body]).select();if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json(data[0])}`,
  'components/UploadButton.tsx': `'use client'\nimport {CldUploadWidget} from 'next-cloudinary'\nexport default function UploadButton({onUpload}:{onUpload:()=>void}){return<CldUploadWidget uploadPreset="josmusichub" options={{resourceType:'auto',maxFiles:1}} onSuccess={async(r:any)=>{const i=r.info;await fetch('/api/tracks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:i.original_filename,artist:'Unknown Artist',audio_url:i.secure_url,cover_url:i.secure_url.replace(/\\.(mp3|wav)$/,'.jpg')})});onUpload()}}>{({open})=><button onClick={()=>open()} className="bg-brand px-4 py-2 rounded-lg font-semibold hover:opacity-90">Upload Track</button>}</CldUploadWidget>}`,
  'components/TrackCard.tsx': `'use client'\nimport {useState} from 'react'\nexport default function TrackCard({track}:{track:any}){return<div className="bg-gray-900 rounded-xl p-4 flex gap-4 items-center"><img src={track.cover_url} className="w-16 h-16 rounded-lg object-cover"/><div className="flex-1"><h3 className="font-semibold">{track.title}</h3><p className="text-gray-400 text-sm">{track.artist} • {track.plays} plays</p><audio src={track.audio_url} controls className="w-full mt-2"/></div></div>}`,
  'README.md': `# TheJosMusicHub\nRun SQL in Supabase to create tracks table:\n\ncreate table tracks(id uuid default gen_random_uuid() primary key,title text,artist text,audio_url text,cover_url text,plays int default 0,created_at timestamp with time zone default now());`
}

Object.entries(files).forEach(([file, content]) => {
  const dir = path.dirname(file)
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, content)
  console.log('Created', file)
})

console.log('Done! Now run: npm install && npm run dev')
