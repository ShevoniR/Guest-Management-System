import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import pb from "../lib/pocketbase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  guestId?: string;
  guestName?: string;
  onDeleted: () => void;
};

export default function DeleteGuestModal({
  isOpen,
  onClose,
  guestId,
  guestName,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!guestId) return;
    setLoading(true);
    try {
      await pb.collection("guests").delete(guestId);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error deleting guest:", err);
      alert("Failed to delete guest");
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                  Delete Guest Record
                </Dialog.Title>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the guest{" "}
                  <span className="font-semibold">{guestName}</span>? This
                  action cannot be undone.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
