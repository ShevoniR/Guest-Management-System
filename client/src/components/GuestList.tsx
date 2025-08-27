import { useEffect, useState } from "react";
import type { RecordModel } from "pocketbase";
import pb from "../lib/pocketbase";
import GuestFormModal from "./GuestFormModal";
import DeleteGuestModal from "./DeleteGuestModal";

export default function GuestList() {
  const [guests, setGuests] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<RecordModel | undefined>();
  const [guestToDelete, setGuestToDelete] = useState<RecordModel | undefined>();

  const fetchGuests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const result = await pb
        .collection("guests")
        .getList(pageNumber, perPage, {
          sort: "-created",
          $autoCancel: false,
        });
      setGuests(result.items);
      setTotalPages(Math.ceil(result.totalItems / perPage));
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching guests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests(1);
  }, []);

  const handleGuestSaved = () => {
    fetchGuests(page);
  };

  const openAddModal = () => {
    setGuestToEdit(undefined);
    setFormModalOpen(true);
  };

  const openEditModal = (guest: RecordModel) => {
    setGuestToEdit(guest);
    setFormModalOpen(true);
  };

  const openDeleteModal = (guest: RecordModel) => {
    setGuestToDelete(guest);
    setDeleteModalOpen(true);
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest Management</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Guest
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p>Loading guests...</p>
      ) : filteredGuests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">#{guest.id}</td>
                  <td className="px-4 py-2 border">
                    {guest.first_name} {guest.last_name}
                  </td>
                  <td className="px-4 py-2 border">{guest.email}</td>
                  <td className="px-4 py-2 border">{guest.phone || "-"}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => openEditModal(guest)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(guest)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => fetchGuests(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchGuests(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <GuestFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onGuestSaved={handleGuestSaved}
        guestToEdit={guestToEdit}
      />

      <DeleteGuestModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        guestId={guestToDelete?.id}
        guestName={`${guestToDelete?.first_name} ${guestToDelete?.last_name}`}
        onDeleted={() => fetchGuests(page)}
      />
    </div>
  );
}
