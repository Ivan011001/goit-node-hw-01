const uuid = require("uuid");
const fs = require("fs/promises");
const path = require("path");

const currentDirectory = process.cwd();
const contactsPath = path.join(currentDirectory, "/db/contacts.json");

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
  console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await readFile();
  const contact = contacts.find(({ id }) => id === contactId);

  if (contact) {
    console.log(contact);
    return;
  }

  console.log(null);
}

async function removeContact(contactId) {
  const contacts = await readFile(contactsPath);
  const index = contacts.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    console.log(null);
    return;
  }

  const newContacts = contacts.filter(({ id }) => id !== contactId);
  await writeFile(newContacts);

  console.log(contacts[index]);
}

async function addContact(
  name = "John Doe",
  email = "johndoe@gmail.com",
  phone = "+380 12 345 6789"
) {
  const contacts = await readFile(contactsPath);

  const newContact = {
    id: uuid.v4(),
    name,
    email,
    phone,
  };

  const newContacts = [...contacts, newContact];
  await writeFile(newContacts);

  console.log(newContact);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
