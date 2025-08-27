import { useState } from "react";
import type { RecordModel } from "pocketbase";
import pb from "../lib/pocketbase";

type Props = {
  onGuestAdded: (guest: RecordModel) => void;
};

export default function AddGuestForm({ onGuestAdded }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newGuest = await pb.collection("guests").create({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      onGuestAdded(newGuest);

      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (err: any) {
      console.error("Error creating guest:", err);
      setError(err.message || "Failed to add guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-4 border rounded shadow"
    >
      <h3 className="text-lg font-bold mb-2">Add New Guest</h3>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Adding..." : "Add Guest"}
      </button>
    </form>
  );
}
