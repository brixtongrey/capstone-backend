import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createUser } from "#db/queries/users";
import { createGroup } from "#db/queries/groups";
import { createGroupMember } from "#db/queries/group_members";
import { createItem } from "#db/queries/items";
import { createExpense } from "#db/queries/expenses";
import { createSplitExpense } from "#db/queries/split_expenses";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  try {
    // STEP 1: Create Users (4 users)
    console.log("Creating users...");
    const password = "password123";

    const userA = await createUser(faker.internet.email(), "AliceW", password);
    const userB = await createUser(faker.internet.email(), "BobM", password);
    const userC = await createUser(
      faker.internet.email(),
      "CharlieP",
      password
    );
    const userD = await createUser(faker.internet.email(), "DianaK", password);

    const users = [userA, userB, userC, userD];
    console.log(`Created ${users.length} users.`);

    // STEP 2: Create Groups (2 groups)
    console.log("Creating groups...");
    const group1 = await createGroup(
      "Bali Trip 2024",
      "Expenses for the week-long vacation, including flights and accommodation."
    );
    const group2 = await createGroup(
      "Apartment 4B Roommates",
      "Monthly bills and shared groceries."
    );

    console.log(`Created 2 groups: ${group1.name} and ${group2.name}.`);

    //  STEP 3: Add Group Members to a Group
    console.log("Adding group members...");

    // Group 1: Alice, Bob, Charlie (3 members)
    await createGroupMember(group1.id, userA.id);
    await createGroupMember(group1.id, userB.id);
    await createGroupMember(group1.id, userC.id);

    // Group 2: Alice, Diana (2 members)
    await createGroupMember(group2.id, userA.id);
    await createGroupMember(group2.id, userD.id);

    console.log("Group memberships established.");

    //  STEP 4: Create Items for an Expense
    console.log("Creating items...");

    // Item 1: Plane Tickets (Paid by Alice, for Group 1)
    const item1 = await createItem(userA.id, "Flight Tickets", 1, 1200.0);

    // Item 2: Groceries (Paid by Bob, for Group 1)
    const item2 = await createItem(userB.id, "BBQ Groceries", 1, 90.0);

    // Item 3: Electricity Bill (Paid by Diana, for Group 2)
    const item3 = await createItem(userD.id, "Monthly Electricity", 1, 150.5);

    console.log("Created 3 items.");

    //  STEP 5: Create Expenses and Split Expenses
    // EXPENSE 1: EVEN SPLIT (Group 1: A, B, C | Total: 1200.00)
    const total1 = item1.price;
    const members1 = [userA, userB, userC];
    // Calculate the even split amount
    const owedEven = total1 / members1.length; // 1200.00 / 3 = 400.00

    console.log(
      `\nCreating Expense 1 (Even Split): $${total1} paid by ${userA.username}`
    );

    // Create the main expense entry
    const expense1 = await createExpense(
      userA.id,
      group1.id,
      item1.id,
      "even",
      total1
    );

    // Create split_expenses entries for those who owe the payer (Bob and Charlie owe Alice)
    await createSplitExpense(expense1.id, userB.id, owedEven); // Bob owes Alice
    await createSplitExpense(expense1.id, userC.id, owedEven); // Charlie owes Alice
    console.log(
      `Expense 1 split: Bob and Charlie each owe $${owedEven.toFixed(
        2
      )} to Alice.`
    );

    // EXPENSE 2: CUSTOM SPLIT (Group 1: A, B, C | Total: 90.00)
    const total2 = item2.price;

    console.log(
      `\nCreating Expense 2 (Custom Split): $${total2} paid by ${userB.username}`
    );

    // Create the main expense entry for expense 2
    const expense2 = await createExpense(
      userB.id,
      group1.id,
      item2.id,
      "custom",
      total2
    );

    // Split: Alice owes 50, Charlie owes 40 (Bob paid)
    await createSplitExpense(expense2.id, userA.id, 50.0); // Alice owes Bob
    await createSplitExpense(expense2.id, userC.id, 40.0); // Charlie owes Bob
    console.log(
      `Expense 2 split: Alice owes $50.00, Charlie owes $40.00 to Bob.`
    );

    // EXPENSE 3: PERCENTAGE SPLIT (Group 2: A, D | Total: 150.50)
    const total3 = item3.price;
    // Diana paid, Alice owes the full amount as a percentage
    const alicePercent = 60;
    const aliceOwes = total3 * (alicePercent / 100); // 150.50 * 0.60 = 90.30

    console.log(
      `\nCreating Expense 3 (Percentage Split): $${total3} paid by ${userD.username}`
    );

    // Create the main expense entry for expense 3
    const expense3 = await createExpense(
      userD.id,
      group2.id,
      item3.id,
      "percentage",
      total3
    );

    // Split: Alice is responsible for 60% of the bill, Diana (payer) for 40%.
    // Only split_expenses entries for those who owe the payer (Alice owes Diana)
    await createSplitExpense(expense3.id, userA.id, aliceOwes); // Alice owes Diana

    console.log(
      `Expense 3 split: Alice owes $${aliceOwes.toFixed(
        2
      )} (${alicePercent}%) to Diana.`
    );
  } catch (err) {
    console.error("Error during seeding:", err);
  }
}
