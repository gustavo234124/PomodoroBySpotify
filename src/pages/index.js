import ParticlesBackground from "@/components/ParticlesBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ParticlesBackground />
      <p className="text-amber-800 text-3xl font-bold">Hola perro</p>
    </div>
  );
}
