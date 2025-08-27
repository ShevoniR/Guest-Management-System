import { useEffect, useState } from "react";
import type { RecordModel } from "pocketbase";
import pb from "../lib/pocketbase";
import GuestFormModal from "./GuestFormModal";

export default function GuestList() {
  const [guests, setGuests] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<RecordModel | undefined>();

  // fetch guests
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const records = await pb.collection("guests").getFullList({
          sort: "-created",
          $autoCancel: false,
        });
        setGuests(records);
      } catch (err) {
        console.error("Error fetching guests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  const handleGuestSaved = (guest: RecordModel) => {
    setGuests((prev) => {
      const index = prev.findIndex((g) => g.id === guest.id);
      if (index >= 0) {
        const newList = [...prev];
        newList[index] = guest;
        return newList;
      }
      return [guest, ...prev];
    });
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;
    try {
      await pb.collection("guests").delete(guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
    } catch (err) {
      console.error("Error deleting guest:", err);
      alert("Failed to delete guest");
    }
  };

  const openAddModal = () => {
    setGuestToEdit(undefined);
    setModalOpen(true);
  };

  const openEditModal = (guest: RecordModel) => {
    setGuestToEdit(guest);
    setModalOpen(true);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Guest List</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Guest
        </button>
      </div>

      {loading ? (
        <p>Loading guests...</p>
      ) : guests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <ul className="space-y-2">
          {guests.map((guest) => (
            <li
              key={guest.id}
              className="p-3 bg-white shadow rounded-lg border border-gray-200 flex justify-between items-center"
            >
              <span>
                {guest.first_name} {guest.last_name} - {guest.email}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => openEditModal(guest)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <GuestFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGuestSaved={handleGuestSaved}
        guestToEdit={guestToEdit}
      />
    </div>
  );
}
