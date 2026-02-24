import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-3xl font-semibold tracking-tight">shadcn/ui on Vite</h1>
        <p className="text-sm text-muted-foreground">Installation check with a working Button component.</p>
        <div className="flex items-center gap-3">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </main>
  )
}

export default App
