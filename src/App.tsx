import { useMemo, useState } from "react";

type Entry = {
  amount: number;
  description?: string;
  allowed: boolean;
};

function parseImport(data: string): Entry[] {
  const entries = data
    .split("\n")
    .filter((line) => line.trim().length > 0 && !line.trim().startsWith("="))
    .map((line) => {
      line = line.trim();

      let amount = line.split(" ")[0];
      amount = amount.replaceAll("€", "");
      amount = amount.replaceAll(",", ".");
      console.log(amount, parseFloat(amount));
      const amountNumber = parseFloat(amount);

      let description = line.split(" ").slice(1).join(" ");

      return {
        amount: amountNumber,
        description: description,
        allowed: true,
      } as Entry;
    });

  return entries.filter((entry) => entry !== null && entry !== undefined);
}

function App() {
  const onImport = () => {
    const data = prompt("Paste your data here");
    setEntries(parseImport(data!));
  };

  const [entries, setEntries] = useState<Entry[]>([]);

  return (
    <div className="p-10 flex flex-col gap-4">
      <button onClick={onImport}>Import Data</button>
      <Total entries={entries} />
      <EntryList entries={entries} setEntries={setEntries} />
    </div>
  );
}

function EntryList({
  entries,
  setEntries,
}: {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry, i) => (
        <Entry
          entry={entry}
          toggle={() => {
            const newEntries = [...entries];
            newEntries[i].allowed = !newEntries[i].allowed;
            setEntries(newEntries);
          }}
          key={i}
        />
      ))}
    </div>
  );
}

function Entry({ entry, toggle }: { entry: Entry; toggle: () => void }) {
  return (
    <div
      className={`shadow border rounded p-3 flex flex-col gap-2 ${
        !entry.allowed ? "bg-gray-500" : ""
      } ${entry.amount > 0 ? "border-green-500" : "border-red-600"}`}
    >
      <p>{entry.amount.toFixed(2).replace(".", ",")}€</p>
      <p>{entry.description}</p>
      <input
        type="checkbox"
        checked={entry.allowed}
        onChange={toggle}
        className="w-5 h-5"
      />
    </div>
  );
}

function Total({ entries }: { entries: Entry[] }) {
  const total = useMemo(
    () =>
      entries
        .filter((entry) => entry.allowed)
        .reduce((acc, entry) => acc + entry.amount, 0),
    [entries]
  );

  return (
    <p className="font-bold text-xl">
      Total: {total.toFixed(2).replace(".", ",")}€
    </p>
  );
}

export default App;
