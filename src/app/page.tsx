import { PageWrapper } from "@/components/shared/PageWrapper";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PageWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">Torneos App</h1>
        <p className="text-muted-foreground mb-8">Next.js 16 + Tailwind 4 + Framer Motion</p>
        <Button size="lg">Comenzar</Button>
      </main>
    </PageWrapper>
  );
}