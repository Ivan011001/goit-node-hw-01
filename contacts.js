const colour = require("colour");
const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(process.cwd(), "./db/contacts.json");

async function readFile() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error);
  }
}

async function writeFile(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
  } catch (error) {
    console.error(error);
  }
}

async function listContacts() {
  const contacts = await readFile();
  console.log("Here are your contacts: ".green);
  console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await readFile();
  const contact = contacts.find(({ id }) => id === contactId);

  if (contact) return console.log("Here is your contact: ".green, contact);

  console.log(`There is no contact with id: ${contactId}`.red);
}

async function removeContact(contactId) {
  const contacts = await readFile(contactsPath);
  const index = contacts.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    console.log(`There is no contact with id: ${contactId}`.red);
    return;
  }

  const newContacts = contacts.filter(({ id }) => id !== contactId);
  await writeFile(newContacts);

  console.log("Contact has been removed: ".green, contacts[index]);
}

async function addContact(
  name = "John Doe",
  email = "johndoe@gmail.com",
  phone = "+380 12 345 6789"
) {
  const contacts = await readFile(contactsPath);

  const newContact = {
    id: new Date().toISOString(),
    name,
    email,
    phone,
  };

  const newContacts = [...contacts, newContact];
  await writeFile(newContacts);

  console.log("Contact has been added: ".green, newContact);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
