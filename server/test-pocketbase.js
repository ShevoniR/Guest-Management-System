const PocketBase = require("pocketbase/cjs");
const pb = new PocketBase("http://127.0.0.1:8090");

async function testGuests() {
  try {
    // Admin login
    await pb.admins.authWithPassword(
      "shevonirogers1915@gmail.com",
      "KbscQ!!rgZvy89c"
    );

    // Fetch all guests
    const guests = await pb.collection("guests").getFullList();
    console.log("Guests in DB:", guests);

    // Add a new guest
    const newGuest = await pb.collection("guests").create({
      first_name: "Test",
      last_name: "User",
      email: "testuser@example.com",
      phone: "0711111111",
      address: "Test Address",
      date_of_birth: "2000-01-01",
    });
    console.log("New guest added:", newGuest);

    // Fetch updated list
    const updatedGuests = await pb.collection("guests").getFullList();
    console.log("Updated guests:", updatedGuests);
  } catch (err) {
    console.error(err);
  }
}

testGuests();
