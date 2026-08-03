export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-8 py-4 flex justify-between items-center z-50">

      <div className="flex items-center gap-3">

  <span className="text-3xl">
    🤖
  </span>

  <h1 className="text-2xl font-bold text-blue-600">
    AI ML Workspace
  </h1>

</div>

      <div className="flex gap-6">

        <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition font-medium">
  Home
</button>

<button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition font-medium">
  Dashboard
</button>

<button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition font-medium">
  Models
</button>

      </div>

    </nav>
  );
}