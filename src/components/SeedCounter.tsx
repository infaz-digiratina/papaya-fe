import { useState } from "react";

export default function SeedCounter() {
  const [name, setName] = useState("");
  const [seedCount, setSeedCount] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://222.165.138.144:5020";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim()) {
      setMessage({ text: "Name is required.", type: "error" });
      return;
    }
    const seedCountNum = parseInt(seedCount);
    if (isNaN(seedCountNum) || seedCountNum < 0) {
      setMessage({ text: "Seed count must be a non-negative number.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/SeedCount`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({
          name: name.trim(),
          seedCount: seedCountNum,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit seed count.");
      }

      const data = await response.json();
      setMessage({ text: data.message || "Seed count recorded successfully!", type: "success" });
      setName("");
      setSeedCount("");

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred. Please try again.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD77F] p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-[#4A2B00] text-4xl md:text-5xl font-bold text-center mb-8 leading-tight">
          COUNTING SEEDS
          <br />
          IN PAPAYA
        </h1>
        
        <img 
          src="/assets/papaya.png"
          alt="Friendly Papaya Character"
          className="w-48 md:w-64 mx-auto mb-8"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="name" 
              className="block text-[#4A2B00] text-3xl font-bold mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-[#8B4513] rounded-lg bg-white text-[#4A2B00] text-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="seedCount" 
              className="block text-[#4A2B00] text-3xl font-bold mb-2"
            >
              Seed Count
            </label>
            <input
              id="seedCount"
              type="number"
              value={seedCount}
              onChange={(e) => setSeedCount(e.target.value)}
              className="w-full p-3 border-2 border-[#8B4513] rounded-lg bg-white text-[#4A2B00] text-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              min="0"
              required
            />
          </div>

          {message && (
            <p
              className={`text-center text-lg font-semibold ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#4A2B00] text-white text-2xl font-bold py-4 rounded-lg hover:bg-[#3A1F00] transition-colors"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}