export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          The Un-Feed
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Paste a URL. Read without the noise.
        </p>
        {/* URL input goes here next */}
      </div>
    </main>
  );
}