import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import type { RecordModel } from "pocketbase";
import pb from "../lib/pocketbase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onGuestSaved: (guest: RecordModel) => void;
  guestToEdit?: RecordModel; // undefined for new guest
};

export default function GuestFormModal({
  isOpen,
  onClose,
  onGuestSaved,
  guestToEdit,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (guestToEdit) {
      setFirstName(guestToEdit.first_name);
      setLastName(guestToEdit.last_name);
      setEmail(guestToEdit.email);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
    setError("");
  }, [guestToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("All fields are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email address");
      return;
    }

    setLoading(true);

    try {
      let savedGuest: RecordModel;
      if (guestToEdit) {
        savedGuest = await pb.collection("guests").update(guestToEdit.id, {
          first_name: firstName,
          last_name: lastName,
          email,
        });
      } else {
        savedGuest = await pb.collection("guests").create({
          first_name: firstName,
          last_name: lastName,
          email,
        });
      }

      onGuestSaved(savedGuest);
      onClose();
    } catch (err: any) {
      console.error("Error saving guest:", err);
      setError(err.message || "Failed to save guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {guestToEdit ? "Edit Guest" : "Add New Guest"}
                </Dialog.Title>

                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {error && <p className="text-red-500">{error}</p>}

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
