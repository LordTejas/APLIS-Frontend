export default function Tabs({ data, selectedTabIndex, setSelectedTabIndex }) {
  return (
    <div className="w-full flex justify-between gap-2">
      {data.map((tab, index) => (
        <button
          key={index}
          className={`w-full text-sm px-3 py-2 rounded-md ${
            selectedTabIndex === index
              ? 'bg-neutral-300 text-black'
              : 'bg-neutral-100 text-black hover:bg-neutral-200'
          } focus:relative`}
          onClick={() => setSelectedTabIndex(index)}
        >
          {/* Add an icon here if needed */}
          {tab?.title}
        </button>
      ))}
    </div>
  );
}
